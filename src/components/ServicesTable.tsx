'use client';

import { Service } from '@/types';

interface ServicesTableProps {
  services: Service[];
}

const getStatusClass = (status: string = ''): string => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('activo')) return 'bg-green-100 text-green-800';
  if (statusLower.includes('pendiente')) return 'bg-yellow-100 text-yellow-800';
  if (statusLower.includes('no atendido')) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};

export default function ServicesTable({ services }: ServicesTableProps) {
  if (!services?.length) {
    return <div className="text-center py-4">No hay servicios registrados</div>;
  }

  const headers = Object.keys(services[0]).filter(Boolean);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map(header => (
              <th 
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {services.map((service, index) => (
            <tr key={index}>
              {headers.map(header => (
                <td key={`${index}-${header}`} className="px-6 py-4 whitespace-nowrap">
                  {header === 'estado' ? (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${getStatusClass(service[header])}`}>
                      {service[header]}
                    </span>
                  ) : (
                    service[header]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}