export default function ConfirmDialog({ t, open, onCancel, onConfirm }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative card w-full max-w-sm p-5">
        <div className="text-base font-semibold">{t.confirm.deleteTitle}</div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t.confirm.deleteBody}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="btn-outline">{t.confirm.cancel}</button>
          <button onClick={onConfirm} className="btn-danger">{t.confirm.confirm}</button>
        </div>
      </div>
    </div>
  )
}
