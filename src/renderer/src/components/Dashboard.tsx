import { CheckCircle, Clock, DollarSign, FileText, TrendingUp, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EstadisticaDashboard } from '../types'

export function Dashboard() {
  const [totalComisiones, setTotalComisiones] = useState(0)
  const [promedioEvaluaciones, setPromedioEvaluaciones] = useState(0)
  const [totalEvaluaciones, setTotalEvaluaciones] = useState(0)
  const [totalAsignaciones, setTotalAsignaciones] = useState(0)
  const [totalPendientes, setTotalPendientes] = useState(0)
  const [totalSolicitudes, setTotalSolicitudes] = useState(0)

  const getTotales = async () => {
    const comisiones = (await window.electron.ipcRenderer.invoke('get-total-comision')) as number
    const promedio = (await window.electron.ipcRenderer.invoke('get-average-price')) as number
    const evaluaciones = (await window.electron.ipcRenderer.invoke(
      'get-total-solicitudes-evaluadas'
    )) as number
    const asignaciones = (await window.electron.ipcRenderer.invoke(
      'get-total-solicitudes-asignadas'
    )) as number
    const pendientes = (await window.electron.ipcRenderer.invoke(
      'get-total-solicitudes-pendientes'
    )) as number
    const solicitudes = (await window.electron.ipcRenderer.invoke(
      'get-total-solicitudes'
    )) as number

    setTotalComisiones(comisiones)
    setPromedioEvaluaciones(promedio)
    setTotalEvaluaciones(evaluaciones)
    setTotalAsignaciones(asignaciones)
    setTotalPendientes(pendientes)
    setTotalSolicitudes(solicitudes)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const cards = [
    {
      title: 'Total Solicitudes',
      value: totalSolicitudes,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Pendientes',
      value: totalPendientes,
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Asignadas',
      value: totalAsignaciones,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Evaluadas',
      value: totalEvaluaciones,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    }
  ]

  const financialCards = [
    {
      title: 'Total Comisiones',
      value: formatCurrency(totalComisiones),
      icon: DollarSign,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Promedio Evaluaciones',
      value: formatCurrency(promedioEvaluaciones),
      icon: TrendingUp,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    }
  ]

  useEffect(() => {
    getTotales()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Principal</h1>
        <p className="text-gray-600 mt-2">Resumen general del sistema VENTAS300</p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div
                  className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Estadísticas financieras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {financialCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div
                  className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}
                >
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Estado del flujo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Flujo de Trabajo</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">1. Registro</h3>
            <p className="text-sm text-gray-500 mt-1">Propietarios y propiedades</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-medium text-gray-900">2. Solicitud</h3>
            <p className="text-sm text-gray-500 mt-1">Creación de solicitudes</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900">3. Asignación</h3>
            <p className="text-sm text-gray-500 mt-1">Asignar a perito</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">4. Evaluación</h3>
            <p className="text-sm text-gray-500 mt-1">Valoración y comisión</p>
          </div>
        </div>
      </div>
    </div>
  )
}
