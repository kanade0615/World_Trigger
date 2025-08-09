import React from 'react';
import { Crosshair } from 'lucide-react';
import { SectionProps } from '../types';
import Card from './ui/Card';
import TriggerSlotGrid from './ui/TriggerSlotGrid';

const TriggerSection: React.FC<SectionProps> = ({ data, triggerLibrary, onUpdate }) => {
  if (!triggerLibrary) return null;

  return (
    <Card title="トリガー編成" icon={Crosshair}>
      <div className="space-y-6">
        <p className="text-sm text-gray-400">
          各枠をクリックしてトリガーを選択してください（メイン4、サブ4）
        </p>

        <TriggerSlotGrid
          data={data}
          triggerLibrary={triggerLibrary}
          onUpdate={onUpdate}
        />
      </div>
    </Card>
  );
};

export default TriggerSection;