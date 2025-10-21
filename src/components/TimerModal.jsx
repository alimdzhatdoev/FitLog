import React from 'react'
import { formatTime } from '../utils'

export default function TimerModal({open, seconds=90, onClose}){
  const [left,setLeft] = React.useState(seconds||90)
  const [running,setRunning] = React.useState(true)
  const ref = React.useRef(null)

  React.useEffect(()=>{
    if(!open){ setRunning(false); return }
    setLeft(seconds||90); setRunning(true)
  }, [open, seconds])

  React.useEffect(()=>{
    if(!running || !open) return
    ref.current = setInterval(()=> setLeft(v=> v>0? v-1 : 0), 1000)
    return ()=> clearInterval(ref.current)
  },[running, open])

  function reset(){ setLeft(seconds||90); setRunning(false) }

  if(!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <h3>Отдых</h3>
        <div style={{fontSize:42, fontWeight:700, textAlign:'center', margin:'10px 0'}}>{formatTime(left)}</div>
        <div className="actions">
          {!running ? <button className="btn" onClick={()=>setRunning(true)}>Старт</button> : <button className="btn secondary" onClick={()=>setRunning(false)}>Пауза</button>}
          <button className="btn secondary" onClick={reset}>Сброс</button>
          <button className="btn" onClick={onClose}>Готово</button>
        </div>
      </div>
    </div>
  )
}
