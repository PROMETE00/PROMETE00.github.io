import { Service } from '@/types';

export async function fetchGoogleSheetData(): Promise<Service[]> {
  const SHEET_ID = '1vLy7_ysmlQ1LU4KO6JW9dqckUFFp8HjhdXLtsAm_h4A'; // ID de tu hoja
  const SHEET_NAME = 'servicios'; // Nombre de tu hoja (verifica que coincida exactamente)
  const API_KEY = 'AIzaSyBMAq0R2vsYI2BxQlmCZrh42luMUmK5T-A'; // Necesitarás una API key de Google

  // Usando la API de Google Sheets v4
  const JSON_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
  
  try {
    const response = await fetch(JSON_URL, { next: { revalidate: 30 } });
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.status}`);
    }
    
    const jsonData = await response.json();
    return parseSheetData(jsonData);
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    return [];
  }
}

function parseSheetData(data: any): Service[] {
  const rows = data.values;
  if (!rows || rows.length === 0) return [];

  const headers = rows[0].map((header: string) => header.trim());
  
  return rows.slice(1).map((row: string[]) => {
    const service: Service = {};
    headers.forEach((header: string, index: number) => {
      // Mapea los nombres de las columnas a las propiedades de Service
      const value = row[index] || '';
      
      switch(header) {
        case 'ID':
          service.id = value;
          break;
        case 'Area Solicitante':
          service.areaSolicitante = value;
          break;
        case 'Nombre del solicitante':
          service.nombreSolicitante = value;
          break;
        case 'Fecha de elaboracion de la solicitud':
          service.fechaElaboracion = value;
          break;
        case 'Descripcion del servicio solicitado o falla a reparar':
          service.descripcionServicio = value;
          break;
        case 'Observaciones':
          service.observaciones = value;
          break;
        case 'Responsables involucrados':
          service.responsablesInvolucrados = value;
          break;
        case 'Estatus':
          service.estatus = value;
          break;
        case 'Fecha de terminacion':
          service.fechaTerminacion = value;
          break;
        default:
          service[header] = value;
      }
    });
    return service;
  });
}