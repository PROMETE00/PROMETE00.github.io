import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import FontAwesome from '@/components/FontAwesome';
import Navbar from '@/components/Navbar'; // Importa el Navbar

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Panel de Servicios',
  description: 'Sistema de seguimiento de servicios',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-[#0D1117]`}>
        <FontAwesome />
        <Navbar />
        <div className=""> {/* Añade padding-top para compensar el Navbar */}
          {children}
        </div>
      </body>
    </html>
  );
}