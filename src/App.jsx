import { useState, useEffect } from 'react'
import { LayoutDashboard, FileText, AlertTriangle, Database, Users as UsersIcon, LogOut, Bell, Search, Check } from 'lucide-react'
import useStoredState from './hooks/useStoredState.js'
import { seed } from './data.js'
import { Brand, Modal } from './components/ui.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Monitoring from './pages/Monitoring.jsx'
import Discrepancy from './pages/Discrepancy.jsx'
import MasterData from './pages/MasterData.jsx'
import Users from './pages/Users.jsx'

const titles = {
  dashboard: ['Dashboard Analitik', 'Selamat pagi, {nama} — Januari 2026'],
  monitoring: ['Monitoring PO', 'Januari 2026 — {n} Purchase Order'],
  discrepancy: ['Review Discrepancy', ''],
  master: ['Kelola Master Data', 'Manajemen supplier & katalog produk kopi'],
  users: ['Kelola User Staff', 'Manajemen akun & hak akses pengguna sistem'],
}

export default function App() {
  const [user, setUser] = useStoredState('ab-user', null)
  const [db, setDb] = useStoredState('ab-db', seed)
  const [path, setPath] = useState(location.pathname)
  const [q, setQ] = useState('')
  const [toast, setToast] = useState(null)
  const [bye, setBye] = useState(false)
  useEffect(() => { const f = () => setPath(location.pathname); addEventListener('popstate', f); return () => removeEventListener('popstate', f) }, [])
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t) } }, [toast])
  const go = (p) => { history.pushState({}, '', p); setPath(p); window.scrollTo(0, 0) }
  const set = (k, v) => setDb((d) => ({ ...d, [k]: typeof v === 'function' ? v(d[k]) : v }))
  const notify = (title, msg) => setToast({ title, msg })

  if (!user) return <Login onLogin={(u) => { setUser(u); go('/dashboard') }} users={db.users} />

  const [, page = 'dashboard', sub] = path.split('/')
  const key = titles[page] ? page : 'dashboard'
  const open = db.discrepancies.filter((d) => !['Selesai', 'Ditutup'].includes(d.st)).length
  const c = { db, set, go, q, notify, user, open, sub }
  const nav = [['dashboard', 'Dashboard', LayoutDashboard], ['monitoring', 'Monitoring PO', FileText], ['discrepancy', 'Review Discrepancy', AlertTriangle, open], ['master', 'Master Data', Database], ['users', 'Kelola User', UsersIcon]]
  const [h, s] = titles[key]
  const Page = { dashboard: Dashboard, monitoring: Monitoring, discrepancy: Discrepancy, master: MasterData, users: Users }[key]

  return (
    <div className="app">
      <aside><Brand />
        <p className="sec">MENU UTAMA</p>
        {nav.slice(0, 3).map(([k, l, I, n]) => <a key={k} className={key === k ? 'on' : ''} onClick={() => go('/' + k)}><I size={16} /> {l}{n > 0 && <i className="count">{n}</i>}</a>)}
        <p className="sec">KONFIGURASI</p>
        {nav.slice(3).map(([k, l, I]) => <a key={k} className={key === k ? 'on' : ''} onClick={() => go('/' + k)}><I size={16} /> {l}</a>)}
        <a className="logout" onClick={() => setBye(true)}><LogOut size={16} /> Keluar</a>
      </aside>
      <main>
        <header>
          <div><h1>{sub ? `Monitoring PO / Detail ${sub}` : h}</h1><p>{s.replace('{nama}', user.nama).replace('{n}', db.pos.length)}</p></div>
          <div className="top"><div className="search"><Search size={14} /><input placeholder="Cari transaksi, supplier..." value={q} onChange={(e) => { setQ(e.target.value); if (key !== 'monitoring') go('/monitoring') }} /></div>
            <button className="icon bell" onClick={() => go('/discrepancy')}><Bell size={16} />{open > 0 && <i />}</button>
            <div className="me"><b>{user.nama}</b><small>{user.role === 'Manager' ? 'Purchasing Manager' : user.role}</small></div></div>
        </header>
        <section className="content">
          {toast && <div className="toast"><Check size={16} /><div><b>{toast.title}</b><p>{toast.msg}</p></div><button onClick={() => setToast(null)}>×</button></div>}
          <Page c={c} />
        </section>
      </main>
      {bye && (
        <Modal title="Konfirmasi Keluar" sub="Anda akan keluar dari sesi ini. Semua pekerjaan yang belum disimpan akan tetap aman di sistem." onClose={() => setBye(false)} w={400}>
          <div className="mfoot"><button className="btn" onClick={() => setBye(false)}>Batal</button><button className="btn danger" onClick={() => { setBye(false); setUser(null); history.pushState({}, '', '/') }}>Ya, Keluar</button></div>
        </Modal>)}
    </div>
  )
}
