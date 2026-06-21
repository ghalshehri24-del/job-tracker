import { STATUS_COLORS } from '../i18n.js'

export default function StatusBadge({ status, label }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.no_response
  return (
    <span className={`chip ${c.bg} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {label}
    </span>
  )
}
