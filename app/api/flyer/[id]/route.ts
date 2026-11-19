import { readLocalFlyer } from '@/lib/eventStore'

// Liefert Flyer aus dem lokalen Ersatzspeicher; auf Vercel kommen die Bilder direkt aus dem Blob-Speicher
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const flyer = await readLocalFlyer(params.id)
  if (!flyer) return new Response('Nicht gefunden', { status: 404 })
  return new Response(new Uint8Array(flyer.bytes), { headers: { 'Content-Type': flyer.type, 'Cache-Control': 'no-store' } })
}
