import { fetchGoogleSheetData } from '@/lib/google-sheets';
import StatsCard from '@/components/StatsCard';
import ServicesTable from '@/components/ServicesTable';

export default async function Home() {
  const services = await fetchGoogleSheetData();
  
  // Calcular estadísticas
  const total = services.length;
  const pending = services.filter(s => s.status === 'Pendiente').length;
  const active = services.filter(s => s.status === 'Activo').length;
  const unattended = services.filter(s => s.status === 'No Atendido').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Panel de Servicios</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Total Servicios" 
          value={total} 
          icon="clipboard-list" 
          color="blue" 
        />
        <StatsCard 
          title="Pendientes" 
          value={pending} 
          icon="clock" 
          color="yellow" 
        />
        <StatsCard 
          title="Activos" 
          value={active} 
          icon="check-circle" 
          color="green" 
        />
        <StatsCard 
          title="No Atendidos" 
          value={unattended} 
          icon="times-circle" 
          color="red" 
        />
      </div>
      
      <ServicesTable services={services} />
    </div>
  );
}