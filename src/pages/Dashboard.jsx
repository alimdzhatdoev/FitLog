import React from 'react'
import { getSessions } from '../store/storage'
import { VolumeOverTime, TopExercises } from '../components/Charts'
import { formatDateDot } from '../utils'

export default function Dashboard(){
  const sessions = getSessions()
  const count = sessions.length
  const last = sessions[0]

  const labels = [...sessions].reverse().map(s=> s.dateISO && formatDateDot(s.dateISO))
  const volumes = [...sessions].reverse().map(s=> s.items.reduce((acc,it)=> acc + it.sets.reduce((v,x)=> v + (x.reps||0)*(x.weight||0), 0), 0))

  const cutoff = new Date(); cutoff.setDate(cutoff.getDate()-30)
  const agg = {}
  sessions.forEach(s => {
    const d = new Date(s.dateISO || Date.now())
    if(d < cutoff) return
    s.items.forEach(it => {
      const vol = it.sets.reduce((v,x)=> v + (x.reps||0)*(x.weight||0), 0)
      agg[it.exercise] = (agg[it.exercise] || 0) + vol
    })
  })
  const top = Object.entries(agg).sort((a,b)=> b[1]-a[1]).slice(0,5)
  const exLabels = top.map(([k])=>k)
  const exData = top.map(([_,v])=>v)

  const totalVolume = volumes.reduce((a,b)=>a+b,0)
  const sets = sessions.reduce((acc,s)=> acc + s.items.reduce((a,it)=> a + it.sets.length, 0), 0)

  return (
    <div className="grid">
      <div className="card">
        <h2>Прогресс</h2>
        <p className="muted">Всего тренировок: <b>{count}</b></p>
        <p className="muted">Всего подходов: <b>{sets}</b></p>
        <p className="muted">Суммарный объём (кг·повт): <b>{totalVolume}</b></p>
        {last && <p className="muted">Последняя тренировка: <b>{formatDateDot(last.dateISO)}</b></p>}
      </div>

      <div className="card">
        <h3>Объём по тренировкам</h3>
        <VolumeOverTime labels={labels} data={volumes} />
      </div>

      <div className="card">
        <h3>Топ упражнений (30 дней)</h3>
        <TopExercises labels={exLabels} data={exData} />
      </div>
    </div>
  )
}
