import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { TriggerLibrary, Trigger } from '../../types';

interface TriggerSelectorProps {
  label: string;
  selectedTriggers: string[];
  triggerLibrary: TriggerLibrary;
  maxSelect: number;
  onUpdate: (triggers: string[]) => void;
  variant: 'main' | 'sub';
}

const TriggerSelector: React.FC<TriggerSelectorProps> = ({
  label,
  selectedTriggers,
  triggerLibrary,
  maxSelect,
  onUpdate,
  variant
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');

  const getAllTriggers = (): Trigger[] => {
    return triggerLibrary || [];
  };

  const filteredTriggers = getAllTriggers().filter(trigger => 
    !selectedType || trigger.type === selectedType
  );

  const getUniqueTypes = () => {
    const types = new Set(triggerLibrary?.map(t => t.type) || []);
    return Array.from(types);
  };

  const addTrigger = (triggerName: string) => {
    if (selectedTriggers.length < maxSelect && !selectedTriggers.includes(triggerName)) {
      onUpdate([...selectedTriggers, triggerName]);
    }
  };

  const removeTrigger = (triggerName: string) => {
    onUpdate(selectedTriggers.filter(t => t !== triggerName));
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

  const variantColor = variant === 'main' ? 'green' : 'orange';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">{label}</h3>
        <span className="text-xs text-gray-500">{selectedTriggers.length}/{maxSelect}</span>
      </div>

      {/* Selected Triggers */}
      <div className="flex flex-wrap gap-2">
        {selectedTriggers.map((trigger) => {
          const triggerInfo = triggerLibrary?.find(t => t.name === trigger);
          return (
            <div
              key={trigger}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getTypeColor(triggerInfo?.type || '')}`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{trigger}</span>
                {triggerInfo?.option && (
                  <span className="text-xs opacity-75">{triggerInfo.option}</span>
                )}
                {triggerInfo?.weapon && triggerInfo?.bullet && (
                  <span className="text-xs opacity-75">{triggerInfo.weapon} + {triggerInfo.bullet}</span>
                )}
              </div>
              <button
                onClick={() => removeTrigger(trigger)}
                className="w-4 h-4 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors duration-200 flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Trigger Button */}
      {selectedTriggers.length < maxSelect && (
        <button
          onClick={() => setIsModalOpen(true)}
          className={`w-full px-4 py-3 rounded-lg border-2 border-dashed border-${variantColor}-500/50 text-${variantColor}-400 hover:border-${variantColor}-500 hover:bg-${variantColor}-500/10 transition-all duration-200 flex items-center justify-center space-x-2`}
        >
          <Plus className="w-4 h-4" />
          <span>トリガーを追加</span>
        </button>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-green-500/20 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">トリガーを選択</h3>
              <button
                onClick={() => setIsModalOpen(false)}
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

            {/* Trigger Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredTriggers.map((trigger) => {
                const { name, type, option, weapon, bullet } = trigger;
                const isSelected = selectedTriggers.includes(name);
                const isDisabled = selectedTriggers.length >= maxSelect && !isSelected;
                
                return (
                  <button
                    key={name}
                    onClick={() => addTrigger(name)}
                    disabled={isDisabled}
                    className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                      isSelected
                        ? `border-${variantColor}-500 bg-${variantColor}-500/20 text-${variantColor}-400`
                        : isDisabled
                        ? 'border-gray-700 bg-gray-800/30 text-gray-600 cursor-not-allowed'
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

export default TriggerSelector;