export function uid(){ return Math.random().toString(36).slice(2)+Date.now().toString(36) }
export function todayISO(){ return new Date().toISOString().slice(0,10) }
export function formatTime(sec){
  const s = Math.max(0, Math.floor(sec||0))
  const m = String(Math.floor(s/60)).padStart(2,'0')
  const r = String(s%60).padStart(2,'0')
  return `${m}:${r}`
}
export function formatDateDot(iso){
  if(!iso) return ''
  const [y,m,d] = iso.split('-')
  return `${d}.${m}.${y}`
}
