import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function AuthScreen({ t, lang, onToggleLang, dark, onToggleTheme }) {
  const { signInPassword, signUpPassword } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setInfo(''); setBusy(true)
    try {
      if (mode === 'signin') {
        await signInPassword(email, password)
      } else {
        const { needsConfirmation } = await signUpPassword(email, password)
        if (needsConfirmation) setInfo(t.auth.checkEmail)
      }
    } catch (err) {
      setError(err.message || String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 end-4 flex gap-2">
        <button onClick={onToggleLang} className="btn-outline" aria-label={t.a11y.toggleLanguage}>
          <span className="font-semibold">{lang === 'ar' ? 'EN' : 'AR'}</span>
        </button>
        <button onClick={onToggleTheme} className="btn-outline" aria-label={t.a11y.toggleTheme}>
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      <div className="flex-1 grid place-items-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="h-10 w-10 rounded-xl bg-brand-600 grid place-items-center text-white font-bold">JT</div>
            <div>
              <div className="font-semibold text-lg leading-tight">{t.appName}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{t.tagline}</div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <div>
              <h1 className="text-lg font-semibold">
                {mode === 'signin' ? t.auth.signInTitle : t.auth.signUpTitle}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {mode === 'signin' ? t.auth.signInSubtitle : t.auth.signUpSubtitle}
              </p>
            </div>

            <form onSubmit={submit} className="space-y-3">
              <label className="block">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.auth.email}
                </div>
                <input
                  type="email" required
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>
              <label className="block">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  {t.auth.password}
                </div>
                <input
                  type="password" required minLength={6}
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                />
              </label>

              {error && (
                <div className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 rounded-md px-3 py-2">
                  {error}
                </div>
              )}
              {info && (
                <div className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 rounded-md px-3 py-2">
                  {info}
                </div>
              )}

              <button type="submit" disabled={busy} className="btn-primary w-full">
                {busy ? '…' : (mode === 'signin' ? t.auth.signIn : t.auth.signUp)}
              </button>
            </form>

            <div className="text-xs text-center text-slate-500 dark:text-slate-400">
              {mode === 'signin' ? t.auth.noAccount : t.auth.haveAccount}{' '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setInfo('') }}
                className="text-brand-600 dark:text-brand-500 font-medium hover:underline"
              >
                {mode === 'signin' ? t.auth.signUp : t.auth.signIn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  )
}
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}
