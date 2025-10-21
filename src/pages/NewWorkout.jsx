import React from 'react'
import ExerciseSetRow from '../components/ExerciseSetRow'
import TimerModal from '../components/TimerModal'
import { uid, todayISO } from '../utils'
import { getExercises, saveSession, getDefaultRestSec, getTemplates, saveTemplate } from '../store/storage'
import { useNavigate } from 'react-router-dom'

function SaveTplModal({ open, onClose, onConfirm }) {
  const [name, setName] = React.useState('Моя тренировка')
  React.useEffect(() => { if (open) setName('Моя тренировка') }, [open])
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Сохранить как шаблон</h3>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Название шаблона" />
        <div className="actions">
          <button className="btn" onClick={() => onConfirm(name)}>Сохранить</button>
          <button className="btn secondary" onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  )
}

export default function NewWorkout() {
  const navigate = useNavigate()
  const [dateISO, setDateISO] = React.useState(todayISO())
  const [items, setItems] = React.useState([]) // {id, exercise, sets:[]}
  const [notes, setNotes] = React.useState('')
  const [exList, setExList] = React.useState(getExercises())
  const [selectedEx, setSelectedEx] = React.useState('')
  const [restDefault, setRestDefault] = React.useState(getDefaultRestSec())
  const [templates, setTemplates] = React.useState(getTemplates())
  const [tplSelect, setTplSelect] = React.useState('')
  const [showTplModal, setShowTplModal] = React.useState(false)
  const [timerOpen, setTimerOpen] = React.useState(false)
  const [timerSec, setTimerSec] = React.useState(restDefault)

  React.useEffect(() => {
    setRestDefault(getDefaultRestSec())
    setExList(getExercises())
    setTemplates(getTemplates())
  }, [])

  function addExerciseToSession(name) {
    if (!name) return
    // добавляем СВЕРХУ
    setItems(prev => [{ id: uid(), exercise: name, sets: [] }, ...prev])
  }
  function addSet(itemId) {
    setItems(prev => prev.map(it => it.id === itemId ? { ...it, sets: [...it.sets, { reps: 10, weight: 0, restSec: restDefault }] } : it))
  }
  function updateSet(itemId, idx, newSet) {
    setItems(prev => prev.map(it => it.id === itemId ? { ...it, sets: it.sets.map((s, i) => i === idx ? newSet : s) } : it))
  }
  function removeSet(itemId, idx) {
    setItems(prev => prev.map(it => it.id === itemId ? { ...it, sets: it.sets.filter((_, i) => i !== idx) } : it))
  }
  function removeItem(itemId) {
    setItems(prev => prev.filter(it => it.id !== itemId))
  }

  function loadTemplateById(id) {
    const t = templates.find(x => x.id === id)
    if (!t) return
    const newItems = t.exercises.map(name => ({ id: uid(), exercise: name, sets: [] }))
    setItems(newItems)
  }

  function save() {
    const session = { id: uid(), dateISO, notes, items }
    if (items.length === 0) {
      alert('Добавь хотя бы одно упражнение');
      return
    }
    saveSession(session)
    navigate('/history')
  }

  function confirmSaveTemplate(name) {
    if (items.length === 0) { alert('Добавь упражнения, чтобы сохранить шаблон'); return }
    const tpl = { id: uid(), name: (name || 'Моя тренировка').trim(), exercises: items.map(i => i.exercise) }
    saveTemplate(tpl)
    setTemplates(getTemplates())
    setShowTplModal(false)
    alert('Шаблон сохранён')
  }

  return (
    <div className="grid">
      <div className="card">
        <h2>Новая тренировка</h2>
        <div className="row stack-sm">
          <div style={{ flex: 1, minWidth: 220 }}>
            <label>Дата</label>
            <input type="date" value={dateISO} onChange={e => setDateISO(e.target.value)} />
          </div>
          <div style={{ flex: 2, minWidth: 220 }}>
            <label>Заметки</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="самочувствие, цели, пр." />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Шаблоны</h3>
        <div className="row stack-sm">
          <select value={tplSelect} onChange={e => setTplSelect(e.target.value)}>
            <option value="">Загрузить шаблон…</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button className="btn" onClick={() => { if (!tplSelect) return; loadTemplateById(tplSelect); setTplSelect('') }}>Загрузить</button>
        </div>
      </div>

      <div className="card">
        <h3>Добавить упражнение</h3>
        <div className="row stack-sm">
          <select value={selectedEx} onChange={e => setSelectedEx(e.target.value)}>
            <option value="">Выбери из справочника…</option>
            {exList.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <button className="btn" onClick={() => { if (!selectedEx) return; addExerciseToSession(selectedEx); setSelectedEx(''); }}>Добавить</button>
        </div>
        <p className="muted" style={{ marginTop: 8 }}>Новые упражнения добавляй в «Настройки» → «Справочник упражнений».</p>
      </div>

      {items.map(item => (
        <div className="card" key={item.id}>
          <button className="close-x" title="Удалить упражнение" onClick={() => removeItem(item.id)}>✕</button>
          <div className="row stack-sm" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, flex: 1, paddingRight: 40 }}>{item.exercise}</h3>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn" onClick={() => addSet(item.id)}>+ Подход</button>
            </div>
          </div>
          {item.sets.length === 0 && <p className="muted">Нет подходов — добавь первый.</p>}
          {item.sets.length > 0 && (
            <div className="table-responsive">
              <table className="hist-table">
                <thead>
                  <tr><th>Повт.</th><th>Вес, кг</th><th>Отдых, сек</th><th></th></tr>
                </thead>
                <tbody>
                  {item.sets.map((s, idx) => (
                    <ExerciseSetRow key={idx} set={s}
                      iconOnly
                      onTimer={() => { setTimerSec(s.restSec || restDefault); setTimerOpen(true); }}
                      onChange={(ns) => updateSet(item.id, idx, ns)}
                      onRemove={() => removeSet(item.id, idx)} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      <div className="card">
        <div className="row stack-sm">
          <button className="btn" onClick={save}>Сохранить тренировку</button>
          <button className="btn secondary" onClick={() => setShowTplModal(true)}>Сохранить как шаблон</button>
        </div>
      </div>

      <SaveTplModal open={showTplModal} onClose={() => setShowTplModal(false)} onConfirm={confirmSaveTemplate} />
      <TimerModal open={timerOpen} seconds={timerSec} onClose={() => setTimerOpen(false)} />
    </div>
  )
}
