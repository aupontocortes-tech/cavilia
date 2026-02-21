// ─── Lógica de Negócio: Classificação de Clientes ───────────────────────────

export type ClientLevel = "Bronze" | "Prata" | "Ouro" | "VIP"

export interface LevelConfig {
  label: ClientLevel
  emoji: string
  minVisitas: number
  maxVisitas: number | null
  color: string
  bgColor: string
  borderColor: string
  glowColor: string
}

export const LEVELS: LevelConfig[] = [
  {
    label: "Bronze",
    emoji: "🟤",
    minVisitas: 0,
    maxVisitas: 4,
    color: "#cd7f32",
    bgColor: "rgba(205,127,50,0.12)",
    borderColor: "rgba(205,127,50,0.4)",
    glowColor: "rgba(205,127,50,0.3)",
  },
  {
    label: "Prata",
    emoji: "⚪",
    minVisitas: 5,
    maxVisitas: 9,
    color: "#c0c0c0",
    bgColor: "rgba(192,192,192,0.12)",
    borderColor: "rgba(192,192,192,0.4)",
    glowColor: "rgba(192,192,192,0.25)",
  },
  {
    label: "Ouro",
    emoji: "🟡",
    minVisitas: 10,
    maxVisitas: 19,
    color: "#d4a017",
    bgColor: "rgba(212,160,23,0.12)",
    borderColor: "rgba(212,160,23,0.5)",
    glowColor: "rgba(212,160,23,0.35)",
  },
  {
    label: "VIP",
    emoji: "💎",
    minVisitas: 20,
    maxVisitas: null,
    color: "#e8b84b",
    bgColor: "rgba(232,184,75,0.15)",
    borderColor: "rgba(232,184,75,0.6)",
    glowColor: "rgba(232,184,75,0.5)",
  },
]

/**
 * Retorna o nível do cliente baseado no total de visitas.
 * getNivelCliente(3)  → "Bronze"
 * getNivelCliente(7)  → "Prata"
 * getNivelCliente(12) → "Ouro"
 * getNivelCliente(25) → "VIP"
 */
export function getNivelCliente(totalVisitas: number): ClientLevel {
  if (totalVisitas >= 20) return "VIP"
  if (totalVisitas >= 10) return "Ouro"
  if (totalVisitas >= 5)  return "Prata"
  return "Bronze"
}

/**
 * Retorna a configuração completa do nível atual.
 */
export function getLevelConfig(totalVisitas: number): LevelConfig {
  const nivel = getNivelCliente(totalVisitas)
  return LEVELS.find((l) => l.label === nivel)!
}

/**
 * Retorna quantas visitas faltam para o próximo nível.
 * Retorna null se já for VIP.
 */
export function visitasParaProximoNivel(totalVisitas: number): number | null {
  if (totalVisitas >= 20) return null
  if (totalVisitas >= 10) return 20 - totalVisitas
  if (totalVisitas >= 5)  return 10 - totalVisitas
  return 5 - totalVisitas
}

/**
 * Retorna o progresso (0–100) dentro do nível atual.
 */
export function progressoNivel(totalVisitas: number): number {
  if (totalVisitas >= 20) return 100
  if (totalVisitas >= 10) return ((totalVisitas - 10) / 10) * 100
  if (totalVisitas >= 5)  return ((totalVisitas - 5) / 5) * 100
  return (totalVisitas / 5) * 100
}
