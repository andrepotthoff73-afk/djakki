'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, SESSION_DAYS, createSession, passwordMatches, verifySession } from '@/lib/adminAuth'
import { addEvent, deleteEvent, listEvents, today } from '@/lib/eventStore'

export type FormState = { ok?: boolean; error?: string }

const MAX_FLYER_BYTES = 4 * 1024 * 1024

// Jede Aktion prüft die Anmeldung selbst, nicht nur die Middleware vor der Seite
async function requireAdmin() {
  if (!(await verifySession(cookies().get(SESSION_COOKIE)?.value))) redirect('/admin/login')
}

// Startseite und Adminliste sofort neu aufbauen, damit Änderungen gleich sichtbar sind
function refresh() {
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function login(_state: FormState, form: FormData): Promise<FormState> {
  const password = String(form.get('password') ?? '')
  if (!(await passwordMatches(password))) {
    // kurze Pause bremst das Durchprobieren von Passwörtern
    await new Promise((r) => setTimeout(r, 800))
    return { error: 'Das Passwort stimmt nicht.' }
  }
  cookies().set(SESSION_COOKIE, await createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
  redirect('/admin')
}

export async function logout() {
  cookies().delete({ name: SESSION_COOKIE, path: '/admin' })
  redirect('/admin/login')
}

export async function createEvent(_state: FormState, form: FormData): Promise<FormState> {
  await requireAdmin()
  const title = String(form.get('title') ?? '').trim()
  const date = String(form.get('date') ?? '')
  const ticket = String(form.get('ticket') ?? '').trim()
  const flyer = form.get('flyer')

  if (!title || title.length > 80) return { error: 'Bitte einen Titel mit höchstens 80 Zeichen eingeben.' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: 'Bitte ein Datum wählen.' }
  if (ticket && !/^https:\/\/\S+$/.test(ticket)) return { error: 'Der Ticket-Link muss mit https:// beginnen.' }
  if (!(flyer instanceof File) || flyer.size === 0) return { error: 'Bitte einen Flyer auswählen.' }
  if (!flyer.type.startsWith('image/')) return { error: 'Der Flyer muss ein Bild sein (JPG, PNG oder WebP).' }
  if (flyer.size > MAX_FLYER_BYTES) return { error: 'Der Flyer ist zu groß. Bitte ein kleineres Bild wählen.' }

  await addEvent({ title, date, ticket: ticket || undefined, flyer })
  refresh()
  return { ok: true }
}

export async function removeEvent(id: string) {
  await requireAdmin()
  await deleteEvent(id)
  refresh()
}

export async function removePastEvents() {
  await requireAdmin()
  const now = today()
  const past = (await listEvents()).filter((e) => e.date < now)
  await Promise.all(past.map((e) => deleteEvent(e.id)))
  refresh()
}
