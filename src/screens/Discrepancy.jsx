import { useState } from 'react'
import { ArrowLeft, Image, CheckCircle2 } from 'lucide-react'
import { Badge, Pager } from '../components/ui.jsx'
import { rp } from '../data.js'

export default function Discrepancy({ c }) {
  const { db, set, go, notify, q, sub } = c
  const [page, setPage] = useState(1)
  const rows = db.discrepancies.filter((d) => JSON.stringify(d).toLowerCase().includes(q.toLowerCase()))
  const d = db.discrepancies.find((x) => x.id === sub)
  const upd = (st, msg) => { set('discrepancies', (l) => l.map((x) => (x.id === d.id ? { ...x, st } : x))); notify('Discrepancy diperbarui', `${d.id}: ${msg}`) }

  if (sub) {
    if (!d) return <><button className="btn" onClick={() => go('/discrepancy')}><ArrowLeft size={14} /> Kembali ke Daftar Discrepancy</button><p className="empty">Laporan discrepancy tidak ditemukan.</p></>
    return (
      <>
        <div className="between"><button className="btn" onClick={() => go('/discrepancy')}><ArrowLeft size={14} /> Kembali ke Daftar Discrepancy</button><Badge t={d.st} /></div>
        <div className="card pad detail discrepancy-detail">
          <div className="between"><h4>Detail Discrepancy</h4><small className="muted">ID Laporan: {d.id} · {d.po}</small></div>
          <div className="grid2">
            <div><h5>Foto Bukti Masalah</h5><div className="photo"><Image size={22} />Foto bukti belum dilampirkan</div></div>
            <div><h5>Deskripsi Masalah</h5><p className="notebox">{d.desc}</p></div>
          </div>
          <h5>Informasi Laporan</h5>
          <dl className="kv"><dt>No Purchase Order</dt><dd>{d.po}</dd><dt>Supplier</dt><dd>{d.sup}</dd><dt>Jenis Masalah</dt><dd className="redt">{d.jenis}</dd><dt>Tanggal Laporan</dt><dd>{d.tgl}</dd><dt>Total Kerugian</dt><dd className="redt">{rp(d.rugi)}</dd><dt>Kuantitas Kurang</dt><dd className="redt">{d.qty}</dd><dt>Pengirim Laporan</dt><dd>{d.by}</dd></dl>
          <div className="discrepancy-actions">
            <button className="btn primary" disabled={d.st === 'Selesai' || d.st === 'Ditutup'} onClick={() => upd('Selesai', 'ditandai selesai.')}><CheckCircle2 size={14} /> Tandai Selesai</button>
            <button className="btn" disabled={d.st === 'Selesai' || d.st === 'Ditutup'} onClick={() => upd('Menunggu Review', `permintaan klarifikasi dikirim ke ${d.sup}.`)}>Minta Klarifikasi</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="card tbl"><table><thead><tr><th>ID LAPORAN</th><th>NO PO</th><th>SUPPLIER</th><th>JENIS MASALAH</th><th>TANGGAL</th><th>STATUS</th></tr></thead>
      <tbody>{rows.slice((page - 1) * 5, page * 5).map((r) => <tr key={r.id} className="discrepancy-row" onClick={() => go('/discrepancy/' + r.id)}><td className="lnk"><b>{r.id}</b></td><td>{r.po}</td><td>{r.sup}</td><td className="redt">{r.jenis}</td><td>{r.tgl}</td><td><Badge t={r.st} /></td></tr>)}
        {!rows.length && <tr><td colSpan={6} className="empty">Tidak ada laporan.</td></tr>}</tbody></table>
      <Pager page={page} total={rows.length} set={setPage} label="entri" /></div>
  )
}
