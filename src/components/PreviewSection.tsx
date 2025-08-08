import React from 'react';
import { Eye } from 'lucide-react';
import { SectionProps } from '../types';
import Card from './ui/Card';
import StatRadarChart from './ui/StatRadarChart';
import TriggerIconGrid from './ui/TriggerIconGrid';

const PreviewSection: React.FC<SectionProps> = ({ data, triggerLibrary }) => {
  return (
    <div className="space-y-8 sticky top-8">
      <Card title="キャラクタープレビュー" icon={Eye}>
        <div className="space-y-8">
          {/* Character Name Display */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              {data.name || 'Unknown Agent'}
            </h3>
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-400">
              <span>トリオン: {data.stats.trion}</span>
              <span>•</span>
              <span>
                合計: {data.stats.speed + data.stats.range + data.stats.attack + data.stats.defenseSupport + data.stats.technique}
              </span>
            </div>
          </div>

          {/* Trigger Grid */}
          <TriggerIconGrid triggers={data.triggers} triggerLibrary={triggerLibrary} />
        </div>
      </Card>
    </div>
  );
};

export default PreviewSection;