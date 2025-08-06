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
    <div className="container mx-auto px-6 py-10 max-w-screen-xl">
      <div className="flex flex-col">
        {/* Encabezado con título y QR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Panel de Servicios</h1>
  
        {/* QR en esquina superior derecha - TAMAÑO AUMENTADO */}
        <div className="bg-white p-3 rounded-lg   self-end md:self-auto">
          <div className="flex flex-col items-center">
            <div className="w-60 h-60 bg-white-100 flex items-center justify-center p-2">
              <Image 
                src="/images/qrexcel.png"
                alt="QR Code"
                width={400}
                height={400}
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
        
        {/* Tabla de servicios - ahora con scroll horizontal si es necesario */}
        <div className="w-full overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
          <ServicesTable services={services} />
        </div>
      </div>
    </div>
  );
}