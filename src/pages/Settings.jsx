import React from 'react'
import { getExercises, addExercise, removeExercise, getDefaultRestSec, setDefaultRestSec, getSessions, setSessions } from '../store/storage'
import { sessionsToCSV, csvToSessions } from '../lib/csv'

export default function Settings() {
  const [exList, setExList] = React.useState(getExercises())
  const [newEx, setNewEx] = React.useState('')
  const [rest, setRest] = React.useState(getDefaultRestSec())

  function addEx() {
    if (!newEx.trim()) return
    addExercise(newEx)
    setExList(getExercises())
    setNewEx('')
  }
  function delEx(name) {
    if (!confirm(`Удалить упражнение «${name}» из справочника?`)) return
    removeExercise(name)
    setExList(getExercises())
  }
  function saveRest() {
    setDefaultRestSec(Number(rest || 0))
    alert('Стандартное время отдыха сохранено')
  }

  function exportCSV() {
    const data = getSessions();
    const csv = sessionsToCSV(data); // теперь вернёт BOM + ; + CRLF
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitlog_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // === CSV Import ===
  const fileRef = React.useRef(null)
  function importCSVFromFile(file) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const text = String(reader.result || '')
        const sessions = csvToSessions(text)
        if (!confirm(`Импортировать ${sessions.length} тренировок? Текущая история будет заменена.`)) return
        setSessions(sessions)
        alert('История импортирована')
        // можно тут же обновить страницу/роут, если хочется сразу увидеть изменения
        window.location.reload()
      } catch (e) {
        console.error(e)
        alert('Ошибка импорта CSV: ' + e.message)
      }
    }
    reader.readAsText(file, 'utf-8')
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>Настройки</h2>
        <p className="muted">Задай свой список упражнений и стандартное время отдыха — потом выбирай их в тренировке.</p>
      </div>

      <div className="card">
        <h3>Стандартное время отдыха</h3>
        <div className="row stack-sm">
          <input type="number" min="0" step="5" value={rest} onChange={e => setRest(e.target.value)} placeholder="секунды" />
          <button className="btn" onClick={saveRest}>Сохранить</button>
        </div>
      </div>

      <div className="card">
        <h3>Справочник упражнений</h3>
        <div className="row stack-sm">
          <input placeholder="Название нового упражнения" value={newEx} onChange={e => setNewEx(e.target.value)} />
          <button className="btn" onClick={addEx}>Добавить</button>
        </div>
        <div style={{ marginTop: 10 }}>
          {exList.length === 0 && <p className="muted">Пока пусто — добавь своё первое упражнение.</p>}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {exList.map(e => (
              <li key={e} className="row" style={{ justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1e2650' }}>
                <span>{e}</span>
                <button className="btn danger" onClick={() => delEx(e)}>Удалить</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card">
        <h3>Резервная копия (CSV)</h3>
        <p className="muted">Выгрузи всю историю в CSV-файл или загрузи ранее сохранённый. При импорте текущая история будет <b>заменена</b>.</p>
        <div className="row stack-sm">
          <button className="btn" onClick={exportCSV}>Выгрузить CSV</button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) importCSVFromFile(f); e.target.value = '' }}
          />
          <button className="btn secondary" onClick={() => fileRef.current?.click()}>Загрузить CSV</button>
        </div>
      </div>
    </div>
  )
}
