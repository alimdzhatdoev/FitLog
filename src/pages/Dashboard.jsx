import React from "react";
import { getSessions } from "../store/storage";
import { MultiLineChart, getColor } from "../components/Charts";
import { formatDateDot } from "../utils";

export default function Dashboard() {
  const sessions = getSessions();
  const count = sessions.length;
  const last = sessions[0];

  // сортируем по возрастанию даты
  const ordered = [...sessions].reverse();
  const labels = ordered.map((s) =>
    s.dateISO ? formatDateDot(s.dateISO) : ""
  );

  // соберём список всех упражнений
  const allExercisesSet = new Set();
  ordered.forEach((s) =>
    s.items.forEach((it) => allExercisesSet.add(it.exercise))
  );
  const allExercises = Array.from(allExercisesSet);

  // ===== ГРАФИК 1: общий вес по упражнениям =====
  const weightDatasets = allExercises.map((exName, i) => {
    const data = ordered.map((s) => {
      const item = s.items.find((it) => it.exercise === exName);
      if (!item) return 0;
      return item.sets.reduce(
        (sum, set) => sum + (Number(set.weight) || 0),
        0
      );
    });
    return {
      label: exName,
      data,
      borderColor: getColor(i),
      backgroundColor: getColor(i) + "33",
      tension: 0.3,
      pointRadius: 3,
      fill: false,
    };
  });

  // ===== ГРАФИК 2: количество повторений =====
  const repsDatasets = allExercises.map((exName, i) => {
    const data = ordered.map((s) => {
      const item = s.items.find((it) => it.exercise === exName);
      if (!item) return 0;
      return item.sets.reduce(
        (sum, set) => sum + (Number(set.reps) || 0),
        0
      );
    });
    return {
      label: exName,
      data,
      borderColor: getColor(i),
      backgroundColor: getColor(i) + "33",
      tension: 0.3,
      pointRadius: 3,
      fill: false,
    };
  });

  return (
    <div className="grid">
      <div className="card">
        <h2>Прогресс</h2>
        <p className="muted">
          Всего тренировок: <b>{count}</b>
        </p>
        {last && (
          <p className="muted">
            Последняя тренировка: <b>{formatDateDot(last.dateISO)}</b>
          </p>
        )}
        <p className="muted">
          Ниже — динамика по каждому упражнению: общий вес и количество
          повторений за каждую тренировку.
        </p>
      </div>

      <div className="card">
        <h3>Вес по упражнениям за тренировку</h3>
        <MultiLineChart
          title="Вес по упражнениям"
          labels={labels}
          datasets={weightDatasets}
        />
      </div>

      <div className="card">
        <h3>Повторы по упражнениям за тренировку</h3>
        <MultiLineChart
          title="Повторы по упражнениям"
          labels={labels}
          datasets={repsDatasets}
        />
      </div>
    </div>
  );
}
