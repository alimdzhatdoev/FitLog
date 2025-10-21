import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// Цвета и оформление под тёмную тему
const grid = "#33415566";
const axis = "#dbeafe";
const palette = [
  "#60a5fa", "#f472b6", "#34d399", "#facc15",
  "#a78bfa", "#fb7185", "#93c5fd", "#fbbf24",
  "#22d3ee", "#c084fc"
];

// Универсальный компонент Line-графика
export function MultiLineChart({ title, labels, datasets }) {
  const data = { labels, datasets };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: axis } },
      tooltip: { enabled: true },
      title: { display: !!title, text: title, color: axis },
    },
    scales: {
      x: { ticks: { color: axis }, grid: { color: grid } },
      y: { ticks: { color: axis }, grid: { color: grid } },
    },
  };

  return (
    <div style={{ height: 320 }}>
      <Line data={data} options={options} />
    </div>
  );
}

// Функция для генерации цветов для каждого упражнения
export function getColor(index) {
  return palette[index % palette.length];
}
