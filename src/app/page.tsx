import { fetchGoogleSheetData } from '@/lib/google-sheets';
import StatsCard from '@/components/StatsCard';
import ServicesTable from '@/components/ServicesTable';
import Image from 'next/image';

export default async function Home() {
  const services = await fetchGoogleSheetData();
  
  // Calcular estadísticas asegurando coincidencia exacta de textos
  const total = services.length;
  const completed = services.filter(s => s.estatus?.trim() === 'Completado').length;
  const active = services.filter(s => s.estatus?.trim() === 'Activo').length;
  const pending = services.filter(s => s.estatus?.trim() === 'Pendiente').length;
  const needsSupervision = services.filter(s => s.estatus?.trim() === 'Necesita Supervisión').length;

  return (
    <div style={{ backgroundColor: '#0D1117' }} className="min-h-screen py-6">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-screen-xl">
        <div className="flex flex-col">
          {/* Encabezado con título y QR */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-white">Panel de Servicios</h1>
    
            {/* QR en esquina superior derecha */}
            <div className="bg-white p-3 rounded-lg shadow-md self-end md:self-auto">
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium mb-2 text-gray-700">Escanea para acceder</p>
                <div className="w-48 h-48 bg-gray-50 flex items-center justify-center p-1 rounded">
                  <Image 
                    src="/images/qrexcel.png"
                    alt="QR Code"
                    width={300}
                    height={300}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            <StatsCard 
              title="Total Servicios" 
              value={total} 
              icon="clipboard-list" 
              color="gray" 
            />
            <StatsCard 
              title="Completados" 
              value={completed} 
              icon="circle-check" 
              color="green" 
            />
            <StatsCard 
              title="Activos" 
              value={active} 
              icon="gear" 
              color="blue" 
            />
            <StatsCard 
              title="Pendientes" 
              value={pending} 
              icon="clock" 
              color="yellow" 
            />
            <StatsCard 
              title="Necesitan Supervisión" 
              value={needsSupervision} 
              icon="eye" 
              color="purple" 
            />
          </div>
          
          {/* Tabla de servicios */}
          <div className="w-full overflow-x-auto rounded-lg shadow-lg border border-gray-300 bg-white">
            <ServicesTable services={services} />
          </div>
        </div>
      </div>
    </div>
  );
}