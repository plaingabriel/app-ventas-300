import { AlertCircle, Clock, MapPin, User, UserCheck } from 'lucide-react'
import { useState } from 'react'
import { Perito, Propiedad, Propietario, SolicitudVenta } from '../types'

interface AsignacionesSectionProps {
  solicitudes: SolicitudVenta[]
  propietarios: Propietario[]
  propiedades: Propiedad[]
  peritos: Perito[]
  onAsignarPerito: (solicitudId: string, peritoId: string) => void
}

export function AsignacionesSection({
  solicitudes,
  propietarios,
  propiedades,
  peritos,
  onAsignarPerito
}: AsignacionesSectionProps) {
  const [asignacionActiva, setAsignacionActiva] = useState<string | null>(null)

  const getPropietario = (id: string) => propietarios.find((p) => p.id === id)
  const getPropiedad = (id: string) => propiedades.find((p) => p.id === id)

  const solicitudesPendientes = solicitudes.filter((s) => s.estado === 'pendiente')
  const peritosDisponibles = peritos.filter((p) => p.disponible)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  const handleAsignar = (solicitudId: string, peritoId: string) => {
    onAsignarPerito(solicitudId, peritoId)
    setAsignacionActiva(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Centro de Asignaciones</h1>
        <p className="text-gray-600 mt-1">Asignar peritos a solicitudes pendientes de evaluación</p>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{solicitudesPendientes.length}</p>
              <p className="text-sm text-gray-600">Solicitudes Pendientes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{peritosDisponibles.length}</p>
              <p className="text-sm text-gray-600">Peritos Disponibles</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{peritos.length}</p>
              <p className="text-sm text-gray-600">Total Peritos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de solicitudes pendientes */}
      {solicitudesPendientes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes pendientes</h3>
          <p className="text-gray-600">
            Todas las solicitudes han sido asignadas o no existen solicitudes nuevas.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Solicitudes Pendientes de Asignación
          </h2>

          {solicitudesPendientes.map((solicitud) => {
            const propietario = getPropietario(solicitud.propietarioId)
            const propiedad = getPropiedad(solicitud.propiedadId)

            return (
              <div
                key={solicitud.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{solicitud.numero}</h3>
                        <p className="text-sm text-gray-600">
                          Creada el {formatDate(solicitud.fechaCreacion)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setAsignacionActiva(asignacionActiva === solicitud.id ? null : solicitud.id)
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <UserCheck className="h-4 w-4" />
                      <span>Asignar Perito</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Propietario */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Propietario</span>
                      </h4>
                      {propietario && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-medium text-gray-900">{propietario.nombre}</p>
                          <p>{propietario.telefono}</p>
                          <p>{propietario.email}</p>
                        </div>
                      )}
                    </div>

                    {/* Propiedad */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Propiedad</span>
                      </h4>
                      {propiedad && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-medium text-gray-900 capitalize">{propiedad.tipo}</p>
                          <p>{propiedad.direccion}</p>
                          <p className="text-xs">{propiedad.caracteristicas}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Panel de asignación */}
                {asignacionActiva === solicitud.id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Seleccionar Perito</h4>

                    {peritosDisponibles.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No hay peritos disponibles en este momento</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {peritosDisponibles.map((perito) => (
                          <div
                            key={perito.id}
                            className="bg-white rounded-lg border border-gray-200 p-4"
                          >
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{perito.nombre}</h5>
                                <p className="text-sm text-gray-600">{perito.especialidad}</p>
                              </div>
                            </div>

                            <div className="text-sm text-gray-600 space-y-1 mb-4">
                              <p>{perito.telefono}</p>
                              <p>{perito.email}</p>
                              <p className="font-medium">Comisión: {perito.comisionPorcentaje}%</p>
                            </div>

                            <button
                              onClick={() => handleAsignar(solicitud.id, perito.id)}
                              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              Asignar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() => setAsignacionActiva(null)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
