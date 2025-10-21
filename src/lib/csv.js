// Простые утилиты CSV: toCSV / parseCSV и экспорт/импорт для сессий.
// Формат CSV (одна строка = один подход):
// session_id,dateISO,notes,exercise,exercise_order,set_order,reps,weight,restSec

function escapeCSV(val) {
    if (val === null || val === undefined) return '';
    const s = String(val);
    if (/[",\n;]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
}

// ⬇⬇⬇ обновлено: поддержка кастомного разделителя и CRLF
export function toCSV(rows, delimiter = ';') {
    if (!rows || rows.length === 0) return '';
    const header = Object.keys(rows[0]);
    const lines = [header.join(delimiter)];
    for (const r of rows) {
        const line = header.map(k => escapeCSV(r[k])).join(delimiter);
        lines.push(line);
    }
    // CRLF для Excel
    return lines.join('\r\n');
}

// Небольшой парсер CSV с поддержкой кавычек и ;/,
// Определяем разделитель по первой строке (если есть ';' — используем его)
export function parseCSV(text) {
    if (!text) return { header: [], rows: [] }
    const firstLine = text.split(/\r?\n/)[0] || ''
    const delim = firstLine.includes(';') && !firstLine.includes(',') ? ';' : ','
    const lines = text.replace(/\r/g, '').split('\n').filter(l => l.length > 0)
    if (!lines.length) return { header: [], rows: [] }

    function splitLine(line) {
        const out = []
        let cur = ''
        let q = false
        for (let i = 0; i < line.length; i++) {
            const ch = line[i]
            if (q) {
                if (ch === '"') {
                    if (i + 1 < line.length && line[i + 1] === '"') { cur += '"'; i++ } // escaped "
                    else { q = false }
                } else cur += ch
            } else {
                if (ch === '"') q = true
                else if (ch === delim) { out.push(cur); cur = '' }
                else cur += ch
            }
        }
        out.push(cur)
        return out
    }

    const header = splitLine(lines[0]).map(h => h.trim())
    const rows = lines.slice(1).map(line => {
        const cols = splitLine(line)
        const obj = {}
        header.forEach((h, idx) => obj[h] = cols[idx] ?? '')
        return obj
    })
    return { header, rows }
}

// ⬇⬇⬇ обновлено: UTF-8 BOM + ; по умолчанию
export function sessionsToCSV(sessions, delimiter = ';') {
    const rows = [];
    sessions.forEach(s => {
        const session_id = s.id || crypto.randomUUID?.() || Math.random().toString(36).slice(2);
        const dateISO = s.dateISO || '';
        const notes = s.notes || '';
        if (s.items && s.items.length) {
            s.items.forEach((it, exIdx) => {
                const exercise = it.exercise || '';
                if (it.sets && it.sets.length) {
                    it.sets.forEach((set, setIdx) => {
                        rows.push({
                            session_id, dateISO, notes, exercise,
                            exercise_order: exIdx, set_order: setIdx,
                            reps: set.reps ?? '', weight: set.weight ?? '', restSec: set.restSec ?? ''
                        });
                    });
                } else {
                    rows.push({
                        session_id, dateISO, notes, exercise,
                        exercise_order: exIdx, set_order: '',
                        reps: '', weight: '', restSec: ''
                    });
                }
            });
        } else {
            rows.push({
                session_id, dateISO, notes, exercise: '',
                exercise_order: '', set_order: '',
                reps: '', weight: '', restSec: ''
            });
        }
    });

    const csvBody = toCSV(rows, delimiter);
    // Добавляем BOM, чтобы Excel понял UTF-8 и кириллицу
    return '\uFEFF' + csvBody;
}

// ===== Парсинг CSV -> доменная модель сессий =====
export function csvToSessions(text) {
    const { header, rows } = parseCSV(text)
    const required = ['session_id', 'dateISO', 'notes', 'exercise', 'exercise_order', 'set_order', 'reps', 'weight', 'restSec']
    const hasAll = required.every(k => header.includes(k))
    if (!hasAll) {
        throw new Error('Некорректный CSV: отсутствуют необходимые столбцы.\nТребуются: ' + required.join(', '))
    }

    // Группируем по session_id
    const bySession = new Map()
    rows.forEach(r => {
        const sid = r.session_id
        if (!bySession.has(sid)) bySession.set(sid, [])
        bySession.get(sid).push(r)
    })

    const sessions = []
    bySession.forEach((lines, sid) => {
        // Берём общие поля
        const dateISO = (lines.find(l => l.dateISO)?.dateISO || '').slice(0, 10)
        const notes = lines.find(l => l.notes)?.notes || ''

        // Группируем по упражнению+порядку
        const byExercise = new Map()
        lines.forEach(l => {
            const key = `${l.exercise}||${l.exercise_order}`
            if (!byExercise.has(key)) byExercise.set(key, [])
            byExercise.get(key).push(l)
        })

        // Восстанавливаем items
        const items = Array.from(byExercise.entries())
            .sort((a, b) => Number(a[0].split('||')[1] || 0) - Number(b[0].split('||')[1] || 0))
            .map(([key, arr]) => {
                const exercise = key.split('||')[0]
                const sets = arr
                    .filter(x => x.reps !== '' || x.weight !== '' || x.restSec !== '')
                    .sort((a, b) => Number(a.set_order || 0) - Number(b.set_order || 0))
                    .map(x => ({
                        reps: x.reps === '' ? undefined : Number(x.reps),
                        weight: x.weight === '' ? undefined : Number(x.weight),
                        restSec: x.restSec === '' ? undefined : Number(x.restSec),
                    }))
                return { exercise, sets }
            })

        sessions.push({
            id: sid,
            dateISO,
            notes,
            items
        })
    })

    // Сортировка по дате (новые сверху — как и раньше в UI)
    sessions.sort((a, b) => (b.dateISO || '').localeCompare(a.dateISO || ''))
    return sessions
}
