import { prisma } from "@/lib/db"

export type AutoHistoryWindow = "off" | "1m" | "2m" | "3m" | "1y"

function toDateKey(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function getBookingStartMs(date: Date, time: string): number {
  // Horário de Brasília para manter consistência com a UI.
  const key = toDateKey(date)
  const dt = new Date(`${key}T${String(time || "00:00")}:00-03:00`)
  return dt.getTime()
}

function getWindowCutoffMs(window: Exclude<AutoHistoryWindow, "off">): number {
  const now = new Date()
  const d = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  )
  if (window === "1y") {
    d.setFullYear(d.getFullYear() - 1)
  } else if (window === "1m") {
    d.setMonth(d.getMonth() - 1)
  } else if (window === "2m") {
    d.setMonth(d.getMonth() - 2)
  } else if (window === "3m") {
    d.setMonth(d.getMonth() - 3)
  }
  return d.getTime()
}

export function parseAutoHistoryWindow(value: string | null | undefined): AutoHistoryWindow {
  const v = String(value || "").trim()
  if (v === "1m" || v === "2m" || v === "3m" || v === "1y" || v === "off") return v
  return "off"
}

/**
 * Limpa automaticamente APENAS histórico já realizado (passou de horário + 2h)
 * e mais antigo que a janela configurada.
 */
export async function runAutoHistoryCleanup(window: AutoHistoryWindow): Promise<number> {
  if (window === "off") return 0

  const list = await prisma.booking.findMany({
    where: { status: { not: "cancelled" } },
    select: { id: true, date: true, time: true },
  })

  const nowMs = Date.now()
  const twoHoursMs = 2 * 60 * 60 * 1000
  const cutoffMs = getWindowCutoffMs(window)

  const idsToDelete = list
    .filter((b) => {
      const startMs = getBookingStartMs(b.date, b.time)
      const endMs = startMs + twoHoursMs
      const isHistory = endMs < nowMs
      if (!isHistory) return false
      // Remove históricos mais antigos que a janela escolhida
      return startMs < cutoffMs
    })
    .map((b) => b.id)

  if (idsToDelete.length === 0) return 0

  const deleted = await prisma.booking.deleteMany({
    where: { id: { in: idsToDelete } },
  })
  return deleted.count
}

