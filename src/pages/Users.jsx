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
      onSave={(r, isNew) => { set('users', (l) => (isNew ? [...l, r] : l.map((x) => (x.id === r.id ? r : x)))); notify('User berhasil disimpan!', `${r.nama} (${r.role}).${isNew ? ' Kata sandi sementara dikirimkan ke email pengguna.' : ''}`) }}
      onDelete={(r) => { set('users', (l) => l.filter((x) => x.id !== r.id)); notify('User dihapus', r.nama) }}
      extra={(r) => <button className="icon amber" title="Reset password" onClick={() => setRs(r)}><KeyRound size={14} /></button>}
      extraModal={rs && (
        <Modal title={done ? 'Akses Berhasil Direset' : 'Atur Ulang Password'} sub={done ? undefined : 'Tindakan ini akan menghasilkan kata sandi sementara baru untuk akun ini. Sesi login yang aktif akan diakhiri.'} onClose={close}>
          <dl className="sum"><dt>Nama pengguna</dt><dd>{rs.nama}</dd><dt>Email</dt><dd>{rs.email}</dd><dt>Password</dt><dd>{done ? 'Anna2026!' : '••••••••'}</dd></dl>
          <div className="note warn"><AlertTriangle size={14} /> Kata sandi sementara ditampilkan sekali di layar berikutnya. Catat sebelum menutup jendela.</div>
          <div className="mfoot">{done ? <button className="btn primary" onClick={() => { notify('Akses berhasil direset', `Password ${rs.nama} telah diatur ulang.`); close() }}><Check size={14} /> Simpan Perubahan</button> : <><button className="btn" onClick={close}>Batal</button><button className="btn amberb" onClick={() => setDone(true)}>Ya, Reset Akses</button></>}</div>
        </Modal>)} />
  )
}
