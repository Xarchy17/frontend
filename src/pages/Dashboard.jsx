import { FileText, Truck, Package, AlertTriangle, CheckCircle2, Activity, Database, ArrowRight } from 'lucide-react'
import { Badge, } from '../components/ui.jsx'
import { rp } from '../data.js'

export const total = (p) => p.items.reduce((s, i) => s + i.q * i.p, 0) * 1.1
export const kg = (p) => p.items.reduce((s, i) => s + i.q, 0)
const bars = [['Jul', 30], ['Agu', 38], ['Sep', 34], ['Okt', 42], ['Nov', 40], ['Des', 48]]

export default function Dashboard({ c }) {
  const { db, go, open } = c, pend = db.pos.filter((p) => p.st === 'Menunggu Konfirmasi')
  const stats = [['Total PO Bulan Ini', 48, '+12.5%', FileText], ['PO Aktif', 12, '+3.1%', Truck], ['Barang Diterima', 156, '-1.5%', Package], ['Discrepancy Aktif', open, '-25%', AlertTriangle, true]]
  const quick = [['Setujui PO', `${pend.length} PO menunggu persetujuan`, CheckCircle2, '/monitoring', 'solid'], ['Monitoring PO', 'Pantau status 12 PO aktif', Activity, '/monitoring'], ['Discrepancy', `${open} kasus perlu ditinjau`, AlertTriangle, '/discrepancy', 'red'], ['Master Data', 'Supplier & katalog produk', Database, '/master']]
  return (
    <>
      {pend.length > 0 && <div className="banner"><span><AlertTriangle size={14} /> <b>{pend.length} PO menunggu persetujuan</b> — Segera tinjau {pend.slice(0, 2).map((p) => p.id).join(' dan ')} sebelum jatuh tempo.</span><button onClick={() => go('/monitoring')}>Tinjau Sekarang</button></div>}
      <div className="grid4">{stats.map(([l, v, d, I, red]) => <div key={l} className={`card stat ${red ? 'redb' : ''}`}><span>{l}<I size={16} /></span><b>{v}</b><small className={d.startsWith('-') ? 'dn' : 'up'}>{d} vs bulan lalu</small></div>)}</div>
      <div className="grid4">{quick.map(([t, s, I, p, k]) => <div key={t} className={`card quick ${k || ''}`} onClick={() => go(p)}><b><I size={16} /> {t}</b><small>{s}</small></div>)}</div>
      <div className="grid2c">
        <div className="card pad"><div className="between"><div><h4>Trend PO (6 Bulan Terakhir)</h4><small className="muted">Jul – Des 2025</small></div><span className="badge blue">Bulanan</span></div>
          <div className="bars">{bars.map(([m, v], i) => <div key={m}><i style={{ height: v * 3.4 }} className={i === 5 ? 'last' : ''}><em>{v}</em></i><span>{m}</span></div>)}</div></div>
        <div className="card pad"><h4>Status Purchase Order</h4><small className="muted">Distribusi status Jan 2026</small>
          <div className="donut"><div className="ring" /><ul><li><i style={{ background: '#10b981' }} />Selesai (60%)</li><li><i style={{ background: '#3b82f6' }} />Sedang Dikirim (25%)</li><li><i style={{ background: '#ef4444' }} />Overdue (15%)</li></ul></div></div>
      </div>
      <div className="card pad"><div className="between"><div><h4>Aktivitas PO Terbaru</h4><small className="muted">Menampilkan 3 transaksi terkini</small></div><a className="link" onClick={() => go('/monitoring')}>Lihat Semua <ArrowRight size={12} /></a></div>
        <table className="plain"><thead><tr><th>NO. PO</th><th>SUPPLIER</th><th>TANGGAL</th><th>STATUS</th><th style={{ textAlign: 'right' }}>NILAI PO</th></tr></thead>
          <tbody>{db.pos.slice(0, 3).map((p) => <tr key={p.id} onClick={() => go('/monitoring/' + p.id)}><td><b>{p.id}</b></td><td>{p.sup}</td><td>{p.tgl}</td><td><Badge t={p.st} /></td><td style={{ textAlign: 'right' }}><b>{rp(total(p))}</b></td></tr>)}</tbody></table></div>
    </>
  )
}
