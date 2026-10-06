import { useLanguage } from '../context/LanguageContext.jsx'

const map = {
  Selesai: 'green', Aktif: 'green', Disetujui: 'green',
  'Sedang Dikirim': 'blue', Manager: 'blue',
  Pending: 'yellow', 'Menunggu Approval': 'yellow', 'Menunggu Konfirmasi': 'yellow', 'Menunggu Review': 'yellow', Staff: 'yellow',
  Overdue: 'red', Nonaktif: 'red', Ditolak: 'red', Admin: 'indigo',
}
export default function Badge({ children }) {
  const { t } = useLanguage()
  return <span className={`badge ${map[children] || 'blue'}`}>{t(children)}</span>
}
