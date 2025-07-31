import { useEffect, useState } from 'react'
import { Perito, Usuario } from 'src/lib/definitions'
import { AsignacionesSection } from './components/AsignacionesSection'
import { Dashboard } from './components/Dashboard'
import { EvaluacionesSection } from './components/EvaluacionesSection'
import { Layout } from './components/Layout'
import { LoginForm } from './components/LoginForm'
import { PropietariosSection } from './components/PropietariosSection'
import { SolicitudesSection } from './components/SolicitudesSection'

function App() {
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
        return <Dashboard />

      case 'propietarios':
        return <PropietariosSection />

      case 'solicitudes':
        return <SolicitudesSection />

      case 'asignaciones':
        return <AsignacionesSection />

      case 'evaluaciones':
      case 'mis-evaluaciones':
        return <EvaluacionesSection usuarioActual={usuarioActual} />

      default:
        return <Dashboard />
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
