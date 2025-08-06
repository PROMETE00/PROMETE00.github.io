'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaClipboardList, FaCalendarAlt } from 'react-icons/fa';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/servicio.png" // Reemplaza con la ruta de tu logo
              alt="Logo de la empresa"
              width={100}
              height={100}
              className="mr-2 rounded-lg"
            />
            <span className="text-xl font-bold text-gray-800">SOPORTE TÉCNICO Y MANTENIMIENTO DEL CENTRO DE COMPUTO</span>
          </Link>
        </div>

        {/* Menú de navegación */}
        <div className="flex space-x-1">
          <Link 
            href="/servicios" 
            className={`px-3 py-2 rounded-md transition-colors flex items-center ${
              pathname === '/servicios' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaClipboardList className="text-sm mr-1" />
            <span className="text-sm">Servicios</span>
          </Link>
          <Link 
            href="/horarios" 
            className={`px-3 py-2 rounded-md transition-colors flex items-center ${
              pathname === '/horarios' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaCalendarAlt className="text-sm mr-1" />
            <span className="text-sm">Horarios</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}