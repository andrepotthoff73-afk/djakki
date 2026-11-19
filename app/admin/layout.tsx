import type { Metadata } from 'next'

// Der Adminbereich gehört nicht in Suchmaschinen
export const metadata: Metadata = {
  title: 'Admin – DJ Akki & Friends',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-svh bg-paper-2 text-ink">{children}</div>
}
