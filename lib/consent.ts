// Einwilligung der Besucher. Notwendig ist nur, sich diese Auswahl selbst zu merken.
// Optional ist „Komfort“: das Merken, dass das Video-Intro schon gesehen wurde.

export const CONSENT_KEY = 'djakki-consent'
export const INTRO_SEEN_KEY = 'djakki-video-intro'
export const OPEN_CONSENT_EVENT = 'djakki:consent-open'

export type Consent = { comfort: boolean; date: string }

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    return raw ? (JSON.parse(raw) as Consent) : null
  } catch {
    return null
  }
}

export function saveConsent(comfort: boolean) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ comfort, date: new Date().toISOString() }))
    // Die Einblendung erscheint erst nach dem Intro: Mit Komfort gilt es damit als gesehen,
    // ohne Komfort (oder beim Widerruf) wird der Merker gelöscht
    if (comfort) localStorage.setItem(INTRO_SEEN_KEY, '1')
    else localStorage.removeItem(INTRO_SEEN_KEY)
  } catch {
    // ohne Speicher erscheint die Einblendung beim nächsten Besuch eben erneut
  }
}

export const comfortAllowed = () => readConsent()?.comfort === true
