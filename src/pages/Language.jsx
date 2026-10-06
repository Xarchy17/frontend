import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Languages } from 'lucide-react'
import Brand from '../components/Brand'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function Language({ isAuthenticated }) {
  const { language, setLanguage, t } = useLanguage()
  const location = useLocation()
  const returnTo = location.state?.from || (isAuthenticated ? '/dashboard' : '/')

  return <main className="language-screen">
    <header className="language-header"><Brand /><Link className="language-back" to={returnTo}><ArrowLeft size={16} />{t('Kembali ke aplikasi')}</Link></header>
    <section className="language-panel">
      <Languages size={24} color="var(--pri)" />
      <h1>{t('Pilih Bahasa')}</h1>
      <p>{t('Pilih bahasa untuk menggunakan Anna Brew.')}</p>
      <div className="language-options" role="group" aria-label={t('Pilih Bahasa')}>
        {[['id', 'Bahasa Indonesia'], ['en', 'English']].map(([value, label]) => <button key={value} className={`language-option ${language === value ? 'selected' : ''}`} aria-pressed={language === value} onClick={() => setLanguage(value)}>
          <span>{label}</span><span className="language-radio" aria-hidden="true" />
        </button>)}
      </div>
      <Link className="btn language-apply" to={returnTo}>{t('Kembali ke aplikasi')}</Link>
    </section>
  </main>
}