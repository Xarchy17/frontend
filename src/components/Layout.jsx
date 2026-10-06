import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileSearch, AlertCircle, Database, Users, Search, Bell, LogOut, Languages } from 'lucide-react'
import Brand from './Brand'
import { useLanguage } from '../context/LanguageContext.jsx'

const menu = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, title: 'Dashboard Analitik' },
  { to: '/monitoring', label: 'Monitoring PO', icon: FileSearch, title: 'Monitoring PO' },
  { to: '/discrepancy', label: 'Review Discrepancy', icon: AlertCircle, title: 'Review Discrepancy' },
  { to: '/master-data', label: 'Master Data', icon: Database, title: 'Kelola Master Data' },
  { to: '/users', label: 'Kelola User', icon: Users, title: 'Kelola User Staff' },
]

export default function Layout({ currentUser, onLogout, users, setUsers }) {
  const { pathname } = useLocation()
  const { t } = useLanguage()
  const title = t(menu.find((m) => m.to === pathname)?.title || 'Dashboard Analitik')
  return (
    <div className="app">
      <aside className="sidebar">
        <Brand />
        <nav className="nav">
          {menu.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}><Icon size={18} />{t(label)}</NavLink>
          ))}
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <h1>{title}</h1>
          <div className="tools">
            <div className="search"><Search size={16} /><input placeholder={t('Cari transaksi, supplier...')} /></div>
            <Bell size={20} color="#64748b" />
            <div className="user">
              <div className="avatar">{currentUser.nama.split(' ').map((part) => part[0]).join('')}</div>
              <div><b>{currentUser.nama}</b><small>{t(currentUser.role)} · {currentUser.lokasi}</small></div>
            </div>
            <Link className="icon-btn" to="/language" state={{ from: pathname }} title={t('Ubah Bahasa')} aria-label={t('Ubah Bahasa')}><Languages size={18} /></Link>
            <button className="icon-btn" title={t('Logout')} aria-label={t('Logout')} onClick={onLogout}><LogOut size={18} /></button>
          </div>
        </header>
        <div className="page"><Outlet context={{ users, setUsers }} /></div>
      </div>
    </div>
  )
}
