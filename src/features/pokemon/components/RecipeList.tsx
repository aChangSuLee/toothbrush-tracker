
import React, { useState, useEffect } from 'react';
import { getRecipes } from '../utils/dataLoader';
import { Recipe } from '../types/recipe';
import { Ingredient } from '../types/pokemon';

import RecipeDetailModal from './RecipeDetailModal';

interface RecipeListProps {
  availableIngredients?: Ingredient[];
  selectedCategory: 'curry' | 'dessert' | 'salad';
  onCategoryChange: (category: 'curry' | 'dessert' | 'salad') => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ availableIngredients, selectedCategory, onCategoryChange }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const loadRecipes = async () => {
      setIsLoading(true);
      try {
        const data = await getRecipes(selectedCategory);

        if (availableIngredients) {
          // availableIngredients가 있으면, 만들 수 있는 레시피만 필터링
          const availableIngredientNames = new Set(availableIngredients.map(i => i.name));
          const cookableRecipes = data.filter(recipe =>
            recipe.ingredients.every(ri => availableIngredientNames.has(ri.ingredient.name))
          );
          setRecipes(cookableRecipes);
        } else {
          setRecipes(data);
        }
      } catch (error) {
        console.error('레시피 데이터를 불러오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, [selectedCategory, availableIngredients]);

  if (isLoading) {
    return <div className="text-black">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => onCategoryChange('curry')}
          className={`px-4 py-2 rounded ${selectedCategory === 'curry' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
          카레
        </button>
        <button
          onClick={() => onCategoryChange('dessert')}
          className={`px-4 py-2 rounded ${selectedCategory === 'dessert' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
          디저트
        </button>
        <button
          onClick={() => onCategoryChange('salad')}
          className={`px-4 py-2 rounded ${selectedCategory === 'salad' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
          샐러드
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-black mb-4">{recipe.name}</h2>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-black">필요한 재료:</h3>
              <ul className="list-disc list-inside text-black">
                {recipe.ingredients.map((item, index) => (
                  <li key={index}>
                    {item.ingredient.name} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setSelectedRecipe(recipe)}
              className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              상세 보기
            </button>
          </div>
        ))}
      </div>

      <RecipeDetailModal
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        recipe={selectedRecipe}
      />
    </div >
  );
};

export default RecipeList; 