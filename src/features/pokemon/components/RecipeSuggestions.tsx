import React, { useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';
import { Pokemon, Ingredient } from '../types/pokemon';
import { getRecipes, getPokemons } from '../utils/dataLoader';

interface RecipeSuggestionsProps {
    availableIngredients: Ingredient[];
    selectedCategory: 'curry' | 'dessert' | 'salad';
}

interface Suggestion {
    recipe: Recipe;
    missingIngredients: {
        ingredient: Ingredient;
        quantity: number;
        suggestedPokemon: Pokemon[];
    }[];
}

import RecipeDetailModal from './RecipeDetailModal';

const RecipeSuggestions: React.FC<RecipeSuggestionsProps> = ({ availableIngredients, selectedCategory }) => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [recipes, pokemons] = await Promise.all([
                    getRecipes(selectedCategory),
                    getPokemons()
                ]);

                const availableNames = new Set(availableIngredients.map(i => i.name));

                const newSuggestions: Suggestion[] = [];

                for (const recipe of recipes) {
                    const missing: { ingredient: Ingredient; quantity: number; suggestedPokemon: Pokemon[] }[] = [];

                    for (const ri of recipe.ingredients) {
                        if (!availableNames.has(ri.ingredient.name)) {
                            // Find pokemon that drop this
                            const providers = pokemons.filter(p =>
                                p.ingredients.some(i => i.name === ri.ingredient.name)
                            );

                            missing.push({
                                ingredient: ri.ingredient,
                                quantity: ri.quantity,
                                suggestedPokemon: providers
                            });
                        }
                    }

                    // Define "Almost Cookable" as missing 1 or 2 ingredients
                    if (missing.length > 0 && missing.length <= 2) {
                        newSuggestions.push({
                            recipe,
                            missingIngredients: missing
                        });
                    }
                }

                // Sorting Logic
                newSuggestions.sort((a, b) => {
                    // 1. Prioritize recipes with owned ingredients
                    // Calculate owned ingredients count for a and b
                    const aOwnedCount = a.recipe.ingredients.length - a.missingIngredients.length;
                    const bOwnedCount = b.recipe.ingredients.length - b.missingIngredients.length;
                    const aHasOwned = aOwnedCount > 0;
                    const bHasOwned = bOwnedCount > 0;

                    if (aHasOwned && !bHasOwned) return -1;
                    if (!aHasOwned && bHasOwned) return 1;

                    // 2. Secondary sort by fewest missing ingredients
                    return a.missingIngredients.length - b.missingIngredients.length;
                });

                setSuggestions(newSuggestions);
            } catch (error) {
                console.error('Failed to load suggestions', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [availableIngredients, selectedCategory]);

    if (isLoading) return <div>제안 로딩 중...</div>;
    if (suggestions.length === 0) return null;

    return (
        <>
            <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <h2 className="text-xl font-bold mb-4 text-black">추천 레시피 (조금만 더 있으면 가능해요!)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion.recipe.id}
                            className="bg-white p-4 rounded shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setSelectedRecipe(suggestion.recipe)}
                        >
                            <h3 className="font-bold text-lg mb-2 text-black">{suggestion.recipe.name}</h3>
                            <div className="text-sm text-black mb-2">
                                <p className="font-semibold text-red-600">부족한 재료:</p>
                                <ul className="list-disc list-inside">
                                    {suggestion.missingIngredients.map((missing, idx) => (
                                        <li key={idx} className="text-black">
                                            {missing.ingredient.name} (x{missing.quantity})
                                            <div className="ml-4 text-xs text-gray-700 font-medium">
                                                추천 포켓몬: {missing.suggestedPokemon.slice(0, 3).map(p => p.name).join(', ')}
                                                {missing.suggestedPokemon.length > 3 && ` 외 ${missing.suggestedPokemon.length - 3}마리`}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <RecipeDetailModal
                isOpen={!!selectedRecipe}
                onClose={() => setSelectedRecipe(null)}
                recipe={selectedRecipe}
            />
        </>
    );
};

export default RecipeSuggestions;
