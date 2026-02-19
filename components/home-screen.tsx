"use client"

import Image from "next/image"

interface HomeScreenProps {
  onNavigate: (screen: "schedule" | "profile") => void
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-24">
      {/* Brand Name */}
      <h1 className="mb-0 font-serif text-5xl font-bold tracking-[0.15em] text-foreground">
        CAVILIA
      </h1>
      <div className="mt-2 mb-8 flex items-center gap-3">
        <div className="h-px w-10 bg-gold/60" />
        <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-gold/90">
          Studio Club 1998
        </span>
        <div className="h-px w-10 bg-gold/60" />
      </div>

      {/* Horse / Horseshoe Logo */}
      <div className="relative mb-12 h-36 w-36">
        <Image
          src="/images/horse-logo.jpg"
          alt="CAVILIA - Logo Cavalo e Ferradura"
          fill
          className="rounded-full object-cover"
          priority
        />
        <div className="absolute inset-0 rounded-full ring-2 ring-gold/40 ring-offset-2 ring-offset-background" />
      </div>

      {/* Main action buttons - styled like the mockup */}
      <div className="flex w-full max-w-xs flex-col gap-4">
        <button
          onClick={() => onNavigate("schedule")}
          className="relative rounded-lg border border-gold/50 bg-card/60 px-6 py-4 font-serif text-base font-semibold tracking-[0.2em] uppercase text-foreground backdrop-blur-sm transition-all hover:border-gold hover:bg-gold/10"
        >
          Agendar Horario
        </button>

        <button
          onClick={() => onNavigate("profile")}
          className="relative rounded-lg border border-gold/50 bg-card/60 px-6 py-4 font-serif text-base font-semibold tracking-[0.2em] uppercase text-foreground backdrop-blur-sm transition-all hover:border-gold hover:bg-gold/10"
        >
          Meus Horarios
        </button>
      </div>
    </div>
  )
}
