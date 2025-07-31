import { AlertCircle, FileText, MapPin, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Solicitud, SolicitudSolicitantePropiedadPerito } from 'src/lib/definitions'

export function SolicitudesSection() {
  const [solicitudes, setSolicitudes] = useState<SolicitudSolicitantePropiedadPerito[]>([])

  const getSolicitudes = async () => {
    const result = (await window.electron.ipcRenderer.invoke(
      'get-solicitudes'
    )) as SolicitudSolicitantePropiedadPerito[]

    // Sort by date
    const solicitudesOrdenadas = result.sort(
      (a, b) => new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime()
    )

    setSolicitudes(solicitudesOrdenadas)
  }

  const getEstadoColor = (estado: Solicitud['Estado']) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-orange-100 text-orange-800'
      case 'Asignada':
        return 'bg-blue-100 text-blue-800'
      case 'Evaluada':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    getSolicitudes()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Solicitudes de Venta</h1>
        <p className="text-gray-600 mt-1">Todas las solicitudes registradas en el sistema</p>
      </div>

      {/* Lista de solicitudes */}
      <div className="space-y-4">
        {solicitudes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes</h3>
            <p className="text-gray-600">
              Las solicitudes aparecerán aquí una vez que se registren propietarios y propiedades.
            </p>
          </div>
        ) : (
          solicitudes.map((solicitud, index) => {
            const { Propietario, Propiedad, Perito } = solicitud

            return (
              <div
                key={solicitud.ID}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
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

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getEstadoColor(solicitud.Estado)}`}
                  >
                    {solicitud.Estado}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                  {/* Perito */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Perito Asignado</span>
                    </h4>
                    {Perito ? (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900">{Perito.Nombre}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-orange-600">Sin asignar</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
