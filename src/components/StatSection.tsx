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
  const totalStats = stats.speed + stats.range + stats.attack + stats.defenseSupport + stats.technique;
  const maxTotal = isVIP ? 100 : (userLimits?.maxStatTotal || 36);
  const isOverLimit = totalStats > maxTotal;

  // Validate minimum requirements
  const hasMinimumRequirements = stats.technique >= 8 && stats.defenseSupport >= 6 && stats.attack >= 7;

  const statItems = [
    { key: 'speed', label: '速度', icon: Activity, color: 'text-green-400' },
    { key: 'range', label: '射程', icon: Target, color: 'text-blue-400' },
    { key: 'attack', label: '攻撃', icon: Sword, color: 'text-red-400' },
    { key: 'defenseSupport', label: '防御援護', icon: Shield, color: 'text-yellow-400' },
    { key: 'technique', label: '技術', icon: Target, color: 'text-cyan-400' },
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
            速度・射程・攻撃・防御援護・技術の合計が{maxTotal}（全員固定）
            {isVIPEligible ? '（VIPは制限なし）' : '（VIP権限が必要）'}
          </p>
        )}

        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <p className="text-blue-400 text-sm font-medium mb-2">必須条件:</p>
          <div className="space-y-1 text-xs">
            <div className={`flex items-center space-x-2 ${stats.technique >= 8 ? 'text-green-400' : 'text-red-400'}`}>
              <span>•</span>
              <span>技術: 最低8 (現在: {stats.technique})</span>
            </div>
            <div className={`flex items-center space-x-2 ${stats.defenseSupport >= 6 ? 'text-green-400' : 'text-red-400'}`}>
              <span>•</span>
              <span>防御援護: 最低6 (現在: {stats.defenseSupport})</span>
            </div>
            <div className={`flex items-center space-x-2 ${stats.attack >= 7 ? 'text-green-400' : 'text-red-400'}`}>
              <span>•</span>
              <span>攻撃: 最低7 (現在: {stats.attack})</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {statItems.map(({ key, label, icon: Icon, color }) => (
            <NumberInput
              key={key}
              label={label}
              value={stats[key as keyof typeof stats]}
              onChange={(value) => onUpdate(`stats.${key}`, value)}
              min={key === 'technique' ? 8 : key === 'defenseSupport' ? 6 : key === 'attack' ? 7 : 1}
              max={isVIP ? 20 : 15}
              icon={Icon}
              iconColor={color}
            />
          ))}
        </div>

        {(!hasMinimumRequirements || (isOverLimit && !isVIP)) && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 text-sm font-medium">
              ⚠️ {!hasMinimumRequirements ? '必須条件を満たしていません。' : '合計値が制限を超えています。'}
              {isVIPEligible && isOverLimit ? 'VIPモードに切り替えるか、' : ''}値を調整してください。
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatSection;