import { AlertCircle, Calculator, Camera, DollarSign, FileText, MapPin } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { SolicitudSolicitantePropiedadPerito, Usuario } from 'src/lib/definitions'

export function EvaluacionesSection({ usuarioActual }: { usuarioActual: Usuario }) {
  const [solicitudes, setSolicitudes] = useState<SolicitudSolicitantePropiedadPerito[]>([])
  const [asignadas, setAsignadas] = useState<SolicitudSolicitantePropiedadPerito[]>([])
  const [evaluaciones, setEvaluaciones] = useState<SolicitudSolicitantePropiedadPerito[]>([])
  const [evaluacionActiva, setEvaluacionActiva] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    observaciones: '',
    valorEvaluado: ''
  })

  const getSolicitudes = async () => {
    const result = (await window.electron.ipcRenderer.invoke(
      'get-solicitudes-by-perito',
      usuarioActual.id
    )) as SolicitudSolicitantePropiedadPerito[]

    setSolicitudes(result)
    setAsignadas(result.filter((s) => s.Estado === 'Asignada'))
    setEvaluaciones(result.filter((s) => s.Estado === 'Evaluada'))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const calcularComision = (valor: number) => {
    return (valor * 10) / 100
  }

  const handleSubmitEvaluacion = async (e: React.FormEvent, solicitudId: number) => {
    e.preventDefault()

    await window.electron.ipcRenderer.invoke('create-evaluacion', {
      solicitudId,
      observaciones: formData.observaciones,
      valorEvaluado: Number(formData.valorEvaluado),
      comisionCalculada: calcularComision(Number(formData.valorEvaluado))
    })
    await getSolicitudes()

    setFormData({ observaciones: '', valorEvaluado: '' })
    setEvaluacionActiva(null)
  }

  useEffect(() => {
    getSolicitudes()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {usuarioActual.rol === 'perito' ? 'Mis Evaluaciones' : 'Gestión de Evaluaciones'}
        </h1>
        <p className="text-gray-600 mt-1">
          {usuarioActual.rol === 'perito'
            ? 'Propiedades asignadas para evaluación'
            : 'Todas las evaluaciones del sistema'}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calculator className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{solicitudes.length}</p>
              <p className="text-sm text-gray-600">Total Asignadas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{asignadas.length}</p>
              <p className="text-sm text-gray-600">Por Evaluar</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{evaluaciones.length}</p>
              <p className="text-sm text-gray-600">Evaluadas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(evaluaciones.reduce((sum, e) => sum + e.Comision, 0))}
              </p>
              <p className="text-sm text-gray-600">Comisiones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de solicitudes */}
      {solicitudes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay evaluaciones asignadas</h3>
          <p className="text-gray-600">
            {usuarioActual.rol === 'perito'
              ? 'No tienes propiedades asignadas para evaluar en este momento.'
              : 'No hay solicitudes asignadas para evaluación.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((solicitud, index) => {
            const { Estado, Propietario, Perito, Propiedad } = solicitud
            const puedeEvaluar = solicitud.Estado === 'Asignada'

            return (
              <div
                key={solicitud.ID}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 ${
                          Estado === 'Evaluada' ? 'bg-green-100' : 'bg-orange-100'
                        } rounded-lg flex items-center justify-center`}
                      >
                        <Calculator
                          className={`h-6 w-6 ${
                            Estado === 'Evaluada' ? 'text-green-600' : 'text-orange-600'
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          SOL-{solicitud.Fecha.toLocaleDateString('es-ES')}-{index + 1}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          Estado === 'Evaluada'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {Estado === 'Evaluada' ? 'Evaluada' : 'Pendiente'}
                      </span>

                      {puedeEvaluar && (
                        <button
                          onClick={() =>
                            setEvaluacionActiva(
                              evaluacionActiva === solicitud.ID ? null : solicitud.ID
                            )
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Calculator className="h-4 w-4" />
                          <span>Evaluar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Propietario */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Propietario</h4>
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
                      </div>
                    </div>

                    {/* Perito */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Perito Asignado</h4>
                      {Perito && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-medium text-gray-900">{Perito.Nombre}</p>
                          <p>Comisión: 10%</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Evaluación existente */}
                  {Estado === 'Evaluada' && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-3 flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Evaluación Completada</span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-green-900">Valor Evaluado</p>
                          <p className="text-lg font-bold text-green-700">
                            {formatCurrency(solicitud.Precio_Fijado)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-900">Comisión Calculada</p>
                          <p className="text-lg font-bold text-green-700">
                            {formatCurrency(solicitud.Precio_Fijado)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm font-medium text-green-900 mb-1">Observaciones</p>
                        <p className="text-sm text-green-800">{solicitud.Observaciones}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Formulario de evaluación */}
                {evaluacionActiva === solicitud.ID && puedeEvaluar && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                      <Calculator className="h-5 w-5" />
                      <span>Nueva Evaluación</span>
                    </h4>

                    <form
                      onSubmit={(e) => handleSubmitEvaluacion(e, solicitud.ID)}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observaciones
                        </label>
                        <textarea
                          value={formData.observaciones}
                          onChange={(e) =>
                            setFormData({ ...formData, observaciones: e.target.value })
                          }
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Descripción detallada del estado de la propiedad..."
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Valor Evaluado (USD)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.valorEvaluado}
                            onChange={(e) =>
                              setFormData({ ...formData, valorEvaluado: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="150000"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comisión Estimada
                          </label>
                          <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                            {formData.valorEvaluado && Perito
                              ? formatCurrency(calcularComision(parseFloat(formData.valorEvaluado)))
                              : '$0.00'}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setEvaluacionActiva(null)}
                          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Completar Evaluación
                        </button>
                      </div>
                    </form>
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
