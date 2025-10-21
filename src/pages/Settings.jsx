import React from 'react'
import { getExercises, addExercise, removeExercise, getDefaultRestSec, setDefaultRestSec } from '../store/storage'

export default function Settings(){
  const [exList, setExList] = React.useState(getExercises())
  const [newEx, setNewEx] = React.useState('')
  const [rest, setRest] = React.useState(getDefaultRestSec())

  function addEx(){
    if(!newEx.trim()) return
    addExercise(newEx)
    setExList(getExercises())
    setNewEx('')
  }
  function delEx(name){
    if(!confirm(`Удалить упражнение «${name}» из справочника?`)) return
    removeExercise(name)
    setExList(getExercises())
  }
  function saveRest(){
    setDefaultRestSec(Number(rest||0))
    alert('Стандартное время отдыха сохранено')
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
          <input type="number" min="0" step="5" value={rest} onChange={e=>setRest(e.target.value)} placeholder="секунды" />
          <button className="btn" onClick={saveRest}>Сохранить</button>
        </div>
      </div>

      <div className="card">
        <h3>Справочник упражнений</h3>
        <div className="row stack-sm">
          <input placeholder="Название нового упражнения" value={newEx} onChange={e=>setNewEx(e.target.value)} />
          <button className="btn" onClick={addEx}>Добавить</button>
        </div>
        <div style={{marginTop:10}}>
          {exList.length===0 && <p className="muted">Пока пусто — добавь своё первое упражнение.</p>}
          <ul style={{listStyle:'none', padding:0, margin:0}}>
            {exList.map(e => (
              <li key={e} className="row" style={{justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #1e2650'}}>
                <span>{e}</span>
                <button className="btn danger" onClick={()=>delEx(e)}>Удалить</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
