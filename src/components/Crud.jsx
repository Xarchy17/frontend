import { useState } from 'react'
import { Search, Plus, Pencil, Trash2 } from 'lucide-react'
import { Modal, Pager } from './ui.jsx'

// Tabel + form tambah/ubah/hapus generik untuk Supplier, Produk, dan User
export default function Crud({ rows, cols, fields, blank, onSave, onDelete, name, addLabel, extra, extraModal, sub }) {
  const [q, setQ] = useState(''), [page, setPage] = useState(1), [edit, setEdit] = useState(null), [form, setForm] = useState({}), [err, setErr] = useState({}), [del, setDel] = useState(null)
  const list = rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))
  const view = list.slice((page - 1) * 5, page * 5)
  const open = (r) => { setEdit(r || 'new'); setForm(r || blank); setErr({}) }
  const submit = (e) => {
    e.preventDefault()
    const n = {}
    fields.forEach((f) => { if (f.req && !String(form[f.k] ?? '').trim()) n[f.k] = `Kolom ${f.l.toLowerCase()} belum diisi.`; else if (f.type === 'email' && form[f.k] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[f.k])) n[f.k] = 'Format email tidak valid.' })
    setErr(n)
    if (!Object.keys(n).length) { onSave({ ...form, id: form.id || Date.now() }, edit === 'new'); setEdit(null) }
  }
  return (
    <>
      <div className="toolbar"><div className="search"><Search size={14} /><input placeholder={`Cari ${name}...`} value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} /></div>
        <button className="btn primary" onClick={() => open()}><Plus size={14} /> {addLabel}</button></div>
      <div className="card tbl">
        <table><thead><tr>{cols.map((c) => <th key={c.k} style={{ textAlign: c.right ? 'right' : 'left' }}>{c.l}</th>)}<th style={{ textAlign: 'right' }}>AKSI</th></tr></thead>
          <tbody>{view.map((r) => (
            <tr key={r.id}>{cols.map((c) => <td key={c.k} style={{ textAlign: c.right ? 'right' : 'left', fontWeight: c.bold ? 700 : 400 }}>{c.render ? c.render(r) : r[c.k]}</td>)}
              <td className="acts">{extra && extra(r)}<button className="icon blue" onClick={() => open(r)}><Pencil size={14} /></button><button className="icon red" onClick={() => setDel(r)}><Trash2 size={14} /></button></td></tr>))}
            {!view.length && <tr><td colSpan={cols.length + 1} className="empty">Tidak ada data.</td></tr>}</tbody></table>
        <Pager page={page} total={list.length} set={setPage} label={sub} />
      </div>
      {edit && (
        <Modal title={edit === 'new' ? addLabel : `Edit ${name}`} onClose={() => setEdit(null)} w={520}>
          <form onSubmit={submit} noValidate className="grid2">
            {fields.map((f) => (
              <div key={f.k} className={`field ${err[f.k] ? 'bad' : ''} ${f.full ? 'full' : ''}`}>
                <label>{f.l}{f.req && ' *'}</label>
                {f.opts ? <select value={form[f.k] || ''} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}><option value="">Pilih {f.l}</option>{f.opts.map((o) => <option key={o}>{o}</option>)}</select>
                  : f.area ? <textarea rows={3} value={form[f.k] || ''} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
                  : <input type={f.type === 'number' ? 'number' : 'text'} value={form[f.k] ?? ''} onChange={(e) => setForm({ ...form, [f.k]: f.type === 'number' ? +e.target.value : e.target.value })} />}
                {err[f.k] && <small className="msg">{err[f.k]}</small>}
              </div>))}
            <div className="mfoot full"><button type="button" className="btn" onClick={() => setEdit(null)}>Batal</button><button className="btn primary">Simpan</button></div>
          </form>
        </Modal>)}
      {del && (
        <Modal title="Hapus data?" sub="Tindakan ini tidak dapat dibatalkan." onClose={() => setDel(null)}>
          <div className="mfoot"><button className="btn" onClick={() => setDel(null)}>Batal</button><button className="btn danger" onClick={() => { onDelete(del); setDel(null) }}>Ya, Hapus</button></div>
        </Modal>)}
      {extraModal}
    </>
  )
}
