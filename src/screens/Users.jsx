import { useState } from 'react'
import { KeyRound, Check, AlertTriangle } from 'lucide-react'
import Crud from '../components/Crud.jsx'
import { Badge, Modal } from '../components/ui.jsx'

export default function Users({ c }) {
  const { db, set, notify } = c, [rs, setRs] = useState(null), [done, setDone] = useState(false)
  const close = () => { setRs(null); setDone(false) }
  return (
    <Crud name="user" addLabel="Tambah User" sub="user" rows={db.users} blank={{ nama: '', email: '', lokasi: '', role: '', st: 'Aktif', gabung: '25 Jan 2026' }}
      cols={[{ k: 'nama', l: 'NAMA', bold: true }, { k: 'email', l: 'EMAIL' }, { k: 'lokasi', l: 'LOKASI' }, { k: 'role', l: 'ROLE', render: (r) => <Badge t={r.role} /> }]}
      fields={[{ k: 'nama', l: 'Nama Lengkap', req: 1, full: 1 }, { k: 'email', l: 'Alamat Email', req: 1, type: 'email', full: 1 }, { k: 'lokasi', l: 'Lokasi', req: 1, full: 1 }, { k: 'role', l: 'Role', req: 1, opts: ['Admin', 'Manager', 'Staff'] }, { k: 'st', l: 'Status Akun', opts: ['Aktif', 'Nonaktif'] }]}
      onSave={(r, isNew) => { set('users', (l) => (isNew ? [...l, r] : l.map((x) => (x.id === r.id ? r : x)))); notify('User berhasil disimpan!', `${r.nama} (${r.role}).${isNew ? ' Data demo tersimpan di browser; email dan password baru tidak dibuat.' : ''}`) }}
      onDelete={(r) => { set('users', (l) => l.filter((x) => x.id !== r.id)); notify('User dihapus', r.nama) }}
      extra={(r) => <button className="icon amber" title="Reset password" onClick={() => setRs(r)}><KeyRound size={14} /></button>}
      extraModal={rs && (
        <Modal title={done ? 'Simulasi Selesai' : 'Simulasi Reset Password'} sub={done ? undefined : 'Pratinjau alur reset. Aplikasi demo ini tidak mengubah password atau mengakhiri sesi login.'} onClose={close}>
          <dl className="sum"><dt>Nama pengguna</dt><dd>{rs.nama}</dd><dt>Email</dt><dd>{rs.email}</dd><dt>Status password</dt><dd>{done ? 'Tidak berubah' : 'Belum diubah'}</dd></dl>
          <div className="note warn"><AlertTriangle size={14} /> Reset password sungguhan memerlukan layanan autentikasi yang belum tersedia.</div>
          <div className="mfoot">{done ? <button className="btn primary" onClick={() => { notify('Simulasi reset selesai', `Password ${rs.nama} tidak berubah.`); close() }}><Check size={14} /> Tutup</button> : <><button className="btn" onClick={close}>Batal</button><button className="btn amberb" onClick={() => setDone(true)}>Lanjutkan Simulasi</button></>}</div>
        </Modal>)} />
  )
}
