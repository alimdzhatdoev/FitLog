import React from 'react'
import { getSessions, deleteSession } from '../store/storage'
import { formatDateDot } from '../utils'

function ExerciseRow({it}){
  return (
    <tr>
      <td>{it.exercise}</td>
      <td>
        <div className="exercise-sets">
          {it.sets.map((x,i)=> <span key={i} className="pill">{x.reps}×{x.weight}кг · {x.restSec||0}s</span>)}
        </div>
      </td>
    </tr>
  )
}

function SessionCard({s}){
  const totalSets = s.items.reduce((acc,it)=> acc + it.sets.length, 0)
  const totalVolume = s.items.reduce((acc,it)=> acc + it.sets.reduce((a,x)=> a + (x.weight||0)*(x.reps||0), 0), 0)
  return (
    <div className="card">
      <div className="row stack-sm" style={{justifyContent:'space-between', alignItems:'center'}}>
        <h3 style={{margin:0}}>{formatDateDot(s.dateISO)} <span className="pill">{totalSets} подходов</span> <span className="pill">Объём: {totalVolume} кг·повт</span></h3>
        <button className="btn danger" onClick={()=>{ if(confirm('Удалить тренировку?')){ deleteSession(s.id); window.location.reload() } }}>Удалить</button>
      </div>
      {s.notes && <p className="muted">Заметки: {s.notes}</p>}
      <div className="table-responsive">
        <table className="hist-table">
          <thead><tr><th>Упражнение</th><th>Подходы</th></tr></thead>
          <tbody>
            {s.items.map((it,idx)=> <ExerciseRow key={idx} it={it} />)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function History(){
  const sessions = getSessions()
  return (
    <div>
      <h2>История тренировок</h2>
      {sessions.length===0 && <p className="muted">Пока нет тренировок. Добавь первую на вкладке «Новая тренировка».</p>}
      {sessions.map(s => <SessionCard key={s.id} s={s}/>)}
    </div>
  )
}
