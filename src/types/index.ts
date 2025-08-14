export interface Service {
  id: string;
  areaSolicitante: string;
  nombreSolicitante: string;
  fechaElaboracionSolicitud: string;
  descripcionServicio: string;
  observaciones: string;
  responsablesInvolucrados: string;
  estatus: 'Pendiente' | 'Activo' | 'Completado' | 'Necesita Supervisión';
  fechaTerminacion: string;
}

export interface SheetColumnMapping {
  id: string;
  areaSolicitante: string;
  nombreSolicitante: string;
  fechaElaboracionSolicitud: string;
  descripcionServicio: string;
  observaciones: string;
  responsablesInvolucrados: string;
  estatus: string;
  fechaTerminacion: string;
}

export interface SheetConfig {
  sheetId: string;
  sheetName: string;
  apiKey: string;
  columnMapping: SheetColumnMapping;
}