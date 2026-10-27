import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export const Brand = ({ light }) => (
  <div className={`brand ${light ? 'brand-light' : ''}`}><img src="/anna-brew-logo.png" alt="Anna Brew — Purchase Order Management System" /></div>
)
const tone = { Selesai: 'green', Aktif: 'green', 'Sedang Dikirim': 'blue', 'Menunggu Konfirmasi': 'amber', 'Menunggu Review': 'amber', Overdue: 'red', Ditolak: 'red', Nonaktif: 'red', Ditutup: 'gray', Manager: 'amber', Admin: 'blue', Staff: 'green' }
export const Badge = ({ t }) => <span className={`badge ${tone[t] || 'gray'}`}>{t}</span>

export function Modal({ title, sub, onClose, children, w = 440 }) {
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: w }}>
        <div className="mhead"><div><h3>{title}</h3>{sub && <p>{sub}</p>}</div><button className="icon" onClick={onClose}><X size={16} /></button></div>
        <div className="mbody">{children}</div>
      </div>
    </div>
  )
}
export function Pager({ page, total, per = 5, set, label = 'entri' }) {
  const pages = Math.max(1, Math.ceil(total / per)), from = total ? (page - 1) * per + 1 : 0
  return (
    <div className="pager"><span>Menampilkan {from}-{Math.min(page * per, total)} dari {total} {label}</span>
      <div><button disabled={page <= 1} onClick={() => set(page - 1)}><ChevronLeft size={14} /></button>
        {Array.from({ length: pages }, (_, i) => <button key={i} className={page === i + 1 ? 'on' : ''} onClick={() => set(i + 1)}>{i + 1}</button>)}
        <button disabled={page >= pages} onClick={() => set(page + 1)}><ChevronRight size={14} /></button></div></div>
  )
}
