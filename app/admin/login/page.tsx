import { adminConfigured } from '@/lib/adminAuth'
import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

export default function AdminLogin() {
  return (
    <main className="container-page flex min-h-svh items-center justify-center py-9">
      <div className="w-full max-w-[420px] bg-paper p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/dj-akki-friends.png" alt="" width={64} height={64} className="h-[64px] w-[64px] rounded-full bg-paper" />
        <h1 className="mt-5 text-3xl">Admin</h1>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-4">
            Der Zugang ist noch nicht eingerichtet: In den Vercel-Einstellungen fehlt die Umgebungsvariable ADMIN_PASSWORD.
          </p>
        )}
      </div>
    </main>
  )
}
