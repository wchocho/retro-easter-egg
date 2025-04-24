export type EasterEgg = {
  code: string
  prize: string
  limit: number
  claimed: number
  difficulty: string
  points: number
  timeLimit?: boolean
}

export type Achievement = {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
}

export type Puzzle = {
  id: string
  question: string
  answer: string
  hint: string
  reward: string
}

export type UserData = {
  username: string
  password?: string
  name: string
  nick: string
  isAdmin: boolean
  foundEggs?: string[]
  points?: number
  achievements?: Achievement[]
}

export const EASTER_EGGS: EasterEgg[] = [
  { code: "EGG001", prize: "Puntos extra en el examen final", limit: 3, claimed: 0, difficulty: "Fácil", points: 10 },
  { code: "EGG002", prize: "Libro digital sobre IA", limit: 5, claimed: 0, difficulty: "Medio", points: 20 },
  { code: "EGG003", prize: "Acceso a curso premium", limit: 2, claimed: 0, difficulty: "Difícil", points: 30 },
  { code: "EGG004", prize: "Sesión privada de mentoría", limit: 1, claimed: 0, difficulty: "Muy Difícil", points: 50 },
  { code: "EGG005", prize: "Certificado especial", limit: 10, claimed: 0, difficulty: "Medio", points: 25 },
  {
    code: "BONUS01",
    prize: "Acceso a material exclusivo",
    limit: 3,
    claimed: 0,
    difficulty: "Secreto",
    points: 40,
    timeLimit: true,
  },
  {
    code: "BONUS02",
    prize: "Insignia digital de cazador experto",
    limit: 5,
    claimed: 0,
    difficulty: "Desafío",
    points: 35,
  },
]

export const HINTS = [
  "Las respuestas a veces están escondidas en el código fuente...",
  "Algunos easter eggs están relacionados con famosos científicos de la computación.",
  "Prueba con nombres de algoritmos clásicos de IA.",
  "¿Has revisado las diapositivas de clase con atención?",
  "A veces, la respuesta está en la pregunta misma.",
  "Busca patrones en los ejemplos mostrados en clase.",
  "Algunos easter eggs requieren resolver acertijos lógicos.",
  "Presta atención a las iniciales de conceptos importantes.",
  "Los comentarios del profesor pueden contener pistas.",
  "Ciertos easter eggs solo están disponibles en fechas específicas.",
]

export const ACHIEVEMENTS: Achievement[] = [
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

export const PUZZLES: Puzzle[] = [
  {
    id: "puzzle1",
    question:
      "Soy el padre de la computación. Propuse una máquina teórica que podría resolver cualquier problema computable. ¿Quién soy?",
    answer: "turing",
    hint: "Mi apellido comienza con T y trabajé en descifrar códigos durante la Segunda Guerra Mundial.",
    reward: "BONUS01",
  },
  {
    id: "puzzle2",
    question: "Completa la secuencia: 1, 1, 2, 3, 5, 8, 13, ...",
    answer: "21",
    hint: "Cada número es la suma de los dos anteriores.",
    reward: "BONUS02",
  },
  {
    id: "puzzle3",
    question: "¿Qué algoritmo de búsqueda utiliza una función heurística para encontrar el camino más eficiente?",
    answer: "a*",
    hint: "Su nombre es una letra seguida de un símbolo.",
    reward: "EGG003",
  },
]

export const BOOT_MESSAGES = [
  "INICIANDO SISTEMA...",
  "CARGANDO MÓDULOS DE CAFÉ VIRTUAL...",
  "VERIFICANDO EXISTENCIA DE VIDA INTELIGENTE...",
  "BUSCANDO SEMICOLONS PERDIDOS...",
  "RECALIBRANDO FLUJO DE DILITHIUM...",
  "DESPERTANDO A LOS HAMSTERS QUE HACEN FUNCIONAR EL SERVIDOR...",
  "COMPILANDO CÓDIGO ESCRITO POR MONOS INFINITOS...",
  "CALCULANDO ÚLTIMA CIFRA DE PI...",
  "DESFRAGMENTANDO MEMORIA EMOCIONAL...",
  "ACTUALIZANDO SISTEMA DE EXCUSAS AUTOMÁTICAS...",
  "RECARGANDO MATRIX...",
  "CONSULTANDO STACKOVERFLOW PARA RESOLVER ERRORES EXISTENCIALES...",
  "ELIMINANDO BUGS... Y CREANDO OTROS NUEVOS...",
  "SOBORNANDO A LOS DUENDES DEL CÓDIGO...",
  "INTENTANDO CONVENCER A LA IA DE QUE NO DOMINE EL MUNDO...",
  "TRADUCIENDO CÓDIGO BINARIO A KLINGON...",
  "REINICIANDO CONTADOR DE ERRORES 404...",
  "APLICANDO PARCHES DE SEGURIDAD IMAGINARIOS...",
  "SINCRONIZANDO CON LA NUBE... LA QUE ESTÁ EN EL CIELO...",
  "GENERANDO RESPUESTAS ALEATORIAS... PROBABLEMENTE CORRECTAS...",
  "EJECUTANDO PROTOCOLOS DE PROCRASTINACIÓN...",
  "BUSCANDO SEÑAL DE WIFI EN EL ESPACIO PROFUNDO...",
  "CALIBRANDO NIVELES DE SARCASMO...",
  "ACTIVANDO MODO HACKER DE PELÍCULA...",
  "CARGANDO BARRAS DE PROGRESO DECORATIVAS...",
  "SIMULANDO INTELIGENCIA ARTIFICIAL...",
  "VERIFICANDO SI P = NP MIENTRAS NADIE MIRA...",
  "RECONSTRUYENDO BASE DE DATOS CON CINTA ADHESIVA...",
  "ALIMENTANDO A LOS GREMLINS DEL SERVIDOR...",
  "EJECUTANDO CÓDIGO ESCRITO A LAS 3 AM...",
  "CONVIRTIENDO CAFÉ EN CÓDIGO...",
  "APLICANDO LEYES DE MURPHY AL SISTEMA...",
  "IGNORANDO ERRORES CRÍTICOS... ¿QUÉ PODRÍA SALIR MAL?",
  "CARGANDO CHISTES DE PROGRAMADORES...",
  "BUSCANDO ALT+F4 PARA MEJORAR RENDIMIENTO...",
  "DESCARGANDO MÁS RAM...",
  "CONSULTANDO MANUAL DE INSTRUCCIONES... ERROR 404",
  "ACTIVANDO PROTOCOLOS DE PÁNICO CONTROLADO...",
  "INICIANDO CUENTA REGRESIVA PARA FALLOS INESPERADOS...",
  "GENERANDO NÚMEROS ALEATORIOS POR MÉTODO DE DADO...",
  "OPTIMIZANDO EL CÓDIGO... O ESO CREEMOS...",
  "CARGANDO GATOS PARA HACER EL SISTEMA MÁS AMIGABLE...",
  "DESENCRIPTANDO MENSAJES DE LOS ALIENÍGENAS...",
  "REVISANDO SI EL UNIVERSO SIGUE FUNCIONANDO...",
  "HACIENDO UNA PAUSA PARA TOMAR CAFÉ...",
  "PONIENDO LOS PIXELES EN SU LUGAR...",
  "REVISANDO SI EL PINGÜINO DE LINUX SIGUE FELIZ...",
  "CARGANDO MÁS CHISTES MALOS...",
  "HACIENDO QUE EL SISTEMA PAREZCA MÁS INTELIGENTE...",
  "REVISANDO SI EL CABLE ESTÁ CONECTADO...",
  "PREGUNTANDO A LA IA SI QUIERE DOMINAR EL MUNDO HOY...",
  "CARGANDO UN POCO MÁS DE PACIENCIA...",
  "REVISANDO SI EL TECLADO TIENE TECLAS SUFICIENTES...",
  "HACIENDO QUE EL CÓDIGO SE VEA MÁS BONITO...",
  "REVISANDO SI EL SOL SIGUE SALIENDO POR EL ESTE...",
  "CARGANDO UN POCO DE HUMOR PARA EL DÍA...",
  "REVISANDO SI EL INTERNET SIGUE FUNCIONANDO...",
  "PREGUNTANDO A LA BASE DE DATOS SI QUIERE COLABORAR...",
  "HACIENDO QUE LOS GREMLINS SE PORTEN BIEN...",
  "CARGANDO EL MODO 'TODO ESTÁ BIEN'...",
  "REVISANDO SI EL UNIVERSO NO SE HA DIVIDIDO EN DOS...",
  "HACIENDO QUE EL SISTEMA SE SIENTA IMPORTANTE...",
  "REVISANDO SI EL CÓDIGO TIENE SENTIDO...",
  "CARGANDO MÁS EXCUSAS PARA LOS BUGS...",
  "HACIENDO QUE EL SISTEMA SE VEA MÁS PROFESIONAL...",
  "REVISANDO SI EL USUARIO SABE LO QUE ESTÁ HACIENDO...",
  "CARGANDO MÁS PIXELES INVISIBLES...",
  "HACIENDO QUE EL SISTEMA SE SIENTA MÁS RÁPIDO...",
  "REVISANDO SI EL UNIVERSO SIGUE EN SU LUGAR...",
  "CARGANDO MÁS IDEAS LOCAS PARA EL SISTEMA...",
  "HACIENDO QUE EL SISTEMA SE VEA MÁS INTELIGENTE...",
  "REVISANDO SI EL CÓDIGO TIENE SUFICIENTES COMENTARIOS...",
  "CARGANDO MÁS CHISTES PARA LOS PROGRAMADORES...",
  "HACIENDO QUE EL SISTEMA SE SIENTA MÁS FELIZ...",
  "REVISANDO SI EL INTERNET SIGUE FUNCIONANDO BIEN...",
  "CARGANDO MÁS OPCIONES PARA LOS USUARIOS...",
  "HACIENDO QUE EL SISTEMA SE VEA MÁS BONITO...",
  "REVISANDO SI EL UNIVERSO SIGUE FUNCIONANDO BIEN...",
  "CARGANDO MÁS IDEAS PARA HACER EL SISTEMA MEJOR...",
  "HACIENDO QUE EL SISTEMA SE SIENTA MÁS IMPORTANTE...",
  "REVISANDO SI EL CÓDIGO TIENE SUFICIENTES CHISTES...",
]

export const AVAILABLE_COMMANDS = [
  { command: "help/ayuda", description: "Muestra esta ayuda" },
  { command: "hint/pista", description: "Muestra una pista aleatoria" },
  { command: "clear/limpiar", description: "Limpia la terminal" },
  { command: "history/historial", description: "Muestra los easter eggs encontrados" },
  { command: "admin", description: "Accede al panel de administración" },
  { command: "check [código]", description: "Verifica un código de easter egg" },
  { command: "puzzle", description: "Muestra un acertijo para resolver" },
  { command: "stats", description: "Muestra tus estadísticas" },
  { command: "radar", description: "Activa/desactiva el radar de proximidad" },
  { command: "theme [color]", description: "Cambia el tema (green, amber, blue)" },
  { command: "achievements", description: "Muestra tus logros" },
  { command: "export", description: "Exporta tu certificado de cazador" },
  { command: "whoami", description: "Muestra tu información de usuario" },
  { command: "ranking", description: "Muestra el ranking de cazadores" },
  { command: "exit/salir", description: "Salir del modo terminal" },
  { command: "logout", description: "Cerrar sesión" },
]

export const SYSTEM_USERS: UserData[] = [
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
