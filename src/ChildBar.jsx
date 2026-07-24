import React from 'react'

export default function ChildBar({ children, activeId, onSelect, onAddChild, onEditChild }) {
  return (
    <div className="child-bar">
      {children.map((child) => (
        <div
          key={child.id}
          className={`child-chip ${child.id === activeId ? 'child-chip-active' : ''}`}
          style={{ '--chip-color': child.avatar_color }}
        >
          <button className="child-chip-select" onClick={() => onSelect(child.id)}>
            <span className="child-chip-avatar">{child.avatar_emoji}</span>
            <span className="child-chip-name">{child.name}</span>
          </button>
          <button
            className="child-chip-edit"
            onClick={() => onEditChild(child)}
            aria-label={`Ubah profil ${child.name}`}
          >
            ✎
          </button>
        </div>
      ))}
      <button className="child-chip child-chip-add" onClick={onAddChild}>
        <span className="child-chip-avatar">➕</span>
        <span className="child-chip-name">Tambah Anak</span>
      </button>
    </div>
  )
}
