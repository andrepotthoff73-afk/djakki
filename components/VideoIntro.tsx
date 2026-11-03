'use client'

import { useEffect, useRef, useState } from 'react'

// Kurzes Video-Intro: Blick über Akkis Schulter auf seine Hände am DJ-Set. Läuft beim ersten Besuch
// von selbst, danach über den Button „Intro ansehen“. Überspringen per Button, Antippen oder Taste.

const SEEN_KEY = 'djakki-video-intro'
export const REPLAY_EVENT = 'djakki:intro'
const FADE_OUT = 0.9 // Sekunden vor dem Ende blendet die Seite ein

export default function VideoIntro() {
  const video = useRef<HTMLVideoElement>(null)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const el = video.current
    if (!el) return
    let running = false
    let prevOverflow = ''
    let fadeTimer = 0

    function finish() {
      if (!running) return
      running = false
      window.clearTimeout(fadeTimer)
      try {
        localStorage.setItem(SEEN_KEY, '1')
      } catch {
        // ohne Speicher läuft das Intro eben beim nächsten Besuch wieder
      }
      el!.pause()
      root.classList.remove('site-intro')
      document.body.style.overflow = prevOverflow
      setLeaving(false)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
    }

    // Überspringen blendet trotzdem weich aus statt hart abzuschneiden
    function skip() {
      if (!running) return
      setLeaving(true)
      window.clearTimeout(fadeTimer)
      fadeTimer = window.setTimeout(finish, 450)
    }

    function onTime() {
      if (running && el!.duration && el!.currentTime >= el!.duration - FADE_OUT) setLeaving(true)
    }

    function play() {
      if (running) return
      running = true
      root.classList.add('site-intro')
      prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      setLeaving(false)
      el!.currentTime = 0
      // Blockiert der Browser das Abspielen, geht es ohne Intro direkt zur Seite
      el!.play().catch(finish)
      // Erst nach dem auslösenden Klick zuhören, sonst würde der Button das Intro sofort überspringen
      setTimeout(() => {
        if (!running) return
        window.addEventListener('pointerdown', skip)
        window.addEventListener('keydown', skip)
      }, 0)
    }

    el.addEventListener('timeupdate', onTime)
    el.addEventListener('ended', finish)
    el.addEventListener('error', finish)

    // Erster Besuch: das Script im <head> hat das Intro bereits angemeldet
    if (root.classList.contains('site-intro')) play()

    function replay() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      play()
    }
    window.addEventListener(REPLAY_EVENT, replay)

    return () => {
      window.removeEventListener(REPLAY_EVENT, replay)
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('ended', finish)
      el.removeEventListener('error', finish)
      // Aufräumen stoppt nur; als gesehen gilt das Intro erst, wenn es gelaufen oder übersprungen ist
      if (running) {
        running = false
        window.clearTimeout(fadeTimer)
        el.pause()
        document.body.style.overflow = prevOverflow
        window.removeEventListener('pointerdown', skip)
        window.removeEventListener('keydown', skip)
      }
    }
  }, [])

  return (
    <div className={`site-intro-overlay fixed inset-0 z-[70] bg-black ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <video
        ref={video}
        className="h-full w-full object-cover object-[64%_50%] md:object-center"
        src="/intro/dj-akki-intro.mp4"
        poster="/intro/dj-akki-intro.jpg"
        muted
        playsInline
        preload="none"
      />
      <div className="site-intro-vignette pointer-events-none absolute inset-0" />
      <div className="container-page pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 pb-6 text-paper md:pb-7">
        <p className="font-display text-xl font-medium uppercase tracking-label md:text-2xl">DJ Akki &amp; Friends</p>
        <span className="shrink-0 whitespace-nowrap text-sm text-gray-400">Überspringen</span>
      </div>
    </div>
  )
}
