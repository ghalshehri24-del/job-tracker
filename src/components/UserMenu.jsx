import { useEffect, useRef, useState } from 'react'

export default function UserMenu({ t, user, onSignOut }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const email = user?.email || ''
  const name  = user?.user_metadata?.full_name || user?.user_metadata?.name || email.split('@')[0]
  const avatar = user?.user_metadata?.avatar_url
  const initial = (name || '?').slice(0, 1).toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 rounded-full overflow-hidden bg-brand-600 text-white grid place-items-center font-medium
                   ring-2 ring-transparent hover:ring-brand-500/40 transition"
        aria-haspopup="menu"
        aria-expanded={open}
        title={email}
      >
        {avatar
          ? <img src={avatar} alt="" className="h-full w-full object-cover" />
          : <span>{initial}</span>}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute end-0 mt-2 w-60 card p-1.5 z-30 origin-top-end"
        >
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
            <div className="text-sm font-medium truncate">{name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{email}</div>
          </div>
          <button
            role="menuitem"
            onClick={() => { setOpen(false); onSignOut() }}
            className="w-full text-start px-3 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-800
                       text-rose-600 dark:text-rose-400"
          >
            {t.auth.signOut}
          </button>
        </div>
      )}
    </div>
  )
}
