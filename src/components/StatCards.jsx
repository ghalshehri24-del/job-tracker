export default function StatCards({ t, stats }) {
  const items = [
    { key: 'total',      label: t.stats.total,      value: stats.total,      tone: 'brand'   },
    { key: 'inProgress', label: t.stats.inProgress, value: stats.inProgress, tone: 'amber'   },
    { key: 'offers',     label: t.stats.offers,     value: stats.offers,     tone: 'emerald' },
    { key: 'rejected',   label: t.stats.rejected,   value: stats.rejected,   tone: 'rose'    },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map((it) => (
        <Card key={it.key} {...it} />
      ))}
    </div>
  )
}

const tones = {
  brand:   'from-brand-500/15 to-brand-500/0 text-brand-600 dark:text-brand-500',
  amber:   'from-amber-400/15 to-amber-400/0 text-amber-600 dark:text-amber-400',
  emerald: 'from-emerald-400/15 to-emerald-400/0 text-emerald-600 dark:text-emerald-400',
  rose:    'from-rose-400/15 to-rose-400/0 text-rose-600 dark:text-rose-400',
}

function Card({ label, value, tone }) {
  return (
    <div className="card p-4 sm:p-5 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${tones[tone]} pointer-events-none`} />
      <div className="relative">
        <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{label}</div>
        <div className="mt-2 text-2xl sm:text-3xl font-semibold tabular-nums">{value}</div>
      </div>
    </div>
  )
}
