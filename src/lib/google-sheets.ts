import { Service } from '@/types';

export async function fetchGoogleSheetData(): Promise<Service[]> {
  const SHEET_ID = '1vLy7_ysmlQ1LU4KO6JW9dqckUFFp8HjhdXLtsAm_h4A';
  const SHEET_NAME = 'servicios';
  const API_KEY = 'AIzaSyBMAq0R2vsYI2BxQlmCZrh42luMUmK5T-A';

  const JSON_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
  
  try {
    const response = await fetch(JSON_URL, { 
      next: { revalidate: 30 }
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }
    
    const jsonData = await response.json();
    return parseSheetData(jsonData);
  } catch (error) {
    console.error('Error al obtener datos de Google Sheets:', error);
    throw error;
  }
}

function parseSheetData(data: any): Service[] {
  if (!data.values || !Array.isArray(data.values)) {
    console.error('Formato de datos inesperado:', data);
    return [];
  }

  const rows = data.values;
  if (rows.length === 0) return [];

  // Mostrar los encabezados para depuración
  console.log('Encabezados encontrados en el archivo:', rows[0]);

  // Mapeo exacto de índices basado en los encabezados
  const headers = rows[0].map((h: string) => h.trim());
  const columnIndices = {
    id: headers.indexOf('id'),
    areaSolicitante: headers.indexOf('areaSolicitante'),
    nombreSolicitante: headers.indexOf('nombreSolicitante'),
    fechaElaboracionSolicitud: headers.indexOf('fechaElaboracionSolicitud'),
    descripcionServicio: headers.indexOf('descripcionServicio'),
    observaciones: headers.indexOf('observaciones'),
    responsablesInvolucrados: headers.indexOf('responsablesInvolucrados'),
    estatus: headers.indexOf('estatus'),
    fechaTerminacion: headers.indexOf('fechaTerminacion')
  };

  // Verificar que todos los índices sean válidos
  for (const [key, index] of Object.entries(columnIndices)) {
    if (index === -1) {
      console.warn(`No se encontró la columna: ${key}`);
    }
  }

  return rows.slice(1).map((row: any[]) => {
    const service: Service = {
      id: row[columnIndices.id]?.toString().trim() || '',
      areaSolicitante: row[columnIndices.areaSolicitante]?.toString().trim() || '',
      nombreSolicitante: row[columnIndices.nombreSolicitante]?.toString().trim() || '',
      fechaElaboracionSolicitud: row[columnIndices.fechaElaboracionSolicitud]?.toString().trim() || '',
      descripcionServicio: row[columnIndices.descripcionServicio]?.toString().trim() || '',
      observaciones: row[columnIndices.observaciones]?.toString().trim() || '',
      responsablesInvolucrados: row[columnIndices.responsablesInvolucrados]?.toString().trim() || '',
      estatus: 'Pendiente', // Valor por defecto
      fechaTerminacion: row[columnIndices.fechaTerminacion]?.toString().trim() || ''
    };

    // Procesamiento especial para el estatus
    const estatusValue = row[columnIndices.estatus]?.toString().trim().toLowerCase() || '';
    if (estatusValue.includes('completado')) {
      service.estatus = 'Completado';
    } else if (estatusValue.includes('activo')) {
      service.estatus = 'Activo';
    } else if (estatusValue.includes('supervisión') || estatusValue.includes('supervision')) {
      service.estatus = 'Necesita Supervisión';
    }

    console.log('Servicio procesado:', service);
    return service;
  });
}