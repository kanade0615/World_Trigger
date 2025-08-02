import React from 'react';
import { Crosshair } from 'lucide-react';
import { SectionProps } from '../types';
import Card from './ui/Card';
import TriggerSelector from './ui/TriggerSelector';

const TriggerSection: React.FC<SectionProps> = ({ data, triggerLibrary, onUpdate }) => {
  if (!triggerLibrary) return null;

  return (
    <Card title="トリガー編成" icon={Crosshair}>
      <div className="space-y-6">
        <p className="text-sm text-gray-400">
          攻撃・防御・オプションから最大8つ（メイン4、サブ4）を選択
        </p>

        <div className="space-y-8">
          <TriggerSelector
            label="メイントリガー（最大4）"
            selectedTriggers={data.triggers.main}
            triggerLibrary={triggerLibrary}
            maxSelect={4}
            onUpdate={(triggers) => onUpdate('triggers.main', triggers)}
            variant="main"
          />

          <TriggerSelector
            label="サブトリガー（最大4）"
            selectedTriggers={data.triggers.sub}
            triggerLibrary={triggerLibrary}
            maxSelect={4}
            onUpdate={(triggers) => onUpdate('triggers.sub', triggers)}
            variant="sub"
          />
        </div>
      </div>
    </Card>
  );
};

export default TriggerSection;