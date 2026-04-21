import React, { useState, useRef, useEffect } from 'react'

export default function MultiSelect({ options = [], selected = [], onChange, placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  function toggleOpt(opt) {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt))
    else onChange([...selected, opt])
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div onClick={() => setOpen(v => !v)} style={{ padding: '8px 10px', border: '1px solid #e6e9ee', borderRadius: 8, cursor: 'pointer', minHeight: 40 }}>
        {selected.length === 0 ? <span className="small">{placeholder}</span> : (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {selected.map(s => <span key={s} style={{ background: '#eef2ff', color: '#1e3a8a', padding: '4px 8px', borderRadius: 999 }}>{s}</span>)}
          </div>
        )}
      </div>

      {open && (
        <div style={{ position: 'absolute', zIndex: 40, background: 'white', border: '1px solid #e6e9ee', marginTop: 6, borderRadius: 8, padding: 8, maxHeight: 200, overflow: 'auto', width: '100%' }}>
          {options.map(o => (
            <div key={o} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', cursor: 'pointer' }} onClick={() => toggleOpt(o)}>
              <input type="checkbox" readOnly checked={selected.includes(o)} />
              <div>{o}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
