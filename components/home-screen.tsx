"use client"
// Para trocar o ícone: substitua o arquivo public/images/emblem.png pela sua imagem.
// Para ajustar o layout: veja COMO-PERSONALIZAR.md na raiz do projeto.

interface HomeScreenProps {
  onNavigate: (screen: "schedule" | "profile") => void
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-24">
      {/* CAVILIA: grande, dourado, brilho metálico */}
      <h1 className="cavilia-title mb-0 font-serif text-6xl font-bold tracking-[0.14em]">
        CAVILIA
      </h1>
      {/* — STUDIO CLUB 1998 — com linhas douradas */}
      <div className="mt-2 mb-8 flex items-center gap-2">
        <span className="text-gold/80">—</span>
        <span className="studio-subtitle font-sans text-[13px] font-medium tracking-[0.28em] uppercase">
          Studio Club 1998
        </span>
        <span className="text-gold/80">—</span>
      </div>

      {/* Emblema circular central: cavalo e ferradura */}
      <div className="emblem-ring relative mb-12 flex-shrink-0">
        <div className="flex h-36 w-36 items-center justify-center rounded-full bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/emblem.png"
            alt="CAVILIA - Cavalo e Ferradura"
            className="h-full w-full rounded-full object-contain object-center"
            width={144}
            height={144}
          />
        </div>
      </div>

      {/* Botões com borda dourada grossa e vibrante */}
      <div className="flex w-full max-w-xs flex-col gap-4">
        <button
          onClick={() => onNavigate("schedule")}
          className="rounded-lg px-6 py-3.5 font-sans text-sm font-semibold tracking-[0.18em] uppercase transition-all hover:brightness-110"
          style={{
            background: "#2a2420",
            border: "2.5px solid #d4a017",
            boxShadow: "0 0 12px 3px rgba(212,160,23,0.55), 0 0 4px 1px rgba(240,188,42,0.4), inset 0 1px 0 rgba(255,255,255,0.07), 0 3px 12px rgba(0,0,0,0.5)",
          }}
        >
          <span style={{
            background: "linear-gradient(180deg, #f5cc50 0%, #d4a017 45%, #f0bc2a 70%, #a87c0e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 4px rgba(212,160,23,0.8))",
          }}>
            Agendar Horário
          </span>
        </button>
        <button
          onClick={() => onNavigate("profile")}
          className="rounded-lg px-6 py-3.5 font-sans text-sm font-semibold tracking-[0.18em] uppercase transition-all hover:brightness-110"
          style={{
            background: "#2a2420",
            border: "2.5px solid #d4a017",
            boxShadow: "0 0 12px 3px rgba(212,160,23,0.55), 0 0 4px 1px rgba(240,188,42,0.4), inset 0 1px 0 rgba(255,255,255,0.07), 0 3px 12px rgba(0,0,0,0.5)",
          }}
        >
          <span style={{
            background: "linear-gradient(180deg, #f5cc50 0%, #d4a017 45%, #f0bc2a 70%, #a87c0e 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 4px rgba(212,160,23,0.8))",
          }}>
            Meus Horários
          </span>
        </button>
      </div>
    </div>
  )
}
