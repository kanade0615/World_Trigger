import React from 'react';
import { User, Zap } from 'lucide-react';
import { SectionProps } from '../types';
import Card from './ui/Card';
import NumberInput from './ui/NumberInput';
import TextInput from './ui/TextInput';

interface ProfileSectionProps extends SectionProps {
  user?: any;
  userLimits?: {
    maxStatTotal: number;
    fixedTrion: number;
  } | null;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ data, isVIP, onUpdate, user, userLimits }) => {
  const VIP_EMAILS = ['remiriazako@gmail.com'];
  const isVIPEligible = user && VIP_EMAILS.includes(user.email || '');

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
              {isVIPEligible 
                ? `一般ユーザーは固定値（${userLimits?.fixedTrion || '取得中...'}）` 
                : `VIP権限が必要です（固定値：${userLimits?.fixedTrion || '取得中...'}）`
              }
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileSection;