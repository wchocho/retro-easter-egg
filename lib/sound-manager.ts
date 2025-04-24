/**
 * Gestor de sonidos para la aplicación retro
 * Proporciona una interfaz unificada para reproducir sonidos
 * con manejo de errores y opciones de configuración
 */

// Tipos de sonidos disponibles en la aplicación
export type SoundType = "boot" | "success" | "error" | "type" | "redeem" | "achievement" | "click" | "tab" | "startup"

// Mapa de rutas de archivos de sonido
const SOUND_PATHS: Record<SoundType, string> = {
  boot: "/sounds/boot.mp3",
  success: "/sounds/success.mp3",
  error: "/sounds/error.mp3",
  type: "/sounds/type.mp3",
  redeem: "/sounds/redeem.mp3",
  achievement: "/sounds/achievement.mp3",
  click: "/sounds/click.mp3",
  tab: "/sounds/tab.mp3",
  startup: "/sounds/startup.mp3",
}

// Caché de instancias de Audio para mejorar el rendimiento
const audioCache: Record<string, HTMLAudioElement> = {}

/**
 * Reproduce un sonido con manejo de errores
 * @param type Tipo de sonido a reproducir
 * @param options Opciones de reproducción
 * @returns Promise que se resuelve cuando el sonido comienza a reproducirse o falla
 */
export const playSound = (
  type: SoundType,
  options: {
    volume?: number
    enabled?: boolean
  } = {},
): Promise<void> => {
  const { volume = 0.3, enabled = true } = options

  // Si el sonido está desactivado, no hacer nada
  if (!enabled) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    try {
      // Usar audio cacheado o crear una nueva instancia
      let audio = audioCache[type]
      if (!audio) {
        audio = new Audio(SOUND_PATHS[type])
        audioCache[type] = audio
      }

      // Configurar volumen
      audio.volume = volume

      // Manejar errores durante la reproducción
      const handleError = (err: any) => {
        console.warn(`Error reproduciendo sonido ${type}:`, err)
        resolve()
      }

      // Reproducir el sonido
      audio
        .play()
        .then(() => resolve())
        .catch(handleError)
    } catch (error) {
      console.warn(`Error al inicializar sonido ${type}:`, error)
      resolve()
    }
  })
}

/**
 * Precarga todos los sonidos para mejorar la experiencia del usuario
 * @param enabled Si es false, no se precargan los sonidos
 */
export const preloadSounds = (enabled = true): void => {
  if (!enabled) return

  try {
    Object.entries(SOUND_PATHS).forEach(([type, path]) => {
      const audio = new Audio(path)
      audio.preload = "auto"
      audioCache[type as SoundType] = audio

      // Cargar silenciosamente
      audio.volume = 0
      audio.play().catch(() => {
        // Ignorar errores durante la precarga
        // Muchos navegadores bloquean la reproducción automática
      })
    })
  } catch (error) {
    console.warn("Error al precargar sonidos:", error)
  }
}

