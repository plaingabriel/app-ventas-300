import { Evaluacion, Perito, Propiedad, Propietario, SolicitudVenta, Usuario } from '../types'

export const mockPropietarios: Propietario[] = [
  {
    id: '1',
    nombre: 'Carlos Mendoza',
    telefono: '555-0123',
    email: 'carlos.mendoza@email.com',
    fechaRegistro: '2025-01-15'
  },
  {
    id: '2',
    nombre: 'María González',
    telefono: '555-0456',
    email: 'maria.gonzalez@email.com',
    fechaRegistro: '2025-01-16'
  },
  {
    id: '3',
    nombre: 'Roberto Silva',
    telefono: '555-0789',
    email: 'roberto.silva@email.com',
    fechaRegistro: '2025-01-17'
  }
]

export const mockPropiedades: Propiedad[] = [
  {
    id: '1',
    propietarioId: '1',
    direccion: 'Av. Libertad 123, Col. Centro',
    tipo: 'casa',
    caracteristicas: '3 habitaciones, 2 baños, piscina, jardín amplio',
    fechaRegistro: '2025-01-15'
  },
  {
    id: '2',
    propietarioId: '2',
    direccion: 'Calle Principal 456, Col. San José',
    tipo: 'apartamento',
    caracteristicas: '2 habitaciones, 1 baño, balcón, estacionamiento',
    fechaRegistro: '2025-01-16'
  },
  {
    id: '3',
    propietarioId: '3',
    direccion: 'Carretera Norte Km 5, Zona Industrial',
    tipo: 'terreno',
    caracteristicas: '500 m², uso comercial, frente a carretera',
    fechaRegistro: '2025-01-17'
  }
]

export const mockPeritos: Perito[] = [
  {
    id: '1',
    nombre: 'Ana Torres',
    telefono: '555-1001',
    email: 'ana.torres@ventas300.com',
    especialidad: 'Residencial',
    disponible: true,
    comisionPorcentaje: 10
  },
  {
    id: '2',
    nombre: 'Pedro Ramírez',
    telefono: '555-1002',
    email: 'pedro.ramirez@ventas300.com',
    especialidad: 'Comercial',
    disponible: true,
    comisionPorcentaje: 12
  },
  {
    id: '3',
    nombre: 'Luisa Herrera',
    telefono: '555-1003',
    email: 'luisa.herrera@ventas300.com',
    especialidad: 'Terrenos',
    disponible: false,
    comisionPorcentaje: 15
  }
]

export const mockSolicitudes: SolicitudVenta[] = [
  {
    id: '1',
    numero: 'SOL-2025-01-001',
    propietarioId: '1',
    propiedadId: '1',
    peritoId: '1',
    estado: 'evaluada',
    fechaCreacion: '2025-01-15',
    fechaAsignacion: '2025-01-16',
    fechaEvaluacion: '2025-01-18'
  },
  {
    id: '2',
    numero: 'SOL-2025-01-002',
    propietarioId: '2',
    propiedadId: '2',
    peritoId: '2',
    estado: 'asignada',
    fechaCreacion: '2025-01-16',
    fechaAsignacion: '2025-01-17'
  },
  {
    id: '3',
    numero: 'SOL-2025-01-003',
    propietarioId: '3',
    propiedadId: '3',
    estado: 'pendiente',
    fechaCreacion: '2025-01-17'
  }
]

export const mockEvaluaciones: Evaluacion[] = [
  {
    id: '1',
    solicitudId: '1',
    peritoId: '1',
    observaciones:
      'Casa bien conservada, cocina remodelada recientemente, jardín en excelente estado. Requiere pintura exterior menor.',
    valorEvaluado: 150000,
    comisionCalculada: 15000,
    fotos: ['foto1.jpg', 'foto2.jpg', 'foto3.jpg'],
    fechaEvaluacion: '2025-01-18'
  }
]

export const mockUsuarios: Usuario[] = [
  {
    id: '1',
    nombre: 'Admin Principal',
    email: 'admin@ventas300.com',
    rol: 'admin'
  },
  {
    id: '2',
    nombre: 'Coordinador López',
    email: 'coordinador@ventas300.com',
    rol: 'coordinador'
  },
  {
    id: '3',
    nombre: 'Ana Torres',
    email: 'ana.torres@ventas300.com',
    rol: 'perito'
  },
  {
    id: '4',
    nombre: 'Finanzas Dept.',
    email: 'finanzas@ventas300.com',
    rol: 'finanzas'
  }
]
