
import React, { useState, useEffect } from 'react';
import { Pokemon } from '../types/pokemon';
import { getPokemons } from '../utils/dataLoader';

interface PokemonSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pokemon: Pokemon) => void;
}

const PokemonSelectModal: React.FC<PokemonSelectModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPokemons = async () => {
      setIsLoading(true);
      try {
        const data = await getPokemons();
        setPokemons(data);
      } catch (error) {
        console.error('포켓몬 데이터를 불러오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadPokemons();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemons(filtered);
    } else {
      setFilteredPokemons(pokemons);
    }
  }, [searchTerm, pokemons]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-black">포켓몬 선택</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="포켓몬 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {isLoading ? (
            <p className="text-black">로딩 중...</p>
          ) : (
            filteredPokemons.map((pokemon) => (
              <button
                key={pokemon.id}
                className="w-full p-2 text-left hover:bg-gray-100 rounded text-black"
                onClick={() => {
                  onSelect(pokemon);
                  onClose();
                }}
              >
                {pokemon.name}
              </button>
            ))
          )}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default PokemonSelectModal; 