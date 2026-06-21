// Shown when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are missing.
// Keeps the app from white-screening before the user pastes credentials.

export default function ConfigNeeded({ t, lang, onToggleLang, dark, onToggleTheme }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 end-4 flex gap-2">
        <button onClick={onToggleLang} className="btn-outline">
          <span className="font-semibold">{lang === 'ar' ? 'EN' : 'AR'}</span>
        </button>
        <button onClick={onToggleTheme} className="btn-outline">{dark ? '☀' : '☾'}</button>
      </div>
      <div className="flex-1 grid place-items-center px-4 py-12">
        <div className="card p-6 max-w-lg w-full">
          <h1 className="text-lg font-semibold">{t.config.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t.config.body}</p>
          <pre className="mt-4 text-xs bg-slate-100 dark:bg-slate-800/60 rounded-lg p-3 overflow-x-auto" dir="ltr">
{`# .env.local
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
          </pre>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">{t.config.restart}</p>
        </div>
      </div>
    </div>
  )
}
