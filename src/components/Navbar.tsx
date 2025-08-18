'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaClipboardList, FaCalendarAlt } from 'react-icons/fa';

export default function Navbar() {
  const pathname = usePathname();

  return (
    // Contenedor padre con el color deseado (#0D1117) y sin overflow oculto
    <div className="bg-[#0D1117]">
      {/* Navbar con bordes redondeados y color de fondo blanco */}
      <nav className="bg-white rounded-b-full border-b-6 border-[#4F5893] relative z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/images/servicio.png"
                alt="Logo de la empresa"
                width={100}
                height={100}
                className="mr-2 rounded-lg"
              />
              <span className="text-xl font-bold text-gray-800">
                SOPORTE TÉCNICO Y MANTENIMIENTO DEL CENTRO DE COMPUTO
              </span>
            </Link>
          </div>

          {/* Menú de navegación */}
          <div className="flex space-x-1">
            <Link 
              href="/services"
              className={`px-3 py-2 rounded-md transition-colors flex items-center ${
                pathname === '/services'
                  ? 'bg-[#7a8ec9] text-white'
                  : 'text-[#3a3352] hover:bg-[#7a8ec9] hover:text-white'
              }`}
            >
              <FaClipboardList className="text-sm mr-1" />
              <span className="text-sm">Servicios</span>
            </Link>
            <Link 
              href="/schedules"
              className={`px-3 py-2 rounded-md transition-colors flex items-center ${
                pathname === '/schedules'
                  ? 'bg-[#7a8ec9] text-white'
                  : 'text-[#3a3352] hover:bg-[#7a8ec9] hover:text-white'
              }`}
            >
              <FaCalendarAlt className="text-sm mr-1" />
              <span className="text-sm">Actividades Semanales</span>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Fondo de respaldo para las esquinas redondeadas */}
      <div className="h-4 bg-[#0D1117] -mt-4 relative z-0"></div>
    </div>
  );
}