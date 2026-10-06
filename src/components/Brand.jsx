export default function Brand({ variant = 'sidebar-brand' }) {
  return (
    <div className={`brand-lockup ${variant}`}>
      <span className="brand-mark" aria-hidden="true" />
      <span className="brand-copy">
        <b>ANNA BREW</b>
        <small>PO MANAGEMENT</small>
      </span>
    </div>
  )
}