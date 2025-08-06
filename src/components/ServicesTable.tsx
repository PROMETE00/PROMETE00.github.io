'use client';

import { Service } from '@/types';

// Definimos el orden de los estados
const statusOrder: Record<string, number> = {
  'Necesita Supervisión': 1,
  'Pendiente': 2,
  'Activo': 3,
  'Completado': 4
};

// Función para obtener el color del estado
const getStatusColor = (status: string = ''): string => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('completado')) return 'bg-green-500';
  if (statusLower.includes('activo')) return 'bg-blue-500';
  if (statusLower.includes('pendiente')) return 'bg-yellow-500';
  if (statusLower.includes('supervisión') || statusLower.includes('supervision')) return 'bg-purple-500';
  return 'bg-gray-500';
};

// Función para obtener la clase de texto según el estado
const getStatusTextClass = (status: string = ''): string => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('completado')) return 'text-green-800';
  if (statusLower.includes('activo')) return 'text-blue-800';
  if (statusLower.includes('pendiente')) return 'text-yellow-800';
  if (statusLower.includes('supervisión') || statusLower.includes('supervision')) return 'text-purple-800';
  return 'text-gray-800';
};

// Función para formatear fechas desde Google Sheets
const formatSheetDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  
  // Intenta parsear como fecha ISO (formato de Google Sheets API)
  const isoDate = new Date(dateString);
  if (!isNaN(isoDate.getTime())) {
    return isoDate.toLocaleDateString();
  }
  
  // Intenta parsear fechas en formato dd/mm/yyyy
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString();
    }
  }
  
  // Si no se puede parsear, devolver el valor original
  return dateString;
};

export default function ServicesTable({ services }: { services: Service[] }) {
  if (!services?.length) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay servicios registrados</p>
      </div>
    );
  }

  // Ordenar servicios por estado
  const sortedServices = [...services].sort((a, b) => {
    return (statusOrder[a.estatus] || 5) - (statusOrder[b.estatus] || 5);
  });

  // Agrupar servicios por estado para secciones separadas
  const groupedServices = sortedServices.reduce((acc: Record<string, Service[]>, service) => {
    const status = service.estatus || 'Otro';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(service);
    return acc;
  }, {});

  // Filtramos y ordenamos los headers
  const headers = Object.keys(services[0])
    .filter(Boolean)
    .sort((a, b) => {
      const order = ['id', 'nombreSolicitante', 'descripcionServicio', 'estatus', 'fechaElaboracionSolicitud'];
      return (order.indexOf(a) - order.indexOf(b)) || a.localeCompare(b);
    });

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-2 px-2"></th> {/* Columna para la bandera */}
            {headers.map(header => (
              <th 
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {header === 'nombreSolicitante' ? 'Solicitante' : 
                 header === 'descripcionServicio' ? 'Descripción' :
                 header === 'fechaElaboracionSolicitud' ? 'Fecha' :
                 header === 'responsablesInvolucrados' ? 'Responsables' :
                 header.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Object.entries(groupedServices).map(([status, statusServices]) => (
            <>
              {statusServices.map((service, index) => (
                <tr key={`${status}-${index}`} className="hover:bg-gray-50 group">
                  <td className={`w-2 ${getStatusColor(service.estatus)} group-hover:opacity-90`}></td>
                  {headers.map(header => (
                    <td 
                      key={`${status}-${index}-${header}`} 
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        header === 'estatus' ? 'font-medium' : 'text-gray-500'
                      } ${getStatusTextClass(service.estatus)}`}
                    >
                      {header === 'estatus' ? (
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${getStatusColor(service.estatus).replace('500', '100')}`}>
                          {service[header]}
                        </span>
                      ) : header.includes('fecha') ? (
                        formatSheetDate(service[header])
                      ) : (
                        service[header]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {status === 'Completado' && (
                <tr className="bg-gray-50">
                  <td colSpan={headers.length + 1} className="h-4"></td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
      <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500">
        Mostrando {services.length} servicios
      </div>
    </div>
  );
}