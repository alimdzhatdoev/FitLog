import React from 'react'
import { formatTime } from '../utils'

export default function Timer({seconds=90}){
  const [left,setLeft] = React.useState(seconds)
  const [running,setRunning] = React.useState(false)
  const ref = React.useRef(null)

  React.useEffect(()=>{
    if(!running) return
    ref.current = setInterval(()=> setLeft(v=> v>0? v-1 : 0), 1000)
    return ()=> clearInterval(ref.current)
  },[running])

  function start(){ setRunning(true) }
  function pause(){ setRunning(false) }
  function reset(s=seconds){ setRunning(false); setLeft(s) }

  return (
    <div className="timer">
      <span className="pill">Отдых: {formatTime(left)}</span>
      {!running ? <button className="btn" onClick={start}>Старт</button> : <button className="btn secondary" onClick={pause}>Пауза</button>}
      <button className="btn secondary" onClick={()=>reset()}>Сброс</button>
      <input style={{width:110}} type="number" min="10" step="5" value={left} onChange={e=>setLeft(Number(e.target.value||0))} />
    </div>
  )
}
