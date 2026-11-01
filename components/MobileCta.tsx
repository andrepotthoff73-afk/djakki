import { site } from '@/lib/site'
import { ArrowRightIcon, PhoneIcon } from './Icons'

// Auf dem Handy immer erreichbar: Anrufen und Anfragen unten am Bildschirm
export default function MobileCta() {
  return (
    <div className="glass fixed inset-x-3 bottom-3 z-50 flex gap-2 rounded-2xl border border-neutral-800 p-2 md:hidden">
      <a href={site.contact.phoneHref} className="btn btn-outline flex-1" aria-label={`Anrufen: ${site.contact.phone}`}>
        <PhoneIcon width={20} height={20} />
        Anrufen
      </a>
      <a href="#kontakt" className="btn btn-light flex-1">
        Anfragen
        <ArrowRightIcon width={20} height={20} />
      </a>
    </div>
  )
}
