// Anmeldung für den Adminbereich: ein Passwort (Umgebungsvariable ADMIN_PASSWORD) und ein signiertes Cookie.
// Läuft mit Web Crypto, also in der Middleware wie in Server Actions. Ändert sich das Passwort,
// werden alle bestehenden Anmeldungen ungültig.

export const SESSION_COOKIE = 'djakki_admin'
export const SESSION_DAYS = 7

const encoder = new TextEncoder()

function hex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, '0')).join('')
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD)
}

async function signingKey() {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return null
  return crypto.subtle.importKey('raw', encoder.encode(`djakki-admin:${password}`), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ])
}

// Gleich lange Hashes vergleichen, ohne dass die Laufzeit verrät, ab welcher Stelle sie abweichen
function sameBytes(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

export async function passwordMatches(input: string) {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(input)),
    crypto.subtle.digest('SHA-256', encoder.encode(password)),
  ])
  return sameBytes(new Uint8Array(a), new Uint8Array(b))
}

export async function createSession() {
  const key = await signingKey()
  if (!key) throw new Error('ADMIN_PASSWORD fehlt')
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  const signature = hex(await crypto.subtle.sign('HMAC', key, encoder.encode(String(expires))))
  return `${expires}.${signature}`
}

export async function verifySession(token: string | undefined) {
  if (!token) return false
  const [expires, signature] = token.split('.')
  if (!expires || !signature || Number(expires) < Date.now()) return false
  const key = await signingKey()
  if (!key) return false
  const expected = hex(await crypto.subtle.sign('HMAC', key, encoder.encode(expires)))
  return sameBytes(encoder.encode(expected), encoder.encode(signature))
}
