import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { getDict } from './i18n.js'

import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { isSupabaseConfigured } from './lib/supabase.js'
import { listJobs, createJob, updateJob, deleteJob } from './lib/jobs.js'

import Navbar from './components/Navbar.jsx'
import StatCards from './components/StatCards.jsx'
import Charts from './components/Charts.jsx'
import Filters from './components/Filters.jsx'
import JobTable from './components/JobTable.jsx'
import JobModal from './components/JobModal.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import AuthScreen from './components/AuthScreen.jsx'
import ConfigNeeded from './components/ConfigNeeded.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}

// ---- Theme + language live above auth so the login screen respects them.

function useChrome() {
  const [lang, setLang] = useLocalStorage('jt:lang', 'ar')
  const [dark, setDark] = useLocalStorage(
    'jt:theme',
    () => (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
  )
  const isDark = dark === true || dark === 'dark'

  useEffect(() => {
    const html = document.documentElement
    html.classList.toggle('dark', isDark)
    try { localStorage.setItem('jt:theme', isDark ? 'dark' : 'light') } catch {}
  }, [isDark])

  useEffect(() => {
    const html = document.documentElement
    html.lang = lang
    html.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const t = getDict(lang)
  return {
    t, lang, isDark,
    toggleLang: () => setLang(lang === 'ar' ? 'en' : 'ar'),
    toggleTheme: () => setDark(!isDark),
  }
}

function Shell() {
  const { t, lang, isDark, toggleLang, toggleTheme } = useChrome()
  const { user, loading: authLoading, signOut } = useAuth()

  if (!isSupabaseConfigured) {
    return <ConfigNeeded t={t} lang={lang} dark={isDark}
                         onToggleLang={toggleLang} onToggleTheme={toggleTheme} />
  }

  if (authLoading) {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-slate-500 dark:text-slate-400">
        …
      </div>
    )
  }

  if (!user) {
    return <AuthScreen t={t} lang={lang} dark={isDark}
                       onToggleLang={toggleLang} onToggleTheme={toggleTheme} />
  }

  return <Workspace t={t} lang={lang} isDark={isDark}
                    onToggleLang={toggleLang} onToggleTheme={toggleTheme}
                    user={user} onSignOut={signOut} />
}

function Workspace({ t, lang, isDark, onToggleLang, onToggleTheme, user, onSignOut }) {
  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [jobsError, setJobsError] = useState('')

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirming, setConfirming] = useState(null)
  const [saving, setSaving] = useState(false)

  const reload = useCallback(async () => {
    setJobsLoading(true); setJobsError('')
    try { setJobs(await listJobs()) }
    catch (e) { setJobsError(e.message || t.errors.loadFailed) }
    finally { setJobsLoading(false) }
  }, [t.errors.loadFailed])

  useEffect(() => { reload() }, [reload])

  const stats = useMemo(() => ({
    total: jobs.length,
    inProgress: jobs.filter((j) => j.status === 'interview' || j.status === 'no_response').length,
    offers: jobs.filter((j) => j.status === 'offer').length,
    rejected: jobs.filter((j) => j.status === 'rejected').length,
  }), [jobs])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return jobs.filter((j) => {
      if (statusFilter !== 'all' && j.status !== statusFilter) return false
      if (typeFilter !== 'all' && j.type !== typeFilter) return false
      if (!q) return true
      return (j.company || '').toLowerCase().includes(q)
          || (j.title   || '').toLowerCase().includes(q)
    })
  }, [jobs, query, statusFilter, typeFilter])

  const openAdd = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (job) => { setEditing(job); setModalOpen(true) }

  const handleSave = async (data) => {
    setSaving(true); setJobsError('')
    try {
      if (editing) {
        const updated = await updateJob(editing.id, data, user.id)
        setJobs((cur) => cur.map((j) => (j.id === editing.id ? updated : j)))
      } else {
        const created = await createJob(data, user.id)
        setJobs((cur) => [created, ...cur])
      }
      setModalOpen(false); setEditing(null)
    } catch (e) {
      setJobsError(e.message || t.errors.saveFailed)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirming) return
    try {
      await deleteJob(confirming.id)
      setJobs((cur) => cur.filter((j) => j.id !== confirming.id))
    } catch (e) {
      setJobsError(e.message || t.errors.deleteFailed)
    } finally {
      setConfirming(null)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar
        t={t}
        lang={lang}
        onToggleLang={onToggleLang}
        dark={isDark}
        onToggleTheme={onToggleTheme}
        onAdd={openAdd}
        user={user}
        onSignOut={onSignOut}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {jobsError && (
          <div className="card p-3 text-sm text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-500/10">
            {jobsError}
          </div>
        )}

        <StatCards t={t} stats={stats} />
        <Charts t={t} jobs={jobs} dark={isDark} />
        <Filters
          t={t}
          query={query} setQuery={setQuery}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          typeFilter={typeFilter} setTypeFilter={setTypeFilter}
          onClear={() => { setQuery(''); setStatusFilter('all'); setTypeFilter('all') }}
        />
        {jobsLoading ? (
          <div className="card p-10 text-center text-sm text-slate-500 dark:text-slate-400">
            {t.auth.loading}
          </div>
        ) : (
          <JobTable
            t={t}
            jobs={filtered}
            allJobsCount={jobs.length}
            onEdit={openEdit}
            onDelete={(j) => setConfirming(j)}
          />
        )}
      </main>

      <JobModal
        t={t}
        open={modalOpen}
        initial={editing}
        busy={saving}
        onClose={() => { if (!saving) { setModalOpen(false); setEditing(null) } }}
        onSave={handleSave}
      />
      <ConfirmDialog
        t={t}
        open={!!confirming}
        onCancel={() => setConfirming(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
