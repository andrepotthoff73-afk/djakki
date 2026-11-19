import data from '@/site-analysis.json'

// Zentrale Inhaltsquelle: alles kommt aus der Analyse von djakki.de
export const site = data

// Alphabetisch sortieren, mit deutschen Umlauten an der richtigen Stelle
const byName = <T,>(key: (item: T) => string) => (a: T, b: T) => key(a).localeCompare(key(b), 'de', { sensitivity: 'base' })

export const ticketShop = 'https://djakki.ticket.io/'

// Die nächsten Events pflegt Akki selbst im Adminbereich unter /admin (siehe lib/eventStore.ts).

// Pressestimmen: Scans der Zeitungsartikel in public/presse/ ablegen und hier eintragen.
// Ohne Eintrag erscheint der Abschnitt nicht.
export const press: { outlet: string; title: string; date: string; scan: string }[] = []

// Referenzen (Auszug), jeweils alphabetisch
export const references = {
  clubs: [
    { name: 'E-Dry', city: 'Geldern' },
    { name: 'Plastique', city: 'Duisburg' },
    { name: 'Königsburg', city: 'Krefeld' },
    { name: 'World Center', city: 'Kleve' },
    { name: 'Riu Pallace', city: 'Mallorca' },
  ].sort(byName((c) => c.name)),
  companies: [
    'Sparkasse',
    'Targobank',
    'Commerzbank',
    'MSV Duisburg',
    'Hellmich',
    'Capelli Sports',
    'Golf & More',
    'Club Raffelberg',
    'Bolero',
    'Vinorado',
    'Coupé 1900',
    'Allstar Fitness',
    'Vita Sports',
    'St. Sebastianus Schützen Buchholz',
    'St. Sebastianus Schützen Serm',
    'Villa Rheinperle',
  ].sort(byName((c) => c)),
}

// Eigene Eventformate, alphabetisch
export const formats = [
  { name: 'DJ Akki Party' },
  { name: 'Summer Night Lounge', href: 'https://summernightlounge.de' },
  { name: 'Club Plastique Revival' },
  { name: 'Rosenmontag Total' },
  { name: 'Schlagertreff' },
  { name: 'Daddy Cool', note: 'Vatertags-Event' },
].sort(byName((f) => f.name))

export const nav = [
  { href: '#leistungen', label: 'Leistungen' },
  { href: '#events', label: 'Events' },
  { href: '#referenzen', label: 'Referenzen' },
  { href: '#stimmen', label: 'Stimmen' },
  ...(press.length ? [{ href: '#presse', label: 'Presse' }] : []),
  { href: '#ablauf', label: 'Ablauf' },
  { href: '#faq', label: 'FAQ' },
]

const base = 'https://www.djakki.de/bilder/k641930-1208_'

// Echte Fotos von djakki.de, mit Bildunterschrift und Seitenverhältnis
export const photos = {
  portrait: { src: `${base}b112906.jpg/dj-akki-plastique-revival.jpg`, alt: 'DJ Akki am Pult bei der Plastique Revival' },
  crate: { src: `${base}b117496.png/dj-akki-plastique-revival.png`, alt: 'DJ Akki sucht Platten aus seiner Vinylkiste' },
  phone: { src: `${base}b117493.png/dj-akki-bolero.png`, alt: 'DJ Akki am Telefon hinter dem Pult im Bolero' },
  decks: { src: `${base}b117505.png/hochzeit-dj-akki-old-daddy-axel-weyand.png`, alt: 'DJ Akki von hinten an den Plattenspielern, darüber die Lichttraverse' },
  crowd: { src: `${base}b117501.png/117501.png`, alt: 'Volle Tanzfläche, vom DJ-Pult aus gesehen' },
  party: { src: `${base}b117489.png/altweiber-bolero-mit-dj-akki.png`, alt: 'Feiernde Gäste an Altweiber im Bolero' },
  plastique: { src: `${base}b117494.png/dj-akki-plastique-revival-1.png`, alt: 'DJ Akki am Pult bei der Club Plastique Revival' },
  rosenmontag: { src: `${base}b117497.png/dj-akki-rosenmontag.png`, alt: 'DJ Akki im roten Sakko an Rosenmontag' },
  summer: { src: `${base}b117498.jpg/dj-akki-summer-night-lounge.jpg`, alt: 'Bühne und Lichtshow der Summer Night Lounge' },
}

// Orte, an denen Akki aufgelegt hat – jedes Foto nur einmal auf der Seite
export const venues = [
  { src: `${base}b117514.png/villa-rheinperle.png`, caption: 'Villa Rheinperle' },
  { src: `${base}b117490.jpg/bolero-terasse.jpg`, caption: 'Bolero, Terrasse' },
  { src: `${base}b117499.png/dj-akki-vs-dj-kosmonova.png`, caption: 'DJ Akki vs. DJ Kosmonova' },
  { src: `${base}b117512.jpg/summer-night-lounge-3.jpg`, caption: 'Summer Night Lounge' },
]
