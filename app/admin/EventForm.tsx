'use client'

import { useRef, useState, useTransition } from 'react'
import { createEvent } from './actions'

const MAX_EDGE = 1600 // längste Kante des Flyers nach dem Verkleinern

// Flyer im Browser auf Webgröße bringen: spart Ladezeit und bleibt unter der Upload-Grenze
async function shrink(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.86))
  if (!blob) return file
  return new File([blob], 'flyer.webp', { type: 'image/webp' })
}

const field = 'min-h-btn-md border border-gray-400 bg-white px-3'

export default function EventForm() {
  const form = useRef<HTMLFormElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [message, setMessage] = useState<{ ok?: boolean; text: string } | null>(null)
  const [pending, startTransition] = useTransition()

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (preview) URL.revokeObjectURL(preview)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const file = data.get('flyer')
    setMessage(null)
    startTransition(async () => {
      try {
        if (file instanceof File && file.size > 0) data.set('flyer', await shrink(file))
        const result = await createEvent({}, data)
        if (result.error) return setMessage({ text: result.error })
        form.current?.reset()
        if (preview) URL.revokeObjectURL(preview)
        setPreview(null)
        setMessage({ ok: true, text: 'Termin ist online.' })
      } catch {
        setMessage({ text: 'Hochladen hat nicht geklappt. Bitte noch einmal versuchen.' })
      }
    })
  }

  return (
    <form ref={form} onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Titel</span>
        <input name="title" required maxLength={80} placeholder="z. B. Summer Night Lounge" className={field} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Datum</span>
        <input type="date" name="date" required className={field} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Ticket-Link (optional)</span>
        <input type="url" name="ticket" placeholder="Leer lassen für djakki.ticket.io" className={field} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Flyer</span>
        <input type="file" name="flyer" accept="image/*" required onChange={onFile} className="py-2" />
      </label>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Vorschau des Flyers" className="max-h-[320px] w-auto self-start bg-ink object-contain" />
      )}
      {message && (
        <p role="status" className={message.ok ? 'font-semibold' : 'text-accent-600'}>
          {message.text}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-red disabled:opacity-60">
        {pending ? 'Lade hoch …' : 'Termin veröffentlichen'}
      </button>
    </form>
  )
}
