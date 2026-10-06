export const rp = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(n))
const it = (n, s, q, p) => ({ n, s, q, p })
const log = (t, who, ts) => ({ t, who, ts })
const po = (id, sup, tgl, due, st, items, eta = '28 – 30 Januari 2026') => ({ id, sup, tgl, due, st, items, eta, logs: [log('PO Dibuat — ' + st, 'Ayu Patricia', tgl + ', 09:15')] })
export const suppliers = [
  { id: 1, kode: 'SUP-001', nama: 'Java Estate Group', email: 'hello@javaestate.co.id', tel: '+62 812-9901-4451', kota: 'Bandung, Jawa Barat', alamat: 'Jl. Kopi No. 1, Bandung', st: 'Aktif' },
  { id: 2, kode: 'SUP-002', nama: 'Toraja Highland Roasters', email: 'sales@torajahighland.com', tel: '+62 853-2210-908', kota: 'Makassar, Sulawesi Selatan', alamat: 'Makale, Tana Toraja, Sulawesi Selatan', st: 'Aktif' },
  { id: 3, kode: 'SUP-003', nama: 'Aceh Gayo Farms', email: 'info@acehgayofarms.com', tel: '+62 811-4091-889', kota: 'Takengon, Aceh', alamat: 'Takengon, Aceh Tengah', st: 'Aktif' },
  { id: 4, kode: 'SUP-004', nama: 'Bali Kintamani Growers', email: 'growers@kintamanibali.org', tel: '+62 831-2290-4100', kota: 'Kintamani, Bali', alamat: 'Kintamani, Bangli, Bali', st: 'Nonaktif' },
  { id: 5, kode: 'SUP-005', nama: 'Sumatra Coffee Labs', email: 'contact@sumatracoffeelabs.com', tel: '+62 811-3442-122', kota: 'Medan, Sumatra Utara', alamat: 'Jl. Industri Kopi No. 12, Medan', st: 'Aktif' },
]
export const products = [
  { id: 1, sku: 'SKU-001', nama: 'Arabika Gayo Grade 1', kategori: 'Green Bean', supplier: 'Aceh Gayo Farms', stok: 850, harga: 95000 },
  { id: 2, sku: 'SKU-002', nama: 'Robusta Sumatra Bulk', kategori: 'Green Bean', supplier: 'Sumatra Coffee Labs', stok: 1240, harga: 62000 },
  { id: 3, sku: 'SKU-003', nama: 'Toraja Kalosi Espresso', kategori: 'Roasted Bean', supplier: 'Toraja Highland Roasters', stok: 45, harga: 148000 },
  { id: 4, sku: 'SKU-004', nama: 'Kintamani Natural Process', kategori: 'Green Bean', supplier: 'Bali Kintamani Growers', stok: 320, harga: 112000 },
  { id: 5, sku: 'SKU-005', nama: 'Java Preanger Washed', kategori: 'Green Bean', supplier: 'Java Estate Group', stok: 670, harga: 88500 },
]
export const users = [
  { id: 1, nama: 'Ayu Patricia', email: 'ayupatricia@gmail.com', lokasi: 'Medan', role: 'Manager', st: 'Aktif', gabung: '05 Jan 2025' },
  { id: 2, nama: 'Aliyah Putri Khairunnisa', email: 'aliyah@gmail.com', lokasi: 'Palembang', role: 'Admin', st: 'Aktif', gabung: '05 Jan 2025' },
  { id: 3, nama: 'Helixa Jaya Cipta Rusyandi', email: 'helixa@gmail.com', lokasi: 'Bandung', role: 'Staff', st: 'Aktif', gabung: '05 Jan 2025' },
]
export const pos = [
  po('PO-2026-0050', 'Flores Bajawa Estate', '26 Jan 2026', '26 Jan 2026', 'Menunggu Konfirmasi', [it('Kopi Arabika Bajawa', 'KPI-A-010', 500, 122000)]),
  po('PO-2026-0049', 'Mandailing Natal Growers', '25 Jan 2026', '28 Jan 2026', 'Menunggu Konfirmasi', [it('Kopi Mandailing Grade 1', 'KPI-A-020', 450, 98000)]),
  po('PO-2026-0048', 'Sumatra Coffee Labs', '24 Jan 2026', '24 Jan 2026', 'Selesai', [it('Robusta Sumatra Bulk', 'SKU-002', 2500, 16363)]),
  po('PO-2026-0047', 'Java Estate Group', '22 Jan 2026', '27 Jan 2026', 'Sedang Dikirim', [it('Java Preanger Washed', 'SKU-005', 12000, 9280)]),
  po('PO-2026-0046', 'Toraja Highland Roasters', '18 Jan 2026', '25 Jan 2026', 'Menunggu Konfirmasi', [it('Kopi Arabika Toraja Grade A', 'KPI-A-001', 2500, 15000), it('Kopi Robusta Toraja Medium Roast', 'KPI-R-007', 1700, 14000)]),
  po('PO-2026-0045', 'Aceh Gayo Farms', '15 Jan 2026', '20 Jan 2026', 'Overdue', [it('Arabika Gayo Grade 1', 'SKU-001', 1500, 19393)]),
  po('PO-2026-0044', 'Bali Kintamani Growers', '12 Jan 2026', '18 Jan 2026', 'Selesai', [it('Kintamani Natural Process', 'SKU-004', 3000, 16666)]),
  po('PO-2026-0043', 'Java Estate Group', '10 Jan 2026', '15 Jan 2026', 'Selesai', [it('Java Preanger Washed', 'SKU-005', 2000, 88500)]),
  po('PO-2026-0042', 'Aceh Gayo Farms', '08 Jan 2026', '14 Jan 2026', 'Selesai', [it('Arabika Gayo Grade 1', 'SKU-001', 800, 95000)]),
  po('PO-2026-0041', 'Toraja Highland Roasters', '06 Jan 2026', '12 Jan 2026', 'Selesai', [it('Toraja Kalosi Espresso', 'SKU-003', 300, 148000)]),
  po('PO-2026-0040', 'Sumatra Coffee Labs', '03 Jan 2026', '09 Jan 2026', 'Selesai', [it('Robusta Sumatra Bulk', 'SKU-002', 1000, 62000)]),
]
const d = (id, po, sup, jenis, tgl, st, desc, rugi, qty, by) => ({ id, po, sup, jenis, tgl, st, desc, rugi, qty, by })
export const discrepancies = [
  d('DISC-0024', 'PO-2026-0048', 'Sumatra Coffee Labs', 'Kekurangan Barang', '25 Jan 2026', 'Menunggu Review', 'Biji kopi Robusta Sumatra yang diterima kurang sebanyak 5 karung (total kekurangan 250 Kg) dari jumlah yang tertera di surat jalan dan dokumen PO. Kondisi segel kontainer luar dalam keadaan baik, kemungkinan kesalahan packing dari supplier.', 4500000, '5 karung / 250 Kg', 'Rian (Staff Gudang)'),
  d('DISC-0023', 'PO-2026-0045', 'Aceh Gayo Farms', 'Kerusakan Barang', '20 Jan 2026', 'Selesai', 'Sebagian karung basah akibat kebocoran atap kontainer saat pengiriman.', 3200000, '3 karung / 150 Kg', 'Rian (Staff Gudang)'),
  d('DISC-0022', 'PO-2026-0044', 'Bali Kintamani Growers', 'Salah Item', '15 Jan 2026', 'Ditutup', 'Item yang dikirim adalah Natural Process, bukan Honey Process sesuai PO.', 1800000, '2 karung / 100 Kg', 'Dewi (QC)'),
  d('DISC-0021', 'PO-2026-0041', 'Toraja Highland Roasters', 'Kekurangan Barang', '10 Jan 2026', 'Selesai', 'Jumlah roasted bean kurang 10 Kg dari surat jalan.', 1480000, '10 Kg', 'Rian (Staff Gudang)'),
]
export const seed = { pos, suppliers, products, users, discrepancies }
