import { useEffect, useState } from 'react'
import { Perito, Usuario } from 'src/lib/definitions'
import { AsignacionesSection } from './components/AsignacionesSection'
import { Dashboard } from './components/Dashboard'
import { EvaluacionesSection } from './components/EvaluacionesSection'
import { Layout } from './components/Layout'
import { LoginForm } from './components/LoginForm'
import { PropietariosSection } from './components/PropietariosSection'
import { SolicitudesSection } from './components/SolicitudesSection'
import { useVentas300Data } from './hooks/useVentas300Data'

function App() {
  const {
    evaluaciones,

    // Computed
    getEstadisticasDashboard
  } = useVentas300Data()

  const [seccionActual, setSeccionActual] = useState('dashboard')
  const [peritos, setPeritos] = useState<Perito[]>([])
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null)

  const getPeritos = async () => {
    const result = (await window.electron.ipcRenderer.invoke('get-peritos')) as Perito[]
    setPeritos(result)
  }

  useEffect(() => {
    getPeritos()
  }, [])

  if (!usuarioActual) {
    return <LoginForm peritos={peritos} onLogin={setUsuarioActual} />
  }

  const handleLogout = () => {
    setUsuarioActual(null)
    setSeccionActual('dashboard')
  }

  const renderSeccion = () => {
    switch (seccionActual) {
      case 'dashboard':
        return <Dashboard estadisticas={getEstadisticasDashboard()} />

      case 'propietarios':
        return <PropietariosSection />

      case 'solicitudes':
        return <SolicitudesSection />

      case 'asignaciones':
        return <AsignacionesSection />

      case 'evaluaciones':
      case 'mis-evaluaciones':
        return <EvaluacionesSection usuarioActual={usuarioActual} />

      case 'reportes':
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reportes Financieros</h2>
            <p className="text-gray-600 mb-6">
              Panel de reportes y análisis financiero del sistema.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Total de Comisiones</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${evaluaciones.reduce((sum, e) => sum + e.comisionCalculada, 0).toLocaleString()}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Valor Total Evaluado</h3>
                <p className="text-2xl font-bold text-blue-600">
                  ${evaluaciones.reduce((sum, e) => sum + e.valorEvaluado, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return <Dashboard estadisticas={getEstadisticasDashboard()} />
    }
  }

  return (
    <Layout
      usuarioActual={usuarioActual}
      onCambiarSeccion={setSeccionActual}
      seccionActual={seccionActual}
      onLogout={handleLogout}
    >
      {renderSeccion()}
    </Layout>
  )
}

export default App
