import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

function isMissingAppSettingsTable(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "")
  return message.includes("P2021") || (message.includes("app_settings") && message.includes("does not exist"))
}

async function ensureAppSettingsTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "app_settings" (
      "id" TEXT NOT NULL,
      "key" TEXT NOT NULL,
      "value" TEXT NOT NULL DEFAULT '',
      CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id")
    );
  `)
  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "app_settings_key_key"
    ON "app_settings"("key");
  `)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key") || "sobre"
    const setting = await prisma.appSetting.findUnique({ where: { key } })
    return NextResponse.json({ key, value: setting?.value ?? "" })
  } catch (e) {
    if (isMissingAppSettingsTable(e)) {
      try {
        await ensureAppSettingsTable()
        const { searchParams } = new URL(request.url)
        const key = searchParams.get("key") || "sobre"
        const setting = await prisma.appSetting.findUnique({ where: { key } })
        return NextResponse.json({ key, value: setting?.value ?? "" })
      } catch (retryError) {
        console.error("[app-settings GET retry]", retryError)
      }
    }
    console.error("[app-settings GET]", e)
    return NextResponse.json({ key: "sobre", value: "" })
  }
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null)
  const key = body?.key
  const value = body?.value
  if (!key || typeof value !== "string") {
    return NextResponse.json({ error: "key e value são obrigatórios" }, { status: 400 })
  }

  try {
    const setting = await prisma.appSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    })
    return NextResponse.json({ key: setting.key, value: setting.value })
  } catch (e) {
    if (isMissingAppSettingsTable(e)) {
      try {
        await ensureAppSettingsTable()
        const setting = await prisma.appSetting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        })
        return NextResponse.json({ key: setting.key, value: setting.value })
      } catch (retryError) {
        console.error("[app-settings PUT retry]", retryError)
      }
    }
    console.error("[app-settings PUT]", e)
    return NextResponse.json({ error: "Erro ao salvar configuração" }, { status: 500 })
  }
}
