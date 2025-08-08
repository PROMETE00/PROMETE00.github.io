'use client';

import { useState } from 'react';
import ScheduleTable, { ScheduleEntry } from '@/components/ScheduleTable';

function generateEmptyRows(): ScheduleEntry[] {
  const horas = [
    '07:00-08:00','08:00-09:00','09:00-10:00','10:00-11:00',
    '11:00-12:00','12:00-13:00','13:00-14:00','14:00-15:00',
    '15:00-16:00','16:00-17:00','17:00-18:00','18:00-19:00',
    '19:00-20:00'
  ];
  return horas.map(hora => ({ hora }));
}

function generateEmptyRowsExcept(exclude: string): ScheduleEntry[] {
  return generateEmptyRows().filter(row => row.hora !== exclude);
}

const allWeeks: { range: string; data: ScheduleEntry[] }[] = [
  {
    range: '04-08 DE AGOSTO',
    data: [
      {
        hora: '09:00-10:00',
        viernes: {
          actividad: 'Entregar la base de datos'
        }
      },
      ...generateEmptyRowsExcept('09:00-10:00')
    ]
  },
  {
    range: '11-15 DE AGOSTO',
    data: generateEmptyRows()
  },
  {
    range: '18-22 DE AGOSTO',
    data: [
      {
        hora: '08:00-09:00',
        miercoles: {
          actividad: 'Registro de entrega a nuevo ingreso',
          observaciones: 'Inicia 8:30 Preguntar al Doc. Ricardo de la aplicación'
        },
        jueves: {
          actividad: 'Registro de entrega a nuevo ingreso',
          observaciones: 'Inicia 8:30 Preguntar al Doc. Ricardo de la aplicación'
        }
      },
      ...generateEmptyRowsExcept('08:00-09:00')
    ]
  }
];

export default function Horarios() {
  const [weekIndex, setWeekIndex] = useState(0);
  const currentWeek = allWeeks[weekIndex];

  return (
  <div className="min-h-[120vh] py-8 bg-[#0D1117]"> {/* Aumentado min-h-screen a min-h-[120vh] y py-6 a py-8 */}
    <div className="mx-auto w-full pr-15 pl-15 h-full"> {/* Añadido h-full */}
      <div className="flex justify-between items-center mb-4 px-4"> {/* Aumentado mb-3 a mb-4 y px-2 a px-4 */}
        <button
          onClick={() => setWeekIndex((prev) => Math.max(prev - 1, 0))}
          className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md disabled:opacity-50 transition-colors text-base" 
          disabled={weekIndex === 0}
        >{/* Aumentado text-sm a text-base y padding */}
          Semana anterior
        </button>

        <h1 className="text-2xl font-bold text-white text-center mx-4"> {/* Aumentado text-xl a text-2xl y mx-3 a mx-4 */}
          Semana {currentWeek.range}
        </h1>

        <button
          onClick={() => setWeekIndex((prev) => Math.min(prev + 1, allWeeks.length - 1))}
          className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md disabled:opacity-50 transition-colors text-base" 
          disabled={weekIndex === allWeeks.length - 1}
        >{/* Aumentado text-sm a text-base y padding */}
          Siguiente semana
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg w-full min-h-[70vh]"> {/* Aumentado p-2 a p-4, min-h añadido, shadow-md a shadow-lg */}
        <ScheduleTable schedule={currentWeek.data} />
      </div>
    </div>
  </div>
);
}