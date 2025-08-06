import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardList, 
  faCircleCheck, 
  faGear, 
  faClock,
  faEye
} from '@fortawesome/free-solid-svg-icons';

type CardColor = 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'gray';

const iconMap: Record<string, IconDefinition> = {
  'clipboard-list': faClipboardList,
  'circle-check': faCircleCheck,
  'gear': faGear,
  'clock': faClock,
  'eye': faEye
};

const colorClasses = {
  blue: 'border-blue-500 text-blue-500 bg-blue-50',
  yellow: 'border-yellow-500 text-yellow-500 bg-yellow-50',
  green: 'border-green-500 text-green-500 bg-green-50',
  red: 'border-red-500 text-red-500 bg-red-50',
  purple: 'border-purple-500 text-purple-500 bg-purple-50',
  gray: 'border-gray-500 text-gray-500 bg-gray-50'
};

interface StatsCardProps {
  title: string;
  value: number;
  icon: keyof typeof iconMap;
  color: CardColor;
}

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className={`border-l-4 ${colorClasses[color]} p-3 rounded-lg shadow h-full`}>
      <div className="flex justify-between items-center h-full">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-medium mb-1">{title}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
        <FontAwesomeIcon 
          icon={iconMap[icon]} 
          className="text-sm" // Iconos más pequeños
          color={colorClasses[color].split(' ')[1].replace('text-', '')}
        />
      </div>
    </div>
  );
}