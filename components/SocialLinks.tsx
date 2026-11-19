import { site } from '@/lib/site'

// Logos von Facebook und Instagram in Textfarbe, damit sie auf jedem Farbkapitel passen
export function FacebookIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  )
}

export function InstagramIcon({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  )
}

export const social = [
  { label: 'Facebook', href: site.contact.social.facebook, Icon: FacebookIcon },
  { label: 'Instagram', href: site.contact.social.instagram, Icon: InstagramIcon },
]

// Kompakte Icon-Links, z. B. für die Kopfzeile
export default function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      {social.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`DJ Akki & Friends auf ${label}`}
          title={label}
          className="flex h-btn-sm w-btn-sm items-center justify-center opacity-90 transition-opacity duration-fast hover:opacity-100"
        >
          <Icon className="h-[22px] w-[22px]" />
        </a>
      ))}
    </div>
  )
}
