// src/main.jsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import NewWorkout from './pages/NewWorkout.jsx'
import History from './pages/History.jsx'
import Settings from './pages/Settings.jsx'
import './styles.css'

// ⬇️ добавь это:
import { registerSW } from 'virtual:pwa-register'
registerSW({ immediate: true }) // автообновления sw
// Временный запрет зума, пока пользователь вводит данные
function setupFocusZoomGuard() {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return;

  const base = 'width=device-width, initial-scale=1, viewport-fit=cover';
  const locked = base + ', maximum-scale=1, user-scalable=no';

  const onFocusIn = (e) => {
    if (e.target.matches('input, select, textarea')) {
      viewport.setAttribute('content', locked);
    }
  };
  const onFocusOut = (e) => {
    if (e.target.matches('input, select, textarea')) {
      // небольшая задержка, чтобы не дёргался в моменты переключения фокуса
      setTimeout(() => viewport.setAttribute('content', base), 300);
    }
  };

  document.addEventListener('focusin', onFocusIn);
  document.addEventListener('focusout', onFocusOut);
}
setupFocusZoomGuard();
function setVh() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
}
setVh()
window.addEventListener('resize', setVh)
window.addEventListener('orientationchange', setVh)

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path='new' element={<NewWorkout />} />
          <Route path='history' element={<History />} />
          <Route path='settings' element={<Settings />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
