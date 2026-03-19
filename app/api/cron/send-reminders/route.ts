import { NextResponse } from "next/server"
import { sendPendingPushNotifications } from "@/lib/push-notifications"
import { prisma } from "@/lib/db"
import { parseAutoHistoryWindow, runAutoHistoryCleanup } from "@/lib/booking-history-cleanup"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

    const { sent, failed } = await sendPendingPushNotifications(baseUrl)

    let autoHistoryWindow = "off"
    let historyDeleted = 0
    try {
      const setting = await prisma.appSetting.findUnique({ where: { key: "booking_history_auto_window" } })
      const parsed = parseAutoHistoryWindow(setting?.value)
      autoHistoryWindow = parsed
      historyDeleted = await runAutoHistoryCleanup(parsed)
    } catch (e) {
      console.error("[cron auto-history-cleanup]", e)
    }

    return NextResponse.json({ ok: true, sent, failed, autoHistoryWindow, historyDeleted })
  } catch (e) {
    console.error("[cron send-reminders]", e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
