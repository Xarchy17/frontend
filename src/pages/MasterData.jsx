import { useState } from 'react'
import Crud from '../components/Crud.jsx'
import { Badge } from '../components/ui.jsx'
import { rp } from '../data.js'

export default function MasterData({ c }) {
  const { db, set, notify } = c, [tab, setTab] = useState('sup')
  const stok = (r) => <span className={r.stok < 100 ? 'redt' : ''}>{r.stok.toLocaleString('id-ID')}</span>
  return (
    <>
      <div className="tabs"><button className={tab === 'sup' ? 'on' : ''} onClick={() => setTab('sup')}>Data Supplier</button><button className={tab === 'prod' ? 'on' : ''} onClick={() => setTab('prod')}>Katalog Produk Kopi</button></div>
      {tab === 'sup' ? (
        <Crud key="s" name="supplier" addLabel="Tambah Supplier" sub="supplier" rows={db.suppliers} blank={{ kode: 'SUP-' + String(db.suppliers.length + 1).padStart(3, '0'), nama: '', email: '', tel: '', kota: '', alamat: '', st: 'Aktif' }}
          cols={[{ k: 'nama', l: 'NAMA SUPPLIER', bold: true }, { k: 'email', l: 'EMAIL' }, { k: 'tel', l: 'TELEPON' }, { k: 'kota', l: 'ALAMAT' }, { k: 'st', l: 'STATUS', render: (r) => <Badge t={r.st} /> }]}
          fields={[{ k: 'nama', l: 'Nama Supplier', req: 1 }, { k: 'kode', l: 'Kode Supplier', req: 1 }, { k: 'email', l: 'Email', req: 1, type: 'email', full: 1 }, { k: 'tel', l: 'Nomor Telepon', req: 1 }, { k: 'kota', l: 'Kota / Provinsi', req: 1 }, { k: 'alamat', l: 'Alamat Lengkap', area: 1, full: 1 }, { k: 'st', l: 'Status Supplier', opts: ['Aktif', 'Nonaktif'] }]}
          onSave={(r, isNew) => { set('suppliers', (l) => (isNew ? [r, ...l] : l.map((x) => (x.id === r.id ? r : x)))); notify('Supplier berhasil disimpan!', `Data ${r.nama} telah diperbarui dan tersimpan dalam sistem.`) }}
          onDelete={(r) => { set('suppliers', (l) => l.filter((x) => x.id !== r.id)); notify('Supplier dihapus', r.nama) }} />
      ) : (
        <Crud key="p" name="produk" addLabel="Tambah Produk" sub="produk" rows={db.products} blank={{ sku: 'SKU-' + String(db.products.length + 1).padStart(3, '0'), nama: '', kategori: 'Green Bean', supplier: '', stok: '', harga: '' }}
          cols={[{ k: 'sku', l: 'SKU' }, { k: 'nama', l: 'NAMA PRODUK', bold: true }, { k: 'kategori', l: 'KATEGORI' }, { k: 'supplier', l: 'SUPPLIER' }, { k: 'stok', l: 'STOK (KG)', render: stok }, { k: 'harga', l: 'HARGA / KG', right: true, bold: true, render: (r) => rp(r.harga) }]}
          fields={[{ k: 'nama', l: 'Nama Produk', req: 1, full: 1 }, { k: 'sku', l: 'SKU', req: 1 }, { k: 'kategori', l: 'Kategori', opts: ['Green Bean', 'Roasted Bean'] }, { k: 'supplier', l: 'Supplier', req: 1, opts: db.suppliers.map((s) => s.nama), full: 1 }, { k: 'harga', l: 'Harga Satuan (per Kg)', req: 1, type: 'number' }, { k: 'stok', l: 'Stok Tersedia (Kg)', req: 1, type: 'number' }]}
          onSave={(r, isNew) => { set('products', (l) => (isNew ? [r, ...l] : l.map((x) => (x.id === r.id ? r : x)))); notify('Produk berhasil disimpan!', `${r.nama} telah diperbarui.`) }}
          onDelete={(r) => { set('products', (l) => l.filter((x) => x.id !== r.id)); notify('Produk dihapus', r.nama) }} />
      )}
    </>
  )
}
