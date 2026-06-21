import { supabase } from './supabase.js'

// DB rows use snake_case; the UI uses camelCase. Convert at the boundary so
// none of the React components need to know about Postgres column names.

function fromRow(r) {
  return {
    id: r.id,
    company: r.company || '',
    title: r.title || '',
    location: r.location || '',
    type: r.type,
    date: r.date || '',
    status: r.status,
    source: r.source || '',
    contact: r.contact || '',
    notes: r.notes || '',
    followUp: r.follow_up || '',
  }
}

function toRow(j, userId) {
  return {
    user_id: userId,
    company: j.company,
    title: j.title,
    location: j.location || '',
    type: j.type,
    date: j.date || null,
    status: j.status,
    source: j.source || '',
    contact: j.contact || '',
    notes: j.notes || '',
    follow_up: j.followUp || null,
  }
}

export async function listJobs() {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(fromRow)
}

export async function createJob(job, userId) {
  const { data, error } = await supabase
    .from('jobs')
    .insert(toRow(job, userId))
    .select()
    .single()
  if (error) throw error
  return fromRow(data)
}

export async function updateJob(id, patch, userId) {
  // We pass the full object (minus id) through toRow for consistency.
  const row = toRow(patch, userId)
  delete row.user_id // never let the user reassign ownership
  const { data, error } = await supabase
    .from('jobs')
    .update(row)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return fromRow(data)
}

export async function deleteJob(id) {
  const { error } = await supabase.from('jobs').delete().eq('id', id)
  if (error) throw error
}
