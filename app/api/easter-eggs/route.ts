import { NextResponse } from "next/server"

// Mock database of easter eggs with prizes and limits
const EASTER_EGGS = [
  { code: "EGG001", prize: "Puntos extra en el examen final", limit: 3, claimed: 0 },
  { code: "EGG002", prize: "Libro digital sobre IA", limit: 5, claimed: 0 },
  { code: "EGG003", prize: "Acceso a curso premium", limit: 2, claimed: 0 },
  { code: "EGG004", prize: "Sesión privada de mentoría", limit: 1, claimed: 0 },
  { code: "EGG005", prize: "Certificado especial", limit: 10, claimed: 0 },
]

// Store for registered users
const registeredUsers: {
  eggCode: string
  cedula: string
  timestamp: string
  prize: string
}[] = []

export async function POST(request: Request) {
  try {
    const { action, eggCode, cedula } = await request.json()

    if (action === "check") {
      const easterEgg = EASTER_EGGS.find((egg) => egg.code === eggCode.toUpperCase())

      if (!easterEgg) {
        return NextResponse.json({
          isValid: false,
          message: "Código de easter egg inválido",
        })
      }

      const isAvailable = easterEgg.claimed < easterEgg.limit

      return NextResponse.json({
        isValid: true,
        isAvailable,
        prize: easterEgg.prize,
        remaining: easterEgg.limit - easterEgg.claimed,
      })
    } else if (action === "register") {
      // Validate inputs
      if (!eggCode || !cedula) {
        return NextResponse.json({ error: "Código de easter egg y cédula son requeridos" }, { status: 400 })
      }

      // Find the easter egg
      const easterEggIndex = EASTER_EGGS.findIndex((egg) => egg.code === eggCode.toUpperCase())

      if (easterEggIndex === -1) {
        return NextResponse.json({ error: "Código de easter egg inválido" }, { status: 400 })
      }

      const easterEgg = EASTER_EGGS[easterEggIndex]

      // Check if this easter egg still has prizes available
      if (easterEgg.claimed >= easterEgg.limit) {
        return NextResponse.json({ error: "Ya no quedan premios disponibles para este easter egg" }, { status: 400 })
      }

      // Check if this user already registered this egg
      const alreadyRegistered = registeredUsers.some(
        (entry) => entry.eggCode === eggCode.toUpperCase() && entry.cedula === cedula,
      )

      if (alreadyRegistered) {
        return NextResponse.json({ error: "Ya has registrado este easter egg" }, { status: 400 })
      }

      // Register the user and update the claimed count
      EASTER_EGGS[easterEggIndex].claimed++

      registeredUsers.push({
        eggCode: eggCode.toUpperCase(),
        cedula,
        prize: easterEgg.prize,
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json({
        success: true,
        prize: easterEgg.prize,
        remaining: easterEgg.limit - easterEgg.claimed,
      })
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

