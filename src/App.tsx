import React, { useState, useEffect } from 'react';
import { User, Zap, Target, Shield, Eye } from 'lucide-react';
import ProfileSection from './components/ProfileSection';
import StatSection from './components/StatSection';
import TriggerSection from './components/TriggerSection';
import PreviewSection from './components/PreviewSection';
import { CharacterData, TriggerLibrary } from './types';

const initialData: CharacterData = {
  name: "",
  stats: {
    trion: 0,
    speed: 0,
    range: 0,
    attack: 0,
    defenseSupport: 0,
    special: 0
  },
  triggers: {
    main: [],
    sub: []
  }
};

const triggerLibrary: TriggerLibrary = {
  "攻撃用": {
    "攻撃手": ["弧月", "旋空", "幻踊", "スコーピオン", "レイガスト", "スラスター"],
    "射手": ["アステロイド", "ハウンド", "メテオラ", "バイパー"],
    "銃手": ["拳銃", "突撃銃", "散弾銃"],
    "狙撃手": ["イーグレット", "アイビス", "ライトニング"]
  },
  "防御用": ["シールド", "エスクード"],
  "オプション": ["カメレオン", "グラスホッパー", "スパイダー", "スタアメーカー", "バッグワーム", "鉛弾", "ダミービーコン"]
};

function App() {
  const [characterData, setCharacterData] = useState<CharacterData>(initialData);
  const [isVIP, setIsVIP] = useState(false);

  // Auto-generate trion for non-VIP users
  useEffect(() => {
    if (!isVIP && characterData.stats.trion === 0) {
      const randomTrion = Math.floor(Math.random() * 14) + 2; // 2-15
      setCharacterData(prev => ({
        ...prev,
        stats: { ...prev.stats, trion: randomTrion }
      }));
    }
  }, [isVIP, characterData.stats.trion]);

  const updateCharacterData = (path: string, value: any) => {
    setCharacterData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const toggleVIP = () => {
    setIsVIP(!isVIP);
    if (!isVIP) {
      // Reset trion when becoming VIP
      updateCharacterData('stats.trion', 0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff41' fill-opacity='0.1'%3E%3Cpath d='M30 30L0 0h30v30zM30 30l30-30v30H30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-green-500/20 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-orange-400 bg-clip-text text-transparent">
                  World Trigger
                </h1>
                <p className="text-gray-400 text-sm">Character Creator</p>
              </div>
            </div>
            
            <button
              onClick={toggleVIP}
              className={`px-4 py-2 rounded-lg border transition-all duration-300 font-medium ${
                isVIP
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-lg shadow-orange-500/25'
                  : 'bg-gray-800/50 text-gray-300 border-gray-600 hover:border-orange-400 hover:text-orange-400'
              }`}
            >
              {isVIP ? 'VIP Mode' : 'Standard Mode'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Settings */}
          <div className="lg:col-span-2 space-y-8">
            <ProfileSection
              data={characterData}
              isVIP={isVIP}
              onUpdate={updateCharacterData}
            />
            
            <StatSection
              data={characterData}
              isVIP={isVIP}
              onUpdate={updateCharacterData}
            />
            
            <TriggerSection
              data={characterData}
              triggerLibrary={triggerLibrary}
              onUpdate={updateCharacterData}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-1">
            <PreviewSection
              data={characterData}
              triggerLibrary={triggerLibrary}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;