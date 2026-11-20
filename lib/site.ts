import data from '@/site-analysis.json'

// Zentrale Inhaltsquelle: alles kommt aus der Analyse von djakki.de
export const site = data

// Alphabetisch sortieren, mit deutschen Umlauten an der richtigen Stelle
const byName = <T,>(key: (item: T) => string) => (a: T, b: T) => key(a).localeCompare(key(b), 'de', { sensitivity: 'base' })

export const ticketShop = 'https://djakki.ticket.io/'

// Die nächsten Events pflegt Akki selbst im Adminbereich unter /admin (siehe lib/eventStore.ts).

// Pressestimmen: Artikel über DJ Akki, verlinkt mit Überschrift und Vorschaubild aus dem Artikel, neueste zuerst.
// Ohne Eintrag erscheint der Abschnitt nicht.
export const press: { outlet: string; title: string; date: string; url: string; image: string }[] = [
  {
    outlet: 'WAZ Duisburg',
    title: 'Plastique-Revival-Party im Club viersieben: „Wie nach Hause kommen“',
    date: '2026-11-15',
    url: 'https://www.waz.de/lokales/duisburg/article413683721/plastique-revival-party-im-club-viersieben-wie-nach-hause-kommen.html',
    image: 'https://img.sparknews.funkemedien.de/413683941/413683941_1794747486_v16_9_1600.jpeg',
  },
  {
    outlet: 'WAZ Duisburg',
    title: 'Bühne im Wasser und Ibiza-Gefühl: Beliebte Duisburger Party an neuer Location',
    date: '2026-08-25',
    url: 'https://www.waz.de/lokales/duisburg/article412948649/buehne-im-wasser-und-ibiza-gefuehl-beliebte-duisburger-party-an-neuer-location.html',
    image: 'https://img.sparknews.funkemedien.de/412966306/412966306_1787728000_v16_9_1600.jpeg',
  },
  {
    outlet: 'WAZ Duisburg',
    title: 'Daydrinking: Neue Open-Air-Party lockt mit Wein und echtem Beach-Feeling',
    date: '2026-05-05',
    url: 'https://www.waz.de/lokales/duisburg/article411892965/daydrinking-neue-open-air-party-lockt-mit-wein-und-echtem-beach-feeling.html',
    image: 'https://img.sparknews.funkemedien.de/411894270/411894270_1777888952_v16_9_1600.jpeg',
  },
  {
    outlet: 'WAZ Duisburg',
    title: 'Erinnerungen an wilde Disco-Nächte: „Auf der Fläche war Ekstase“',
    date: '2025-11-13',
    url: 'https://www.waz.de/lokales/duisburg/article405217602/samstags-war-plastique-erinnerungen-an-wilde-disco-naechte.html',
    image: 'https://img.sparknews.funkemedien.de/408751734/408751734_1763037176_v16_9_1600.jpeg',
  },
  {
    outlet: 'WAZ Duisburg',
    title: 'Duisburgs größte Open-Air-Party kehrt zurück – in neuer Location',
    date: '2025-06-11',
    url: 'https://www.waz.de/lokales/duisburg/article409230624/duisburgs-groesste-open-air-party-kehrt-zurueck-in-neuer-location.html',
    image: 'https://img.sparknews.funkemedien.de/409234729/409234729_1749634178_v16_9_1600.jpeg',
  },
]

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
  // Im Seitenrot vorab eingefärbt (public/hero), damit kein Filter im Browser nötig ist
  crowd: { src: '/hero/tanzflaeche-rot.webp', alt: 'Volle Tanzfläche, vom DJ-Pult aus gesehen' },
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
