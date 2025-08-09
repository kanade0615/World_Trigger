import React, { useState } from 'react';
import { Plus, X, Sword, Shield, Zap, Target, Crosshair } from 'lucide-react';
import { TriggerLibrary, Trigger, CharacterData } from '../../types';

interface TriggerSlotGridProps {
  data: CharacterData;
  triggerLibrary: TriggerLibrary;
  onUpdate: (path: string, value: any) => void;
}

const TriggerSlotGrid: React.FC<TriggerSlotGridProps> = ({ data, triggerLibrary, onUpdate }) => {
  const [selectedSlot, setSelectedSlot] = useState<{ type: 'main' | 'sub', index: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');

  const getTrigger = (triggerName: string): Trigger | undefined => {
    return triggerLibrary.find(trigger => trigger.name === triggerName);
  };

  const getTriggerIcon = (triggerName: string) => {
    if (!triggerName) return Plus;
    const trigger = getTrigger(triggerName);
    if (!trigger) return Crosshair;
    
    switch (trigger.type) {
      case '攻撃手':
      case '射手':
      case '銃手':
      case '狙撃手':
        return Sword;
      case '防御': return Shield;
      case 'オプション': return Zap;
      default: return Crosshair;
    }
  };

  const getCategoryColor = (triggerName: string) => {
    if (!triggerName) return 'from-gray-800/50 to-gray-700/50 border-gray-600/30 text-gray-500';
    
    const trigger = getTrigger(triggerName);
    if (!trigger) return 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-400';
    
    switch (trigger.type) {
      case '攻撃手':
      case '射手':
      case '銃手':
      case '狙撃手':
        return 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-400';
      case '防御': return 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400';
      case 'オプション': return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 text-yellow-400';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-400';
    }
  };

  const getUniqueTypes = () => {
    const types = new Set(triggerLibrary.map(t => t.type));
    return Array.from(types);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '攻撃手':
      case '射手':
      case '銃手':
      case '狙撃手':
        return 'border-red-500/50 bg-red-500/10 text-red-400';
      case '防御': return 'border-blue-500/50 bg-blue-500/10 text-blue-400';
      case 'オプション': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400';
      default: return 'border-gray-500/50 bg-gray-500/10 text-gray-400';
    }
  };

  const openSlotSelector = (type: 'main' | 'sub', index: number) => {
    setSelectedSlot({ type, index });
    setIsModalOpen(true);
    setSelectedType('');
  };

  const selectTrigger = (triggerName: string) => {
    if (!selectedSlot) return;

    const { type, index } = selectedSlot;
    const currentTriggers = [...data.triggers[type]];
    
    // Ensure array has enough slots
    while (currentTriggers.length <= index) {
      currentTriggers.push('');
    }
    
    currentTriggers[index] = triggerName;
    onUpdate(`triggers.${type}`, currentTriggers);
    
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const clearSlot = (type: 'main' | 'sub', index: number) => {
    const currentTriggers = [...data.triggers[type]];
    if (currentTriggers[index]) {
      currentTriggers[index] = '';
      onUpdate(`triggers.${type}`, currentTriggers);
    }
  };

  const renderSlot = (type: 'main' | 'sub', index: number) => {
    // Ensure we have enough slots in the array
    const triggers = data.triggers[type];
    const triggerName = triggers[index] || '';
    const isEmpty = !triggerName;
    const Icon = getTriggerIcon(triggerName);
    const colorClass = getCategoryColor(triggerName);
    const slotColor = type === 'main' ? 'border-green-500/30' : 'border-orange-500/30';
    
    return (
      <div
        key={`${type}-${index}`}
        className={`relative w-20 h-20 rounded-lg border-2 ${isEmpty ? slotColor : ''} bg-gradient-to-br ${colorClass} flex flex-col items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 ${
          !isEmpty ? 'shadow-lg' : 'hover:bg-gray-700/30'
        }`}
        onClick={() => openSlotSelector(type, index)}
      >
        <Icon className="w-5 h-5 mb-1" />
        {triggerName && (
          <>
            <span className="text-xs font-medium text-center leading-tight px-1 truncate w-full">
              {triggerName}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSlot(type, index);
              }}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors duration-200 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        )}
        {isEmpty && (
          <span className="text-xs text-gray-500 mt-1">空き</span>
        )}
      </div>
    );
  };

  const filteredTriggers = triggerLibrary.filter(trigger => 
    !selectedType || trigger.type === selectedType
  );

  return (
    <div className="space-y-6">
      {/* Main Triggers */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-green-400 flex items-center space-x-2">
          <Target className="w-4 h-4" />
          <span>メイントリガー</span>
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }, (_, index) => renderSlot('main', index))}
        </div>
      </div>

      {/* Sub Triggers */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-orange-400 flex items-center space-x-2">
          <Crosshair className="w-4 h-4" />
          <span>サブトリガー</span>
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }, (_, index) => renderSlot('sub', index))}
        </div>
      </div>

      {/* Selection Modal */}
      {isModalOpen && selectedSlot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-green-500/20 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {selectedSlot.type === 'main' ? 'メイン' : 'サブ'}トリガー選択 - スロット {selectedSlot.index + 1}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedSlot(null);
                }}
                className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors duration-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedType('')}
                className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                  !selectedType 
                    ? 'border-green-500 bg-green-500/20 text-green-400' 
                    : 'border-gray-600 bg-gray-800/50 text-gray-400 hover:border-gray-500'
                }`}
              >
                すべて
              </button>
              {getUniqueTypes().map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                    selectedType === type
                      ? getTypeColor(type)
                      : 'border-gray-600 bg-gray-800/50 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Clear Option */}
            <div className="mb-4">
              <button
                onClick={() => selectTrigger('')}
                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-800 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>空きにする</span>
              </button>
            </div>

            {/* Trigger Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredTriggers.map((trigger) => {
                const { name, type, option, weapon, bullet } = trigger;
                const currentTrigger = data.triggers[selectedSlot.type][selectedSlot.index];
                const isSelected = currentTrigger === name;
                
                return (
                  <button
                    key={name}
                    onClick={() => selectTrigger(name)}
                    className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-green-500 bg-green-500/20 text-green-400'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500 hover:bg-gray-800'
                    }`}
                  >
                    <div className="font-medium">{name}</div>
                    <div className="text-xs text-gray-500 mt-1">{type}</div>
                    {option && (
                      <div className="text-xs text-gray-400 mt-1">{option}</div>
                    )}
                    {weapon && bullet && (
                      <div className="text-xs text-gray-400 mt-1">{weapon} + {bullet}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriggerSlotGrid;