import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { supabase, Database } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CharacterData } from '../../types';

type Character = Database['public']['Tables']['characters']['Row'];

interface CharacterListProps {
  onSelectCharacter: (character: CharacterData | null) => void;
  currentCharacter: CharacterData | null;
}

const CharacterList: React.FC<CharacterListProps> = ({ onSelectCharacter, currentCharacter }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCharacters();
    }
  }, [user]);

  const fetchCharacters = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCharacters(data || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCharacter = async (id: string) => {
    if (!confirm('このキャラクターを削除しますか？')) return;

    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCharacters(characters.filter(c => c.id !== id));
      
      // If the deleted character was currently selected, clear selection
      if (currentCharacter && characters.find(c => c.id === id)) {
        onSelectCharacter(null);
      }
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };

  const selectCharacter = (character: Character) => {
    const characterData: CharacterData = {
      name: character.name,
      stats: character.stats,
      triggers: character.triggers
    };
    onSelectCharacter(characterData);
  };

  if (loading) {
    return (
      <div className="bg-gray-900/60 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
          <User className="w-5 h-5 text-green-400" />
          <span>保存済みキャラクター</span>
        </h2>
        <button
          onClick={() => onSelectCharacter(null)}
          className="px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all duration-200 flex items-center space-x-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>新規作成</span>
        </button>
      </div>

      {characters.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>まだキャラクターが作成されていません</p>
          <p className="text-sm mt-2">新しいキャラクターを作成してみましょう</p>
        </div>
      ) : (
        <div className="space-y-3">
          {characters.map((character) => (
            <div
              key={character.id}
              className="p-4 rounded-lg bg-gray-800/50 border border-gray-600 hover:border-green-500/50 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white group-hover:text-green-400 transition-colors duration-200">
                    {character.name || 'Unnamed Agent'}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                    <span>トリオン: {character.stats.trion}</span>
                    <span>
                      合計: {character.stats.speed + character.stats.range + character.stats.attack + character.stats.defenseSupport + character.stats.special + character.stats.technique}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    更新: {new Date(character.updated_at).toLocaleDateString('ja-JP')}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => selectCharacter(character)}
                    className="p-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCharacter(character.id)}
                    className="p-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterList;