import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Brand from '../components/Brand'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function ForgotPassword({ users, onReset }) {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [account, setAccount] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const findAccount = (event) => {
    event.preventDefault()
    const match = users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.st === 'Aktif')
    if (!match) {
      setError(t('Email tidak ditemukan atau akun tidak aktif.'))
      return
    }
    setAccount(match)
    setError('')
  }

  const savePassword = (event) => {
    event.preventDefault()
    if (password.length < 8) {
      setError(t('Kata sandi minimal 8 karakter.'))
      return
    }
    if (password !== confirmation) {
      setError(t('Konfirmasi kata sandi tidak cocok.'))
      return
    }
    onReset(account.email, password)
    setError('')
    setSuccess(true)
  }

  return <div className="login">
    <section className="hero">
      <Brand variant="hero-brand" />
      <div className="hero-message"><h1>{t('Reset Kata Sandi')}</h1><p>{t('Masukkan email akun untuk mengatur kata sandi baru.')}</p></div>
      <small>© 2026 ANNA BREW Coffee Roasters. All rights reserved.</small>
    </section>
    <section className="formbox">
      {success ? <div className="recovery-form"><h2>{t('Reset Kata Sandi')}</h2><p role="status">{t('Kata sandi berhasil diubah. Silakan masuk dengan kata sandi baru.')}</p><Link className="btn full" to="/">{t('Kembali ke Login')}</Link></div> : <form className="recovery-form" onSubmit={account ? savePassword : findAccount}>
        <h2>{account ? t('Buat kata sandi baru') : t('Reset Kata Sandi')}</h2>
        <p className="form-hint">{t('Masukkan email akun untuk mengatur kata sandi baru.')}</p>
        {error && <p className="login-error" role="alert">{error}</p>}
        {!account ? <div className="field"><label htmlFor="recovery-email">{t('Alamat Email')}</label><input id="recovery-email" className="input" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div> : <>
          <div className="field"><label htmlFor="new-password">{t('Kata sandi baru')}</label><div className="password-field"><input id="new-password" className="input" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button className="password-toggle" type="button" aria-label={showPassword ? t('Sembunyikan kata sandi') : t('Lihat kata sandi')} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
          <div className="field"><label htmlFor="confirm-password">{t('Konfirmasi kata sandi')}</label><div className="password-field"><input id="confirm-password" className="input" type={showConfirmation ? 'text' : 'password'} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required /><button className="password-toggle" type="button" aria-label={showConfirmation ? t('Sembunyikan kata sandi') : t('Lihat kata sandi')} aria-pressed={showConfirmation} onClick={() => setShowConfirmation(!showConfirmation)}>{showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
        </>}
        <button className="btn full">{account ? t('Simpan Kata Sandi Baru') : t('Lanjutkan')}</button>
        <Link className="recovery-link" to="/">{t('Kembali ke Login')}</Link>
      </form>}
    </section>
  </div>
}