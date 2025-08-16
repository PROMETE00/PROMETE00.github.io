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
  let currentDate = new Date();
  
  // Buscar la semana actual primero
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    if (row[1] && typeof row[1] === 'string' && row[1].startsWith('SEMANA ')) {
      const weekRange = row[1].replace('SEMANA ', '');
      const [dateRange, month] = weekRange.split(' DE ');
      const [startDay, endDay] = dateRange.split('-').map(Number);
      
      // Crear fechas para comparación (asumiendo formato "DD-DD DE MES")
      const year = currentDate.getFullYear();
      const monthIndex = getMonthIndex(month);
      const weekStartDate = new Date(year, monthIndex, startDay);
      const weekEndDate = new Date(year, monthIndex, endDay);
      
      // Verificar si la fecha actual está en este rango
      if (currentDate >= weekStartDate && currentDate <= weekEndDate) {
        currentWeek = {
          range: weekRange,
          data: [],
          isCurrent: true
        };
        i += 2; // Saltar encabezados
        break; // Encontramos la semana actual
      }
    }
  }

  // Si no encontramos semana actual, procesar normalmente
  if (!currentWeek) {
    currentWeek = {
      range: '',
      data: [],
      isCurrent: false
    };
  }

  // Procesar todas las semanas
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    if (row[1] && typeof row[1] === 'string' && row[1].startsWith('SEMANA ')) {
      // Guardar semana anterior si existe
      if (currentWeek && currentWeekData.length > 0) {
        currentWeek.data = currentWeekData;
        weeks.push(currentWeek);
        currentWeekData = [];
      }
      
      // Crear nueva semana
      currentWeek = {
        range: row[1].replace('SEMANA ', ''),
        data: [],
        isCurrent: false
      };
      i += 2; // Saltar encabezados
      continue;
    }

    // Procesar filas de horario
    if (currentWeek && row[0] && typeof row[0] === 'string' && row[0].match(/^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/)) {
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