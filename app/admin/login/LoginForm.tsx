'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { login, type FormState } from '../actions'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn btn-ink w-full disabled:opacity-60">
      {pending ? 'Prüfe …' : 'Anmelden'}
    </button>
  )
}

export default function LoginForm() {
  const [state, action] = useFormState<FormState, FormData>(login, {})
  return (
    <form action={action} className="mt-5 flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Passwort</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          autoFocus
          className="min-h-btn-md border border-gray-400 bg-white px-3"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-accent-600">
          {state.error}
        </p>
      )}
      <Submit />
    </form>
  )
}
