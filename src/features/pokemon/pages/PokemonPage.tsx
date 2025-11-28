import { useState, useEffect } from 'react';
import PokemonSelectModal from '../components/PokemonSelectModal';
import IngredientSelect from '../components/IngredientSelect';
import RecipeList from '../components/RecipeList';
import RecipeSuggestions from '../components/RecipeSuggestions';
import { Pokemon, Ingredient, PokemonSelection } from '../types/pokemon';
import { CookiePokemonRepository } from '../repositories/PokemonRepository';

const repository = new CookiePokemonRepository();

const PokemonIngredientPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pokemonSelections, setPokemonSelections] = useState<PokemonSelection[]>([]);
  const [currentPokemonIndex, setCurrentPokemonIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'curry' | 'dessert' | 'salad'>('curry');

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedSelections = await repository.getSelections();
        if (savedSelections.length > 0) {
          setPokemonSelections(savedSelections);
        }
      } catch (error) {
        console.error('Failed to load data', error);
      }
    };
    loadData();
  }, []);

  const saveSelections = async (newSelections: PokemonSelection[]) => {
    setPokemonSelections(newSelections);
    await repository.saveSelections(newSelections);
  };

  const handleAddPokemon = () => {
    if (pokemonSelections.length < 5) {
      setCurrentPokemonIndex(pokemonSelections.length);
      setIsModalOpen(true);
    }
  };

  const handleDeletePokemon = (index: number) => {
    const newSelections = pokemonSelections.filter((_, i) => i !== index);
    saveSelections(newSelections);
  };

  const handlePokemonSelect = (pokemon: Pokemon) => {
    if (currentPokemonIndex !== null) {
      const newSelections = [...pokemonSelections];
      // If adding a new pokemon (index equals length), push it
      if (currentPokemonIndex === pokemonSelections.length) {
        newSelections.push({
          pokemon,
          ingredients: [],
        });
      } else {
        // Replacing existing
        newSelections[currentPokemonIndex] = {
          pokemon,
          ingredients: [],
        };
      }
      saveSelections(newSelections);
      setCurrentPokemonIndex(null);
    }
  };

  const handleIngredientSelect = (index: number, ingredients: Ingredient[]) => {
    if (index >= 0 && index < pokemonSelections.length) {
      const newSelections = [...pokemonSelections];
      newSelections[index] = {
        ...newSelections[index],
        ingredients: ingredients,
      };
      saveSelections(newSelections);
    }
  };

  // Calculate all selected ingredients for RecipeList
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
        <RecipeList
          availableIngredients={allSelectedIngredients}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <RecipeSuggestions
          availableIngredients={allSelectedIngredients}
          selectedCategory={selectedCategory}
        />
      </div>

      <PokemonSelectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentPokemonIndex(null);
        }}
        onSelect={handlePokemonSelect}
      />
    </div>
  );
};

export default PokemonIngredientPage;