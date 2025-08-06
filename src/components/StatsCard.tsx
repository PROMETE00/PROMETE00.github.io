import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardList, 
  faClock, 
  faCircleCheck, 
  faGear,
  faEye
} from '@fortawesome/free-solid-svg-icons';

type CardColor = 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'gray';

const iconMap: Record<string, IconDefinition> = {
  'clipboard-list': faClipboardList,
  'clock': faClock,
  'circle-check': faCircleCheck,
  'gear': faGear,
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
    <div className={`border-l-4 ${colorClasses[color]} p-4 rounded-lg shadow`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <FontAwesomeIcon 
          icon={iconMap[icon]} 
          className={`text-2xl ${colorClasses[color].split(' ')[1]}`} 
        />
      </div>
    </div>
  );
}