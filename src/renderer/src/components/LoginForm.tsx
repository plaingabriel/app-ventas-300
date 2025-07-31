import { Building2, LogIn } from 'lucide-react'
import React, { useState } from 'react'
import { Perito, Usuario } from 'src/lib/definitions'

interface LoginFormProps {
  peritos: Perito[]
  onLogin: React.Dispatch<React.SetStateAction<Usuario | null>>
}

const usuarioAdmin: Usuario = {
  id: 0,
  nombre: 'Admin Principal',
  rol: 'admin'
}

export function LoginForm({ peritos, onLogin }: LoginFormProps) {
  const [id, setID] = useState(0)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (id === 0) {
      onLogin(usuarioAdmin)
      return
    }

    const perito = peritos.find((p) => p.ID === id)

    if (perito) {
      onLogin({
        id: perito.ID,
        nombre: perito.Nombre,
        rol: 'perito'
      })
    } else {
      setError('El perito no existe')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">VENTAS300</h1>
            <p className="text-gray-600 mt-2">Sistema de Gestión Inmobiliaria</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <select
                value={id}
                onChange={(e) => {
                  setID(parseInt(e.target.value))
                  setError('')
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value={usuarioAdmin.id}>
                  {usuarioAdmin.nombre} - ({usuarioAdmin.rol})
                </option>

                {peritos.map((perito) => (
                  <option key={perito.ID} value={perito.ID}>
                    {perito.Nombre} - Perito
                  </option>
                ))}
              </select>
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
            >
              <LogIn className="h-5 w-5" />
              <span>Iniciar Sesión</span>
            </button>
          </form>

          {/* Demo info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Usuarios de Prueba:</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>
                • <strong>Admin:</strong> Acceso completo al sistema
              </li>
              <li>
                • <strong>Perito:</strong> Evaluaciones de propiedades
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
