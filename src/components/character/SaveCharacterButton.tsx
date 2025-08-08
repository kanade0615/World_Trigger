import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CharacterData } from '../../types';

interface SaveCharacterButtonProps {
  characterData: CharacterData;
  isOverLimit?: boolean;
  onSave?: () => void;
}

const SaveCharacterButton: React.FC<SaveCharacterButtonProps> = ({ characterData, isOverLimit = false, onSave }) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();

  const saveCharacter = async () => {
    if (!user || !characterData.name.trim() || isOverLimit) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('characters')
        .upsert({
          user_id: user.id,
          name: characterData.name,
          stats: characterData.stats,
          triggers: characterData.triggers,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSaved(true);
      onSave?.();
      
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving character:', error);
    } finally {
      setSaving(false);
    }
  };

  const isDisabled = !user || !characterData.name.trim() || saving || isOverLimit;

  return (
    <button
      onClick={saveCharacter}
      disabled={isDisabled}
      className={`px-4 py-2 rounded-lg border font-medium transition-all duration-300 flex items-center space-x-2 ${
        saved
          ? 'bg-green-500/20 border-green-500/50 text-green-400'
          : isOverLimit
          ? 'bg-red-500/20 border-red-500/50 text-red-400 cursor-not-allowed'
          : isDisabled
          ? 'bg-gray-800/50 border-gray-600 text-gray-500 cursor-not-allowed'
          : 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30 hover:border-green-500/50'
      }`}
      title={isOverLimit ? '身体能力の合計値が上限を超えています' : ''}
    >
      {saved ? (
        <>
          <Check className="w-4 h-4" />
          <span>保存完了</span>
        </>
      ) : isOverLimit ? (
        <>
          <Save className="w-4 h-4" />
          <span>上限超過</span>
        </>
      ) : (
        <>
          <Save className="w-4 h-4" />
          <span>{saving ? '保存中...' : 'キャラクター保存'}</span>
        </>
      )}
    </button>
  );
};

export default SaveCharacterButton;