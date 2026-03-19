import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

type ClearMode = "month" | "quarter" | "year" | "three_years" | "all"

function toDateKey(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, "0")
  const d = String(date.getUTCDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function getBookingStartMs(date: Date, time: string): number {
  // Horário de Brasília para consistência com a regra visual do ADM.
  const key = toDateKey(date)
  const dt = new Date(`${key}T${String(time || "00:00")}:00-03:00`)
  return dt.getTime()
}

function getRetentionStart(mode: Exclude<ClearMode, "all">): number {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())
  if (mode === "month") d.setMonth(d.getMonth() - 1)
  if (mode === "quarter") d.setMonth(d.getMonth() - 3)
  if (mode === "year") d.setFullYear(d.getFullYear() - 1)
  if (mode === "three_years") d.setFullYear(d.getFullYear() - 3)
  return d.getTime()
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const rawMode = String(body?.mode || "all") as ClearMode
    const mode: ClearMode =
      rawMode === "month" ||
      rawMode === "quarter" ||
      rawMode === "year" ||
      rawMode === "three_years" ||
      rawMode === "all"
        ? rawMode
        : "all"

    const list = await prisma.booking.findMany({
      where: { status: { not: "cancelled" } },
      select: { id: true, date: true, time: true },
    })

    const nowMs = Date.now()
    const twoHoursMs = 2 * 60 * 60 * 1000
    const retentionStart = mode === "all" ? Number.NEGATIVE_INFINITY : getRetentionStart(mode)

    const idsToDelete = list
      .filter((b) => {
        const startMs = getBookingStartMs(b.date, b.time)
        const endMs = startMs + twoHoursMs
        const isHistory = endMs < nowMs
        if (!isHistory) return false
        if (mode === "all") return true
        // "month/quarter/year/three_years" => remove históricos dentro desse período
        return startMs >= retentionStart
      })
      .map((b) => b.id)

    if (idsToDelete.length === 0) {
      return NextResponse.json({
        ok: true,
        deleted: 0,
        mode,
      })
    }

    const deleted = await prisma.booking.deleteMany({
      where: { id: { in: idsToDelete } },
    })

    return NextResponse.json({
      ok: true,
      deleted: deleted.count,
      mode,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("[bookings/history DELETE]", e)
    return NextResponse.json(
      {
        ok: false,
        error: msg,
      },
      { status: 500 },
    )
  }
}

