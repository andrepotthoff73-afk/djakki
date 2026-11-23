'use client'

import { OPEN_CONSENT_EVENT } from '@/lib/consent'

// Öffnet die Privatsphäre-Einblendung erneut, etwa um die Einwilligung zu ändern oder zu widerrufen
export default function PrivacySettingsButton({ className = '' }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className={className}>
      Privatsphäre-Einstellungen
    </button>
  )
}
