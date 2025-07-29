import React, { useState } from 'react';
import { Calculator, MapPin, DollarSign, FileText, Camera, AlertCircle } from 'lucide-react';
import { SolicitudVenta, Propietario, Propiedad, Perito, Evaluacion, Usuario } from '../types';

interface EvaluacionesSectionProps {
  solicitudes: SolicitudVenta[];
  propietarios: Propietario[];
  propiedades: Propiedad[];
  peritos: Perito[];
  evaluaciones: Evaluacion[];
  usuarioActual: Usuario;
  onCrearEvaluacion: (evaluacion: Omit<Evaluacion, 'id' | 'comisionCalculada' | 'fechaEvaluacion'>) => void;
}

export function EvaluacionesSection({ 
  solicitudes, 
  propietarios, 
  propiedades, 
  peritos,
  evaluaciones,
  usuarioActual,
  onCrearEvaluacion
}: EvaluacionesSectionProps) {
  const [evaluacionActiva, setEvaluacionActiva] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    observaciones: '',
    valorEvaluado: '',
    fotos: [] as string[]
  });

  const getPropietario = (id: string) => propietarios.find(p => p.id === id);
  const getPropiedad = (id: string) => propiedades.find(p => p.id === id);
  const getPerito = (id: string) => peritos.find(p => p.id === id);
  const getEvaluacion = (solicitudId: string) => evaluaciones.find(e => e.solicitudId === solicitudId);

  // Filtrar solicitudes según el rol del usuario
  const getSolicitudesRelevantes = () => {
    if (usuarioActual.rol === 'perito') {
      // Para peritos: solo sus solicitudes asignadas
      const peritoData = peritos.find(p => p.email === usuarioActual.email);
      if (peritoData) {
        return solicitudes.filter(s => s.peritoId === peritoData.id);
      }
      return [];
    } else {
      // Para admin y coordinador: todas las solicitudes asignadas
      return solicitudes.filter(s => s.estado === 'asignada' || s.estado === 'evaluada');
    }
  };

  const solicitudesRelevantes = getSolicitudesRelevantes();
  const solicitudesPorEvaluar = solicitudesRelevantes.filter(s => s.estado === 'asignada');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calcularComision = (valor: number, peritoId: string) => {
    const perito = getPerito(peritoId);
    return perito ? (valor * perito.comisionPorcentaje) / 100 : 0;
  };

  const handleSubmitEvaluacion = (e: React.FormEvent, solicitudId: string) => {
    e.preventDefault();
    
    const solicitud = solicitudes.find(s => s.id === solicitudId);
    if (!solicitud?.peritoId) return;

    onCrearEvaluacion({
      solicitudId,
      peritoId: solicitud.peritoId,
      observaciones: formData.observaciones,
      valorEvaluado: parseFloat(formData.valorEvaluado),
      fotos: formData.fotos
    });

    setFormData({ observaciones: '', valorEvaluado: '', fotos: [] });
    setEvaluacionActiva(null);
  };

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
            : 'Todas las evaluaciones del sistema'
          }
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
              <p className="text-lg font-semibold text-gray-900">{solicitudesRelevantes.length}</p>
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
              <p className="text-lg font-semibold text-gray-900">{solicitudesPorEvaluar.length}</p>
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
              <p className="text-lg font-semibold text-gray-900">
                {evaluaciones.filter(e => {
                  const solicitud = solicitudes.find(s => s.id === e.solicitudId);
                  return usuarioActual.rol === 'perito' 
                    ? e.peritoId === peritos.find(p => p.email === usuarioActual.email)?.id
                    : true;
                }).length}
              </p>
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
                {formatCurrency(evaluaciones
                  .filter(e => {
                    return usuarioActual.rol === 'perito' 
                      ? e.peritoId === peritos.find(p => p.email === usuarioActual.email)?.id
                      : true;
                  })
                  .reduce((sum, e) => sum + e.comisionCalculada, 0)
                )}
              </p>
              <p className="text-sm text-gray-600">Comisiones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de solicitudes */}
      {solicitudesRelevantes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay evaluaciones asignadas</h3>
          <p className="text-gray-600">
            {usuarioActual.rol === 'perito' 
              ? 'No tienes propiedades asignadas para evaluar en este momento.'
              : 'No hay solicitudes asignadas para evaluación.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudesRelevantes.map((solicitud) => {
            const propietario = getPropietario(solicitud.propietarioId);
            const propiedad = getPropiedad(solicitud.propiedadId);
            const perito = getPerito(solicitud.peritoId!);
            const evaluacionExistente = getEvaluacion(solicitud.id);
            const puedeEvaluar = solicitud.estado === 'asignada';

            return (
              <div key={solicitud.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${
                        evaluacionExistente ? 'bg-green-100' : 'bg-orange-100'
                      } rounded-lg flex items-center justify-center`}>
                        <Calculator className={`h-6 w-6 ${
                          evaluacionExistente ? 'text-green-600' : 'text-orange-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{solicitud.numero}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Asignada: {formatDate(solicitud.fechaAsignacion!)}</span>
                          {evaluacionExistente && (
                            <span>Evaluada: {formatDate(evaluacionExistente.fechaEvaluacion)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        evaluacionExistente 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {evaluacionExistente ? 'Evaluada' : 'Pendiente'}
                      </span>
                      
                      {puedeEvaluar && (usuarioActual.rol !== 'perito' || 
                        perito?.email === usuarioActual.email) && (
                        <button
                          onClick={() => setEvaluacionActiva(
                            evaluacionActiva === solicitud.id ? null : solicitud.id
                          )}
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

                    {/* Perito */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Perito Asignado</h4>
                      {perito && (
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="font-medium text-gray-900">{perito.nombre}</p>
                          <p>{perito.especialidad}</p>
                          <p>Comisión: {perito.comisionPorcentaje}%</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Evaluación existente */}
                  {evaluacionExistente && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-3 flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Evaluación Completada</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-green-900">Valor Evaluado</p>
                          <p className="text-lg font-bold text-green-700">
                            {formatCurrency(evaluacionExistente.valorEvaluado)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-900">Comisión Calculada</p>
                          <p className="text-lg font-bold text-green-700">
                            {formatCurrency(evaluacionExistente.comisionCalculada)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm font-medium text-green-900 mb-1">Observaciones</p>
                        <p className="text-sm text-green-800">{evaluacionExistente.observaciones}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Formulario de evaluación */}
                {evaluacionActiva === solicitud.id && puedeEvaluar && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                      <Calculator className="h-5 w-5" />
                      <span>Nueva Evaluación</span>
                    </h4>
                    
                    <form onSubmit={(e) => handleSubmitEvaluacion(e, solicitud.id)} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observaciones
                        </label>
                        <textarea
                          value={formData.observaciones}
                          onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, valorEvaluado: e.target.value})}
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
                            {formData.valorEvaluado && perito ? 
                              formatCurrency(calcularComision(parseFloat(formData.valorEvaluado), perito.id)) :
                              '$0.00'
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Camera className="h-4 w-4 inline mr-2" />
                          Fotos de la Propiedad
                        </label>
                        <div className="text-sm text-gray-500 mb-2">
                          Simulación: En un sistema real, aquí se cargarían las fotos
                        </div>
                        <input
                          type="text"
                          placeholder="foto1.jpg, foto2.jpg, foto3.jpg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onChange={(e) => setFormData({
                            ...formData, 
                            fotos: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                          })}
                        />
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
            );
          })}
        </div>
      )}
    </div>
  );
}