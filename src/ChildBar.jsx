import React from 'react'

export default function ChildBar({ children, activeId, onSelect, onAddChild }) {
  return (
    <div className="child-bar">
      {children.map((child) => (
        <button
          key={child.id}
          className={`child-chip ${child.id === activeId ? 'child-chip-active' : ''}`}
          style={{ '--chip-color': child.avatar_color }}
          onClick={() => onSelect(child.id)}
        >
          <span className="child-chip-avatar">{child.avatar_emoji}</span>
          <span className="child-chip-name">{child.name}</span>
        </button>
      ))}
      <button className="child-chip child-chip-add" onClick={onAddChild}>
        <span className="child-chip-avatar">➕</span>
        <span className="child-chip-name">Tambah Anak</span>
      </button>
    </div>
  )
}
