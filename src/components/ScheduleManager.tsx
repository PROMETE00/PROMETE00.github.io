'use client';

import React, { useState, useEffect } from 'react';
import { ScheduleWeek } from '../types/types-schedules';
import { useScheduleData } from '../hooks/useScheduleData';

const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'] as const;
type DayKey = typeof days[number];

const displayNames: Record<DayKey, string> = {
  lunes: 'LUNES',
  martes: 'MARTES',
  miercoles: 'MIÉRCOLES',
  jueves: 'JUEVES',
  viernes: 'VIERNES'
};

const dayColors: Record<DayKey, string> = {
  lunes: 'bg-blue-50',
  martes: 'bg-green-50',
  miercoles: 'bg-purple-50',
  jueves: 'bg-yellow-50',
  viernes: 'bg-orange-50'
};

interface HeightSettings {
  container: string;    // Altura del contenedor principal
  row: string;          // Altura de cada fila
  header: string;       // Altura del encabezado
}

export function ScheduleManager() {
  const [weekIndex, setWeekIndex] = useState(0);
  const { weeks, loading, error, lastRefresh, triggerRefresh } = useScheduleData({
    refreshInterval: 30000,
    autoRefresh: true
  });

  // Configuración de alturas (puedes ajustar estos valores)
  const [heightSettings, setHeightSettings] = useState<HeightSettings>({
    container: 'calc(95vh - 120px)', // Altura del contenedor principal
    row: 'h-16',                     // Altura de cada fila (40px)
    header: 'h-27'                   // Altura del encabezado (64px)
  });

  // Efecto para encontrar y establecer la semana actual cuando los datos cambian
  useEffect(() => {
    if (weeks.length > 0) {
      const currentWeekIndex = weeks.findIndex(week => week.isCurrent);
      if (currentWeekIndex !== -1) {
        setWeekIndex(currentWeekIndex);
      } else {
        // Si no hay semana marcada como actual, usar la última semana
        setWeekIndex(weeks.length - 1);
      }
    }
  }, [weeks]);

  const handlePrevWeek = () => {
    setWeekIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextWeek = () => {
    setWeekIndex(prev => Math.min(weeks.length - 1, prev + 1));
  };

  const currentWeek = weeks[weekIndex] || { range: '', data: [] };
  
  const sortedSchedule = [...currentWeek.data].sort((a, b) => {
    const timeToMinutes = (time: string) => {
      const [start] = time.split('-');
      const [hours, minutes] = start.split(':').map(Number);
      return hours * 60 + minutes;
    };
    return timeToMinutes(a.hora) - timeToMinutes(b.hora);
  });

  if (loading) return <div className="p-4 text-center">Cargando horarios...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  if (!weeks.length) return <div className="p-4 text-center">No hay datos disponibles</div>;

  return (
    <div 
      className="w-full mx-auto px-2 flex flex-col"
      style={{ height: heightSettings.container }}
    >
      {/* Controles de semana */}
      <div className="flex justify-between items-center mb-2 px-2 bg-gray-800 rounded py-2">
        <button
          onClick={handlePrevWeek}
          className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm" 
          disabled={weekIndex === 0}
        >
          ← Anterior
        </button>

        <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold text-white">
            Semana {currentWeek.range}
          </h1>
          {lastRefresh && (
            <p className="text-xs text-gray-300">
              Actualizado: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
        </div>

        <button
          onClick={handleNextWeek}
          className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm" 
          disabled={weekIndex === weeks.length - 1}
        >
          Siguiente →
        </button>
      </div>

      {/* Tabla de horarios */}
      <div className="flex-1 overflow-auto bg-white border border-gray-200 rounded-lg">
        <table className="w-full">
          <colgroup>
            <col className="w-24" /> {/* Columna HORA */}
            {days.map(() => (
              <>
                <col className="w-48" /> {/* ACTIVIDAD */}
                <col className="w-32" /> {/* RESPONSABLE */}
                <col className="w-48" /> {/* OBSERVACIONES */}
              </>
            ))}
          </colgroup>
          <thead className={`sticky top-0 bg-white z-10 ${heightSettings.header}`}>
            <tr>
              <th 
                rowSpan={2} 
                className="px-2 py-2 text-sm font-semibold text-gray-700 uppercase bg-gray-100 border-r border-gray-200"
              >
                HORA
              </th>
              {days.map((day) => (
                <th 
                  key={day} 
                  colSpan={3} 
                  className={`px-1 py-2 text-sm font-semibold text-gray-700 uppercase border-b border-r border-gray-200 ${dayColors[day]}`}
                >
                  {displayNames[day]}
                </th>
              ))}
            </tr>
            <tr>
              {days.map((day) => (
                <>
                  <th className="px-1 py-2 text-xs font-medium text-gray-600 uppercase bg-white border-r border-gray-200">
                    ACTIVIDAD
                  </th>
                  <th className="px-1 py-2 text-xs font-medium text-gray-600 uppercase bg-white border-r border-gray-200">
                    RESPONSABLE
                  </th>
                  <th className="px-1 py-2 text-xs font-medium text-gray-600 uppercase bg-white border-r border-gray-200">
                    OBSERVACIONES
                  </th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedSchedule.map((row, i) => (
              <tr 
                key={i} 
                className={`border-b border-gray-200 hover:bg-gray-50 ${heightSettings.row}`}
              >
                <td className="px-2 py-2 text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-200">
                  {row.hora}
                </td>
                {days.map((day) => {
                  const dayData = row[day];
                  return (
                    <>
                      <td className={`px-2 py-2 text-sm text-gray-800 border-r border-gray-200 ${dayColors[day]} break-words`}>
                        {dayData?.actividad || '-'}
                      </td>
                      <td className={`px-2 py-2 text-sm text-gray-800 border-r border-gray-200 ${dayColors[day]} break-words`}>
                        {dayData?.responsable || '-'}
                      </td>
                      <td className={`px-2 py-2 text-sm text-gray-800 border-r border-gray-200 ${dayColors[day]} break-words`}>
                        {dayData?.observaciones || '-'}
                      </td>
                    </>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}