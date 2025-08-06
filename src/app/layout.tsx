import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import FontAwesome from '@/components/FontAwesome';

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
      <body className={inter.className}>
        <FontAwesome />
        {children}
      </body>
    </html>
  );
}