import Image from 'next/image'
import { listEvents, today, type EventEntry } from '@/lib/eventStore'
import { logout, removeEvent, removePastEvents } from './actions'
import ConfirmButton from './ConfirmButton'
import EventForm from './EventForm'

export const dynamic = 'force-dynamic'

const day = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })

function EventRow({ event, past }: { event: EventEntry; past: boolean }) {
  return (
    <li className="flex items-center gap-4 border-t border-paper-2 py-3">
      <div className="relative h-[96px] w-[77px] shrink-0 overflow-hidden bg-ink">
        <Image src={event.flyer} alt="" fill sizes="80px" className={`object-cover ${past ? 'grayscale' : ''}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm">{day.format(new Date(event.date))}</p>
        <p className="truncate text-lg font-semibold">{event.title}</p>
        {past && <p className="text-sm text-accent-600">vorbei</p>}
      </div>
      <form action={removeEvent.bind(null, event.id)}>
        <ConfirmButton message={`„${event.title}“ wirklich löschen?`} className="btn btn-sm border border-ink bg-transparent hover:bg-ink hover:text-paper">
          Löschen
        </ConfirmButton>
      </form>
    </li>
  )
}

export default async function Admin() {
  const events = await listEvents()
  const now = today()
  const upcoming = events.filter((e) => e.date >= now)
  const past = events.filter((e) => e.date < now).reverse()

  return (
    <main className="container-page py-7">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/dj-akki-friends.png" alt="" width={44} height={44} className="h-[44px] w-[44px] rounded-full bg-paper" />
          <h1 className="text-3xl">Termine verwalten</h1>
        </div>
        <div className="flex items-center gap-4">
          <a href="/#events" className="link">
            Zur Website
          </a>
          <form action={logout}>
            <button type="submit" className="btn btn-sm btn-ink">
              Abmelden
            </button>
          </form>
        </div>
      </header>

      <div className="mt-7 grid gap-6 lg:grid-cols-12">
        <section className="bg-paper p-5 lg:col-span-5">
          <h2 className="text-2xl">Neuer Termin</h2>
          <p className="mt-2 text-sm">Der Flyer erscheint sofort unter „Next Events“ auf der Startseite.</p>
          <EventForm />
        </section>

        <div className="flex flex-col gap-6 lg:col-span-7">
          <section className="bg-paper p-5">
            <h2 className="text-2xl">Kommende Termine ({upcoming.length})</h2>
            {upcoming.length ? (
              <ul className="mt-4">
                {upcoming.map((e) => (
                  <EventRow key={e.id} event={e} past={false} />
                ))}
              </ul>
            ) : (
              <p className="mt-3">Noch keine. Die Startseite verweist dann auf den Ticketshop.</p>
            )}
          </section>

          <section className="bg-paper p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl">Vergangene Termine ({past.length})</h2>
              {past.length > 0 && (
                <form action={removePastEvents}>
                  <ConfirmButton
                    message={`Alle ${past.length} vergangenen Termine löschen?`}
                    className="btn btn-sm btn-red"
                  >
                    Alle vergangenen löschen
                  </ConfirmButton>
                </form>
              )}
            </div>
            <p className="mt-2 text-sm">Auf der Startseite sind sie schon ausgeblendet; hier lassen sie sich endgültig entfernen.</p>
            {past.length > 0 && (
              <ul className="mt-4">
                {past.map((e) => (
                  <EventRow key={e.id} event={e} past />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
