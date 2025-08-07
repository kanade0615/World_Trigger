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
    special: 1
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

function AppContent() {
  const [characterData, setCharacterData] = useState<CharacterData>(initialData);
  const [isVIP, setIsVIP] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userLimits, setUserLimits] = useState<{
    maxStatTotal: number;
    fixedTrion: number;
  } | null>(null);
  const { user, signOut, loading } = useAuth();
