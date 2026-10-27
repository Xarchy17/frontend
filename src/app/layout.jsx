import '../index.css'

export const metadata = {
  title: 'Anna Brew | PO Management',
  description: 'Sistem manajemen purchase order Anna Brew.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
