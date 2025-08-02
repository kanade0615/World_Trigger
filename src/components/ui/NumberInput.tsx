import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  disabled = false,
  icon: Icon,
  iconColor = 'text-green-400'
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 flex items-center space-x-2">
        {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
        <span>{label}</span>
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          disabled={disabled}
          className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
          {min}-{max}
        </div>
      </div>
    </div>
  );
};

export default NumberInput;