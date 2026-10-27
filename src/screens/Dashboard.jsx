import { FileText, Truck, Package, AlertTriangle, CheckCircle2, Activity, Database, ArrowRight } from 'lucide-react'
import { Badge, } from '../components/ui.jsx'
import { rp } from '../data.js'
import { total } from '../lib/purchaseOrders.js'

export default function Dashboard({ c }) {
  const { db, go, open } = c, pend = db.pos.filter((p) => p.st === 'Menunggu Konfirmasi')
  const active = db.pos.filter((p) => !['Selesai', 'Ditolak'].includes(p.st)).length
  const received = db.pos.filter((p) => p.st === 'Selesai').reduce((sum, p) => sum + p.items.reduce((qty, item) => qty + item.q, 0), 0)
  const stats = [['PO Tersimpan', db.pos.length, FileText], ['PO Aktif', active, Truck], ['Kuantitas PO Selesai (Kg)', received.toLocaleString('id-ID'), Package], ['Discrepancy Terbuka', open, AlertTriangle, true]]
  const statuses = [
    ['Selesai', '#10b981'],
    ['Sedang Dikirim', '#3b82f6'],
    ['Menunggu Konfirmasi', '#f59e0b'],
    ['Overdue', '#ef4444'],
    ['Ditolak', '#64748b'],
  ].map(([label, color]) => ({ label, color, count: db.pos.filter((p) => p.st === label).length }))
  let offset = 0
  const segments = statuses.map((item) => {
    const start = offset
    offset += db.pos.length ? item.count / db.pos.length * 100 : 0
    return `${item.color} ${start}% ${offset}%`
  })
  const quick = [['Setujui PO', `${pend.length} PO menunggu persetujuan`, CheckCircle2, '/monitoring', 'solid'], ['Monitoring PO', `Pantau ${active} PO aktif`, Activity, '/monitoring'], ['Discrepancy', `${open} kasus perlu ditinjau`, AlertTriangle, '/discrepancy', 'red'], ['Master Data', 'Supplier & katalog produk', Database, '/master']]
  return (
    <>
      {pend.length > 0 && <div className="banner"><span><AlertTriangle size={14} /> <b>{pend.length} PO menunggu persetujuan</b> — Segera tinjau {pend.slice(0, 2).map((p) => p.id).join(' dan ')} sebelum jatuh tempo.</span><button onClick={() => go('/monitoring')}>Tinjau Sekarang</button></div>}
      <div className="grid4">{stats.map(([l, v, I, red]) => <div key={l} className={`card stat ${red ? 'redb' : ''}`}><span>{l}<I size={16} /></span><b>{v}</b><small className="muted">Berdasarkan data saat ini</small></div>)}</div>
      <div className="grid4">{quick.map(([t, s, I, p, k]) => <div key={t} className={`card quick ${k || ''}`} onClick={() => go(p)}><b><I size={16} /> {t}</b><small>{s}</small></div>)}</div>
      <div className="grid2c">
        <div className="card pad"><h4>Ringkasan Status PO</h4><small className="muted">Jumlah PO berdasarkan status saat ini</small>
          <div className="status-summary">{statuses.map((item) => <div key={item.label}><span><i style={{ background: item.color }} />{item.label}</span><b>{item.count}</b></div>)}</div></div>
        <div className="card pad"><h4>Distribusi Purchase Order</h4><small className="muted">Proporsi dari {db.pos.length} PO tersimpan</small>
          <div className="donut"><div className="ring" style={{ background: `conic-gradient(${segments.join(', ')})` }} /><ul>{statuses.filter((item) => item.count > 0).map((item) => <li key={item.label}><i style={{ background: item.color }} />{item.label} ({Math.round(item.count / db.pos.length * 100)}%)</li>)}</ul></div></div>
      </div>
      <div className="card pad"><div className="between"><div><h4>Aktivitas PO Terbaru</h4><small className="muted">Menampilkan 3 transaksi terkini</small></div><a className="link" onClick={() => go('/monitoring')}>Lihat Semua <ArrowRight size={12} /></a></div>
        <table className="plain"><thead><tr><th>NO. PO</th><th>SUPPLIER</th><th>TANGGAL</th><th>STATUS</th><th style={{ textAlign: 'right' }}>NILAI PO</th></tr></thead>
          <tbody>{db.pos.slice(0, 3).map((p) => <tr key={p.id} onClick={() => go('/monitoring/' + p.id)}><td><b>{p.id}</b></td><td>{p.sup}</td><td>{p.tgl}</td><td><Badge t={p.st} /></td><td style={{ textAlign: 'right' }}><b>{rp(total(p))}</b></td></tr>)}</tbody></table></div>
    </>
  )
}
