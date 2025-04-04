"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Textarea } from "@/components/ui/textarea"
import { playSound } from "@/lib/sound-manager"

// Mock data for easter eggs with prizes and limits
const EASTER_EGGS = [
  { code: "EGG001", prize: "Puntos extra en el examen final", limit: 3, claimed: 2 },
  { code: "EGG002", prize: "Libro digital sobre IA", limit: 5, claimed: 1 },
  { code: "EGG003", prize: "Acceso a curso premium", limit: 2, claimed: 0 },
  { code: "EGG004", prize: "Sesión privada de mentoría", limit: 1, claimed: 1 },
  { code: "EGG005", prize: "Certificado especial", limit: 10, claimed: 3 },
]

// Mock registrations
const mockRegistrations = [
  {
    eggCode: "EGG001",
    cedula: "1234567890",
    timestamp: "2023-04-01T12:30:45Z",
    prize: "Puntos extra en el examen final",
  },
  { eggCode: "EGG002", cedula: "0987654321", timestamp: "2023-04-02T10:15:22Z", prize: "Libro digital sobre IA" },
  {
    eggCode: "EGG001",
    cedula: "5678901234",
    timestamp: "2023-04-03T14:45:10Z",
    prize: "Puntos extra en el examen final",
  },
  { eggCode: "EGG004", cedula: "1122334455", timestamp: "2023-04-04T09:20:15Z", prize: "Sesión privada de mentoría" },
  { eggCode: "EGG005", cedula: "9988776655", timestamp: "2023-04-05T16:10:30Z", prize: "Certificado especial" },
  { eggCode: "EGG005", cedula: "1357924680", timestamp: "2023-04-06T11:05:45Z", prize: "Certificado especial" },
  { eggCode: "EGG005", cedula: "2468013579", timestamp: "2023-04-07T13:25:50Z", prize: "Certificado especial" },
]

// Mock users data
const mockUsers = [
  {
    username: "1234567890",
    password: "1234567890",
    name: "Juan Pérez",
    nick: "juanp",
    isAdmin: false,
    foundEggs: ["EGG001", "EGG002"],
    points: 30,
  },
  {
    username: "0987654321",
    password: "0987654321",
    name: "María López",
    nick: "mariaL",
    isAdmin: false,
    foundEggs: ["EGG001", "EGG003", "EGG004"],
    points: 90,
  },
  {
    username: "5678901234",
    password: "5678901234",
    name: "Carlos Rodríguez",
    nick: "carlosr",
    isAdmin: false,
    foundEggs: ["EGG002"],
    points: 20,
  },
  {
    username: "1122334455",
    password: "1122334455",
    name: "Ana Martínez",
    nick: "anam",
    isAdmin: false,
    foundEggs: ["EGG001", "EGG005", "BONUS01"],
    points: 75,
  },
  {
    username: "9988776655",
    password: "9988776655",
    name: "Pedro Sánchez",
    nick: "pedros",
    isAdmin: false,
    foundEggs: [],
    points: 0,
  },
  {
    username: "admin",
    password: "admin123",
    name: "Administrador",
    nick: "admin",
    isAdmin: true,
    foundEggs: ["EGG001", "EGG002", "EGG003", "EGG004", "EGG005"],
    points: 135,
  },
]

// Mock achievements
const mockAchievements = [
  {
    id: "first_egg",
    name: "Primer Descubrimiento",
    description: "Encontraste tu primer easter egg",
    icon: "🥚",
    unlocked: false,
  },
  {
    id: "three_eggs",
    name: "Cazador Novato",
    description: "Encontraste 3 easter eggs diferentes",
    icon: "🔍",
    unlocked: false,
  },
  {
    id: "all_eggs",
    name: "Maestro Cazador",
    description: "Encontraste todos los easter eggs regulares",
    icon: "🏆",
    unlocked: false,
  },
  {
    id: "bonus_egg",
    name: "Buscador de Bonus",
    description: "Encontraste un easter egg bonus",
    icon: "⭐",
    unlocked: false,
  },
  {
    id: "terminal_pro",
    name: "Terminal Master",
    description: "Usaste 10 comandos diferentes en la terminal",
    icon: "💻",
    unlocked: false,
  },
  {
    id: "quick_finder",
    name: "Velocista",
    description: "Encontraste un easter egg en menos de 5 segundos",
    icon: "⚡",
    unlocked: false,
  },
  {
    id: "night_hunter",
    name: "Búho Nocturno",
    description: "Encontraste un easter egg después de medianoche",
    icon: "🦉",
    unlocked: false,
  },
  {
    id: "puzzle_solver",
    name: "Enigmático",
    description: "Resolviste un acertijo para obtener un easter egg",
    icon: "🧩",
    unlocked: false,
  },
]

export default function AdminPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [registrations, setRegistrations] = useState(mockRegistrations)
  const [easterEggs, setEasterEggs] = useState(EASTER_EGGS)
  const [users, setUsers] = useState(mockUsers)
  const [achievements, setAchievements] = useState(mockAchievements)
  const [activeTab, setActiveTab] = useState("registros")
  const [soundEnabled, setSoundEnabled] = useState(false)

  // Estados para el formulario de usuario
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<null | {
    username: string
    password?: string
    name: string
    nick: string
    isAdmin: boolean
  }>(null)
  const [userFormData, setUserFormData] = useState({
    username: "",
    password: "",
    name: "",
    nick: "",
    isAdmin: false,
  })

  // Estados para el formulario de logros
  const [showAchievementForm, setShowAchievementForm] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<null | {
    id: string
    name: string
    description: string
    icon: string
  }>(null)
  const [achievementFormData, setAchievementFormData] = useState({
    id: "",
    name: "",
    description: "",
    icon: "",
  })

  // Verificar si hay un usuario en localStorage (simulando sesión)
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        if (user.isAdmin) {
          setIsAuthenticated(true)
          // Cargar preferencia de sonido
          setSoundEnabled(localStorage.getItem("soundEnabled") === "true")
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("Error parsing stored user:", error)
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    playSound("type", { enabled: soundEnabled })

    // Simple password check - in a real app, use proper authentication
    if (password === "admin123") {
      setIsAuthenticated(true)
      playSound("success", { enabled: soundEnabled })
    } else {
      playSound("error", { enabled: soundEnabled })
      alert("ACCESO DENEGADO: CONTRASEÑA INCORRECTA")
    }
  }

  const handleLogout = () => {
    // Eliminar solo la parte de isAdmin pero mantener el usuario
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      user.isAdmin = false
      localStorage.setItem("currentUser", JSON.stringify(user))
    }
    playSound("click", { enabled: soundEnabled })
    router.push("/")
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    playSound("tab", { enabled: soundEnabled })
  }

  const handleAddEasterEgg = () => {
    // This would open a modal in a real app
    playSound("click", { enabled: soundEnabled })
    alert("FUNCIÓN NO IMPLEMENTADA: AGREGAR NUEVO EASTER EGG")
  }

  const handleEditLimits = (code: string) => {
    // This would open a modal in a real app
    playSound("click", { enabled: soundEnabled })
    alert(`FUNCIÓN NO IMPLEMENTADA: EDITAR LÍMITES PARA ${code}`)
  }

  const handleAddUser = () => {
    setEditingUser(null)
    setUserFormData({
      username: "",
      password: "",
      name: "",
      nick: "",
      isAdmin: false,
    })
    setShowUserForm(true)
    playSound("click", { enabled: soundEnabled })
  }

  const handleEditUser = (user: (typeof users)[0]) => {
    setEditingUser(user)
    setUserFormData({
      username: user.username,
      password: user.password || "",
      name: user.name,
      nick: user.nick,
      isAdmin: user.isAdmin,
    })
    setShowUserForm(true)
    playSound("click", { enabled: soundEnabled })
  }

  const handleDeleteUser = (username: string) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario ${username}?`)) {
      setUsers(users.filter((user) => user.username !== username))
      playSound("success", { enabled: soundEnabled })
      toast({
        title: "USUARIO ELIMINADO",
        description: `El usuario ${username} ha sido eliminado correctamente.`,
        className: "retro-toast",
      })
    }
  }

  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    playSound("type", { enabled: soundEnabled })

    if (editingUser) {
      // Actualizar usuario existente
      setUsers(users.map((user) => (user.username === editingUser.username ? userFormData : user)))
      playSound("success", { enabled: soundEnabled })
      toast({
        title: "USUARIO ACTUALIZADO",
        description: `El usuario ${userFormData.username} ha sido actualizado correctamente.`,
        className: "retro-toast",
      })
    } else {
      // Verificar si el usuario ya existe
      if (users.some((user) => user.username === userFormData.username)) {
        playSound("error", { enabled: soundEnabled })
        toast({
          title: "ERROR",
          description: `Ya existe un usuario con la cédula ${userFormData.username}.`,
          variant: "destructive",
          className: "retro-toast",
        })
        return
      }

      // Agregar nuevo usuario
      setUsers([...users, userFormData])
      playSound("success", { enabled: soundEnabled })
      toast({
        title: "USUARIO CREADO",
        description: `El usuario ${userFormData.username} ha sido creado correctamente.`,
        className: "retro-toast",
      })
    }

    setShowUserForm(false)
  }

  const handleAddAchievement = () => {
    setEditingAchievement(null)
    setAchievementFormData({
      id: "",
      name: "",
      description: "",
      icon: "",
    })
    setShowAchievementForm(true)
    playSound("click", { enabled: soundEnabled })
  }

  const handleEditAchievement = (achievement: (typeof achievements)[0]) => {
    setEditingAchievement(achievement)
    setAchievementFormData({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
    })
    setShowAchievementForm(true)
    playSound("click", { enabled: soundEnabled })
  }

  const handleDeleteAchievement = (id: string) => {
    if (window.confirm(`¿Estás seguro de eliminar el logro ${id}?`)) {
      setAchievements(achievements.filter((achievement) => achievement.id !== id))
      playSound("success", { enabled: soundEnabled })
      toast({
        title: "LOGRO ELIMINADO",
        description: `El logro ${id} ha sido eliminado correctamente.`,
        className: "retro-toast",
      })
    }
  }

  const handleAchievementFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    playSound("type", { enabled: soundEnabled })

    if (editingAchievement) {
      // Actualizar logro existente
      setAchievements(
        achievements.map((achievement) =>
          achievement.id === editingAchievement.id
            ? { ...achievementFormData, unlocked: achievement.unlocked }
            : achievement,
        ),
      )
      playSound("success", { enabled: soundEnabled })
      toast({
        title: "LOGRO ACTUALIZADO",
        description: `El logro ${achievementFormData.name} ha sido actualizado correctamente.`,
        className: "retro-toast",
      })
    } else {
      // Verificar si el logro ya existe
      if (achievements.some((achievement) => achievement.id === achievementFormData.id)) {
        playSound("error", { enabled: soundEnabled })
        toast({
          title: "ERROR",
          description: `Ya existe un logro con el ID ${achievementFormData.id}.`,
          variant: "destructive",
          className: "retro-toast",
        })
        return
      }

      // Agregar nuevo logro
      setAchievements([...achievements, { ...achievementFormData, unlocked: false }])
      playSound("success", { enabled: soundEnabled })
      toast({
        title: "LOGRO CREADO",
        description: `El logro ${achievementFormData.name} ha sido creado correctamente.`,
        className: "retro-toast",
      })
    }

    setShowAchievementForm(false)
  }

  const handleSoundToggle = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    localStorage.setItem("soundEnabled", newState.toString())
    playSound("click", { enabled: newState })
  }

  return (
    <main className="retro-screen min-h-screen flex flex-col items-center justify-center p-4">
      <div className="scanlines"></div>

      <div className="retro-container max-w-4xl w-full p-6 relative z-10">
        <h1 className="retro-title text-center mb-8 pulse-glow">PANEL DE ADMINISTRACIÓN</h1>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="retro-label">
                CONTRASEÑA:
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="retro-input"
                placeholder="INGRESA LA CONTRASEÑA"
                required
              />
            </div>
            <Button type="submit" className="retro-button w-full">
              ACCEDER
            </Button>
          </form>
        ) : (
          <div>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleSoundToggle}
                className="p-2 hover:bg-primary/20 rounded mr-2"
                aria-label={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
              >
                {soundEnabled ? "🔊 SONIDO ON" : "🔇 SONIDO OFF"}
              </button>
            </div>

            <Tabs defaultValue="registros" className="w-full" onValueChange={handleTabChange}>
              <TabsList className="retro-tabs w-full mb-4">
                <TabsTrigger value="registros" className="retro-tab">
                  REGISTROS
                </TabsTrigger>
                <TabsTrigger value="easter-eggs" className="retro-tab">
                  EASTER EGGS
                </TabsTrigger>
                <TabsTrigger value="usuarios" className="retro-tab">
                  USUARIOS
                </TabsTrigger>
                <TabsTrigger value="logros" className="retro-tab">
                  LOGROS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="registros" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl">REGISTROS DE EASTER EGGS</h2>
                  <Button className="retro-button-sm" onClick={() => playSound("click", { enabled: soundEnabled })}>
                    EXPORTAR
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-[#33ff33]">
                        <TableHead className="text-left">CÓDIGO</TableHead>
                        <TableHead className="text-left">CÉDULA</TableHead>
                        <TableHead className="text-left">PREMIO</TableHead>
                        <TableHead className="text-left">FECHA</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrations.map((reg, index) => (
                        <TableRow key={index} className="border-b border-[#33ff33]/30">
                          <TableCell>{reg.eggCode}</TableCell>
                          <TableCell>{reg.cedula}</TableCell>
                          <TableCell>{reg.prize}</TableCell>
                          <TableCell>{new Date(reg.timestamp).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                      {registrations.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">
                            No hay registros disponibles
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="easter-eggs" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl">GESTIÓN DE EASTER EGGS</h2>
                  <Button className="retro-button-sm" onClick={handleAddEasterEgg}>
                    AGREGAR NUEVO
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-[#33ff33]">
                        <TableHead className="text-left">CÓDIGO</TableHead>
                        <TableHead className="text-left">PREMIO</TableHead>
                        <TableHead className="text-left">LÍMITE</TableHead>
                        <TableHead className="text-left">RECLAMADOS</TableHead>
                        <TableHead className="text-left">DISPONIBLES</TableHead>
                        <TableHead className="text-left">ACCIONES</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {easterEggs.map((egg, index) => (
                        <TableRow key={index} className="border-b border-[#33ff33]/30">
                          <TableCell>{egg.code}</TableCell>
                          <TableCell>{egg.prize}</TableCell>
                          <TableCell>{egg.limit}</TableCell>
                          <TableCell>{egg.claimed}</TableCell>
                          <TableCell>{egg.limit - egg.claimed}</TableCell>
                          <TableCell>
                            <Button className="retro-button-xs" onClick={() => handleEditLimits(egg.code)}>
                              EDITAR
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="usuarios" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl">GESTIÓN DE USUARIOS</h2>
                  <Button className="retro-button-sm" onClick={handleAddUser}>
                    AGREGAR USUARIO
                  </Button>
                </div>

                {showUserForm ? (
                  <div className="border border-[#33ff33] p-4 mb-4">
                    <h3 className="text-lg mb-3">{editingUser ? "EDITAR USUARIO" : "NUEVO USUARIO"}</h3>
                    <form onSubmit={handleUserFormSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="username">CÉDULA:</Label>
                        <Input
                          id="username"
                          value={userFormData.username}
                          onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                          className="retro-input"
                          placeholder="Ingrese la cédula"
                          disabled={!!editingUser}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="password">CONTRASEÑA:</Label>
                        <Input
                          id="password"
                          type="password"
                          value={userFormData.password}
                          onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                          className="retro-input"
                          placeholder={editingUser ? "Dejar en blanco para no cambiar" : "Ingrese la contraseña"}
                          required={!editingUser}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="name">NOMBRE COMPLETO:</Label>
                        <Input
                          id="name"
                          value={userFormData.name}
                          onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                          className="retro-input"
                          placeholder="Ingrese el nombre completo"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="nick">NICKNAME:</Label>
                        <Input
                          id="nick"
                          value={userFormData.nick}
                          onChange={(e) => setUserFormData({ ...userFormData, nick: e.target.value })}
                          className="retro-input"
                          placeholder="Ingrese el nickname"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isAdmin"
                          checked={userFormData.isAdmin}
                          onChange={(e) => setUserFormData({ ...userFormData, isAdmin: e.target.checked })}
                          className="retro-checkbox"
                        />
                        <Label htmlFor="isAdmin">ES ADMINISTRADOR</Label>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button type="submit" className="retro-button-sm">
                          {editingUser ? "ACTUALIZAR" : "GUARDAR"}
                        </Button>
                        <Button
                          type="button"
                          className="retro-button-sm"
                          onClick={() => {
                            setShowUserForm(false)
                            playSound("click", { enabled: soundEnabled })
                          }}
                        >
                          CANCELAR
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : null}

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-[#33ff33]">
                        <TableHead className="text-left">CÉDULA</TableHead>
                        <TableHead className="text-left">NOMBRE</TableHead>
                        <TableHead className="text-left">NICKNAME</TableHead>
                        <TableHead className="text-left">TIPO</TableHead>
                        <TableHead className="text-left">ACCIONES</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow key={index} className="border-b border-[#33ff33]/30">
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.nick}</TableCell>
                          <TableCell>{user.isAdmin ? "Administrador" : "Usuario"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button className="retro-button-xs" onClick={() => handleEditUser(user)}>
                                EDITAR
                              </Button>
                              <Button
                                className="retro-button-xs"
                                onClick={() => handleDeleteUser(user.username)}
                                disabled={user.username === "admin"} // Proteger al admin principal
                              >
                                ELIMINAR
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="logros" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl">GESTIÓN DE LOGROS</h2>
                  <Button className="retro-button-sm" onClick={handleAddAchievement}>
                    AGREGAR LOGRO
                  </Button>
                </div>

                {showAchievementForm ? (
                  <div className="border border-[#33ff33] p-4 mb-4">
                    <h3 className="text-lg mb-3">{editingAchievement ? "EDITAR LOGRO" : "NUEVO LOGRO"}</h3>
                    <form onSubmit={handleAchievementFormSubmit} className="space-y-3">
                      <div className="space-y-1">
                        <Label htmlFor="id">ID:</Label>
                        <Input
                          id="id"
                          value={achievementFormData.id}
                          onChange={(e) => setAchievementFormData({ ...achievementFormData, id: e.target.value })}
                          className="retro-input"
                          placeholder="Identificador único (ej: first_egg)"
                          disabled={!!editingAchievement}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="name">NOMBRE:</Label>
                        <Input
                          id="name"
                          value={achievementFormData.name}
                          onChange={(e) => setAchievementFormData({ ...achievementFormData, name: e.target.value })}
                          className="retro-input"
                          placeholder="Nombre del logro"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="description">DESCRIPCIÓN:</Label>
                        <Textarea
                          id="description"
                          value={achievementFormData.description}
                          onChange={(e) =>
                            setAchievementFormData({ ...achievementFormData, description: e.target.value })
                          }
                          className="retro-input"
                          placeholder="Descripción del logro"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="icon">ICONO (EMOJI):</Label>
                        <Input
                          id="icon"
                          value={achievementFormData.icon}
                          onChange={(e) => setAchievementFormData({ ...achievementFormData, icon: e.target.value })}
                          className="retro-input"
                          placeholder="Emoji (ej: 🏆)"
                          required
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button type="submit" className="retro-button-sm">
                          {editingAchievement ? "ACTUALIZAR" : "GUARDAR"}
                        </Button>
                        <Button
                          type="button"
                          className="retro-button-sm"
                          onClick={() => {
                            setShowAchievementForm(false)
                            playSound("click", { enabled: soundEnabled })
                          }}
                        >
                          CANCELAR
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : null}

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-[#33ff33]">
                        <TableHead className="text-left">ID</TableHead>
                        <TableHead className="text-left">ICONO</TableHead>
                        <TableHead className="text-left">NOMBRE</TableHead>
                        <TableHead className="text-left">DESCRIPCIÓN</TableHead>
                        <TableHead className="text-left">ACCIONES</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {achievements.map((achievement, index) => (
                        <TableRow key={index} className="border-b border-[#33ff33]/30">
                          <TableCell>{achievement.id}</TableCell>
                          <TableCell className="text-2xl">{achievement.icon}</TableCell>
                          <TableCell>{achievement.name}</TableCell>
                          <TableCell>{achievement.description}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button className="retro-button-xs" onClick={() => handleEditAchievement(achievement)}>
                                EDITAR
                              </Button>
                              <Button
                                className="retro-button-xs"
                                onClick={() => handleDeleteAchievement(achievement.id)}
                              >
                                ELIMINAR
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button onClick={handleLogout} className="retro-button">
                CERRAR SESIÓN
              </Button>
            </div>
          </div>
        )}

        <div className="retro-footer text-center mt-8 pulse-glow">
          <p>SISTEMA DE ADMINISTRACIÓN · ACCESO RESTRINGIDO</p>
        </div>
      </div>
      <Toaster />
    </main>
  )
}

