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

export interface ScheduleWeek {
  range: string;
  data: ScheduleEntry[];
}

export interface SheetConfig {
  sheetId: string;
  sheetName: string;
  apiKey: string;
}

export interface ScheduleWeek {
  range: string;
  data: ScheduleEntry[];
  isCurrent?: boolean; // Nueva propiedad para identificar semana actual
}