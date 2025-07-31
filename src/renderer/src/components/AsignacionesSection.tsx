import { AlertCircle, Clock, MapPin, User, UserCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Perito, SolicitudSolicitantePropiedadPerito } from 'src/lib/definitions'

export function AsignacionesSection() {
  const [solicitudes, setSolicitudes] = useState<SolicitudSolicitantePropiedadPerito[]>([])
  const [peritos, setPeritos] = useState<Perito[]>([])
  const [asignacionActiva, setAsignacionActiva] = useState<number | null>(null)

  const handleAsignar = async (solicitudId: number, peritoId: number) => {
    await window.electron.ipcRenderer.invoke('asignar-perito', solicitudId, peritoId)
    setAsignacionActiva(null)
    getSolicitudes()
  }

  const getSolicitudes = async () => {
    const result = (await window.electron.ipcRenderer.invoke(
      'get-solicitudes'
    )) as SolicitudSolicitantePropiedadPerito[]

    // Sort by date
    const solicitudesOrdenadas = result.sort(
      (a, b) => new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime()
    )

    // Filtrar solicitudes pendientes
    const solicitudesPendientes = solicitudesOrdenadas.filter((s) => s.Estado === 'Pendiente')

    setSolicitudes(solicitudesPendientes)
  }

  const getPeritos = async () => {
    const result = (await window.electron.ipcRenderer.invoke('get-peritos')) as Perito[]
    setPeritos(result)
  }

  useEffect(() => {
    getSolicitudes()
    getPeritos()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Centro de Asignaciones</h1>
        <p className="text-gray-600 mt-1">Asignar peritos a solicitudes pendientes de evaluación</p>
      </div>

      {/* Lista de solicitudes pendientes */}
      {solicitudes.length === 0 ? (
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

          {solicitudes.map((solicitud, index) => {
            const { Propietario, Propiedad } = solicitud

            return (
              <div
                key={solicitud.ID}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          SOL-{solicitud.Fecha.toLocaleDateString('es-ES')}-{index + 1}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Creada el {solicitud.Fecha.toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setAsignacionActiva(asignacionActiva === solicitud.ID ? null : solicitud.ID)
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
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900">{Propietario.Nombre}</p>
                        <p>{Propietario.Contacto}</p>
                      </div>
                    </div>

                    {/* Propiedad */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Propiedad</span>
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900 capitalize">{Propiedad.Tipo}</p>
                        <p>{Propiedad.Direccion}</p>
                        <p className="text-xs">{Propiedad.Caracteristicas}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel de asignación */}
                {asignacionActiva === solicitud.ID && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Seleccionar Perito</h4>

                    {peritos.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No hay peritos disponibles en este momento</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {peritos.map((perito) => (
                          <div
                            key={perito.ID}
                            className="bg-white rounded-lg border border-gray-200 p-4"
                          >
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{perito.Nombre}</h5>
                              </div>
                            </div>

                            <button
                              onClick={() => handleAsignar(solicitud.ID, perito.ID)}
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
