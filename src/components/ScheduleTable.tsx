'use client';

import React from 'react';

export interface DayEntry {
  actividad?: string;
  responsable?: string;
  observaciones?: string;
}

export interface ScheduleEntry {
  hora: string;
  lunes?: DayEntry;
  martes?: DayEntry;
  miercoles?: DayEntry;
  jueves?: DayEntry;
  viernes?: DayEntry;
}

interface Props {
  schedule: ScheduleEntry[];
}

const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
const displayNames = {
  lunes: 'LUNES',
  martes: 'MARTES',
  miercoles: 'MIÉRCOLES',
  jueves: 'JUEVES',
  viernes: 'VIERNES'
};

const colors: Record<string, string> = {
  lunes: 'bg-pink-300',
  martes: 'bg-green-300',
  miercoles: 'bg-blue-300',
  jueves: 'bg-yellow-300',
  viernes: 'bg-orange-300'
};

export default function ScheduleTable({ schedule }: Props) {
  // Ordenar las horas cronológicamente
  const sortedSchedule = [...schedule].sort((a, b) => {
    const timeToMinutes = (time: string) => {
      const [start] = time.split('-');
      const [hours, minutes] = start.split(':').map(Number);
      return hours * 60 + minutes;
    };
    return timeToMinutes(a.hora) - timeToMinutes(b.hora);
  });

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr>
            <th 
              rowSpan={2} 
              className="w-28 px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase bg-gray-100 border-r border-gray-200"
            >
              HORA
            </th>
            {days.map((day) => (
              <th 
                key={day} 
                colSpan={3} 
                className={`px-2 py-2 text-xs font-semibold text-gray-700 uppercase border-b border-r border-gray-200 ${colors[day]}`}
              >
                {displayNames[day as keyof typeof displayNames]}
              </th>
            ))}
          </tr>
          <tr>
            {days.map((day) => (
              <React.Fragment key={day}>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 uppercase bg-white bg-opacity-70 border-r border-gray-200">
                  ACTIVIDAD
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 uppercase bg-white bg-opacity-70 border-r border-gray-200">
                  RESPONSABLE
                </th>
                <th className="px-2 py-2 text-xs font-medium text-gray-600 uppercase bg-white bg-opacity-70 border-r border-gray-200">
                  OBSERVACIONES
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedSchedule.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 border-b border-gray-200 last:border-b-0">
              <td className="w-28 px-3 py-3 text-sm font-medium text-gray-900 bg-gray-50 border-r border-gray-200 whitespace-nowrap">
                {row.hora}
              </td>
              {days.map((day) => {
                const entry = row[day as keyof ScheduleEntry] as DayEntry;
                return (
                  <React.Fragment key={day}>
                    <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-200">
                      {entry?.actividad || '-'}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-200 whitespace-nowrap">
                      {entry?.responsable || '-'}
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-800 border-r border-gray-200">
                      {entry?.observaciones || '-'}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}