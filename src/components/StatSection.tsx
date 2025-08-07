import React from 'react';
import { Activity, Target, Sword, Shield, Zap } from 'lucide-react';
import { SectionProps } from '../types';
import Card from './ui/Card';
import NumberInput from './ui/NumberInput';

interface StatSectionProps extends SectionProps {
  user?: any;
  userLimits?: {
    maxStatTotal: number;
    fixedTrion: number;
  } | null;
}

const StatSection: React.FC<StatSectionProps> = ({ data, isVIP, onUpdate, user, userLimits }) => {
  const VIP_EMAILS = ['remiriazako@gmail.com'];
  const isVIPEligible = user && VIP_EMAILS.includes(user.email || '');

  const stats = data.stats;
  const totalStats = stats.speed + stats.range + stats.attack + stats.defenseSupport + stats.special;
  const maxTotal = isVIP ? 100 : (userLimits?.maxStatTotal || 38);
  const isOverLimit = totalStats > maxTotal;

  const statItems = [
    { key: 'speed', label: '速度', icon: Activity, color: 'text-green-400' },
    { key: 'range', label: '射程', icon: Target, color: 'text-blue-400' },
    { key: 'attack', label: '攻撃', icon: Sword, color: 'text-red-400' },
    { key: 'defenseSupport', label: '防御援護', icon: Shield, color: 'text-yellow-400' },
    { key: 'special', label: '特殊戦闘', icon: Zap, color: 'text-purple-400' },
  ];

  return (
    <Card title="身体能力設定" icon={Activity}>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700">
          <span className="text-sm text-gray-300">合計値</span>
          <div className="flex items-center space-x-2">
            <span className={`font-bold ${isOverLimit ? 'text-red-400' : 'text-green-400'}`}>
              {totalStats}
            </span>
            <span className="text-gray-400">/ {maxTotal}</span>
          </div>
        </div>

        {!isVIP && (
          <p className="text-xs text-gray-400 flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            速度・射程・攻撃・防御援護・特殊戦闘の合計が{maxTotal}以下（アカウント固有値）
            {isVIPEligible ? '（VIPは制限なし）' : '（VIP権限が必要）'}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statItems.map(({ key, label, icon: Icon, color }) => (
            <NumberInput
              key={key}
              label={label}
              value={stats[key as keyof typeof stats]}
              onChange={(value) => onUpdate(`stats.${key}`, value)}
              min={0}
              max={isVIP ? 20 : 15}
              icon={Icon}
              iconColor={color}
            />
          ))}
        </div>

        {isOverLimit && !isVIP && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 text-sm font-medium">
              ⚠️ 合計値が制限を超えています。
              {isVIPEligible ? 'VIPモードに切り替えるか、' : ''}値を調整してください。
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatSection;