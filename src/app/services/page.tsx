'use client';
import { useServices } from '@/hooks/useServices';
import StatsCard from '@/components/StatsCard';
import ServicesTable from '@/components/ServicesTable';
import Image from 'next/image';
import { FaSync, FaExclamationTriangle, FaClipboardList, FaCheckCircle, FaCogs, FaClock, FaEye } from 'react-icons/fa';
import { useEffect } from 'react';

// Función mejorada de normalización que maneja más casos
const normalizeStatus = (status: string = ''): string => {
  return status
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, '')
    .trim();
};

interface StatsData {
  total: number;
  completed: number;
  active: number;
  pending: number;
  needsSupervision: number;
}

export default function ServicesPage() {
  const { services = [], isLoading, error, refresh, isValidating, isEmpty } = useServices();

  // Aseguramos que services siempre sea un array válido
  const safeServices = Array.isArray(services) ? services : [];

  // Función mejorada para detectar estados
  const getServiceStatus = (status: string | undefined): string => {
    const normalized = normalizeStatus(status || '');
    
    if (['completado', 'comptado', 'comptados', 'terminado'].some(s => normalized.includes(s))) {
      return 'completed';
    }
    if (['activo', 'actvo', 'progreso'].some(s => normalized.includes(s))) {
      return 'active';
    }
    if (['pendiente', 'pndiente', 'porhacer'].some(s => normalized.includes(s))) {
      return 'pending';
    }
    if (['supervision', 'revision', 'revisión', 'necesita'].some(s => normalized.includes(s))) {
      return 'needsSupervision';
    }
    return 'pending'; // Por defecto
  };

  // Calcular estadísticas con la función mejorada
  const stats: StatsData = {
    total: safeServices.length,
    completed: safeServices.filter(s => getServiceStatus(s.estatus) === 'completed').length,
    active: safeServices.filter(s => getServiceStatus(s.estatus) === 'active').length,
    pending: safeServices.filter(s => getServiceStatus(s.estatus) === 'pending').length,
    needsSupervision: safeServices.filter(s => getServiceStatus(s.estatus) === 'needsSupervision').length
  };

  // Calcular porcentajes
  const calculatePercentage = (value: number): number => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
  };

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} onRetry={refresh} />;
  if (isEmpty) return <EmptyState onRefresh={refresh} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <HeaderSection isValidating={isValidating} refresh={refresh} />
        
        <div className="mb-8">
          <ProgressOverview stats={stats} calculatePercentage={calculatePercentage} />
          <StatsSection stats={stats} isValidating={isValidating} calculatePercentage={calculatePercentage} />
        </div>
        
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-gray-700/30">
          <ServicesTable 
            services={safeServices} 
            isLoading={isLoading} 
            isRefreshing={isValidating} 
          />
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares mejorados
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
    <div className="text-center">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
      <p className="text-white text-xl font-medium">Cargando servicios...</p>
      <p className="text-gray-400 mt-2">Por favor espera un momento</p>
    </div>
  </div>
);

interface ErrorScreenProps {
  error: Error;
  onRetry: () => void;
}

const ErrorScreen = ({ error, onRetry }: ErrorScreenProps) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
    <div className="bg-red-900/50 border border-red-700 text-white px-8 py-8 rounded-xl max-w-md text-center backdrop-blur-sm">
      <FaExclamationTriangle className="mx-auto text-4xl mb-4 text-red-300" />
      <h2 className="text-2xl font-bold mb-3">Error al cargar los datos</h2>
      <p className="mb-6 text-red-200">{error.message}</p>
      <button
        onClick={onRetry}
        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 flex items-center mx-auto gap-2"
      >
        <FaSync /> Reintentar
      </button>
    </div>
  </div>
);

interface EmptyStateProps {
  onRefresh: () => void;
}

const EmptyState = ({ onRefresh }: EmptyStateProps) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
    <div className="bg-yellow-900/50 border border-yellow-700 text-white px-8 py-8 rounded-xl max-w-md text-center backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-3">No hay datos disponibles</h2>
      <p className="mb-6 text-yellow-200">No se encontraron registros en la hoja de cálculo.</p>
      <button
        onClick={onRefresh}
        className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 flex items-center mx-auto gap-2"
      >
        <FaSync /> Actualizar
      </button>
    </div>
  </div>
);

interface HeaderSectionProps {
  isValidating: boolean;
  refresh: () => void;
}

const HeaderSection = ({ isValidating, refresh }: HeaderSectionProps) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-blue-600/20 p-2 rounded-lg">
          <FaClipboardList className="text-blue-400 text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-white">Panel de Servicios</h1>
      </div>
      <p className="text-gray-300 mt-2 flex items-center gap-2">
        <span className="bg-gray-700/50 px-2 py-1 rounded text-sm">
          Última actualización: {new Date().toLocaleTimeString()}
        </span>
        {isValidating && (
          <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-sm flex items-center gap-1">
            <FaSync className="animate-spin" /> Actualizando...
          </span>
        )}
      </p>
    </div>
    
    <div className="bg-gray-800/50 p-4 rounded-xl shadow-lg border border-gray-700/30 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <button 
          onClick={refresh}
          disabled={isValidating}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium transition-all ${
            isValidating 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg'
          }`}
        >
          <FaSync className={isValidating ? 'animate-spin' : ''} />
          {isValidating ? 'Actualizando...' : 'Actualizar Datos'}
        </button>
        <p className="text-sm font-medium my-3 text-gray-400">Escanea para acceder</p>
        <div className="w-36 h-36 flex items-center justify-center p-1.5 rounded-lg bg-white">
          <Image 
            src="/images/qrexcel.png"
            alt="QR Code"
            width={300}
            height={300}
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </div>
    </div>
  </div>
);

interface ProgressOverviewProps {
  stats: StatsData;
  calculatePercentage: (value: number) => number;
}

const ProgressOverview = ({ stats, calculatePercentage }: ProgressOverviewProps) => {
  const completionPercentage = calculatePercentage(stats.completed);
  
  return (
    <div className="bg-gray-800/50 rounded-xl p-6 mb-6 border border-gray-700/30 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-white">Progreso General</h3>
        <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          {completionPercentage}%
        </span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-4 mb-2">
        <div 
          className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500" 
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm text-gray-300">
        <span>{stats.completed} completados</span>
        <span>{stats.total} total</span>
      </div>
    </div>
  );
};

interface StatsSectionProps {
  stats: StatsData;
  isValidating: boolean;
  calculatePercentage: (value: number) => number;
}

const StatsSection = ({ stats, isValidating, calculatePercentage }: StatsSectionProps) => {
  const statsCards = [
    {
      title: "Total Servicios",
      value: stats.total,
      icon: <FaClipboardList className="text-2xl" />,
      color: "bg-gradient-to-br from-gray-500 to-gray-600",
      percentage: null
    },
    {
      title: "Completados",
      value: stats.completed,
      icon: <FaCheckCircle className="text-2xl" />,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      percentage: calculatePercentage(stats.completed)
    },
    {
      title: "Activos",
      value: stats.active,
      icon: <FaCogs className="text-2xl" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      percentage: calculatePercentage(stats.active)
    },
    {
      title: "Pendientes",
      value: stats.pending,
      icon: <FaClock className="text-2xl" />,
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      percentage: calculatePercentage(stats.pending)
    },
    {
      title: "Necesita Supervisión",
      value: stats.needsSupervision,
      icon: <FaEye className="text-2xl" />,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      percentage: calculatePercentage(stats.needsSupervision)
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statsCards.map((card, index) => (
        <div 
          key={index}
          className={`${card.color} rounded-xl p-5 shadow-lg text-white transition-transform hover:scale-[1.02]`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-white/80">{card.title}</p>
              <p className="text-3xl font-bold mt-1">{isValidating ? '...' : card.value}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              {card.icon}
            </div>
          </div>
          {card.percentage !== null && (
            <div className="mt-3">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full" 
                  style={{ width: `${card.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1 text-white/80">{card.percentage}% del total</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};