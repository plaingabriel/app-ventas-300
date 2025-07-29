import React from 'react';
import { Building2, Users, FileText, Calculator, BarChart3, LogOut } from 'lucide-react';
import { Usuario } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  usuarioActual: Usuario;
  onCambiarSeccion: (seccion: string) => void;
  seccionActual: string;
  onLogout: () => void;
}

export function Layout({ children, usuarioActual, onCambiarSeccion, seccionActual, onLogout }: LayoutProps) {
  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 }
    ];

    switch (usuarioActual.rol) {
      case 'admin':
        return [
          ...baseItems,
          { id: 'propietarios', label: 'Propietarios', icon: Users },
          { id: 'solicitudes', label: 'Solicitudes', icon: FileText },
          { id: 'asignaciones', label: 'Asignaciones', icon: Building2 },
          { id: 'evaluaciones', label: 'Evaluaciones', icon: Calculator }
        ];
      case 'coordinador':
        return [
          ...baseItems,
          { id: 'propietarios', label: 'Propietarios', icon: Users },
          { id: 'solicitudes', label: 'Solicitudes', icon: FileText },
          { id: 'asignaciones', label: 'Asignaciones', icon: Building2 }
        ];
      case 'perito':
        return [
          ...baseItems,
          { id: 'mis-evaluaciones', label: 'Mis Evaluaciones', icon: Calculator }
        ];
      case 'finanzas':
        return [
          ...baseItems,
          { id: 'reportes', label: 'Reportes', icon: BarChart3 }
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">VENTAS300</h1>
              <p className="text-sm text-gray-500">Gestión Inmobiliaria</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">
                {usuarioActual.nombre.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{usuarioActual.nombre}</p>
              <p className="text-xs text-gray-500 capitalize">{usuarioActual.rol}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onCambiarSeccion(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      seccionActual === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900 capitalize">
            {menuItems.find(item => item.id === seccionActual)?.label || 'Dashboard'}
          </h2>
        </header>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}