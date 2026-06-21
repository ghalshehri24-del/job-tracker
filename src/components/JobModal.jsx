import { useEffect, useState } from 'react'
import { STATUSES, JOB_TYPES } from '../i18n.js'

const empty = {
  company: '', title: '', location: '', type: 'full_time',
  date: new Date().toISOString().slice(0, 10),
  status: 'no_response', source: '', contact: '', notes: '', followUp: '',
}

export default function JobModal({ t, open, initial, onClose, onSave, busy = false }) {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...empty, ...initial } : empty)
      setErrors({})
    }
  }, [open, initial])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.company.trim()) errs.company = true
    if (!form.title.trim()) errs.title = true
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative w-full sm:max-w-2xl card max-h-[92vh] overflow-hidden flex flex-col rounded-b-none sm:rounded-2xl"
      >
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-semibold">
            {initial ? t.modal.editTitle : t.modal.addTitle}
          </h2>
          <button type="button" onClick={onClose} className="btn-ghost p-2" aria-label={t.a11y.closeModal}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto">
          <Field label={t.table.company} required error={errors.company} message={t.modal.required}>
            <input className="input" value={form.company} onChange={set('company')}
                   placeholder={t.modal.placeholders.company} />
          </Field>
          <Field label={t.table.title} required error={errors.title} message={t.modal.required}>
            <input className="input" value={form.title} onChange={set('title')}
                   placeholder={t.modal.placeholders.title} />
          </Field>
          <Field label={t.table.location}>
            <input className="input" value={form.location} onChange={set('location')}
                   placeholder={t.modal.placeholders.location} />
          </Field>
          <Field label={t.table.type}>
            <select className="input" value={form.type} onChange={set('type')}>
              {JOB_TYPES.map((k) => <option key={k} value={k}>{t.jobTypes[k]}</option>)}
            </select>
          </Field>
          <Field label={t.table.date}>
            <input type="date" className="input" value={form.date} onChange={set('date')} />
          </Field>
          <Field label={t.table.status}>
            <select className="input" value={form.status} onChange={set('status')}>
              {STATUSES.map((k) => <option key={k} value={k}>{t.statuses[k]}</option>)}
            </select>
          </Field>
          <Field label={t.table.source} className="sm:col-span-2">
            <input className="input" value={form.source} onChange={set('source')}
                   placeholder={t.modal.placeholders.source} />
          </Field>
          <Field label={t.table.contact}>
            <input className="input" value={form.contact} onChange={set('contact')}
                   placeholder={t.modal.placeholders.contact} />
          </Field>
          <Field label={t.table.followUp}>
            <input type="date" className="input" value={form.followUp} onChange={set('followUp')} />
          </Field>
          <Field label={t.table.notes} className="sm:col-span-2">
            <textarea className="input min-h-[96px] resize-y" value={form.notes} onChange={set('notes')}
                      placeholder={t.modal.placeholders.notes} />
          </Field>
        </div>

        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={busy} className="btn-outline">{t.modal.cancel}</button>
          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? '…' : (initial ? t.modal.save : t.modal.saveAdd)}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children, required, error, message, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
        {label}{required && <span className="text-rose-500 ms-1">*</span>}
      </div>
      {children}
      {error && <div className="text-xs text-rose-500 mt-1">{message}</div>}
    </label>
  )
}
