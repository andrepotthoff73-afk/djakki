import data from '@/site-analysis.json'

// Zentrale Inhaltsquelle: alles kommt aus der Analyse von djakki.de
export const site = data

export const nav = [
  { href: '#leistungen', label: 'Leistungen' },
  { href: '#stimmen', label: 'Stimmen' },
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
}

export const strip = [
  { src: `${base}b117514.png/villa-rheinperle.png`, caption: 'Villa Rheinperle', w: 3, h: 2 },
  { src: `${base}b117490.jpg/bolero-terasse.jpg`, caption: 'Bolero, Terrasse', w: 4, h: 3 },
  { src: `${base}b117499.png/dj-akki-vs-dj-kosmonova.png`, caption: 'DJ Akki vs. DJ Kosmonova', w: 3, h: 2 },
  { src: `${base}b117512.jpg/summer-night-lounge-3.jpg`, caption: 'Summer Night Lounge', w: 3, h: 2 },
  { src: `${base}b117489.png/altweiber-bolero-mit-dj-akki.png`, caption: 'Altweiber im Bolero', w: 3, h: 2 },
  { src: `${base}b112906.jpg/dj-akki-plastique-revival.jpg`, caption: 'Plastique Revival', w: 1, h: 1 },
  { src: `${base}b117501.png/117501.png`, caption: 'Tanzfläche', w: 3, h: 2 },
  { src: `${base}b117496.png/dj-akki-plastique-revival.png`, caption: 'Vinylkiste', w: 3, h: 2 },
]
