import { del, list, put } from '@vercel/blob'
import { promises as fs } from 'fs'
import path from 'path'

// Speicher für die nächsten Events: auf Vercel im Blob-Speicher, lokal ohne Zugangsschlüssel im Ordner .data/.
// Jeder Termin liegt in einem eigenen Ordner events/<id>/ mit info.json und flyer.webp. Dateien werden nie
// überschrieben, nur angelegt und gelöscht – so liefert auch ein zwischengespeicherter Abruf nie veraltete Daten.

export type EventEntry = {
  id: string
  title: string
  date: string // JJJJ-MM-TT
  ticket?: string
  flyer: string // Adresse des Flyer-Bilds
}

const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN)
const LOCAL_DIR = path.join(process.cwd(), '.data', 'events')

// Heutiges Datum in Deutschland, damit ein Termin bis Mitternacht als aktuell gilt
export function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date())
}

const byDate = (a: EventEntry, b: EventEntry) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'de')

export async function listEvents(): Promise<EventEntry[]> {
  try {
    if (blobEnabled()) {
      const { blobs } = await list({ prefix: 'events/' })
      const infos = blobs.filter((b) => b.pathname.endsWith('/info.json'))
      const items = await Promise.all(
        infos.map(async (b) => {
          const res = await fetch(b.url)
          return res.ok ? ((await res.json()) as EventEntry) : null
        }),
      )
      return items.filter((e): e is EventEntry => e !== null).sort(byDate)
    }

    const ids = await fs.readdir(LOCAL_DIR).catch(() => [] as string[])
    const items = await Promise.all(
      ids.map(async (id) =>
        JSON.parse(await fs.readFile(path.join(LOCAL_DIR, id, 'info.json'), 'utf8')) as EventEntry,
      ),
    )
    return items.sort(byDate)
  } catch (error) {
    // Ist der Speicher nicht erreichbar, bleibt die Seite trotzdem stehen und verweist auf den Ticketshop
    console.error('Events konnten nicht geladen werden', error)
    return []
  }
}

export async function listUpcoming() {
  const now = today()
  return (await listEvents()).filter((e) => e.date >= now)
}

export async function addEvent(input: { title: string; date: string; ticket?: string; flyer: File }) {
  const id = `${input.date}-${crypto.randomUUID().slice(0, 8)}`
  const bytes = Buffer.from(await input.flyer.arrayBuffer())
  const ext = input.flyer.type === 'image/webp' ? 'webp' : input.flyer.type === 'image/png' ? 'png' : 'jpg'

  if (blobEnabled()) {
    const flyer = await put(`events/${id}/flyer.${ext}`, bytes, {
      access: 'public',
      addRandomSuffix: false,
      contentType: input.flyer.type,
    })
    const entry: EventEntry = { id, title: input.title, date: input.date, ticket: input.ticket, flyer: flyer.url }
    await put(`events/${id}/info.json`, JSON.stringify(entry), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    })
    return entry
  }

  const dir = path.join(LOCAL_DIR, id)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, `flyer.${ext}`), bytes)
  const entry: EventEntry = { id, title: input.title, date: input.date, ticket: input.ticket, flyer: `/api/flyer/${id}` }
  await fs.writeFile(path.join(dir, 'info.json'), JSON.stringify(entry))
  return entry
}

export async function deleteEvent(id: string) {
  if (!/^[\w-]+$/.test(id)) return
  if (blobEnabled()) {
    const { blobs } = await list({ prefix: `events/${id}/` })
    if (blobs.length) await del(blobs.map((b) => b.url))
    return
  }
  await fs.rm(path.join(LOCAL_DIR, id), { recursive: true, force: true })
}

// Nur für den lokalen Betrieb: Flyer aus .data/ ausliefern
export async function readLocalFlyer(id: string) {
  if (blobEnabled() || !/^[\w-]+$/.test(id)) return null
  const dir = path.join(LOCAL_DIR, id)
  const file = (await fs.readdir(dir).catch(() => [] as string[])).find((f) => f.startsWith('flyer.'))
  if (!file) return null
  const type = file.endsWith('.webp') ? 'image/webp' : file.endsWith('.png') ? 'image/png' : 'image/jpeg'
  return { bytes: await fs.readFile(path.join(dir, file)), type }
}
