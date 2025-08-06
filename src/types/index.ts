export type Service = {
  id?: string;
  areaSolicitante?: string;
  nombreSolicitante?: string;
  fechaElaboracionSolicitud?: string;
  descripcionServicio?: string;
  observaciones?: string;
  responsablesInvolucrados?: string;
  estatus?: string;
  fechaTerminacion?: string;
  [key: string]: string | undefined;
};