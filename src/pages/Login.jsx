import { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Brand, Modal } from '../components/ui.jsx'

const PASS = 'Anna2026!'
export default function Login({ onLogin, users }) {
  const [email, setEmail] = useState('admin@annabrew.co.id'), [pw, setPw] = useState(''), [show, setShow] = useState(false)
  const [err, setErr] = useState({}), [left, setLeft] = useState(3), [forgot, setForgot] = useState(false), [sent, setSent] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    const n = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) n.email = 'Pastikan format email sudah benar.'
    if (!pw) n.pw = 'Kata sandi wajib diisi.'
    if (Object.keys(n).length) return setErr(n)
    const u = users.find((x) => x.email === email && x.st === 'Aktif')
    if (email === 'admin@annabrew.co.id' && pw === PASS) return onLogin({ nama: 'Ayu Patricia', role: 'Manager', email })
    if (u && pw === PASS) return onLogin(u)
    const r = left - 1
    setLeft(r); setErr({ form: true, pw: r > 0 ? `Kata sandi salah. Sisa percobaan: ${r} kali.` : 'Akun terkunci sementara. Silakan reset password.' })
  }
  return (
    <div className="login">
      <div className="hero"><Brand light />
        <div><h2>from prompt to perfect<br />logistics alignment</h2><p>Sistem Manajemen Purchase Order untuk mengelola ketidaksesuaian pemasok, verifikasi pencocokan item, dan pemantauan jadwal pengadaan secara akurat.</p></div>
        <small>© 2026 ANNA BREW Coffee Roasters. All rights reserved.</small></div>
      <form onSubmit={submit} noValidate>
        <h2>Masuk ke Dashboard</h2><p className="muted">Gunakan kredensial staff resmi Anda untuk mengakses sistem.</p>
        {err.form && <div className="alert"><AlertCircle size={16} /><div><b>Email atau kata sandi tidak sesuai</b><p>Periksa kembali email dan kata sandi Anda, lalu coba lagi.</p></div></div>}
        <div className={`field ${err.email || err.form ? 'bad' : ''}`}><label>Alamat Email</label><input value={email} onChange={(e) => { setEmail(e.target.value); setErr({}) }} />{err.email && <small className="msg">{err.email}</small>}</div>
        <div className={`field ${err.pw ? 'bad' : ''}`}><label>Kata Sandi</label><div className="pw"><input type={show ? 'text' : 'password'} value={pw} placeholder="Masukkan kata sandi" onChange={(e) => { setPw(e.target.value); setErr({}) }} /><button type="button" onClick={() => setShow(!show)}>{show ? <Eye size={16} /> : <EyeOff size={16} />}</button></div>{err.pw && <small className="msg">{err.pw}</small>}</div>
        <button className="btn primary big" disabled={left <= 0}>Masuk Sekarang</button>
        <a className="link" onClick={() => { setForgot(true); setSent(false) }}>Lupa Password?</a>
        <p className="hint">Demo: ayupatricia@gmail.com · kata sandi {PASS}</p>
      </form>
      {forgot && (
        <Modal title="Lupa Password" sub="Masukkan email Anda untuk menerima tautan reset." onClose={() => setForgot(false)}>
          {sent ? <p className="okmsg">Tautan reset telah dikirim ke {email}. (simulasi frontend)</p> : <div className="field"><label>Alamat Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} /></div>}
          <div className="mfoot"><button className="btn" onClick={() => setForgot(false)}>Tutup</button>{!sent && <button className="btn primary" onClick={() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && setSent(true)}>Kirim Tautan</button>}</div>
        </Modal>)}
    </div>
  )
}
