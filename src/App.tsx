import React, { useState, useEffect } from 'react';
import { User, Zap, Target, Shield, Eye, LogIn, LogOut } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import LoginModal from './components/auth/LoginModal';
import CharacterList from './components/character/CharacterList';
import SaveCharacterButton from './components/character/SaveCharacterButton';
import ProfileSection from './components/ProfileSection';
import StatSection from './components/StatSection';
import TriggerSection from './components/TriggerSection';
import PreviewSection from './components/PreviewSection';
import { CharacterData, TriggerLibrary } from './types';

const initialData: CharacterData = {
  name: "",
  stats: {
    trion: 0,
    speed: 1,
    range: 1,
    attack: 1,
    defenseSupport: 1,
    special: 1,
    technique: 1
  },
  triggers: {
    main: [],
    sub: []
  }
};

const triggerLibrary: TriggerLibrary = [
  { "name": "弧月", "type": "攻撃手" },
  { "name": "旋空", "type": "攻撃手", "option": "弧月専用オプション" },
  { "name": "スコーピオン", "type": "攻撃手" },
  { "name": "レイガスト", "type": "攻撃手" },
  { "name": "スラスター", "type": "攻撃手", "option": "レイガスト専用オプション" },
  { "name": "アステロイド", "type": "射手" },
  { "name": "ハウンド", "type": "射手" },
  { "name": "メテオラ", "type": "射手" },
  { "name": "バイパー", "type": "射手" },
  { "name": "突撃銃アステロイド", "type": "銃手", "weapon": "突撃銃", "bullet": "アステロイド" },
  { "name": "突撃銃ハウンド", "type": "銃手", "weapon": "突撃銃", "bullet": "ハウンド" },
  { "name": "突撃銃メテオラ", "type": "銃手", "weapon": "突撃銃", "bullet": "メテオラ" },
  { "name": "突撃銃バイパー", "type": "銃手", "weapon": "突撃銃", "bullet": "バイパー" },
  { "name": "拳銃アステロイド", "type": "銃手", "weapon": "拳銃", "bullet": "アステロイド" },
  { "name": "拳銃ハウンド", "type": "銃手", "weapon": "拳銃", "bullet": "ハウンド" },
  { "name": "拳銃メテオラ", "type": "銃手", "weapon": "拳銃", "bullet": "メテオラ" },
  { "name": "拳銃バイパー", "type": "銃手", "weapon": "拳銃", "bullet": "バイパー" },
  { "name": "散弾銃アステロイド", "type": "銃手", "weapon": "散弾銃", "bullet": "アステロイド" },
  { "name": "散弾銃ハウンド", "type": "銃手", "weapon": "散弾銃", "bullet": "ハウンド" },
  { "name": "散弾銃メテオラ", "type": "銃手", "weapon": "散弾銃", "bullet": "メテオラ" },
  { "name": "散弾銃バイパー", "type": "銃手", "weapon": "散弾銃", "bullet": "バイパー" },
  { "name": "イーグレット", "type": "狙撃手" },
  { "name": "アイビス", "type": "狙撃手" },
  { "name": "ライトニング", "type": "狙撃手" },
  { "name": "シールド", "type": "防御" },
  { "name": "エスクード", "type": "防御" },
  { "name": "カメレオン", "type": "オプション" },
  { "name": "グラスホッパー", "type": "オプション" },
  { "name": "スパイダー", "type": "オプション" },
  { "name": "スタアメーカー", "type": "オプション" },
  { "name": "バッグワーム", "type": "オプション" },
  { "name": "鉛弾", "type": "オプション" },
  { "name": "ダミービーコン", "type": "オプション" }
];

function AppContent() {
  const [characterData, setCharacterData] = useState<CharacterData>(initialData);
  const [isVIP, setIsVIP] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userLimits, setUserLimits] = useState<{
    maxStatTotal: number;
    fixedTrion: number;
  } | null>(null);
  const { user, signOut, loading } = useAuth();

  // VIP email list
  const VIP_EMAILS = ['remiriazako@gmail.com'];
  const isVIPEligible = user && VIP_EMAILS.includes(user.email || '');

  // Generate or fetch user limits
  useEffect(() => {
    if (user && !isVIP) {
      generateOrFetchUserLimits();
    } else if (!user) {
      setUserLimits(null);
    }
  }, [user, isVIP]);

  const generateOrFetchUserLimits = async () => {
    if (!user) return;

    try {
      // Try to fetch existing limits from user metadata
      const { data: profile, error } = await supabase.auth.getUser();
      
      if (error) throw error;

      const metadata = profile.user?.user_metadata;
      
      if (metadata?.maxStatTotal && metadata?.fixedTrion) {
        // Use existing limits
        setUserLimits({
          maxStatTotal: metadata.maxStatTotal,
          fixedTrion: metadata.fixedTrion
        });
      } else {
        // Generate new limits and save them
        const maxStatTotal = 36; // Fixed at 36 for all users
        const fixedTrion = Math.floor(Math.random() * 4) + 5; // 5-8
        
        const newLimits = { maxStatTotal, fixedTrion };
        setUserLimits(newLimits);

        // Save to user metadata
        await supabase.auth.updateUser({
          data: newLimits
        });
      }
    } catch (error) {
      console.error('Error managing user limits:', error);
      // Fallback to random generation
      setUserLimits({
        maxStatTotal: 36,
        fixedTrion: Math.floor(Math.random() * 4) + 5
      });
    }
  };

  // Auto-generate trion for non-VIP users
  useEffect(() => {
    if (!isVIP && userLimits && characterData.stats.trion === 0) {
      setCharacterData(prev => ({
        ...prev,
        stats: { ...prev.stats, trion: userLimits.fixedTrion }
      }));
    }
  }, [isVIP, userLimits, characterData.stats.trion]);

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

  // Reset VIP mode if user is not eligible
  useEffect(() => {
    if (isVIP && !isVIPEligible) {
      setIsVIP(false);
    }
  }, [isVIP, isVIPEligible]);

  const toggleVIP = () => {
    if (!isVIPEligible) return;
    setIsVIP(!isVIP);
    if (!isVIP) {
      // Reset trion when becoming VIP
      updateCharacterData('stats.trion', 0);
    }
  };

  const handleSelectCharacter = (character: CharacterData | null) => {
    if (character) {
      setCharacterData(character);
    } else {
      setCharacterData(initialData);
    }
  };

  const handleSaveComplete = () => {
    // Refresh character list or perform other actions after save
  };

  // Calculate if stats are over limit
  const totalStats = characterData.stats.speed + characterData.stats.range + characterData.stats.attack + characterData.stats.defenseSupport + characterData.stats.technique;
  const maxTotal = isVIP ? 100 : (userLimits?.maxStatTotal || 38);
  const isOverLimit = !isVIP && totalStats > maxTotal;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">読み込み中...</p>
        </div>
      </div>
    );
  }

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
            
            <div className="flex items-center space-x-4">
              {user && (
                <SaveCharacterButton 
                  characterData={characterData}
                  isOverLimit={isOverLimit}
                  onSave={handleSaveComplete}
                />
              )}
              
              {user ? (
                <button
                  onClick={toggleVIP}
                  disabled={!isVIPEligible}
                  className={`px-4 py-2 rounded-lg border transition-all duration-300 font-medium ${
                    isVIP
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-lg shadow-orange-500/25'
                      : isVIPEligible
                      ? 'bg-gray-800/50 text-gray-300 border-gray-600 hover:border-orange-400 hover:text-orange-400'
                      : 'bg-gray-800/30 text-gray-500 border-gray-700 cursor-not-allowed opacity-50'
                  }`}
                  title={!isVIPEligible ? 'VIP権限がありません' : ''}
                >
                  {isVIP ? 'VIP Mode' : isVIPEligible ? 'Standard Mode' : 'VIP権限なし'}
                </button>
              ) : (
                <div className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/30 text-gray-500 font-medium">
                  ログインが必要
                </div>
              )}

              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-400">{user.email}</span>
                  <button
                    onClick={signOut}
                    className="px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-300 font-medium flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>ログアウト</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 rounded-lg border border-green-500/30 bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all duration-300 font-medium flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>ログイン</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Character List - Only show when logged in */}
          {user && (
            <div className="xl:col-span-1">
              <CharacterList
                onSelectCharacter={handleSelectCharacter}
                currentCharacter={characterData}
              />
            </div>
          )}

          {/* Left Column - Settings */}
          <div className={`${user ? 'xl:col-span-2' : 'xl:col-span-3'} space-y-8`}>
            <ProfileSection
              data={characterData}
              isVIP={isVIP}
              user={user}
              userLimits={userLimits}
              onUpdate={updateCharacterData}
            />
            
            <StatSection
              data={characterData}
              isVIP={isVIP}
              user={user}
              userLimits={userLimits}
              onUpdate={updateCharacterData}
            />
            
            <TriggerSection
              data={characterData}
              triggerLibrary={triggerLibrary}
              onUpdate={updateCharacterData}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="xl:col-span-1">
            <PreviewSection
              data={characterData}
              triggerLibrary={triggerLibrary}
            />
          </div>
        </div>
      </main>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;