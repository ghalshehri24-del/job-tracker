import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { STATUSES, JOB_TYPES, STATUS_COLORS, TYPE_COLORS } from '../i18n.js'

export default function Charts({ t, jobs, dark }) {
  const typeData = JOB_TYPES.map((k) => ({
    key: k,
    name: t.jobTypes[k],
    value: jobs.filter((j) => j.type === k).length,
    color: TYPE_COLORS[k],
  })).filter((d) => d.value > 0)

  const statusData = STATUSES.map((k) => ({
    key: k,
    name: t.statuses[k],
    value: jobs.filter((j) => j.status === k).length,
    color: STATUS_COLORS[k].chart,
  }))

  const axisColor = dark ? '#94a3b8' : '#475569'
  const gridColor = dark ? '#1e293b' : '#e2e8f0'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card p-4 sm:p-5">
        <div className="text-sm font-medium mb-3">{t.charts.byType}</div>
        <div className="h-64">
          {typeData.length === 0 ? (
            <Empty t={t} />
          ) : (
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={48}
                  outerRadius={82}
                  paddingAngle={2}
                  stroke="none"
                >
                  {typeData.map((d) => <Cell key={d.key} fill={d.color} />)}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle(dark)}
                  formatter={(v, n) => [v, n]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(v) => <span className="text-xs text-slate-600 dark:text-slate-300">{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card p-4 sm:p-5">
        <div className="text-sm font-medium mb-3">{t.charts.byStatus}</div>
        <div className="h-64">
          {jobs.length === 0 ? (
            <Empty t={t} />
          ) : (
            <ResponsiveContainer>
              <BarChart data={statusData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 12 }} axisLine={{ stroke: gridColor }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: axisColor, fontSize: 12 }} axisLine={{ stroke: gridColor }} tickLine={false} />
                <Tooltip
                  contentStyle={tooltipStyle(dark)}
                  cursor={{ fill: dark ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.04)' }}
                  formatter={(v) => [v, t.charts.count]}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {statusData.map((d) => <Cell key={d.key} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

function tooltipStyle(dark) {
  return {
    background: dark ? '#0f172a' : '#ffffff',
    border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
    borderRadius: 10,
    fontSize: 12,
    color: dark ? '#e2e8f0' : '#0f172a',
  }
}

function Empty({ t }) {
  return (
    <div className="h-full grid place-items-center text-sm text-slate-500 dark:text-slate-400">
      {t.charts.empty}
    </div>
  )
}
