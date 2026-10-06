import { useState } from 'react'
import { Image, CheckCircle2 } from 'lucide-react'
import { Badge, Pager } from '../components/ui.jsx'
import { rp } from '../data.js'

export default function Discrepancy({ c }) {
  const { db, set, notify, q } = c
  const [sel, setSel] = useState(db.discrepancies[0].id), [page, setPage] = useState(1)
  const rows = db.discrepancies.filter((d) => JSON.stringify(d).toLowerCase().includes(q.toLowerCase()))
  const d = db.discrepancies.find((x) => x.id === sel) || rows[0]
  const upd = (st, msg) => { set('discrepancies', (l) => l.map((x) => (x.id === d.id ? { ...x, st } : x))); notify('Discrepancy diperbarui', `${d.id}: ${msg}`) }
  return (
    <div className="split">
      <div className="card tbl"><table><thead><tr><th>ID LAPORAN</th><th>NO PO</th><th>SUPPLIER</th><th>JENIS MASALAH</th><th>TANGGAL</th><th>STATUS</th></tr></thead>
        <tbody>{rows.slice((page - 1) * 5, page * 5).map((r) => <tr key={r.id} className={r.id === d?.id ? 'sel' : ''} onClick={() => setSel(r.id)}><td className="lnk"><b>{r.id}</b></td><td>{r.po}</td><td>{r.sup}</td><td className="redt">{r.jenis}</td><td>{r.tgl}</td><td><Badge t={r.st} /></td></tr>)}
          {!rows.length && <tr><td colSpan={6} className="empty">Tidak ada laporan.</td></tr>}</tbody></table>
        <Pager page={page} total={rows.length} set={setPage} label="entri" /></div>
      {d && (
        <div className="card pad detail"><div className="between"><h4>Detail Discrepancy</h4><Badge t={d.st} /></div><small className="muted">ID Laporan: {d.id} · {d.po}</small>
          <h5>Foto Bukti Masalah</h5><div className="photo"><Image size={22} />Foto bukti belum dilampirkan</div>
          <h5>Deskripsi Masalah</h5><p className="notebox">{d.desc}</p>
          <dl className="kv sm"><dt>No Purchase Order</dt><dd>{d.po}</dd><dt>Jenis Masalah</dt><dd className="redt">{d.jenis}</dd><dt>Total Kerugian</dt><dd className="redt">{rp(d.rugi)}</dd><dt>Kuantitas Kurang</dt><dd className="redt">{d.qty}</dd><dt>Pengirim Laporan</dt><dd>{d.by}</dd></dl>
          <button className="btn primary big" disabled={d.st === 'Selesai' || d.st === 'Ditutup'} onClick={() => upd('Selesai', 'ditandai selesai.')}><CheckCircle2 size={14} /> Tandai Selesai</button>
          <button className="btn big" disabled={d.st === 'Selesai' || d.st === 'Ditutup'} onClick={() => upd('Menunggu Review', `permintaan klarifikasi dikirim ke ${d.sup}.`)}>Minta Klarifikasi</button></div>)}
    </div>
  )
}
