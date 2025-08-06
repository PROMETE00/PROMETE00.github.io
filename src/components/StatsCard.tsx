'use client';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardList, 
  faClock, 
  faCheckCircle, 
  faTimesCircle 
} from '@fortawesome/free-solid-svg-icons';

const iconMap: Record<string, IconDefinition> = {
  'clipboard-list': faClipboardList,
  'clock': faClock,
  'check-circle': faCheckCircle,
  'times-circle': faTimesCircle
};

const colorClasses = {
  blue: 'border-blue-500 text-blue-500',
  yellow: 'border-yellow-500 text-yellow-500',
  green: 'border-green-500 text-green-500',
  red: 'border-red-500 text-red-500'
};

type StatsCardProps = {
  title: string;
  value: number;
  icon: keyof typeof iconMap;
  color: keyof typeof colorClasses;
};

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className={`border-l-4 ${colorClasses[color]} p-4 bg-white rounded-lg shadow`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <FontAwesomeIcon 
          icon={iconMap[icon]} 
          className={`text-2xl ${colorClasses[color]}`} 
        />
      </div>
    </div>
  );
}