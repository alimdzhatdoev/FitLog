import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { initStore } from './store/storage'

initStore()

export default function App() {
  const [open, setOpen] = React.useState(false)
  React.useEffect(()=>{
    const onResize = () => { if(window.innerWidth > 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return ()=> window.removeEventListener('resize', onResize)
  },[])

  return (
    <div className="app">
      <header className="topbar">
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <button className="burger" aria-label="menu" onClick={()=>setOpen(o=>!o)}>
            <span></span><span></span><span></span>
          </button>
          <h1>🏋️‍♂️ FitLog</h1>
        </div>
        <nav className="nav-desktop">
          <NavLink to="/" end>Главная</NavLink>
          <NavLink to="/new">Новая тренировка</NavLink>
          <NavLink to="/history">История</NavLink>
          <NavLink to="/settings">Настройки</NavLink>
        </nav>
      </header>
      {open && (
        <nav className="nav-mobile">
          <NavLink onClick={()=>setOpen(false)} to="/" end>Главная</NavLink>
          <NavLink onClick={()=>setOpen(false)} to="/new">Новая тренировка</NavLink>
          <NavLink onClick={()=>setOpen(false)} to="/history">История</NavLink>
          <NavLink onClick={()=>setOpen(false)} to="/settings">Настройки</NavLink>
        </nav>
      )}
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
