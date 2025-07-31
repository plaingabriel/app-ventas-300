export interface Solicitante {
  ID: number
  Nombre: string
  Contacto: string
}

export type NewSolicitante = Omit<Solicitante, 'ID'>

export interface Propiedad {
  ID: number
  Tipo: 'Casa' | 'Terreno' | 'Departamento' | 'Otro'
  Direccion: string
  Caracteristicas: string
}

export type NewPropiedad = Omit<Propiedad, 'ID'>

export type SolicitantePropiedades = Solicitante & { propiedades: Propiedad[] }

export interface Solicitud {
  ID: number
  Fecha: Date
  ID_Solicitante: number
  ID_Propiedad: number
  ID_Perito?: number
  Estado: 'Pendiente' | 'Asignada' | 'Evaluada'
  Observaciones?: string
  Precio_Fijado: number
  Comision: number
}

export type SolicitudSolicitantePropiedadPerito = Solicitud & {
  Propietario: Solicitante
  Propiedad: Propiedad
  Perito?: Perito
}

export type NewSolicitud = Pick<Solicitud, 'ID_Solicitante' | 'ID_Propiedad'>

export interface Perito {
  ID: number
  Nombre: string
}
