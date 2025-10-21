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
