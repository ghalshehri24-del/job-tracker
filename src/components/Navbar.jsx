import UserMenu from './UserMenu.jsx'

export default function Navbar({ t, lang, onToggleLang, dark, onToggleTheme, onAdd, user, onSignOut }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/80 dark:bg-slate-950/80
                       border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        <div className="flex items-center gap-2 me-auto">
          <div className="h-8 w-8 rounded-lg bg-brand-600 grid place-items-center text-white font-bold">
            JT
          </div>
          <div className="leading-tight">
            <div className="font-semibold">{t.appName}</div>
            <div className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
              {t.tagline}
            </div>
          </div>
        </div>

        <button
          onClick={onToggleLang}
          className="btn-outline"
          aria-label={t.a11y.toggleLanguage}
          title={t.a11y.toggleLanguage}
        >
          <GlobeIcon />
          <span className="font-semibold">{lang === 'ar' ? 'EN' : 'AR'}</span>
        </button>

        <button
          onClick={onToggleTheme}
          className="btn-outline"
          aria-label={t.a11y.toggleTheme}
          title={t.a11y.toggleTheme}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>

        <button onClick={onAdd} className="btn-primary">
          <PlusIcon />
          <span className="hidden sm:inline">{t.nav.addJob}</span>
        </button>

        {user && <UserMenu t={t} user={user} onSignOut={onSignOut} />}
      </div>
    </header>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
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
function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  )
}
