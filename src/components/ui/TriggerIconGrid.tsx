import React from 'react';
import { Sword, Shield, Zap, Target, Crosshair } from 'lucide-react';
import { TriggerLibrary } from '../../types';

interface TriggerIconGridProps {
  triggers: {
    main: string[];
    sub: string[];
  };
  triggerLibrary?: TriggerLibrary;
}

const TriggerIconGrid: React.FC<TriggerIconGridProps> = ({ triggers, triggerLibrary }) => {
  const getTriggerCategory = (triggerName: string) => {
    if (!triggerLibrary) return 'unknown';
    
    for (const [category, content] of Object.entries(triggerLibrary)) {
      if (Array.isArray(content)) {
        if (content.includes(triggerName)) return category;
      } else {
        for (const triggers of Object.values(content)) {
          if (triggers.includes(triggerName)) return category;
        }
      }
    }
    return 'unknown';
  };

  const getTriggerIcon = (triggerName: string) => {
    const category = getTriggerCategory(triggerName);
    switch (category) {
      case '攻撃用': return Sword;
      case '防御用': return Shield;
      case 'オプション': return Zap;
      default: return Crosshair;
    }
  };

  const getCategoryColor = (triggerName: string) => {
    const category = getTriggerCategory(triggerName);
    switch (category) {
      case '攻撃用': return 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400';
      case '防御用': return 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400';
      case 'オプション': return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-400';
    }
  };

  const renderTriggerSlots = (triggerList: string[], type: 'main' | 'sub', maxSlots: number) => {
    const slots = Array.from({ length: maxSlots }, (_, index) => {
      const trigger = triggerList[index];
      const isEmpty = !trigger;
      const Icon = trigger ? getTriggerIcon(trigger) : Target;
      const colorClass = trigger ? getCategoryColor(trigger) : 'from-gray-800/50 to-gray-700/50 border-gray-600/30 text-gray-500';
      
      return (
        <div
          key={index}
          className={`w-16 h-16 rounded-lg border bg-gradient-to-br ${colorClass} flex flex-col items-center justify-center transition-all duration-200 ${
            !isEmpty ? 'shadow-lg' : ''
          }`}
        >
          <Icon className="w-5 h-5 mb-1" />
          {trigger && (
            <span className="text-xs font-medium text-center leading-tight px-1 truncate w-full">
              {trigger}
            </span>
          )}
        </div>
      );
    });

    return (
      <div className="space-y-2">
        <h4 className={`text-sm font-medium ${type === 'main' ? 'text-green-400' : 'text-orange-400'}`}>
          {type === 'main' ? 'メイン' : 'サブ'}
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {slots}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-medium text-gray-300 text-center">トリガー構成</h3>
      
      {renderTriggerSlots(triggers.main, 'main', 4)}
      {renderTriggerSlots(triggers.sub, 'sub', 4)}
      
      <div className="text-center text-xs text-gray-500">
        {triggers.main.length + triggers.sub.length}/8 選択済み
      </div>
    </div>
  );
};

export default TriggerIconGrid;