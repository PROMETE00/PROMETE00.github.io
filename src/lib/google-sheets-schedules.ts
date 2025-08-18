import { ScheduleWeek, ScheduleEntry } from '../types/types-schedules';

export async function fetchScheduleData(): Promise<ScheduleWeek[]> {
  const SHEET_ID = '1vLy7_ysmlQ1LU4KO6JW9dqckUFFp8HjhdXLtsAm_h4A';
  const SHEET_NAME = 'horarios';
  const API_KEY = 'AIzaSyBMAq0R2vsYI2BxQlmCZrh42luMUmK5T-A';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!B3:Q100?key=${API_KEY}`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 30 }
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }
    
    const jsonData = await response.json();
    return parseScheduleData(jsonData);
  } catch (error) {
    console.error('Error al obtener datos de Google Sheets:', error);
    throw error;
  }
}

function parseScheduleData(data: any): ScheduleWeek[] {
  if (!data.values || !Array.isArray(data.values)) {
    console.error('Formato de datos inesperado:', data);
    return [];
  }

  const rows: (string | undefined)[][] = data.values;
  const weeks: ScheduleWeek[] = [];
  let currentWeek: ScheduleWeek | null = null;
  let currentWeekData: ScheduleEntry[] = [];
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Domingo, 1=Lunes,...,6=Sábado

  // Determinar si debemos mostrar esta semana o la próxima
  const showNextWeek = dayOfWeek === 0 || dayOfWeek === 6; // Si es sábado o domingo

  // Procesar todas las semanas
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    if (row && row[1] && typeof row[1] === 'string' && row[1].startsWith('SEMANA ')) {
      // Guardar semana anterior si existe
      if (currentWeek && currentWeekData.length > 0) {
        currentWeek.data = currentWeekData;
        weeks.push(currentWeek);
        currentWeekData = [];
      }
      
      const weekRange = row[1].replace('SEMANA ', '').trim();
      const [dateRange, month] = weekRange.split(' DE ');
      const [startDay, endDay] = dateRange.split('-').map(s => parseInt(s.trim(), 10));
      
      const monthIndex = getMonthIndex(month);
      if (monthIndex === -1) continue;
      
      const currentYear = today.getFullYear();
      const weekStartDate = new Date(currentYear, monthIndex, startDay);
      const weekEndDate = new Date(currentYear, monthIndex, endDay);

      // Ajustar para meses que cruzan años (ej: diciembre-enero)
      if (monthIndex === 11 && today.getMonth() === 0) {
        weekStartDate.setFullYear(currentYear - 1);
        weekEndDate.setFullYear(currentYear - 1);
      }

      // Determinar si es la semana que debemos mostrar
      let isCurrentWeek = false;
      
      if (showNextWeek) {
        // Buscamos la primera semana que comienza después de hoy
        isCurrentWeek = weekStartDate > today;
      } else {
        // Buscamos la semana que contiene hoy
        isCurrentWeek = today >= weekStartDate && today <= weekEndDate;
      }

      currentWeek = {
        range: weekRange,
        data: [],
        isCurrent: isCurrentWeek
      };
      
      i += 2; // Saltar encabezados
      continue;
    }

    // Procesar filas de horario
    if (currentWeek && row && row[0] && typeof row[0] === 'string' && row[0].match(/^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/)) {
      const entry: ScheduleEntry = {
        hora: row[0],
        lunes: getDayData(row, 1),
        martes: getDayData(row, 4),
        miercoles: getDayData(row, 7),
        jueves: getDayData(row, 10),
        viernes: getDayData(row, 13)
      };
      currentWeekData.push(entry);
    }
  }

  // Asegurar que la última semana se agregue
  if (currentWeek && currentWeekData.length > 0) {
    currentWeek.data = currentWeekData;
    weeks.push(currentWeek);
  }

  // Si no encontramos semana actual, seleccionar la primera disponible
  if (!weeks.some(w => w.isCurrent) && weeks.length > 0) {
    if (showNextWeek) {
      // Si es fin de semana y no encontramos semana futura, mostrar la última disponible
      weeks[weeks.length - 1].isCurrent = true;
    } else {
      // Si es día de semana y no encontramos coincidencia, mostrar la primera
      weeks[0].isCurrent = true;
    }
  }

  return weeks;
}

function getDayData(row: (string | undefined)[], startIndex: number) {
  return {
    actividad: row[startIndex] || '-',
    responsable: row[startIndex + 1] || '-',
    observaciones: row[startIndex + 2] || '-'
  };
}

// Función auxiliar para convertir nombre de mes a índice (0-11)
function getMonthIndex(monthName: string): number {
  const months = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
  ];
  return months.findIndex(m => m === monthName.toUpperCase());
}

// Funciones auxiliares para obtener fechas de la semana
function getWeekStartDate(weekRange: string): Date {
  const [dateRange, month] = weekRange.split(' DE ');
  const [startDay] = dateRange.split('-').map(s => parseInt(s.trim(), 10));
  const monthIndex = getMonthIndex(month);
  const currentYear = new Date().getFullYear();
  return new Date(currentYear, monthIndex, startDay);
}

function getWeekEndDate(weekRange: string): Date {
  const [dateRange, month] = weekRange.split(' DE ');
  const [, endDay] = dateRange.split('-').map(s => parseInt(s.trim(), 10));
  const monthIndex = getMonthIndex(month);
  const currentYear = new Date().getFullYear();
  return new Date(currentYear, monthIndex, endDay);
}