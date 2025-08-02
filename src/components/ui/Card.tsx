import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, icon: Icon, children, className = '' }) => {
  return (
    <div className={`bg-gray-900/60 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 shadow-xl ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400/20 to-green-600/20 border border-green-500/30 flex items-center justify-center">
          <Icon className="w-4 h-4 text-green-400" />
        </div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default Card;