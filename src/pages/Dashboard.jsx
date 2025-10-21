import React from "react";
import { getSessions } from "../store/storage";
import { MultiLineChart, getColor } from "../components/Charts";
import { formatDateDot } from "../utils";

export default function Dashboard() {
  const sessions = getSessions();
  const count = sessions.length;
  const last = sessions[0];

  // сортируем тренировки по дате (слева -> направо)
  const ordered = [...sessions].reverse();
  const labels = ordered.map((s) =>
    s.dateISO ? formatDateDot(s.dateISO) : ""
  );

  // список всех упражнений
  const allExercisesSet = new Set();
  ordered.forEach((s) =>
    s.items.forEach((it) => allExercisesSet.add(it.exercise))
  );
  const allExercises = Array.from(allExercisesSet);

  // выбранные упражнения (по умолчанию все)
  const [selected, setSelected] = React.useState(allExercises);

  // переключение чекбоксов
  const toggleExercise = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  // ===== Готовим датасеты =====
  function makeDatasets(type) {
    return allExercises
      .filter((ex) => selected.includes(ex)) // фильтр
      .map((exName, i) => {
        const data = ordered.map((s) => {
          const item = s.items.find((it) => it.exercise === exName);
          if (!item) return 0;
          if (type === "weight") {
            return item.sets.reduce(
              (sum, set) => sum + (Number(set.weight) || 0),
              0
            );
          } else {
            return item.sets.reduce(
              (sum, set) => sum + (Number(set.reps) || 0),
              0
            );
          }
        });
        const color = getColor(i);
        return {
          label: exName,
          data,
          borderColor: color,
          backgroundColor: color + "33",
          tension: 0.3,
          pointRadius: 3,
          fill: false,
        };
      });
  }

  const weightDatasets = makeDatasets("weight");
  const repsDatasets = makeDatasets("reps");

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
          повторений за тренировку.
        </p>
      </div>

      {/* ✅ Выпадающий фильтр упражнений */}
      {allExercises.length > 0 && (
        <div className="card">
          <details>
            <summary style={{ cursor: "pointer" }}>
              ⚙️ Фильтр упражнений ({selected.length}/{allExercises.length})
            </summary>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "10px",
              }}
            >
              {allExercises.map((ex) => (
                <label
                  key={ex}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px",
                    cursor: "pointer",
                    background: "#0f1532",
                    border: "1px solid #2a3a7a",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    width: "100%"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(ex)}
                    onChange={() => toggleExercise(ex)}
                    style={{
                      width: "16px"
                    }}
                  />
                  {ex}
                </label>
              ))}
            </div>
          </details>
        </div>
      )}

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
