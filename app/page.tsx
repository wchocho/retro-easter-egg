"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Progress } from "@/components/ui/progress"
import { useSound } from "@/lib/SoundContext"
import {
  Terminal,
  Volume2,
  VolumeX,
  HelpCircle,
  Trophy,
  History,
  Award,
  Settings,
  User,
  BarChart,
  LogOut,
  UserCircle,
  Medal,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { playSound, preloadSounds } from "@/lib/sound-manager"
import {
  EASTER_EGGS,
  HINTS,
  ACHIEVEMENTS,
  PUZZLES,
  BOOT_MESSAGES,
  AVAILABLE_COMMANDS,
  SYSTEM_USERS,
  EasterEgg,
  Achievement,
  Puzzle,
  UserData,
} from "./components/constants"

export default function Home() {
  const { soundEnabled, setSoundEnabled } = useSound();
  const router = useRouter()
  const terminalRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  // Estados de la interfaz
  const [theme, setTheme] = useState<"green" | "amber" | "blue">("green")
  const [showSettings, setShowSettings] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showRanking, setShowRanking] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)

  // Estados de usuario
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [newNickname, setNewNickname] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Estados de la secuencia de inicio
  const [bootSequence, setBootSequence] = useState(true)
  const [bootText, setBootText] = useState("")
  const [waitingForKeyPress, setWaitingForKeyPress] = useState(false)

  // Estados de login
  const [showLogin, setShowLogin] = useState(false)
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Estados de salida
  const [showExitAnimation, setShowExitAnimation] = useState(false)

  // Estados del terminal
  const [terminalMode, setTerminalMode] = useState(false)
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [usedCommands, setUsedCommands] = useState<Set<string>>(new Set())

  // Estados de easter eggs
  const [easterEggCode, setEasterEggCode] = useState("")
  const [cedula, setCedula] = useState("")
  const [foundEgg, setFoundEgg] = useState(false)
  const [foundEggs, setFoundEggs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showHackingAnimation, setShowHackingAnimation] = useState(false)
  // Estados de premios
  const [prize, setPrize] = useState<{ name: string; available: boolean } | null>(null)
  const [showPrize, setShowPrize] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [typingIndex, setTypingIndex] = useState(0)

  // Estados de acertijos
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null)
  const [puzzleAnswer, setPuzzleAnswer] = useState("")
  const [showPuzzle, setShowPuzzle] = useState(false)

  // Estados de logros
  const [achievements, setAchievements] = useState(ACHIEVEMENTS)
  const [userPoints, setUserPoints] = useState(0)

  // Estados de easter eggs de tiempo limitado
  const [showTimeLimitedEgg, setShowTimeLimitedEgg] = useState(false)
  const [timeLimitedEggCode, setTimeLimitedEggCode] = useState("")
  const [timeLimitedEggTimer, setTimeLimitedEggTimer] = useState(60)

  // Estados de estadísticas
  const [eggStats, setEggStats] = useState({
    total: EASTER_EGGS.length,
    found: 0,
    regular: 0,
    bonus: 0,
    percentage: 0,
  })

  // Ranking de usuarios
  const [userRanking, setUserRanking] = useState<{ nick: string; eggCount: number; points: number }[]>([])

  // Precargar sonidos cuando la aplicación se inicia
  useEffect(() => {
    preloadSounds(soundEnabled)
  }, [soundEnabled])

  // Verificar si hay un usuario en localStorage (simulando sesión)
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)

        // Set all user data at once to avoid multiple renders
        setCurrentUser(user)
        setIsLoggedIn(true)

        if (user.foundEggs && user.foundEggs.length > 0) {
          setFoundEggs(user.foundEggs)
        }

        if (typeof user.points === "number") {
          setUserPoints(user.points)
        }

        if (user.achievements) {
          setAchievements(user.achievements)
        }
      } catch (error) {
        console.error("Error parsing stored user:", error)
      }
    }

    // Cargar ranking de usuarios
    loadUserRanking()
  }, []) // Empty dependency array to run only once

  // Cargar ranking de usuarios
  const loadUserRanking = () => {
    // En un sistema real, esto sería una llamada a la API
    // Aquí simulamos con los datos de SYSTEM_USERS
    const ranking = SYSTEM_USERS.map((user) => ({
      nick: user.nick,
      eggCount: user.foundEggs?.length || 0,
      points: user.points || 0,
    })).sort((a, b) => b.points - a.points) // Ordenar por puntos de mayor a menor

    setUserRanking(ranking)
  }

  // Secuencia de inicio
  useEffect(() => {
    if (!bootSequence) return

    // Seleccionar exactamente 8 mensajes
    const numMessages = 8
    const selectedMessages = ["INICIANDO SISTEMA..."] // Siempre comenzar con este

    // Añadir mensajes aleatorios sin repetir
    const availableMessages = [...BOOT_MESSAGES.slice(1)] // Excluir el primer mensaje que ya usamos
    for (let i = 0; i < numMessages - 2; i++) {
      // -2 porque ya tenemos el primero y añadiremos "SISTEMA LISTO" al final
      const randomIndex = Math.floor(Math.random() * availableMessages.length)
      selectedMessages.push(availableMessages[randomIndex].replace(/\n/g, " ")) // Asegurar 1 línea sin retorno de carro
      availableMessages.splice(randomIndex, 1) // Eliminar el mensaje seleccionado para evitar repeticiones
    }

    // Siempre terminar con este mensaje
    selectedMessages.push("SISTEMA LISTO.")

    let currentIndex = 0
    setBootText("") // Limpiar cualquier texto anterior

    // Reproducir sonido de inicio
    playSound("boot", { enabled: soundEnabled })

    const bootInterval = setInterval(() => {
      if (currentIndex < selectedMessages.length) {
        setBootText((prev) => prev + "\n> " + selectedMessages[currentIndex])
        playSound("type", { enabled: soundEnabled, volume: 0.2 })
        currentIndex++
      } else {
        clearInterval(bootInterval)
        setTimeout(() => {
          setBootText((prev) => prev + "\n\nPRESIONE CUALQUIER TECLA PARA CONTINUAR...")
          setWaitingForKeyPress(true)
        }, 1200) // Dar tiempo para leer el último mensaje
      }
    }, 1000) // Más tiempo entre mensajes para permitir leerlos

    return () => clearInterval(bootInterval)
  }, [bootSequence, soundEnabled])

  // Detector de teclas para continuar después del boot
  useEffect(() => {
    if (!waitingForKeyPress) return

    const handleKeyPress = () => {
      playSound("click", { enabled: soundEnabled })
      playSound("startup", { enabled: soundEnabled })
      setWaitingForKeyPress(false)
      setBootSequence(false)

      // Si ya hay un usuario logueado, ir directamente a la pantalla principal
      if (isLoggedIn && currentUser) {
        return
      }

      setShowLogin(true)

      // Posibilidad de mostrar un easter egg de tiempo limitado
      if (Math.random() < 0.3) {
        // 30% de probabilidad
        setTimeout(() => {
          const timeLimitedEgg = EASTER_EGGS.find((egg) => egg.timeLimit)
          if (timeLimitedEgg) {
            setShowTimeLimitedEgg(true)
            setTimeLimitedEggCode(timeLimitedEgg.code)
            playSound("success", { enabled: soundEnabled })

            // Iniciar temporizador
            const timer = setInterval(() => {
              setTimeLimitedEggTimer((prev) => {
                if (prev <= 1) {
                  clearInterval(timer)
                  setShowTimeLimitedEgg(false)
                  return 60
                }
                return prev - 1
              })
            }, 1000)
          }
        }, 30000) // Mostrar después de 30 segundos
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    window.addEventListener("click", handleKeyPress)

    return () => {
      window.removeEventListener("keydown", handleKeyPress)
      window.removeEventListener("click", handleKeyPress)
    }
  }, [waitingForKeyPress, isLoggedIn, currentUser, soundEnabled])

  // Efecto de escritura para la revelación del premio
  useEffect(() => {
    if (showPrize && prize && typingIndex < prize.name.length) {
      const timer = setTimeout(() => {
        setTypingText(prize.name.substring(0, typingIndex + 1))
        if (typingIndex % 2 === 0) {
          playSound("type", { enabled: soundEnabled, volume: 0.1 })
        }
        setTypingIndex(typingIndex + 1)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [showPrize, prize, typingIndex, soundEnabled])

  // Desplazamiento automático del terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalHistory])

  // Actualizar estadísticas cuando cambian los easter eggs encontrados
  useEffect(() => {
    // Skip this effect if we don't have foundEggs yet
    if (!foundEggs.length && !currentUser?.foundEggs?.length) return

    const regularEggs = foundEggs.filter((code) => !code.startsWith("BONUS"))
    const bonusEggs = foundEggs.filter((code) => code.startsWith("BONUS"))

    setEggStats({
      total: EASTER_EGGS.length,
      found: foundEggs.length,
      regular: regularEggs.length,
      bonus: bonusEggs.length,
      percentage: Math.round((foundEggs.length / EASTER_EGGS.length) * 100),
    })

    // Create a copy of achievements to work with
    let updatedAchievements = [...achievements]
    let shouldUpdate = false
    const achievementNotifications = []

    // Primer easter egg
    if (foundEggs.length > 0 && !updatedAchievements.find((a) => a.id === "first_egg")?.unlocked) {
      updatedAchievements = updatedAchievements.map((a) => (a.id === "first_egg" ? { ...a, unlocked: true } : a))
      shouldUpdate = true
      achievementNotifications.push({ name: "Primer Descubrimiento", icon: "🥚", delay: 100 })
    }

    // Tres easter eggs
    if (foundEggs.length >= 3 && !updatedAchievements.find((a) => a.id === "three_eggs")?.unlocked) {
      updatedAchievements = updatedAchievements.map((a) => (a.id === "three_eggs" ? { ...a, unlocked: true } : a))
      shouldUpdate = true
      achievementNotifications.push({ name: "Cazador Novato", icon: "🔍", delay: 200 })
    }

    // Todos los easter eggs regulares (excluyendo bonus)
    const regularEggCount = EASTER_EGGS.filter((egg) => !egg.code.startsWith("BONUS")).length
    if (regularEggs.length >= regularEggCount && !updatedAchievements.find((a) => a.id === "all_eggs")?.unlocked) {
      updatedAchievements = updatedAchievements.map((a) => (a.id === "all_eggs" ? { ...a, unlocked: true } : a))
      shouldUpdate = true
      achievementNotifications.push({ name: "Maestro Cazador", icon: "🏆", delay: 300 })
    }

    // Easter egg bonus
    if (bonusEggs.length > 0 && !updatedAchievements.find((a) => a.id === "bonus_egg")?.unlocked) {
      updatedAchievements = updatedAchievements.map((a) => (a.id === "bonus_egg" ? { ...a, unlocked: true } : a))
      shouldUpdate = true
      achievementNotifications.push({ name: "Buscador de Bonus", icon: "⭐", delay: 400 })
    }

    // Solo actualizar si realmente hay cambios
    if (shouldUpdate) {
      setAchievements(updatedAchievements)

      // Show notifications outside the effect
      achievementNotifications.forEach((notification) => {
        setTimeout(() => {
          playSound("achievement", { enabled: soundEnabled })
          toast({
            title: `¡LOGRO DESBLOQUEADO!`,
            description: `${notification.icon} ${notification.name}`,
            className: "retro-toast achievement-toast",
          })
        }, notification.delay)
      })
    }

    // Actualizar datos del usuario en localStorage
    if (currentUser && shouldUpdate) {
      const updatedUser = {
        ...currentUser,
        foundEggs,
        points: userPoints,
        achievements: updatedAchievements,
      }

      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      setCurrentUser(updatedUser)

      // Actualizar ranking
      loadUserRanking()
    }
  }, [foundEggs, userPoints]) // Remove achievements and currentUser from dependencies

  // Verificar logro de comandos de terminal
  useEffect(() => {
    if (usedCommands.size >= 10 && !achievements.find((a) => a.id === "terminal_pro")?.unlocked) {
      const updatedAchievements = achievements.map((a) => (a.id === "terminal_pro" ? { ...a, unlocked: true } : a))
      setAchievements(updatedAchievements)
      showAchievementNotification("Terminal Master", "💻")
    }
  }, [usedCommands, achievements])


  // Temporizador para easter egg de tiempo limitado
  useEffect(() => {
    if (!showTimeLimitedEgg) return

    const timer = setInterval(() => {
      setTimeLimitedEggTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowTimeLimitedEgg(false)
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showTimeLimitedEgg])

  // Efecto para la animación de salida
  useEffect(() => {
    if (!showExitAnimation) return

    // Reproducir sonido de cierre
    playSound("boot", { enabled: soundEnabled })

    // Después de mostrar la animación, reiniciar el sistema
    const timer = setTimeout(() => {
      resetSystem()
    }, 5000) // Aumentado para dar tiempo a la nueva animación

    return () => clearTimeout(timer)
  }, [showExitAnimation, soundEnabled])

  const handleSoundToggle = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    playSound("click", { enabled: newState })

    // Si se activa el sonido, precargar los sonidos
    if (newState) {
      preloadSounds(true)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    playSound("type", { enabled: soundEnabled })

    // Verificar si la cédula existe como nombre de usuario
    const user = SYSTEM_USERS.find((u) => u.username === loginUsername)

    if (user) {
      // En un sistema real, verificaríamos la contraseña con hash
      // Aquí simplemente simulamos que la contraseña es la misma que el username para usuarios normales
      const isValidPassword = user.password === loginPassword

      if (isValidPassword) {
        setCurrentUser(user)
        setIsLoggedIn(true)
        setShowLogin(false)

        // Guardar usuario en localStorage (simulando sesión)
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            ...user,
            foundEggs: user.foundEggs || [],
            points: user.points || 0,
            achievements: user.achievements || ACHIEVEMENTS,
          }),
        )

        playSound("success", { enabled: soundEnabled })
        toast({
          title: "ACCESO CONCEDIDO",
          description: `Bienvenido, ${user.nick}. Sesión iniciada correctamente.`,
          className: "retro-toast",
        })

        // Si es admin, redirigir al panel de administración
        if (user.isAdmin) {
          setTimeout(() => {
            router.push("/admin")
          }, 1500)
        }
      } else {
        playSound("error", { enabled: soundEnabled })
        toast({
          title: "ACCESO DENEGADO",
          description: "Contraseña incorrecta.",
          variant: "destructive",
          className: "retro-toast",
        })
      }
    } else {
      playSound("error", { enabled: soundEnabled })
      toast({
        title: "USUARIO NO ENCONTRADO",
        description: "La cédula ingresada no está registrada en el sistema.",
        variant: "destructive",
        className: "retro-toast",
      })
    }
  }

  const handleLogout = () => {
    setShowExitAnimation(true)
    playSound("type", { enabled: soundEnabled })
  }

  const resetSystem = () => {
    // Eliminar datos de sesión
    localStorage.removeItem("currentUser")

    // Reiniciar todos los estados
    setIsLoggedIn(false)
    setCurrentUser(null)
    setFoundEggs([])
    setUserPoints(0)
    setAchievements(ACHIEVEMENTS)
    setShowExitAnimation(false)
    setBootSequence(true)
    setWaitingForKeyPress(false)
    setLoginUsername("")
    setLoginPassword("")
  }

  const updateNickname = () => {
    if (!currentUser || !newNickname.trim()) return

    playSound("click", { enabled: soundEnabled })

    // Actualizar el nickname
    const updatedUser = {
      ...currentUser,
      nick: newNickname.trim(),
    }

    setCurrentUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    toast({
      title: "NICKNAME ACTUALIZADO",
      description: `Tu nickname ha sido actualizado a: ${newNickname}`,
      className: "retro-toast",
    })

    setNewNickname("")
    setShowProfile(false)

    // Actualizar ranking
    loadUserRanking()
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) return

    playSound("click", { enabled: soundEnabled })

    // Verificar contraseña actual
    if (currentUser.password !== currentPassword) {
      playSound("error", { enabled: soundEnabled })
      toast({
        title: "ERROR",
        description: "La contraseña actual es incorrecta.",
        variant: "destructive",
        className: "retro-toast",
      })
      return
    }

    // Verificar que las contraseñas nuevas coincidan
    if (newPassword !== confirmPassword) {
      playSound("error", { enabled: soundEnabled })
      toast({
        title: "ERROR",
        description: "Las contraseñas nuevas no coinciden.",
        variant: "destructive",
        className: "retro-toast",
      })
      return
    }

    // Actualizar contraseña
    const updatedUser = {
      ...currentUser,
      password: newPassword,
    }

    setCurrentUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    playSound("success", { enabled: soundEnabled })
    toast({
      title: "CONTRASEÑA ACTUALIZADA",
      description: "Tu contraseña ha sido actualizada correctamente.",
      className: "retro-toast",
    })

    // Limpiar campos
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setShowPasswordChange(false)
  }

  const checkEasterEgg = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    playSound("type", { enabled: soundEnabled })

    // Mostrar animación de "hackeo"
    setShowHackingAnimation(true)

    // Registrar tiempo de inicio para el logro de velocista
    const startTime = new Date().getTime()

    // Simulate API call
    setTimeout(() => {
      setShowHackingAnimation(false)
      const foundEasterEgg = EASTER_EGGS.find((egg) => egg.code === easterEggCode.toUpperCase())

      if (foundEasterEgg) {
        if (foundEasterEgg.claimed < foundEasterEgg.limit) {
          setFoundEgg(true)
          setPrize({
            name: foundEasterEgg.prize,
            available: true,
          })

          // Añadir a la lista de easter eggs encontrados
          if (!foundEggs.includes(foundEasterEgg.code)) {
            setFoundEggs([...foundEggs, foundEasterEgg.code])

            // Añadir puntos
            setUserPoints((prev) => prev + foundEasterEgg.points)

            // Verificar logro de velocista
            const endTime = new Date().getTime()
            const timeTaken = (endTime - startTime) / 1000 // en segundos

            if (timeTaken < 5 && !achievements.find((a) => a.id === "quick_finder")?.unlocked) {
              const updatedAchievements = achievements.map((a) =>
                a.id === "quick_finder" ? { ...a, unlocked: true } : a,
              )
              setAchievements(updatedAchievements)
              setTimeout(() => {
                showAchievementNotification("Velocista", "⚡")
              }, 1000)
            }

            // Verificar logro de búho nocturno
            const currentHour = new Date().getHours()
            if (currentHour >= 0 && currentHour < 6 && !achievements.find((a) => a.id === "night_hunter")?.unlocked) {
              const updatedAchievements = achievements.map((a) =>
                a.id === "night_hunter" ? { ...a, unlocked: true } : a,
              )
              setAchievements(updatedAchievements)
              setTimeout(() => {
                showAchievementNotification("Búho Nocturno", "🦉")
              }, 1500)
            }
          }

          playSound("success", { enabled: soundEnabled })
          toast({
            title: "¡EASTER EGG ENCONTRADO!",
            description: "Has descubierto un easter egg. Registra tu cédula para reclamar tu premio.",
            className: "retro-toast",
          })
        } else {
          setPrize({
            name: foundEasterEgg.prize,
            available: false,
          })

          playSound("error", { enabled: soundEnabled })
          toast({
            title: "LÍMITE ALCANZADO",
            description: "Este easter egg ya ha sido reclamado el número máximo de veces permitido.",
            variant: "destructive",
            className: "retro-toast",
          })
        }
      } else {
        playSound("error", { enabled: soundEnabled })
        toast({
          title: "CÓDIGO INCORRECTO",
          description: "Este código no corresponde a ningún easter egg. Sigue buscando.",
          variant: "destructive",
          className: "retro-toast",
        })
      }
      setLoading(false)
    }, 1500)
  }

  const registerEasterEgg = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    playSound("type", { enabled: soundEnabled })

    // Simulate API call
    setTimeout(() => {
      setShowPrize(true)
      playSound("redeem", { enabled: soundEnabled })

      // Reset after showing prize
      setTimeout(() => {
        toast({
          title: "¡REGISTRO EXITOSO!",
          description: `Tu cédula ${currentUser?.username || cedula} ha sido registrada para el easter egg ${easterEggCode}.`,
          className: "retro-toast",
        })
        setFoundEgg(false)
        setShowPrize(false)
        setEasterEggCode("")
        setCedula("")
        setTypingText("")
        setTypingIndex(0)
        setLoading(false)

        // Actualizar ranking
        loadUserRanking()
      }, 3000)
    }, 800)
  }

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!terminalInput.trim()) return

    const input = terminalInput.trim().toLowerCase()
    let response = ""

    // Reproducir sonido de tecleo
    playSound("type", { enabled: soundEnabled })

    // Registrar comando usado para el logro
    setUsedCommands((prev) => new Set(prev).add(input.split(" ")[0]))

    // Procesar comandos
    if (input === "help" || input === "ayuda") {
      response =
        "Comandos disponibles:\n\n" +
        AVAILABLE_COMMANDS.map((cmd) => `${cmd.command.padEnd(20)} - ${cmd.description}`).join("\n")
    } else if (input === "hint" || input === "pista") {
      const randomIndex = Math.floor(Math.random() * HINTS.length)
      response = `PISTA: ${HINTS[randomIndex]}`
    } else if (input === "clear" || input === "limpiar") {
      setTerminalHistory([])
      setTerminalInput("")
      return
    } else if (input === "history" || input === "historial") {
      if (foundEggs.length === 0) {
        response = "No has encontrado ningún easter egg todavía."
      } else {
        response =
          `Easter eggs encontrados (${foundEggs.length}/${EASTER_EGGS.length}):\n\n` +
          foundEggs
            .map((code) => {
              const egg = EASTER_EGGS.find((e) => e.code === code)
              return `${code.padEnd(10)} - ${egg?.prize || "Desconocido"} (${egg?.points || 0} pts)`
            })
            .join("\n")
      }
    } else if (input === "admin") {
      if (currentUser?.isAdmin) {
        playSound("click", { enabled: soundEnabled })
        router.push("/admin")
        return
      } else {
        playSound("error", { enabled: soundEnabled })
        response = "Acceso denegado. Necesitas privilegios de administrador."
      }
    } else if (input.startsWith("check ")) {
      const code = input.substring(6).toUpperCase()
      const egg = EASTER_EGGS.find((e) => e.code === code)
      if (egg) {
        playSound("success", { enabled: soundEnabled })
        response = `¡Easter egg encontrado! Premio: ${egg.prize}`
        if (!foundEggs.includes(code)) {
          setFoundEggs([...foundEggs, code])
          setUserPoints((prev) => prev + egg.points)
        }
      } else {
        playSound("error", { enabled: soundEnabled })
        response = "Código inválido. Sigue buscando."
      }
    } else if (input === "puzzle") {
      // Seleccionar un acertijo aleatorio
      const randomIndex = Math.floor(Math.random() * PUZZLES.length)
      setCurrentPuzzle(PUZZLES[randomIndex])
      setShowPuzzle(true)
      setTerminalMode(false)
      playSound("click", { enabled: soundEnabled })
      return
    } else if (input === "stats") {
      response = `
Estadísticas:
- Easter eggs encontrados: ${foundEggs.length}/${EASTER_EGGS.length} (${Math.round((foundEggs.length / EASTER_EGGS.length) * 100)}%)
- Easter eggs regulares: ${eggStats.regular}
- Easter eggs bonus: ${eggStats.bonus}
- Logros desbloqueados: ${achievements.filter((a) => a.unlocked).length}/${achievements.length}
    `

    } else if (input.startsWith("theme ")) {
      const newTheme = input.substring(6).toLowerCase()
      if (["green", "amber", "blue"].includes(newTheme)) {
        setTheme(newTheme as "green" | "amber" | "blue")
        playSound("click", { enabled: soundEnabled })
        response = `Tema cambiado a ${newTheme}.`
      } else {
        playSound("error", { enabled: soundEnabled })
        response = "Tema no válido. Opciones disponibles: green, amber, blue"
      }
    } else if (input === "achievements") {
      const unlockedAchievements = achievements.filter((a) => a.unlocked)
      if (unlockedAchievements.length === 0) {
        response = "No has desbloqueado ningún logro todavía."
      } else {
        response =
          `Logros desbloqueados (${unlockedAchievements.length}/${achievements.length}):\n\n` +
          unlockedAchievements.map((a) => `${a.icon} ${a.name.padEnd(20)} - ${a.description}`).join("\n")
      }
    } else if (input === "export") {
      generateCertificate()
      playSound("success", { enabled: soundEnabled })
      response = "Generando certificado de cazador de easter eggs..."
    } else if (input === "whoami") {
      response = `
Usuario: ${currentUser?.name || "Desconocido"}
Cédula: ${currentUser?.username || "No registrada"}
Nickname: ${currentUser?.nick || "No definido"}
Easter eggs encontrados: ${foundEggs.length}
Puntos: ${userPoints}
    `
    } else if (input === "ranking") {
      if (userRanking.length === 0) {
        response = "No hay datos de ranking disponibles."
      } else {
        response =
          "RANKING DE CAZADORES:\n\n" +
          userRanking
            .map((user, index) => `${index + 1}. ${user.nick.padEnd(15)} - ${user.eggCount} eggs (${user.points} pts)`)
            .join("\n")
      }
    } else if (input === "logout") {
      setTerminalMode(false)
      handleLogout()
      return
    } else if (input === "exit" || input === "salir") {
      setTerminalMode(false)
      playSound("click", { enabled: soundEnabled })
      return
    } else {
      playSound("error", { enabled: soundEnabled })
      response = `Comando no reconocido: ${input}. Escribe 'help' para ver los comandos disponibles.`
    }

    setTerminalHistory([...terminalHistory, `> ${terminalInput}`, response])
    setTerminalInput("")
  }

  const showAchievementNotification = (name: string, icon: string) => {
    playSound("achievement", { enabled: soundEnabled })
    toast({
      title: `¡LOGRO DESBLOQUEADO!`,
      description: `${icon} ${name}`,
      className: "retro-toast achievement-toast",
    })
  }

  const handlePuzzleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPuzzle) return

    playSound("type", { enabled: soundEnabled })

    if (puzzleAnswer.toLowerCase() === currentPuzzle.answer.toLowerCase()) {
      // Respuesta correcta
      playSound("success", { enabled: soundEnabled })

      // Añadir el easter egg correspondiente si no lo tiene ya
      if (!foundEggs.includes(currentPuzzle.reward)) {
        setFoundEggs([...foundEggs, currentPuzzle.reward])

        // Añadir puntos del easter egg
        const egg = EASTER_EGGS.find((e) => e.code === currentPuzzle.reward)
        if (egg) {
          setUserPoints((prev) => prev + egg.points)
        }

        // Desbloquear logro de resolver acertijo
        if (!achievements.find((a) => a.id === "puzzle_solver")?.unlocked) {
          const updatedAchievements = achievements.map((a) => (a.id === "puzzle_solver" ? { ...a, unlocked: true } : a))
          setAchievements(updatedAchievements)
          setTimeout(() => {
            showAchievementNotification("Enigmático", "🧩")
          }, 1000)
        }
      }

      toast({
        title: "¡ACERTIJO RESUELTO!",
        description: `Has desbloqueado el easter egg ${currentPuzzle.reward}`,
        className: "retro-toast",
      })

      setShowPuzzle(false)
      setPuzzleAnswer("")
      setCurrentPuzzle(null)
    } else {
      // Respuesta incorrecta
      playSound("error", { enabled: soundEnabled })
      toast({
        title: "RESPUESTA INCORRECTA",
        description: "Inténtalo de nuevo o solicita una pista.",
        variant: "destructive",
        className: "retro-toast",
      })
    }
  }

  const showPuzzleHint = () => {
    if (!currentPuzzle) return

    playSound("click", { enabled: soundEnabled })
    toast({
      title: "PISTA",
      description: currentPuzzle.hint,
      className: "retro-toast",
    })
  }

  const generateCertificate = () => {
    playSound("success", { enabled: soundEnabled })
    toast({
      title: "CERTIFICADO GENERADO",
      description: `Se ha generado un certificado para ${currentUser?.name || "Usuario"} con ${foundEggs.length} easter eggs encontrados.`,
      className: "retro-toast",
    })
  }

  // Función para copiar códigos de easter eggs de tiempo limitado
  const copyTimeLimitedEgg = () => {
    navigator.clipboard.writeText(timeLimitedEggCode).then(() => {
      playSound("click", { enabled: soundEnabled })
      toast({
        title: "CÓDIGO COPIADO",
        description: "El código ha sido copiado al portapapeles.",
        className: "retro-toast",
      })
    })
  }

  // Renderizado de la secuencia de inicio
  if (bootSequence) {
    return (
      <main className={`retro-screen retro-${theme} min-h-screen flex flex-col items-center justify-center p-4`}>
        <div className="scanlines"></div>
        <pre className="retro-terminal w-full max-w-md font-mono text-sm whitespace-pre-wrap">{bootText}</pre>

        {/* Botón para saltar la animación */}
        <button
          onClick={() => {
            playSound("click", { enabled: soundEnabled })
            playSound("startup", { enabled: soundEnabled })
            setWaitingForKeyPress(false)
            setBootSequence(false)
          }}
          className="fixed bottom-9 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-primary text-black rounded hover:bg-primary/80 transition retro-button text-sm"
        >
          Omitir
        </button>
      </main>
    );
  }

  // Renderizado de la pantalla de login
  if (showLogin) {
    return (
      <main className={`retro-screen retro-${theme} min-h-screen flex flex-col items-center justify-center p-4`}>
        <div className="scanlines"></div>

        <div className="retro-container max-w-md w-full p-6 relative z-10">
          <h1 className="retro-title text-center mb-6">SISTEMA DE ACCESO</h1>
          <div className="text-center mb-6 text-sm">EASTER EGG HUNTER · CURSO DE IA</div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="retro-label">
                CÉDULA:
              </Label>
              <Input
                id="username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="retro-input"
                placeholder="INGRESA TU CÉDULA"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="retro-label">
                CONTRASEÑA:
              </Label>
              <Input
                id="password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="retro-input"
                placeholder="INGRESA TU CONTRASEÑA"
                required
              />
            </div>

            <Button type="submit" className="retro-button w-full">
              INICIAR SESIÓN
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p>Usuarios de prueba:</p>
            <p>1234567890 / 1234567890 (usuario normal)</p>
            <p>admin / admin123 (administrador)</p>
          </div>
        </div>
      </main>
    )
  }

  // Renderizado del modo terminal
  if (terminalMode) {
    return (
      <main className={`retro-screen retro-${theme} min-h-screen flex flex-col items-center justify-center p-4`}>
        <div className="scanlines"></div>

        <div className="retro-container max-w-2xl w-full p-4 relative z-10 h-[80vh] flex flex-col">
          <div className="flex justify-between items-center mb-2 px-2">
            <h2 className="text-xl">TERMINAL</h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setTerminalMode(false)
                  playSound("click", { enabled: soundEnabled })
                }}
                className="p-1 hover:bg-primary/20 rounded"
                aria-label="Salir del modo terminal"
              >
                X
              </button>
            </div>
          </div>

          <div
            ref={terminalRef}
            className="flex-1 overflow-auto p-2 font-mono text-sm bg-black border border-primary/30"
          >
            <div className="mb-2 text-primary/70">Escribe 'help' para ver los comandos disponibles.</div>
            {terminalHistory.map((line, index) => (
              <div key={index} className={line.startsWith(">") ? "" : "pl-2 mb-2"}>
                {line}
              </div>
            ))}
          </div>

          <form onSubmit={handleTerminalSubmit} className="flex mt-2">
            <span className="text-primary mr-2">{">"}</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-primary"
              autoFocus
            />
          </form>
        </div>
      </main>
    )
  }

  // Renderizado del modo acertijo
  if (showPuzzle) {
    return (
      <main className={`retro-screen retro-${theme} min-h-screen flex flex-col items-center justify-center p-4`}>
        <div className="scanlines"></div>

        <div className="retro-container max-w-md w-full p-6 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl">ACERTIJO</h2>
            <button
              onClick={() => {
                setShowPuzzle(false)
                playSound("click", { enabled: soundEnabled })
              }}
              className="p-1 hover:bg-primary/20 rounded"
              aria-label="Cerrar acertijo"
            >
              X
            </button>
          </div>

          {currentPuzzle && (
            <div className="space-y-4">
              <div className="border border-primary p-4 bg-black/50">
                <p className="mb-2">{currentPuzzle.question}</p>
              </div>

              <form onSubmit={handlePuzzleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="puzzleAnswer" className="retro-label">
                    TU RESPUESTA:
                  </Label>
                  <Input
                    id="puzzleAnswer"
                    value={puzzleAnswer}
                    onChange={(e) => setPuzzleAnswer(e.target.value)}
                    className="retro-input"
                    placeholder="INGRESA TU RESPUESTA"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="retro-button flex-1">
                    VERIFICAR
                  </Button>
                  <Button type="button" onClick={showPuzzleHint} className="retro-button">
                    PISTA
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    )
  }

  // Renderizado de la animación de salida
  if (showExitAnimation) {
    return (
      <main className={`retro-screen retro-${theme} min-h-screen flex flex-col items-center justify-center p-4`}>
        <div className="scanlines"></div>
        <div className="shutdown-animation">
          <div className="shutdown-screen">
            <div className="shutdown-message">CERRANDO SESIÓN</div>
            <div className="shutdown-progress">
              <div className="shutdown-bar"></div>
            </div>
            <div className="shutdown-details">
              <div className="shutdown-detail">Guardando datos de usuario...</div>
              <div className="shutdown-detail">Cerrando procesos...</div>
              <div className="shutdown-detail">Desconectando servicios...</div>
              <div className="shutdown-detail">Limpiando memoria...</div>
              <div className="shutdown-detail">Apagando sistema...</div>
            </div>
            <div className="shutdown-glitch"></div>
          </div>
        </div>
      </main>
    )
  }

  // Renderizado principal
  return (
    <main
      ref={mainRef}
      className={`retro-screen retro-${theme} min-h-screen flex flex-col items-center justify-center p-4`}
    >
      <div className="scanlines"></div>

      {showTimeLimitedEgg && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-20 time-limited-egg">
          <div className="retro-container p-3 flex flex-col items-center">
            <div className="text-center mb-2">¡EASTER EGG DE TIEMPO LIMITADO!</div>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-xl font-bold">{timeLimitedEggCode}</div>
              <button onClick={copyTimeLimitedEgg} className="p-1 hover:bg-primary/20 rounded text-xs">
                COPIAR
              </button>
            </div>
            <div className="text-center text-sm">Expira en: {timeLimitedEggTimer} segundos</div>
          </div>
        </div>
      )}
      <div className="retro-container max-w-md w-full p-6 relative z-10">
        <div className="absolute top-2 right-2 flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="p-1 hover:bg-primary/20 rounded" aria-label="Ayuda">
                      <HelpCircle size={18} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="retro-dialog">
                    <DialogHeader>
                      <DialogTitle>AYUDA DEL SISTEMA</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <p className="mb-2">Este sistema te permite cazar easter eggs ocultos en el curso de IA.</p>
                      <p className="mb-2">Cuando encuentres un código, ingrésalo en el formulario para verificarlo.</p>
                      <p className="mb-2">
                        Si el código es válido, podrás registrar tu cédula para reclamar el premio.
                      </p>
                      <p className="mb-2">Cada easter egg tiene un número limitado de premios disponibles.</p>
                      <p className="mb-4">¡Buena suerte en tu búsqueda!</p>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ayuda</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setTerminalMode(true)
                    playSound("click", { enabled: soundEnabled })
                  }}
                  className="p-1 hover:bg-primary/20 rounded"
                  aria-label="Modo terminal"
                >
                  <Terminal size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Modo terminal</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="p-1 hover:bg-primary/20 rounded"
                      aria-label="Historial"
                      onClick={() => playSound("click", { enabled: soundEnabled })}
                    >
                      <History size={18} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="retro-dialog">
                    <DialogHeader>
                      <DialogTitle>EASTER EGGS ENCONTRADOS</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      {foundEggs.length === 0 ? (
                        <p>No has encontrado ningún easter egg todavía.</p>
                      ) : (
                        <div className="space-y-2">
                          {foundEggs.map((code) => {
                            const egg = EASTER_EGGS.find((e) => e.code === code)
                            return (
                              <div key={code} className="border border-primary/30 p-2">
                                <p>
                                  <strong>Código:</strong> {code}
                                </p>
                                <p>
                                  <strong>Premio:</strong> {egg?.prize || "Desconocido"}
                                </p>
                                <p>
                                  <strong>Puntos:</strong> {egg?.points || 0}
                                </p>
                                <p>
                                  <strong>Dificultad:</strong> {egg?.difficulty || "Normal"}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Historial</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="p-1 hover:bg-primary/20 rounded"
                      aria-label="Logros"
                      onClick={() => playSound("click", { enabled: soundEnabled })}
                    >
                      <Award size={18} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="retro-dialog">
                    <DialogHeader>
                      <DialogTitle>LOGROS</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <div className="space-y-2">
                        {achievements.map((achievement) => (
                          <div
                            key={achievement.id}
                            className={`border p-2 ${achievement.unlocked ? "border-primary" : "border-primary/30 opacity-70"}`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="text-2xl">{achievement.icon}</div>
                              <div>
                                <p className="font-bold">{achievement.name}</p>
                                <p className="text-sm">{achievement.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logros</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setShowSettings(!showSettings)
                    playSound("click", { enabled: soundEnabled })
                  }}
                  className="p-1 hover:bg-primary/20 rounded"
                  aria-label="Configuración"
                >
                  <Settings size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Configuración</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setShowStats(!showStats)
                    playSound("click", { enabled: soundEnabled })
                  }}
                  className="p-1 hover:bg-primary/20 rounded"
                  aria-label="Estadísticas"
                >
                  <BarChart size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Estadísticas</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="p-1 hover:bg-primary/20 rounded"
                      aria-label="Ranking"
                      onClick={() => playSound("click", { enabled: soundEnabled })}
                    >
                      <Medal size={18} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="retro-dialog">
                    <DialogHeader>
                      <DialogTitle>RANKING DE CAZADORES</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <div className="space-y-2 mt-2">
                        {userRanking.length === 0 ? (
                          <p>No hay datos de ranking disponibles.</p>
                        ) : (
                          <div className="border border-primary/30 p-2">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-primary/30">
                                  <th className="text-left p-1">#</th>
                                  <th className="text-left p-1">NICKNAME</th>
                                  <th className="text-center p-1">EGGS</th>
                                  <th className="text-center p-1">PUNTOS</th>
                                </tr>
                              </thead>
                              <tbody>
                                {userRanking.map((user, index) => (
                                  <tr
                                    key={index}
                                    className={`${user.nick === currentUser?.nick ? "bg-primary/20" : ""}`}
                                  >
                                    <td className="p-1">{index + 1}</td>
                                    <td className="p-1">{user.nick}</td>
                                    <td className="text-center p-1">{user.eggCount}</td>
                                    <td className="text-center p-1">{user.points}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ranking</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="p-1 hover:bg-primary/20 rounded"
                      aria-label="Perfil"
                      onClick={() => playSound("click", { enabled: soundEnabled })}
                    >
                      <UserCircle size={18} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="retro-dialog">
                    <DialogHeader>
                      <DialogTitle>PERFIL DE USUARIO</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <div className="space-y-4 mt-2">
                        <div className="border border-primary/30 p-3">
                          <p>
                            <strong>Nombre:</strong> {currentUser?.name || "No disponible"}
                          </p>
                          <p>
                            <strong>Cédula:</strong> {currentUser?.username || "No disponible"}
                          </p>
                          <p>
                            <strong>Nickname:</strong> {currentUser?.nick || "No disponible"}
                          </p>
                          <p>
                            <strong>Puntos:</strong> {userPoints}
                          </p>
                          <p>
                            <strong>Easter Eggs:</strong> {foundEggs.length}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newNickname">CAMBIAR NICKNAME:</Label>
                          <div className="flex gap-2">
                            <Input
                              id="newNickname"
                              value={newNickname}
                              onChange={(e) => setNewNickname(e.target.value)}
                              className="retro-input"
                              placeholder="Nuevo nickname"
                            />
                            <Button onClick={updateNickname} className="retro-button" disabled={!newNickname.trim()}>
                              ACTUALIZAR
                            </Button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-primary/30">
                          <Button
                            onClick={() => {
                              setShowPasswordChange(!showPasswordChange)
                              playSound("click", { enabled: soundEnabled })
                            }}
                            className="retro-button w-full"
                          >
                            {showPasswordChange ? "CANCELAR" : "CAMBIAR CONTRASEÑA"}
                          </Button>

                          {showPasswordChange && (
                            <form onSubmit={handlePasswordChange} className="space-y-3 mt-3">
                              <div className="space-y-1">
                                <Label htmlFor="currentPassword">CONTRASEÑA ACTUAL:</Label>
                                <Input
                                  id="currentPassword"
                                  type="password"
                                  value={currentPassword}
                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                  className="retro-input"
                                  required
                                />
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="newPassword">NUEVA CONTRASEÑA:</Label>
                                <Input
                                  id="newPassword"
                                  type="password"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  className="retro-input"
                                  required
                                />
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor="confirmPassword">CONFIRMAR CONTRASEÑA:</Label>
                                <Input
                                  id="confirmPassword"
                                  type="password"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  className="retro-input"
                                  required
                                />
                              </div>

                              <Button type="submit" className="retro-button w-full">
                                GUARDAR CONTRASEÑA
                              </Button>
                            </form>
                          )}
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Perfil</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={handleLogout} className="p-1 hover:bg-primary/20 rounded" aria-label="Cerrar sesión">
                  <LogOut size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cerrar sesión</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="retro-header">
          <h1 className="retro-title text-center mb-4">EASTER EGG HUNTER</h1>
          <div className="text-center mb-2 text-sm">SISTEMA DE CAZA · CURSO DE IA</div>

          <div className="user-info flex items-center justify-center gap-2 mb-4">
            <User size={16} />
            <span>{currentUser?.nick || "Usuario"}</span>
          </div>
        </div>

        {showSettings && (
          <div className="settings-panel mb-6 border border-primary p-3">
            <h3 className="text-center mb-2">CONFIGURACIÓN</h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label>TEMA:</Label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setTheme("green")
                      playSound("click", { enabled: soundEnabled })
                    }}
                    className={`flex-1 p-2 border ${theme === "green" ? "border-[#33ff33] bg-[#33ff33]/20" : "border-[#33ff33]/30"}`}
                  >
                    VERDE
                  </button>
                  <button
                    onClick={() => {
                      setTheme("amber")
                      playSound("click", { enabled: soundEnabled })
                    }}
                    className={`flex-1 p-2 border ${theme === "amber" ? "border-[#ffb700] bg-[#ffb700]/20" : "border-[#ffb700]/30"}`}
                  >
                    ÁMBAR
                  </button>
                  <button
                    onClick={() => {
                      setTheme("blue")
                      playSound("click", { enabled: soundEnabled })
                    }}
                    className={`flex-1 p-2 border ${theme === "blue" ? "border-[#00aaff] bg-[#00aaff]/20" : "border-[#00aaff]/30"}`}
                  >
                    AZUL
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showStats && (
          <div className="stats-panel mb-6 border border-primary p-3">
            <h3 className="text-center mb-2">ESTADÍSTICAS</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Easter Eggs Encontrados:</span>
                <span>
                  {eggStats.found}/{eggStats.total}
                </span>
              </div>

              <Progress value={eggStats.percentage} className="h-2 bg-primary/20" />

              <div className="grid grid-cols-2 gap-2">
                <div className="border border-primary/30 p-2">
                  <div className="text-sm text-primary/70">REGULARES</div>
                  <div className="text-xl">{eggStats.regular}</div>
                </div>
                <div className="border border-primary/30 p-2">
                  <div className="text-sm text-primary/70">BONUS</div>
                  <div className="text-xl">{eggStats.bonus}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showHackingAnimation && (
          <div className="hacking-animation mb-4">
            <div className="text-center mb-2">ANALIZANDO CÓDIGO...</div>
            <div className="matrix-code"></div>
          </div>
        )}



        {showPrize ? (
          <div className="prize-reveal">
            <h2 className="text-center mb-4">¡PREMIO DESBLOQUEADO!</h2>
            <div className="retro-prize-container">
              <div className="retro-prize-animation">
                <Trophy className="h-12 w-12 animate-pulse" />
              </div>
              <div className="retro-prize-text">
                <div className="typing-cursor">{typingText}</div>
              </div>
            </div>
          </div>
        ) : !foundEgg ? (
          <form onSubmit={checkEasterEgg} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="easterEggCode" className="retro-label">
                CÓDIGO EASTER EGG:
              </Label>
              <Input
                id="easterEggCode"
                value={easterEggCode}
                onChange={(e) => setEasterEggCode(e.target.value)}
                className="retro-input"
                placeholder="INGRESA EL CÓDIGO"
                required
              />
            </div>
            <Button type="submit" className="retro-button w-full" disabled={loading}>
              {loading ? "VERIFICANDO..." : "VERIFICAR CÓDIGO"}
            </Button>
          </form>
        ) : (
          <form onSubmit={registerEasterEgg} className="space-y-6">
            <div className="space-y-2">
              <div className="retro-success-message mb-4">¡EASTER EGG ENCONTRADO!</div>
              {prize && (
                <div className="prize-info mb-4">
                  <p className="text-center">PREMIO: {prize.name}</p>
                  <p className="text-center text-sm">
                    {prize.available
                      ? "¡Aún hay premios disponibles!"
                      : "Lo sentimos, ya no quedan premios disponibles."}
                  </p>
                </div>
              )}
              {!currentUser ? (
                <div className="space-y-2">
                  <Label htmlFor="cedula" className="retro-label">
                    NÚMERO DE CÉDULA:
                  </Label>
                  <Input
                    id="cedula"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    className="retro-input"
                    placeholder="INGRESA TU CÉDULA"
                    required
                  />
                </div>
              ) : (
                <div className="border border-primary/30 p-3 mb-2">
                  <p className="text-center">
                    Se registrará con tu cédula: <strong>{currentUser.username}</strong>
                  </p>
                </div>
              )}
            </div>
            <Button type="submit" className="retro-button w-full" disabled={loading || !!(prize && !prize.available)}>
              {loading ? "REGISTRANDO..." : "CANJEAR PREMIO"}
            </Button>
          </form>
        )}

        <div className="retro-footer text-center mt-8">
          <div className="pulse-glow">SISTEMA ACTIVO</div>
        </div>
      </div>
      <Toaster />
    </main>
  )
}

