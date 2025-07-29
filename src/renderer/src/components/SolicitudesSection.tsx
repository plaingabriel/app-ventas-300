import React from 'react';
import { FileText, User, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { SolicitudVenta, Propietario, Propiedad, Perito } from '../types';

interface SolicitudesSectionProps {
  solicitudes: SolicitudVenta[];
  propietarios: Propietario[];
  propiedades: Propiedad[];
  peritos: Perito[];
}

export function SolicitudesSection({ 
  solicitudes, 
  propietarios, 
  propiedades, 
  peritos 
}: SolicitudesSectionProps) {
  const getPropietario = (id: string) => propietarios.find(p => p.id === id);
  const getPropiedad = (id: string) => propiedades.find(p => p.id === id);
  const getPerito = (id?: string) => id ? peritos.find(p => p.id === id) : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-orange-100 text-orange-800';
      case 'asignada':
        return 'bg-blue-100 text-blue-800';
      case 'evaluada':
        return 'bg-green-100 text-green-800';
      case 'completada':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const solicitudesOrdenadas = solicitudes.sort((a, b) => 
    new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Solicitudes de Venta</h1>
        <p className="text-gray-600 mt-1">
          Todas las solicitudes registradas en el sistema
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: solicitudes.length, color: 'bg-blue-100 text-blue-700' },
          { label: 'Pendientes', count: solicitudes.filter(s => s.estado === 'pendiente').length, color: 'bg-orange-100 text-orange-700' },
          { label: 'Asignadas', count: solicitudes.filter(s => s.estado === 'asignada').length, color: 'bg-purple-100 text-purple-700' },
          { label: 'Evaluadas', count: solicitudes.filter(s => s.estado === 'evaluada').length, color: 'bg-green-100 text-green-700' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
              <FileText className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Lista de solicitudes */}
      <div className="space-y-4">
        {solicitudesOrdenadas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes</h3>
            <p className="text-gray-600">
              Las solicitudes aparecerán aquí una vez que se registren propietarios y propiedades.
            </p>
          </div>
        ) : (
          solicitudesOrdenadas.map((solicitud) => {
            const propietario = getPropietario(solicitud.propietarioId);
            const propiedad = getPropiedad(solicitud.propiedadId);
            const perito = getPerito(solicitud.peritoId);

            return (
              <div key={solicitud.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{solicitud.numero}</h3>
                      <p className="text-sm text-gray-600">
                        Creada el {formatDate(solicitud.fechaCreacion)}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getEstadoColor(solicitud.estado)}`}>
                    {solicitud.estado}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Propietario */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Propietario</span>
                    </h4>
                    {propietario ? (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900">{propietario.nombre}</p>
                        <p>{propietario.telefono}</p>
                        <p>{propietario.email}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-red-600">Propietario no encontrado</p>
                    )}
                  </div>

                  {/* Propiedad */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Propiedad</span>
                    </h4>
                    {propiedad ? (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900 capitalize">{propiedad.tipo}</p>
                        <p>{propiedad.direccion}</p>
                        <p className="text-xs">{propiedad.caracteristicas}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-red-600">Propiedad no encontrada</p>
                    )}
                  </div>

                  {/* Perito */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Perito Asignado</span>
                    </h4>
                    {perito ? (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900">{perito.nombre}</p>
                        <p>{perito.especialidad}</p>
                        <p>{perito.telefono}</p>
                        {solicitud.fechaAsignacion && (
                          <p className="text-xs">
                            Asignado: {formatDate(solicitud.fechaAsignacion)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-orange-600">Sin asignar</p>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                {(solicitud.fechaAsignacion || solicitud.fechaEvaluacion) && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Historial</span>
                    </h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">
                          Creada el {formatDate(solicitud.fechaCreacion)}
                        </span>
                      </div>
                      
                      {solicitud.fechaAsignacion && (
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-600">
                            Asignada el {formatDate(solicitud.fechaAsignacion)}
                          </span>
                        </div>
                      )}
                      
                      {solicitud.fechaEvaluacion && (
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">
                            Evaluada el {formatDate(solicitud.fechaEvaluacion)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}