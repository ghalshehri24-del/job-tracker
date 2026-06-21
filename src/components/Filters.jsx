import { STATUSES, JOB_TYPES } from '../i18n.js'

export default function Filters({
  t, query, setQuery, statusFilter, setStatusFilter,
  typeFilter, setTypeFilter, onClear,
}) {
  const hasFilter = query || statusFilter !== 'all' || typeFilter !== 'all'

  return (
    <div className="card p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
      <div className="relative flex-1">
        <SearchIcon />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.filters.searchPlaceholder}
          className="input ps-9"
        />
      </div>
      <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input sm:w-44"
        >
          <option value="all">{t.filters.allStatuses}</option>
          {STATUSES.map((k) => <option key={k} value={k}>{t.statuses[k]}</option>)}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="input sm:w-44"
        >
          <option value="all">{t.filters.allTypes}</option>
          {JOB_TYPES.map((k) => <option key={k} value={k}>{t.jobTypes[k]}</option>)}
        </select>
        {hasFilter && (
          <button onClick={onClear} className="btn-ghost col-span-2 sm:col-auto">
            {t.filters.clear}
          </button>
        )}
      </div>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg
      className="absolute top-1/2 -translate-y-1/2 start-3 text-slate-400"
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}
