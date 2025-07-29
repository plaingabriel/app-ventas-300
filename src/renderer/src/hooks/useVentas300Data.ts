import {
  mockEvaluaciones,
  mockPeritos,
  mockPropiedades,
  mockPropietarios,
  mockSolicitudes,
  mockUsuarios
} from '../data/mockData'
import {
  EstadisticaDashboard,
  Evaluacion,
  Perito,
  Propiedad,
  Propietario,
  SolicitudVenta,
  Usuario
} from '../types'
import { useLocalStorage } from './useLocalStorage'

export function useVentas300Data() {
  const [propietarios, setPropietarios] = useLocalStorage<Propietario[]>(
    'ventas300_propietarios',
    mockPropietarios
  )
  const [propiedades, setPropiedades] = useLocalStorage<Propiedad[]>(
    'ventas300_propiedades',
    mockPropiedades
  )
  const [peritos, setPeritos] = useLocalStorage<Perito[]>('ventas300_peritos', mockPeritos)
  const [solicitudes, setSolicitudes] = useLocalStorage<SolicitudVenta[]>(
    'ventas300_solicitudes',
    mockSolicitudes
  )
  const [evaluaciones, setEvaluaciones] = useLocalStorage<Evaluacion[]>(
    'ventas300_evaluaciones',
    mockEvaluaciones
  )
  const [usuarios] = useLocalStorage<Usuario[]>('ventas300_usuarios', mockUsuarios)

  const [usuarioActual, setUsuarioActual] = useLocalStorage<Usuario | null>(
    'ventas300_usuario_actual',
    usuarios[0]
  )

  // Funciones CRUD para Propietarios
  const agregarPropietario = (propietario: Omit<Propietario, 'id'>) => {
    const nuevo = {
      ...propietario,
      id: Date.now().toString()
    }
    setPropietarios([...propietarios, nuevo])
    return nuevo
  }

  // Funciones CRUD para Propiedades
  const agregarPropiedad = (propiedad: Omit<Propiedad, 'id'>) => {
    const nueva = {
      ...propiedad,
      id: Date.now().toString()
    }
    setPropiedades([...propiedades, nueva])
    return nueva
  }

  // Funciones CRUD para Solicitudes
  const crearSolicitud = (propietarioId: string, propiedadId: string) => {
    const numeroSolicitud = generateSolicitudNumber()
    const nueva: SolicitudVenta = {
      id: Date.now().toString(),
      numero: numeroSolicitud,
      propietarioId,
      propiedadId,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString().split('T')[0]
    }
    setSolicitudes([...solicitudes, nueva])
    return nueva
  }

  const asignarPerito = (solicitudId: string, peritoId: string) => {
    setSolicitudes((prev) =>
      prev.map((sol) =>
        sol.id === solicitudId
          ? {
              ...sol,
              peritoId,
              estado: 'asignada' as const,
              fechaAsignacion: new Date().toISOString().split('T')[0]
            }
          : sol
      )
    )
  }

  const crearEvaluacion = (
    evaluacionData: Omit<Evaluacion, 'id' | 'comisionCalculada' | 'fechaEvaluacion'>
  ) => {
    const perito = peritos.find((p) => p.id === evaluacionData.peritoId)
    const comisionCalculada = perito
      ? (evaluacionData.valorEvaluado * perito.comisionPorcentaje) / 100
      : 0

    const nuevaEvaluacion: Evaluacion = {
      ...evaluacionData,
      id: Date.now().toString(),
      comisionCalculada,
      fechaEvaluacion: new Date().toISOString().split('T')[0]
    }

    setEvaluaciones([...evaluaciones, nuevaEvaluacion])

    // Actualizar estado de solicitud
    setSolicitudes((prev) =>
      prev.map((sol) =>
        sol.id === evaluacionData.solicitudId
          ? {
              ...sol,
              estado: 'evaluada' as const,
              fechaEvaluacion: nuevaEvaluacion.fechaEvaluacion
            }
          : sol
      )
    )

    return nuevaEvaluacion
  }

  // Función para generar número de solicitud
  const generateSolicitudNumber = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const count =
      solicitudes.filter((s) => s.fechaCreacion.startsWith(`${year}-${month}`)).length + 1
    return `SOL-${year}-${month}-${String(count).padStart(3, '0')}`
  }

  // Calcular estadísticas del dashboard
  const getEstadisticasDashboard = (): EstadisticaDashboard => {
    const totalComisiones = evaluaciones.reduce(
      (sum, evaluacion) => sum + evaluacion.comisionCalculada,
      0
    )
    const valorTotalEvaluaciones = evaluaciones.reduce(
      (sum, evaluacion) => sum + evaluacion.valorEvaluado,
      0
    )

    return {
      totalSolicitudes: solicitudes.length,
      solicitudesPendientes: solicitudes.filter((s) => s.estado === 'pendiente').length,
      solicitudesAsignadas: solicitudes.filter((s) => s.estado === 'asignada').length,
      solicitudesEvaluadas: solicitudes.filter((s) => s.estado === 'evaluada').length,
      totalComisiones,
      valorTotalEvaluaciones
    }
  }

  // Obtener datos relacionados
  const getSolicitudCompleta = (solicitudId: string) => {
    const solicitud = solicitudes.find((s) => s.id === solicitudId)
    if (!solicitud) return null

    const propietario = propietarios.find((p) => p.id === solicitud.propietarioId)
    const propiedad = propiedades.find((p) => p.id === solicitud.propiedadId)
    const perito = solicitud.peritoId ? peritos.find((p) => p.id === solicitud.peritoId) : null
    const evaluacion = evaluaciones.find((e) => e.solicitudId === solicitud.id)

    return {
      solicitud,
      propietario,
      propiedad,
      perito,
      evaluacion
    }
  }

  return {
    // Data
    propietarios,
    propiedades,
    peritos,
    solicitudes,
    evaluaciones,
    usuarios,
    usuarioActual,

    // Actions
    agregarPropietario,
    agregarPropiedad,
    crearSolicitud,
    asignarPerito,
    crearEvaluacion,
    setUsuarioActual,

    // Computed
    getEstadisticasDashboard,
    getSolicitudCompleta
  }
}
