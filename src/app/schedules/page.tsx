'use client';

import { ScheduleManager } from '@/components/ScheduleManager';

export default function Horarios() {
  return (
    <div className="min-h-screen py-4 bg-[#0D1117]"> {/* Padding reducido */}
      <div className="mx-auto w-full px-4"> {/* Padding mínimo */}
        <ScheduleManager />
      </div>
    </div>
  );
}