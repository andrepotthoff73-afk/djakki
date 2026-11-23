'use client'

import { useEffect, useRef, useState } from 'react'
import { OPEN_CONSENT_EVENT, readConsent, saveConsent } from '@/lib/consent'

// Privatsphäre-Einblendung im Stil eines dunklen Dialogs in der Bildmitte. Erscheint beim ersten Besuch,
// sobald das Video-Intro vorbei ist, und lässt sich über „Privatsphäre-Einstellungen“ im Footer wieder öffnen.
export default function ConsentBanner() {
  const [open, setOpen] = useState(false)
  const [details, setDetails] = useState(false)
  // Optionale Einwilligung ist nie vorausgewählt
  const [comfort, setComfort] = useState(false)
  const firstButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) return
    const root = document.documentElement

    function show() {
      const saved = readConsent()
      setComfort(saved ? saved.comfort : false)
      setDetails(false)
      setOpen(true)
    }

    // Erster Besuch: warten, bis das Intro die Bühne freigibt
    let observer: MutationObserver | null = null
    if (!readConsent()) {
      if (root.classList.contains('site-intro')) {
        observer = new MutationObserver(() => {
          if (!root.classList.contains('site-intro')) {
            observer?.disconnect()
            show()
          }
        })
        observer.observe(root, { attributes: true, attributeFilter: ['class'] })
      } else show()
    }

    window.addEventListener(OPEN_CONSENT_EVENT, show)
    return () => {
      observer?.disconnect()
      window.removeEventListener(OPEN_CONSENT_EVENT, show)
    }
  }, [])

  // Während der Dialog offen ist, steht die Seite dahinter still
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstButton.current?.focus()
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  function decide(allowComfort: boolean) {
    saveConsent(allowComfort)
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3" style={{ backgroundColor: 'rgba(17, 18, 20, 0.6)' }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
        className="consent-dialog flex max-h-[calc(100svh-24px)] w-full max-w-[540px] flex-col overflow-y-auto bg-ink text-paper shadow-2xl"
      >
        <div className="flex items-center justify-center gap-4 border-b border-ink-2 px-5 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/dj-akki-friends.png" alt="" width={48} height={48} className="h-[48px] w-[48px] rounded-full bg-paper" />
          <h2 id="consent-title" className="text-2xl normal-case">
            Privatsphäre-Einstellungen
          </h2>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5 text-center text-sm leading-body">
          <p>
            Wir verwenden keine Tracking- oder Werbe-Cookies und geben keine Daten an Dritte weiter. Technisch notwendig ist
            nur, dass sich die Website deine Auswahl in diesem Fenster merkt.
          </p>
          <p>
            Mit deiner Einwilligung merkt sie sich außerdem, dass du das Video-Intro schon gesehen hast, damit es nicht bei
            jedem Besuch erneut startet. Du kannst deine Auswahl jederzeit unter „Privatsphäre-Einstellungen“ unten auf der
            Seite ändern. Mehr dazu in unserer{' '}
            <a href="/datenschutz" className="link">
              Datenschutzerklärung
            </a>
            .
          </p>

          {details && (
            <fieldset className="flex flex-col gap-3 border-t border-ink-2 pt-4 text-left">
              <legend className="sr-only">Kategorien</legend>
              <label className="flex items-start gap-3">
                <input type="checkbox" checked disabled className="mt-1 h-[18px] w-[18px] shrink-0 accent-accent-500" />
                <span>
                  <span className="font-semibold">Notwendig</span>
                  <br />
                  Speichert deine Auswahl in diesem Fenster. Immer aktiv.
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={comfort}
                  onChange={(e) => setComfort(e.target.checked)}
                  className="mt-1 h-[18px] w-[18px] shrink-0 accent-accent-500"
                />
                <span>
                  <span className="font-semibold">Komfort</span>
                  <br />
                  Merkt sich, dass du das Video-Intro gesehen hast. Ohne diese Einwilligung läuft es bei jedem Besuch.
                </span>
              </label>
            </fieldset>
          )}

          {details ? (
            <button ref={firstButton} type="button" onClick={() => decide(comfort)} className="btn btn-paper w-full">
              Auswahl speichern
            </button>
          ) : (
            <button ref={firstButton} type="button" onClick={() => decide(true)} className="btn btn-paper w-full">
              Alle akzeptieren
            </button>
          )}

          {!details && (
            <button type="button" onClick={() => setDetails(true)} className="link self-center">
              Privatsphäre-Einstellungen individuell festlegen
            </button>
          )}
          <button type="button" onClick={() => decide(false)} className="link self-center">
            Weiter ohne Einwilligung
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 border-t border-ink-2 px-5 py-3 text-sm">
          <a href="/datenschutz" className="link">
            Datenschutzerklärung
          </a>
          <span aria-hidden="true">•</span>
          <a href="/impressum" className="link">
            Impressum
          </a>
        </div>
      </div>
    </div>
  )
}
