import React from 'react'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler)

const grid = '#33415566'
const axis = '#dbeafe'
const primary = '#60a5fa'
const primaryFill = 'rgba(96,165,250,0.25)'
const bar = '#93c5fd'

export function VolumeOverTime({labels, data}){
  const ds = {
    labels,
    datasets: [{
      label:'Объём (кг·повт)',
      data,
      borderColor: primary,
      backgroundColor: primaryFill,
      fill: true,
      pointRadius: 3,
      tension: 0.3,
    }]
  }
  const opts = {
    responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ labels:{ color: axis }}, tooltip:{ enabled:true } },
    scales:{
      x:{ ticks:{ color: axis }, grid:{ color: grid } },
      y:{ ticks:{ color: axis }, grid:{ color: grid } }
    }
  }
  return <div style={{height:260}}><Line data={ds} options={opts}/></div>
}

export function TopExercises({labels, data}){
  const ds = {
    labels,
    datasets: [{
      label:'Объём за период',
      data,
      borderWidth: 0,
      backgroundColor: bar
    }]
  }
  const opts = {
    indexAxis:'y', responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{ labels:{ color: axis }}, tooltip:{ enabled:true } },
    scales:{
      x:{ ticks:{ color: axis }, grid:{ color: grid } },
      y:{ ticks:{ color: axis }, grid:{ color: grid } }
    }
  }
  return <div style={{height:260}}><Bar data={ds} options={opts}/></div>
}
