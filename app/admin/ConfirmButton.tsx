'use client'

import { useFormStatus } from 'react-dom'

// Absende-Knopf mit Rückfrage, damit nichts versehentlich gelöscht wird
export default function ConfirmButton({
  message,
  className,
  children,
}: {
  message: string
  className: string
  children: React.ReactNode
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault()
      }}
      className={`${className} disabled:opacity-60`}
    >
      {pending ? 'Lösche …' : children}
    </button>
  )
}
