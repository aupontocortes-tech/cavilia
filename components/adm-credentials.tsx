"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, Mail, Lock, Check, X, ShieldCheck } from "lucide-react"

interface AdmCreds {
  user: string
  pass: string
  email: string
}

interface AdmCredentialsProps {
  onClose: () => void
}

const DEFAULT_CREDS: AdmCreds = { user: "cavilia", pass: "0000", email: "" }

export function getAdmCreds(): AdmCreds {
  if (typeof window === "undefined") return DEFAULT_CREDS
  const saved = localStorage.getItem("cavilia-adm-creds")
  return saved ? JSON.parse(saved) : DEFAULT_CREDS
}

export function AdmCredentials({ onClose }: AdmCredentialsProps) {
  const [email, setEmail] = useState("")
  const [currentPass, setCurrentPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const creds = getAdmCreds()
    setEmail(creds.email || "")
  }, [])

  function handleSave() {
    setError("")
    const creds = getAdmCreds()

    // Verifica senha atual
    if (!currentPass) return setError("Informe a senha atual")
    if (currentPass !== creds.pass) return setError("Senha atual incorreta")

    // Se digitou nova senha, valida
    if (newPass || confirmPass) {
      if (newPass.length < 4) return setError("Nova senha deve ter pelo menos 4 caracteres")
      if (newPass !== confirmPass) return setError("As senhas não conferem")
    }

    const updated: AdmCreds = {
      user: creds.user,
      pass: newPass || creds.pass,
      email: email.trim(),
    }
    localStorage.setItem("cavilia-adm-creds", JSON.stringify(updated))
    // Atualiza o "lembrar senha" se existir
    const saved = localStorage.getItem("cavilia-adm-saved")
    if (saved) {
      const parsed = JSON.parse(saved)
      localStorage.setItem("cavilia-adm-saved", JSON.stringify({ ...parsed, pass: updated.pass }))
    }
    setSuccess(true)
    setTimeout(() => { setSuccess(false); onClose() }, 1500)
  }

  const goldGradient = {
    background: "linear-gradient(180deg, #f5cc50 0%, #d4a017 50%, #f0bc2a 100%)",
    WebkitBackgroundClip: "text" as const,
    WebkitTextFillColor: "transparent" as const,
    backgroundClip: "text" as const,
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-xs rounded-2xl border border-border bg-[#110e0b] p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-lg font-bold" style={goldGradient}>Credenciais ADM</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground/60 hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Login fixo */}
        <div className="mb-4 rounded-lg border border-border/50 bg-card px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Login da barbearia</p>
          <p className="font-serif text-lg font-bold text-gold">CAVILIA</p>
          <p className="text-[10px] text-muted-foreground/50 mt-0.5">Nome de usuário fixo</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* E-mail */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              E-mail (recuperação de senha)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError("") }}
                placeholder="seuemail@exemplo.com"
                className="w-full rounded-lg border border-border bg-card pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="border-t border-border/30 pt-1">
            <p className="mb-3 text-[10px] uppercase tracking-wider text-muted-foreground/60">Alterar senha</p>

            {/* Senha atual */}
            <div className="mb-3">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Senha atual *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPass}
                  onChange={(e) => { setCurrentPass(e.target.value); setError("") }}
                  placeholder="••••"
                  className="w-full rounded-lg border border-border bg-card pl-9 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-gold focus:outline-none"
                />
                <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-gold">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Nova senha */}
            <div className="mb-3">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Nova senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => { setNewPass(e.target.value); setError("") }}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full rounded-lg border border-border bg-card pl-9 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-gold focus:outline-none"
                />
                <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-gold">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar senha */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Confirmar nova senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPass}
                  onChange={(e) => { setConfirmPass(e.target.value); setError("") }}
                  placeholder="Repita a nova senha"
                  className="w-full rounded-lg border border-border bg-card pl-9 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 focus:border-gold focus:outline-none"
                />
                <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-gold">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {error && <p className="text-center text-xs text-red-400">{error}</p>}

          {success && (
            <div className="flex items-center justify-center gap-2 text-sm text-green-400">
              <Check className="h-4 w-4" /> Credenciais salvas!
            </div>
          )}

          <button
            onClick={handleSave}
            className="w-full rounded-lg py-3.5 font-serif text-sm font-bold transition-all"
            style={{ background: "#2a2420", border: "2.5px solid #d4a017", boxShadow: "0 0 10px rgba(212,160,23,0.35)" }}
          >
            <span style={goldGradient}>Salvar Credenciais</span>
          </button>
        </div>
      </div>
    </div>
  )
}
