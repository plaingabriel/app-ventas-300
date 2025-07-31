import { Calendar, Mail, Phone, Plus, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { NewPropiedad, Propiedad, SolicitantePropiedades } from 'src/lib/definitions'
import { Propietario } from '../types'

interface PropietariosSectionProps {
  propietarios: Propietario[]
  propiedades: Propiedad[]
  onAgregarPropietario: (propietario: Omit<Propietario, 'id'>) => void
  onAgregarPropiedad: (propiedad: Omit<Propiedad, 'id'>) => void
  onCrearSolicitud: (propietarioId: string, propiedadId: string) => void
}

export function PropietariosSection({
  propietarios,
  propiedades,
  onAgregarPropietario,
  onAgregarPropiedad,
  onCrearSolicitud
}: PropietariosSectionProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mostrarFormPropiedad, setMostrarFormPropiedad] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: ''
  })
  const [propiedadData, setPropiedadData] = useState<NewPropiedad>({
    Direccion: '',
    Tipo: 'Casa',
    Caracteristicas: ''
  })
  const [solicitantes, setSolicitantes] = useState<SolicitantePropiedades[]>([])

  const handleSubmitPropietario = (e: React.FormEvent) => {
    e.preventDefault()
    onAgregarPropietario({
      ...formData,
      fechaRegistro: new Date().toISOString().split('T')[0]
    })
    setFormData({ nombre: '', telefono: '', email: '' })
    setMostrarFormulario(false)
  }

  const handleSubmitPropiedad = async (e: React.FormEvent, propietarioId: number) => {
    e.preventDefault()
    await window.electron.ipcRenderer.invoke('create-propiedad', propiedadData, propietarioId)
    await getPropietarios()

    setPropiedadData({ Direccion: '', Tipo: 'Casa', Caracteristicas: '' })
    setMostrarFormPropiedad(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  const getPropietarios = async () => {
    const response = (await window.electron.ipcRenderer.invoke(
      'get-solicitantes'
    )) as SolicitantePropiedades[]

    setSolicitantes(response)
  }

  useEffect(() => {
    getPropietarios()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Propietarios</h1>
          <p className="text-gray-600 mt-1">
            Registro y administración de propietarios y sus propiedades
          </p>
        </div>

        <button
          onClick={() => setMostrarFormulario(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nuevo Propietario</span>
        </button>
      </div>

      {/* Formulario nuevo propietario */}
      {mostrarFormulario && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Registrar Nuevo Propietario</h2>

          <form
            onSubmit={handleSubmitPropietario}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-3 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Registrar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de propietarios */}
      <div className="space-y-4">
        {solicitantes.map((propietario) => {
          const { propiedades } = propietario
          return (
            <div
              key={propietario.ID}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Header del propietario */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{propietario.Nombre}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{propietario.Contacto}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setMostrarFormPropiedad(propietario.ID)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Agregar Propiedad</span>
                  </button>
                </div>
              </div>

              {/* Formulario nueva propiedad */}
              {mostrarFormPropiedad === propietario.ID && (
                <div className="p-6 bg-gray-50 border-b border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Nueva Propiedad</h4>

                  <form
                    onSubmit={(e) => handleSubmitPropiedad(e, propietario.ID)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección
                        </label>
                        <input
                          type="text"
                          value={propiedadData.Direccion}
                          onChange={(e) =>
                            setPropiedadData({ ...propiedadData, Direccion: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Propiedad
                        </label>
                        <select
                          value={propiedadData.Tipo}
                          onChange={(e) =>
                            setPropiedadData({
                              ...propiedadData,
                              Tipo: e.target.value as Propiedad['Tipo']
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Casa">Casa</option>
                          <option value="Departamento">Departamento</option>
                          <option value="Terreno">Terreno</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Características
                      </label>
                      <textarea
                        value={propiedadData.Caracteristicas}
                        onChange={(e) =>
                          setPropiedadData({ ...propiedadData, Caracteristicas: e.target.value })
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describa las características principales de la propiedad..."
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setMostrarFormPropiedad(null)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Agregar Propiedad
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Lista de propiedades */}
              {propiedades.length > 0 && (
                <div className="p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Propiedades ({propiedades.length})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {propiedades.map((propiedad) => (
                      <div key={propiedad.ID} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-medium text-gray-900 capitalize">
                              {propiedad.Tipo.replace('_', ' ')}
                            </h5>
                            <p className="text-sm text-gray-600">{propiedad.Direccion}</p>
                          </div>
                          {/* <button
                            onClick={() => onCrearSolicitud(propietario.id, propiedad.id)}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                          >
                            Crear Solicitud
                          </button> */}
                        </div>

                        <p className="text-sm text-gray-700 mb-2">{propiedad.Caracteristicas}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {propiedades.length === 0 && mostrarFormPropiedad !== propietario.ID && (
                <div className="p-6 text-center text-gray-500">
                  <p>No hay propiedades registradas para este propietario</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
