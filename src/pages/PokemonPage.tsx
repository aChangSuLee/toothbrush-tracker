import React, { useState, useEffect } from 'react';
import PokemonSelectModal from '../components/PokemonSelectModal';
import IngredientSelect from '../components/IngredientSelect';
import RecipeList from '../components/RecipeList';
import { Pokemon, Ingredient, PokemonSelection } from '../types/pokemon';
import { getIngredients } from '../utils/dataLoader';
import { setCookie, getCookie } from '../utils/cookie';

const PokemonIngredientPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPokemonIndex, setCurrentPokemonIndex] = useState<number | null>(null);
  const [pokemonSelections, setPokemonSelections] = useState<PokemonSelection[]>([]);

  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const data = await getIngredients();
        setAllIngredients(data);
      } catch (error) {
        console.error('식재료 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    loadIngredients();
  }, []);

  useEffect(() => {
    // 쿠키에서 데이터를 로드
    const loadFromCookie = () => {
      const savedSelections = getCookie('pokemon_selections');
      if (savedSelections) {
        try {
          const selections = JSON.parse(savedSelections) as PokemonSelection[];
          console.log('로드된 포켓몬 선택:', selections);
          setPokemonSelections(selections.map((selection: PokemonSelection) => ({
            ...selection,
            ingredients: selection.ingredients.map((ing: Ingredient) => ({
              ...ing,
              id: String(ing.id),
              name: String(ing.name),
              pokemonId: String(ing.pokemonId)
            }))
          })));
        } catch (error) {
          console.error('포켓몬 선택 정보를 불러오는 중 오류 발생:', error);
        }
      }
    };

    // allIngredients가 로드된 후에 쿠키를 로드
    if (allIngredients.length > 0) {
      loadFromCookie();
    }
  }, [allIngredients]);

  useEffect(() => {
    // 포켓몬과 식재료 선택 정보를 쿠키에 저장
    if (pokemonSelections.length > 0) {
      const selectionsToSave: PokemonSelection[] = pokemonSelections.map((selection: PokemonSelection) => {
        console.log('저장할 포켓몬 선택:', selection);
        return {
          pokemon: {
            id: String(selection.pokemon.id),
            name: String(selection.pokemon.name),
            ingredients: allIngredients.filter(ing =>
              selection.pokemon.ingredients.some(pIng => pIng.id === ing.id)
            )
          },
          ingredients: selection.ingredients.map((ing: Ingredient) => ({
            ...ing,
            id: String(ing.id),
            name: String(ing.name),
            pokemonId: String(ing.pokemonId)
          }))
        };
      });
      console.log('쿠키에 저장된 데이터:', selectionsToSave);
      setCookie('pokemon_selections', JSON.stringify(selectionsToSave));
    }
  }, [pokemonSelections, allIngredients]);

  useEffect(() => {
    // 식재료만 따로 저장
    const allIngredients = pokemonSelections.flatMap(selection =>
      selection.ingredients.map((ing: Ingredient) => ({
        ...ing,
        pokemonId: selection.pokemon.id
      }))
    );
    setCookie('selected_ingredients', JSON.stringify(allIngredients));
  }, [pokemonSelections]);

  // 컴포넌트 마운트 시 식재료 쿠키도 읽어오기
  useEffect(() => {
    const savedSelections = getCookie('pokemon_selections');
    if (savedSelections) {
      const selections = JSON.parse(savedSelections);
      // 포켓몬 ID를 기반으로 식재료를 올바르게 연결
      const updatedSelections = selections.map((selection: PokemonSelection) => ({
        ...selection,
        ingredients: selection.ingredients.map(ing => ({
          ...ing,
          pokemonId: selection.pokemon.id
        }))
      }));
      setPokemonSelections(updatedSelections);
    }
  }, []);

  const handleAddPokemon = () => {
    if (pokemonSelections.length < 5) {
      setCurrentPokemonIndex(pokemonSelections.length);
      setIsModalOpen(true);
    }
  };

  const handleDeletePokemon = (index: number) => {
    const newSelections = pokemonSelections.filter((_, i) => i !== index);
    setPokemonSelections(newSelections);
  };

  const handlePokemonSelect = (pokemon: Pokemon) => {
    if (currentPokemonIndex !== null) {
      const newSelections = [...pokemonSelections];
      newSelections[currentPokemonIndex] = {
        pokemon,
        ingredients: [],
      };
      setPokemonSelections(newSelections);
    }
  };

  const handleIngredientSelect = (index: number, ingredients: Ingredient[]) => {
    if (index >= 0 && index < pokemonSelections.length) {
      const newSelections = [...pokemonSelections];
      const pokemon = newSelections[index].pokemon;
      newSelections[index] = {
        pokemon,
        ingredients: ingredients.map((ing: Ingredient) => ({
          ...ing,
          pokemonId: pokemon.id
        })),
      };
      setPokemonSelections(newSelections);
    }
  };

  // Calculate all selected ingredients
  const allSelectedIngredients = pokemonSelections.flatMap(selection =>
    selection.ingredients
  );

  return (
    <div className="w-full h-full p-4">
      <h1 className="text-2xl font-bold mb-6 text-black">포켓몬 및 식재료 선택</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {pokemonSelections.map((selection, index) => (
          <div key={index} className="max-w-[400px] border p-4 rounded-lg bg-white shadow-sm relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-black">
                {selection.pokemon.name}
              </h2>
              <button
                onClick={() => handleDeletePokemon(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
            <IngredientSelect
              onSelect={(ingredients) => handleIngredientSelect(index, ingredients)}
              availableIngredients={selection.pokemon.ingredients}
              pokemonId={selection.pokemon.id}
              selectedIngredients={selection.ingredients}
            />
          </div>
        ))}

        {pokemonSelections.length < 5 && (
          <button
            className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 bg-white"
            onClick={handleAddPokemon}
          >
            + 포켓몬 추가
          </button>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-black">만들 수 있는 요리</h2>
        <RecipeList availableIngredients={allSelectedIngredients} />
      </div>

      <PokemonSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handlePokemonSelect}
      />
    </div>
  );
};

export default PokemonIngredientPage; 