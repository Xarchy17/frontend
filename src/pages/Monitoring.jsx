import { useState } from 'react'
import { Search, Download, Plus, Eye, EyeOff, Pencil, CheckCircle2, XCircle, ArrowLeft, Bell, AlertTriangle, Calendar } from 'lucide-react'
import { Badge, Modal, Pager } from '../components/ui.jsx'
import { rp } from '../data.js'
import { total, kg } from './Dashboard.jsx'

const reasons = ['Harga melebihi anggaran', 'Spesifikasi tidak sesuai', 'Jadwal pengiriman tidak sesuai', 'Supplier tidak terverifikasi', 'Lainnya']
const now = () => '25 Jan 2026, ' + new Date().toTimeString().slice(0, 5)

export default function Monitoring({ c }) {
  const { db, set, go, q, notify, user, sub } = c
  const [st, setSt] = useState(''), [sup, setSup] = useState(''), [page, setPage] = useState(1)
  const [ok, setOk] = useState(null), [no, setNo] = useState(null), [cat, setCat] = useState(''), [note, setNote] = useState(''), [err, setErr] = useState(false)
  const [add, setAdd] = useState(false), [nf, setNf] = useState({ sup: '', produk: '', qty: '', due: '' }), [banner, setBanner] = useState(null)

  const upd = (id, fn) => set('pos', (l) => l.map((p) => (p.id === id ? fn(p) : p)))
  const approve = () => {
    upd(ok.id, (p) => ({ ...p, st: 'Sedang Dikirim', logs: [...p.logs, { t: 'PO Disetujui', who: user.nama, ts: now() }, { t: 'Notifikasi Terkirim ke Supplier', who: 'Sistem', ts: now() }] }))
    setBanner(ok.id); notify('PO Berhasil Disetujui!', `${ok.id} telah disetujui dan notifikasi telah dikirim ke ${ok.sup}.`); setOk(null)
  }
  const reject = () => {
    if (!cat || !note.trim()) return setErr(true)
    upd(no.id, (p) => ({ ...p, st: 'Ditolak', logs: [...p.logs, { t: 'PO Ditolak — ' + cat, who: user.nama, ts: now() }] }))
    notify('PO Ditolak', `${no.id} ditolak dan catatan dikirim ke supplier.`); setNo(null); setCat(''); setNote(''); setErr(false)
  }
  const createPo = () => {
    const pr = db.products.find((p) => p.nama === nf.produk)
    if (!nf.sup || !pr || !(+nf.qty > 0) || !nf.due) return setErr(true)
    const id = 'PO-2026-' + String(51 + db.pos.length - 11).padStart(4, '0')
    set('pos', (l) => [{ id, sup: nf.sup, tgl: '25 Jan 2026', due: nf.due, st: 'Menunggu Konfirmasi', eta: '-', items: [{ n: pr.nama, s: pr.sku, q: +nf.qty, p: pr.harga }], logs: [{ t: 'PO Dibuat — Menunggu Konfirmasi', who: user.nama, ts: now() }] }, ...l])
    notify('PO berhasil dibuat', `${id} menunggu persetujuan.`); setAdd(false); setErr(false); setNf({ sup: '', produk: '', qty: '', due: '' })
  }
  const exportCsv = (rows) => {
    const csv = ['No PO,Supplier,Tanggal,Total Item (Kg),Total Harga,Status', ...rows.map((p) => [p.id, p.sup, p.tgl, kg(p), Math.round(total(p)), p.st].join(','))].join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'monitoring-po.csv'; a.click()
  }

  const okModal = ok && (
    <Modal title="Konfirmasi Persetujuan PO" sub="Anda akan menyetujui dan mengirimkan PO ini ke supplier. Tindakan ini tidak dapat dibatalkan." onClose={() => setOk(null)}>
      <dl className="sum"><dt>No. PO</dt><dd>{ok.id}</dd><dt>Supplier</dt><dd>{ok.sup}</dd><dt>Total Item</dt><dd>{kg(ok).toLocaleString('id-ID')} Kg ({ok.items.length} produk)</dd><dt>Nilai PO</dt><dd>{rp(total(ok))}</dd></dl>
      <div className="note warn"><AlertTriangle size={14} /> Setelah disetujui, notifikasi otomatis akan dikirim ke email supplier dan status PO akan diperbarui menjadi <b>Sedang Dikirim</b>.</div>
      <div className="mfoot"><button className="btn" onClick={() => setOk(null)}>Batalkan</button><button className="btn primary" onClick={approve}>Ya, Setujui PO</button></div>
    </Modal>)
  const noModal = no && (
    <Modal title="Tolak Purchase Order" sub="Berikan alasan penolakan yang jelas agar supplier dapat melakukan perbaikan." onClose={() => { setNo(null); setErr(false) }}>
      <div className="sum between"><span><b>{no.id}</b><br /><small>{no.sup}</small></span><b>{rp(total(no))}</b></div>
      <div className={`field ${err && !cat ? 'bad' : ''}`}><label>Kategori Alasan Penolakan *</label><select value={cat} onChange={(e) => setCat(e.target.value)}><option value="">Pilih kategori alasan...</option>{reasons.map((r) => <option key={r}>{r}</option>)}</select></div>
      <div className={`field ${err && !note.trim() ? 'bad' : ''}`}><label>Catatan Penolakan *</label><textarea rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Contoh: Harga satuan melebihi batas anggaran yang telah disetujui. Mohon revisi dengan harga Rp 13.500/Kg sesuai kontrak..." /><small className="muted">Catatan akan dikirimkan ke supplier melalui email secara otomatis.</small></div>
      <div className="mfoot"><button className="btn" onClick={() => { setNo(null); setErr(false) }}>Batalkan</button><button className="btn danger" onClick={reject}>Tolak PO</button></div>
    </Modal>)

  // ---------- Detail PO ----------
  if (sub) {
    const p = db.pos.find((x) => x.id === sub)
    if (!p) return <p className="empty">PO tidak ditemukan.</p>
    const sp = db.suppliers.find((s) => s.nama === p.sup) || {}, sb = p.items.reduce((s, i) => s + i.q * i.p, 0), pending = p.st === 'Menunggu Konfirmasi'
    return (
      <>
        {banner === p.id && p.st === 'Sedang Dikirim' && <div className="banner ok"><span><CheckCircle2 size={14} /> <b>PO Berhasil Disetujui!</b> {p.id} telah disetujui dan notifikasi telah dikirim ke {p.sup}.</span><button onClick={() => setBanner(null)}>Tutup</button></div>}
        <div className="between"><div className="row"><button className="btn" onClick={() => go('/monitoring')}><ArrowLeft size={14} /> Kembali ke Daftar PO</button><Badge t={p.st} /></div>
          {pending ? <div className="row"><button className="btn outred" onClick={() => setNo(p)}><XCircle size={14} /> Tolak PO</button><button className="btn primary" onClick={() => setOk(p)}><CheckCircle2 size={14} /> Setujui PO</button></div> : <button className="btn" onClick={() => window.print()}>Unduh PDF</button>}</div>
        <div className="grid2c">
          <div className="card pad"><h4>Informasi Purchase Order</h4><dl className="kv"><dt>No. PO</dt><dd>{p.id}</dd><dt>Tanggal Order</dt><dd>{p.tgl}</dd><dt>Tanggal Jatuh Tempo</dt><dd className="redt">{p.due}</dd><dt>Dibuat oleh</dt><dd>Ayu Patricia</dd><dt>Status</dt><dd><Badge t={p.st} /></dd></dl></div>
          <div className="card pad"><h4>Informasi Supplier</h4><dl className="kv"><dt>Nama Supplier</dt><dd>{p.sup}</dd><dt>Kode Supplier</dt><dd>{sp.kode || '-'}</dd><dt>Kontak</dt><dd>{sp.tel || '-'}</dd><dt>Email</dt><dd className="lnk">{sp.email || '-'}</dd><dt>Alamat</dt><dd>{sp.alamat || '-'}</dd><dt>Estimasi Tiba</dt><dd>{p.eta}</dd></dl></div>
        </div>
        <div className="card pad"><div className="between"><h4>Daftar Item PO</h4><small className="muted">Total: {kg(p).toLocaleString('id-ID')} Kg</small></div>
          <table className="plain"><thead><tr><th>NO</th><th>NAMA PRODUK</th><th>KODE ITEM</th><th>QTY (KG)</th><th>HARGA SATUAN</th><th style={{ textAlign: 'right' }}>SUBTOTAL</th></tr></thead>
            <tbody>{p.items.map((i, n) => <tr key={i.s}><td>{n + 1}</td><td><b>{i.n}</b></td><td>{i.s}</td><td>{i.q.toLocaleString('id-ID')}</td><td>{rp(i.p)}/Kg</td><td style={{ textAlign: 'right' }}><b>{rp(i.q * i.p)}</b></td></tr>)}</tbody></table>
          <div className="totals"><span>{kg(p).toLocaleString('id-ID')} Kg total · {p.items.length} item produk</span><span>Subtotal {rp(sb)}</span><span>PPN 10% {rp(sb * 0.1)}</span><b>Total: {rp(sb * 1.1)}</b></div></div>
        {!pending && <div className="card pad"><h4>Riwayat Aktivitas PO</h4><ul className="tl">{[...p.logs].reverse().map((l, i) => <li key={i}><i /><b>{l.t}</b><small>{l.who} · {l.ts}</small></li>)}</ul></div>}
        <div className="card pad"><h4>Catatan PO</h4><p className="notebox">Pengiriman dilakukan ke Gudang Pusat Jakarta Barat. Mohon sertakan Certificate of Origin dan hasil uji lab untuk setiap batch. Kontak person: Budi Santoso (081234567890).</p></div>
        {okModal}{noModal}
      </>
    )
  }

  // ---------- Daftar PO ----------
  const pend = db.pos.filter((p) => p.st === 'Menunggu Konfirmasi' && p.id !== 'PO-2026-0046')
  const rows = db.pos.filter((p) => (!st || p.st === st) && (!sup || p.sup === sup) && JSON.stringify([p.id, p.sup]).toLowerCase().includes(q.toLowerCase()))
  const names = [...new Set(db.pos.map((p) => p.sup))]
  return (
    <>
      {pend.length > 0 && <div className="banner"><span><AlertTriangle size={14} /> <b>{pend.length} PO menunggu persetujuan</b> — Segera tinjau {pend.map((p) => p.id).join(' dan ')} sebelum jatuh tempo.</span><button onClick={() => document.getElementById('queue')?.scrollIntoView({ behavior: 'smooth' })}>Tinjau Sekarang</button></div>}
      {pend.length > 0 && (
        <div className="card queue" id="queue"><div className="between qh"><b><Bell size={14} /> Antrian Persetujuan PO <i className="count">{pend.length}</i></b><small>Memerlukan tindakan segera</small></div>
          {pend.map((p) => <div className="qrow" key={p.id}><div><b>{p.id}</b><br /><small>{p.sup}</small></div><div><small>Jatuh Tempo</small><br /><b className="redt">{p.due}</b></div><div><small>Nilai PO</small><br /><b>{rp(total(p))}</b></div>
            <div className="row"><button className="btn outred sm" onClick={() => setNo(p)}>Tolak</button><button className="btn primary sm" onClick={() => setOk(p)}>Setujui</button><button className="btn sm" onClick={() => go('/monitoring/' + p.id)}>Detail</button></div></div>)}</div>)}
      <div className="between"><div className="row">
        <select className="pill" value={st} onChange={(e) => { setSt(e.target.value); setPage(1) }}><option value="">Status: Semua Status</option>{['Selesai', 'Sedang Dikirim', 'Menunggu Konfirmasi', 'Overdue', 'Ditolak'].map((s) => <option key={s}>{s}</option>)}</select>
        <select className="pill" value={sup} onChange={(e) => { setSup(e.target.value); setPage(1) }}><option value="">Supplier: Semua Supplier</option>{names.map((s) => <option key={s}>{s}</option>)}</select>
        <span className="pill"><Calendar size={13} /> 01 Jan 2026 - 31 Jan 2026</span></div>
        <div className="row"><button className="btn outline" onClick={() => exportCsv(rows)}><Download size={14} /> Export CSV</button><button className="btn primary" onClick={() => { setAdd(true); setErr(false) }}><Plus size={14} /> Buat PO Baru</button></div></div>
      <div className="card tbl"><table><thead><tr><th>NO PO</th><th>SUPPLIER</th><th>TANGGAL ORDER</th><th>TOTAL ITEM</th><th style={{ textAlign: 'right' }}>TOTAL HARGA</th><th>STATUS</th><th style={{ textAlign: 'right' }}>AKSI</th></tr></thead>
        <tbody>{rows.slice((page - 1) * 5, page * 5).map((p) => (
          <tr key={p.id} className={p.st === 'Menunggu Konfirmasi' ? 'hl' : ''}><td><b>{p.id}</b></td><td>{p.sup}</td><td>{p.tgl}</td><td>{kg(p).toLocaleString('id-ID')} Kg</td><td style={{ textAlign: 'right' }}><b>{rp(total(p))}</b></td><td><Badge t={p.st} /></td>
            <td className="acts"><button className="icon blue" title="Lihat detail" onClick={() => go('/monitoring/' + p.id)}>{p.st === 'Selesai' ? <Eye size={14} /> : <EyeOff size={14} />}</button>{p.st === 'Menunggu Konfirmasi' ? <button className="icon solid" title="Setujui" onClick={() => setOk(p)}><CheckCircle2 size={14} /></button> : <button className="icon" onClick={() => go('/monitoring/' + p.id)}><Pencil size={14} /></button>}</td></tr>))}
          {!rows.length && <tr><td colSpan={7} className="empty"><Search size={14} /> Tidak ada PO yang cocok.</td></tr>}</tbody></table>
        <Pager page={page} total={rows.length} set={setPage} /></div>
      {add && (
        <Modal title="Buat PO Baru" sub="Lengkapi data pemesanan ke supplier." onClose={() => setAdd(false)}>
          <div className={`field ${err && !nf.sup ? 'bad' : ''}`}><label>Supplier *</label><select value={nf.sup} onChange={(e) => setNf({ ...nf, sup: e.target.value })}><option value="">Pilih supplier</option>{db.suppliers.filter((s) => s.st === 'Aktif').map((s) => <option key={s.id}>{s.nama}</option>)}</select></div>
          <div className={`field ${err && !nf.produk ? 'bad' : ''}`}><label>Produk *</label><select value={nf.produk} onChange={(e) => setNf({ ...nf, produk: e.target.value })}><option value="">Pilih produk</option>{db.products.map((s) => <option key={s.id}>{s.nama}</option>)}</select></div>
          <div className="grid2"><div className={`field ${err && !(+nf.qty > 0) ? 'bad' : ''}`}><label>Jumlah (Kg) *</label><input type="number" value={nf.qty} onChange={(e) => setNf({ ...nf, qty: e.target.value })} /></div><div className={`field ${err && !nf.due ? 'bad' : ''}`}><label>Jatuh Tempo *</label><input value={nf.due} placeholder="30 Jan 2026" onChange={(e) => setNf({ ...nf, due: e.target.value })} /></div></div>
          {err && <small className="msg">Lengkapi semua kolom bertanda *.</small>}
          <div className="mfoot"><button className="btn" onClick={() => setAdd(false)}>Batal</button><button className="btn primary" onClick={createPo}>Buat PO</button></div>
        </Modal>)}
      {okModal}{noModal}
    </>
  )
}
