import StatusBadge from './StatusBadge.jsx'

export default function JobTable({ t, jobs, allJobsCount, onEdit, onDelete }) {
  if (jobs.length === 0) {
    return (
      <div className="card p-10 text-center text-sm text-slate-500 dark:text-slate-400">
        {allJobsCount === 0 ? t.table.emptyAll : t.table.empty}
      </div>
    )
  }

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="card hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400">
              <tr className="text-start">
                <Th>{t.table.company}</Th>
                <Th>{t.table.title}</Th>
                <Th>{t.table.location}</Th>
                <Th>{t.table.type}</Th>
                <Th>{t.table.date}</Th>
                <Th>{t.table.status}</Th>
                <Th>{t.table.source}</Th>
                <Th>{t.table.contact}</Th>
                <Th>{t.table.notes}</Th>
                <Th>{t.table.followUp}</Th>
                <Th className="text-end">{t.table.actions}</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {jobs.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                  <Td className="font-medium">{j.company}</Td>
                  <Td>{j.title}</Td>
                  <Td className="text-slate-600 dark:text-slate-300">{j.location || '—'}</Td>
                  <Td>{j.type ? <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">{t.jobTypes[j.type]}</span> : '—'}</Td>
                  <Td className="tabular-nums whitespace-nowrap">{j.date || '—'}</Td>
                  <Td><StatusBadge status={j.status} label={t.statuses[j.status]} /></Td>
                  <Td>{renderSource(j.source, t)}</Td>
                  <Td className="text-slate-600 dark:text-slate-300">{j.contact || '—'}</Td>
                  <Td className="text-slate-600 dark:text-slate-300 max-w-[14rem] truncate" title={j.notes}>{j.notes || '—'}</Td>
                  <Td className="tabular-nums whitespace-nowrap">{j.followUp || '—'}</Td>
                  <Td className="text-end whitespace-nowrap">
                    <button onClick={() => onEdit(j)} className="btn-ghost px-2 py-1 text-xs">{t.table.edit}</button>
                    <button onClick={() => onDelete(j)} className="btn-ghost px-2 py-1 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10">{t.table.delete}</button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid gap-3">
        {jobs.map((j) => (
          <div key={j.id} className="card p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold leading-tight">{j.company}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">{j.title}</div>
              </div>
              <StatusBadge status={j.status} label={t.statuses[j.status]} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Field label={t.table.location} value={j.location} />
              <Field label={t.table.type} value={j.type ? t.jobTypes[j.type] : ''} />
              <Field label={t.table.date} value={j.date} />
              <Field label={t.table.followUp} value={j.followUp} />
              <Field label={t.table.contact} value={j.contact} />
              <Field label={t.table.source} value={renderSourceText(j.source)} />
            </div>
            {j.notes && (
              <div className="text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-2">
                {j.notes}
              </div>
            )}
            <div className="flex justify-end gap-1 pt-1">
              <button onClick={() => onEdit(j)} className="btn-outline px-3 py-1.5 text-xs">{t.table.edit}</button>
              <button onClick={() => onDelete(j)} className="btn-outline px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400">{t.table.delete}</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function Th({ children, className = '' }) {
  return <th className={`px-4 py-3 text-xs font-medium uppercase tracking-wide text-start ${className}`}>{children}</th>
}
function Td({ children, className = '' }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>
}
function Field({ label, value }) {
  return (
    <div>
      <div className="uppercase tracking-wide text-[10px]">{label}</div>
      <div className="text-slate-700 dark:text-slate-200">{value || '—'}</div>
    </div>
  )
}

function renderSource(src, t) {
  if (!src) return '—'
  const isUrl = /^https?:\/\//i.test(src)
  if (!isUrl) return <span className="text-slate-600 dark:text-slate-300">{src}</span>
  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className="text-brand-600 dark:text-brand-500 hover:underline inline-flex items-center gap-1"
      title={src}
    >
      {t.table.openLink}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </a>
  )
}
function renderSourceText(src) {
  if (!src) return ''
  return /^https?:\/\//i.test(src) ? new URL(src).hostname : src
}
