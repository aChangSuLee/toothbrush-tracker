import React, { useState, useEffect, useRef } from 'react';
import { Ingredient } from '../types/pokemon';

interface IngredientSelectProps {
  onSelect: (ingredients: Ingredient[]) => void;
  maxSlots?: number;
  availableIngredients: Ingredient[];
  pokemonId: string;
  selectedIngredients?: Ingredient[];
}

const IngredientSelect: React.FC<IngredientSelectProps> = ({ onSelect, maxSlots = 3, availableIngredients, pokemonId, selectedIngredients: initialIngredients }) => {
  const [selectedIngredients, setSelectedIngredients] = useState<(Ingredient | null)[]>(() => {
    if (initialIngredients) {
      return initialIngredients.map((ing: Ingredient) => ({ ...ing, pokemonId })) as (Ingredient | null)[];
    }
    return Array(maxSlots).fill(null);
  });
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [searchTerms, setSearchTerms] = useState<string[]>(Array(maxSlots).fill(''));
  const searchInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // 드롭다운이 열릴 때 해당 검색 입력란에 포커스
    if (activeDropdown !== null && searchInputRefs.current[activeDropdown]) {
      searchInputRefs.current[activeDropdown]?.focus();
    }
  }, [activeDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdowns = document.querySelectorAll('.ingredient-dropdown');
      let isClickInside = false;

      dropdowns.forEach((dropdown) => {
        if (dropdown.contains(target)) {
          isClickInside = true;
        }
      });

      if (!isClickInside) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (ingredient: Ingredient | null, slotIndex: number) => {
    const newSelectedIngredients = [...selectedIngredients];
    newSelectedIngredients[slotIndex] = ingredient ? { ...ingredient, pokemonId } : null;
    setSelectedIngredients(newSelectedIngredients);
    onSelect(newSelectedIngredients.filter(Boolean) as Ingredient[]);
  };

  const handleSearchChange = (slotIndex: number, term: string) => {
    const newTerms = [...searchTerms];
    newTerms[slotIndex] = term;
    setSearchTerms(newTerms);
  };

  const getFilteredIngredients = (slotIndex: number) => {
    const searchTerm = searchTerms[slotIndex].toLowerCase();
    return availableIngredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchTerm)
    );
  };

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold text-black">식재료 선택</h3>
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: maxSlots }).map((_, index) => (
          <div key={index} className="relative">
            <button
              className="w-full p-3 text-left bg-white border rounded-lg shadow-sm text-black hover:bg-gray-50 focus:outline-none"
              onClick={() => {
                setActiveDropdown(activeDropdown === index ? null : index);
                if (activeDropdown !== index) {
                  setSearchTerms(prev => {
                    const newTerms = [...prev];
                    newTerms[index] = '';
                    return newTerms;
                  });
                }
              }}
            >
              {selectedIngredients[index]?.name || '선택 없음'}
            </button>

            {activeDropdown === index && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg ingredient-dropdown">
                <div className="p-2 border-b">
                  <input
                    ref={(el) => {
                      searchInputRefs.current[index] = el;
                    }}
                    type="text"
                    className="w-full p-2 border rounded-md text-black"
                    placeholder="식재료 검색..."
                    value={searchTerms[index]}
                    onChange={(e) => handleSearchChange(index, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="max-h-60 overflow-auto">
                  <button
                    className="w-full p-2 text-left text-black hover:bg-gray-100"
                    onClick={() => {
                      handleSelect(null, index);
                      setActiveDropdown(null);
                    }}
                  >
                    선택 없음
                  </button>
                  {getFilteredIngredients(index).map((ingredient) => (
                    <button
                      key={ingredient.id}
                      className="w-full p-2 text-left text-black hover:bg-gray-100"
                      onClick={() => {
                        handleSelect(ingredient, index);
                        setActiveDropdown(null);
                      }}
                    >
                      {ingredient.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientSelect; 