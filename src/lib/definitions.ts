export interface Solicitante {
  ID: number
  Nombre: string
  Contacto: string
}

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
}

export interface Perito {
  ID: number
  Nombre: string
  Especialidad: string
}

export interface OrdenTrabajo {
  ID: number
  ID_Solicitud: number
  ID_Perito: number
  Fecha_Evaluacion: Date
  Observaciones: string
  Precio_Fijado: number
  Comision: number
}
