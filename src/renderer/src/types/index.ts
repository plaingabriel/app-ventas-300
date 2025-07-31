export interface Propietario {
  id: string
  nombre: string
  telefono: string
  email: string
  fechaRegistro: string
}

export interface Propiedad {
  id: string
  propietarioId: string
  direccion: string
  tipo: 'casa' | 'terreno' | 'apartamento' | 'local' | 'bodega'
  caracteristicas: string
  fechaRegistro: string
}

export interface Perito {
  id: string
  nombre: string
  telefono: string
  email: string
  especialidad: string
  disponible: boolean
  comisionPorcentaje: number
}

export interface SolicitudVenta {
  id: string
  numero: string
  propietarioId: string
  propiedadId: string
  peritoId?: string
  estado: 'pendiente' | 'asignada' | 'evaluada' | 'completada'
  fechaCreacion: string
  fechaAsignacion?: string
  fechaEvaluacion?: string
}

export interface Evaluacion {
  id: string
  solicitudId: string
  peritoId: string
  observaciones: string
  valorEvaluado: number
  comisionCalculada: number
  fotos: string[]
  fechaEvaluacion: string
}

export interface Usuario {
  id: number
  nombre: string
  rol: 'admin' | 'coordinador' | 'perito' | 'finanzas'
}

export type EstadisticaDashboard = {
  totalSolicitudes: number
  solicitudesPendientes: number
  solicitudesAsignadas: number
  solicitudesEvaluadas: number
  totalComisiones: number
  valorTotalEvaluaciones: number
}
