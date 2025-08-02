import React from 'react';
import { User, Zap } from 'lucide-react';
import { SectionProps } from '../types';
import Card from './ui/Card';
import NumberInput from './ui/NumberInput';
import TextInput from './ui/TextInput';

const ProfileSection: React.FC<SectionProps> = ({ data, isVIP, onUpdate }) => {
  return (
    <Card title="プロフィール設定" icon={User}>
      <div className="space-y-6">
        <TextInput
          label="名前"
          value={data.name}
          onChange={(value) => onUpdate('name', value)}
          placeholder="プレイヤー名を入力"
        />
        
        <div className="relative">
          <NumberInput
            label="トリオン"
            value={data.stats.trion}
            onChange={(value) => onUpdate('stats.trion', value)}
            disabled={!isVIP}
            min={isVIP ? 0 : 2}
            max={isVIP ? 100 : 15}
            icon={Zap}
          />
          {!isVIP && (
            <p className="mt-2 text-xs text-gray-400 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              一般ユーザーは自動設定（2〜15）
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileSection;