import React from 'react'

export default function ExerciseSetRow({ set, onChange, onRemove, iconOnly, onTimer }) {
  return (
    <tr>
      <td><input
        type="number"
        inputMode="numeric"          // ⬅ iOS/Android: цифровая клавиатура
        pattern="[0-9]*"
        min="1"
        placeholder="повт."
        value={set.reps || ''}
        onChange={(e) => onChange({ ...set, reps: Number(e.target.value) })}
      /></td>
      <td><input
        type="number"
        inputMode="decimal"          // ⬅ точка/запятая на клавиатуре
        step="0.5"
        placeholder="кг"
        value={set.weight || ''}
        onChange={(e) => onChange({ ...set, weight: Number(e.target.value) })}
      /></td>
      <td><input
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        min="0"
        placeholder="сек. отдых"
        value={set.restSec || ''}
        onChange={(e) => onChange({ ...set, restSec: Number(e.target.value) })}
      /></td>
      <td style={{ width: 120, textAlign: 'right', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="icon-btn" title="Таймер отдыха" onClick={onTimer}>⏱</button>
        {iconOnly ? (
          <button className="icon-btn" title="Удалить подход" onClick={onRemove}>🗑</button>
        ) : (
          <button className="btn danger" onClick={onRemove}>Удалить</button>
        )}
      </td>
    </tr>
  )
}
