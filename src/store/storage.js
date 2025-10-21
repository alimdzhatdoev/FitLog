const KEY = 'fitlog_v3'
const initialData = { 
  sessions: [], 
  exercises: ['Жим гантелей лёжа','Тяга горизонтального блока','Разведение гантелей в стороны','Подъем гантелей на бицепс'],
  settings: { defaultRestSec: 90 },
  templates: [] // {id, name, exercises:[string]}
}

export function initStore(){
  const exists = localStorage.getItem(KEY)
  if(!exists){
    localStorage.setItem(KEY, JSON.stringify(initialData))
  } else {
    // мягкая миграция: заполняем отсутствующие поля
    const db = read()
    if(!db.settings) db.settings = { defaultRestSec: 90 }
    if(!db.templates) db.templates = []
    write(db)
  }
}

function read(){
  try { return JSON.parse(localStorage.getItem(KEY)) || initialData }
  catch { return initialData }
}
function write(data){
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function getExercises(){ return read().exercises }
export function addExercise(name){
  const n = name.trim()
  if(!n) return
  const db = read()
  if(!db.exercises.includes(n)) db.exercises.push(n)
  write(db)
}
export function removeExercise(name){
  const db = read()
  db.exercises = db.exercises.filter(x => x !== name)
  write(db)
}

export function getDefaultRestSec(){ return (read().settings?.defaultRestSec) || 90 }
export function setDefaultRestSec(sec){
  const s = Math.max(0, Number(sec||0))
  const db = read()
  db.settings.defaultRestSec = s
  write(db)
}

// sessions: [{id, dateISO, notes, items:[{exercise, sets:[{reps, weight, restSec}]}]}]
export function saveSession(session){
  const db = read()
  const idx = db.sessions.findIndex(s => s.id === session.id)
  if(idx>=0) db.sessions[idx] = session
  else db.sessions.push(session)
  write(db)
}
export function getSessions(){
  const db = read()
  return [...db.sessions].sort((a,b)=> (b.dateISO||'').localeCompare(a.dateISO||''))
}
export function deleteSession(id){
  const db = read()
  db.sessions = db.sessions.filter(s => s.id !== id)
  write(db)
}

// Templates
export function saveTemplate(tpl){
  const db = read()
  const idx = db.templates.findIndex(t => t.id === tpl.id)
  if(idx>=0) db.templates[idx] = tpl
  else db.templates.push(tpl)
  write(db)
}
export function getTemplates(){ return read().templates || [] }
export function deleteTemplate(id){
  const db = read()
  db.templates = db.templates.filter(t => t.id !== id)
  write(db)
}
