import React, { useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';
import { Pokemon } from '../types/pokemon';
import { getPokemons } from '../utils/dataLoader';

interface RecipeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipe: Recipe | null;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ isOpen, onClose, recipe }) => {
    const [allPokemons, setAllPokemons] = useState<Pokemon[]>([]);
    const [expandedIngredients, setExpandedIngredients] = useState<Set<string>>(new Set());
    const [expandedPokemonLists, setExpandedPokemonLists] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (isOpen) {
            getPokemons().then(setAllPokemons);
            setExpandedIngredients(new Set()); // Reset on open
            setExpandedPokemonLists(new Set()); // Reset on open
        }
    }, [isOpen]);

    if (!isOpen || !recipe) return null;

    // Logic to find pokemon for each ingredient
    const getPokemonForIngredient = (ingredientName: string) => {
        return allPokemons.filter(p => p.ingredients.some(i => i.name === ingredientName));
    };

    const toggleIngredient = (name: string) => {
        const newSet = new Set(expandedIngredients);
        if (newSet.has(name)) {
            newSet.delete(name);
        } else {
            newSet.add(name);
        }
        setExpandedIngredients(newSet);
    };

    const togglePokemonList = (ingredientName: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent toggling the ingredient section
        const newSet = new Set(expandedPokemonLists);
        if (newSet.has(ingredientName)) {
            newSet.delete(ingredientName);
        } else {
            newSet.add(ingredientName);
        }
        setExpandedPokemonLists(newSet);
    };

    // Logic to find "Best Pokemon" (provides 2+ ingredients)
    const getBestPokemon = () => {
        const requiredIngredientNames = new Set(recipe.ingredients.map(ri => ri.ingredient.name));

        return allPokemons.filter(p => {
            const providedCount = p.ingredients.filter(i => requiredIngredientNames.has(i.name)).length;
            return providedCount >= 2;
        }).sort((a, b) => {
            // Sort by how many ingredients they provide (descending)
            const aCount = a.ingredients.filter(i => requiredIngredientNames.has(i.name)).length;
            const bCount = b.ingredients.filter(i => requiredIngredientNames.has(i.name)).length;
            return bCount - aCount;
        });
    };

    const bestPokemons = getBestPokemon();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md m-4 relative shadow-xl max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                    &times;
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-black mb-1">{recipe.name}</h2>
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-semibold">
                        ⚡️ 에너지: {recipe.energy.toLocaleString()}
                    </span>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">필요한 재료</h3>
                    <ul className="space-y-2">
                        {recipe.ingredients.map((ri, idx) => {
                            const providers = getPokemonForIngredient(ri.ingredient.name);
                            const isExpanded = expandedIngredients.has(ri.ingredient.name);
                            const isListExpanded = expandedPokemonLists.has(ri.ingredient.name);
                            const showCount = isListExpanded ? providers.length : 10;
                            const hasMore = providers.length > 10;

                            return (
                                <li key={idx} className="flex flex-col text-gray-700">
                                    <div
                                        className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                                        onClick={() => toggleIngredient(ri.ingredient.name)}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 mr-1">{isExpanded ? '▼' : '▶'}</span>
                                            {ri.ingredient.name}
                                        </span>
                                        <span className="font-medium bg-gray-100 px-2 py-1 rounded">
                                            x{ri.quantity}
                                        </span>
                                    </div>

                                    {isExpanded && (
                                        <div className="ml-6 mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                            <p className="font-semibold mb-1 text-xs text-gray-500">획득 가능 포켓몬:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {providers.slice(0, showCount).map(p => (
                                                    <span key={p.id} className="bg-white border px-1 rounded text-xs">
                                                        {p.name}
                                                    </span>
                                                ))}
                                                {hasMore && !isListExpanded && (
                                                    <button
                                                        onClick={(e) => togglePokemonList(ri.ingredient.name, e)}
                                                        className="text-xs text-blue-500 hover:underline bg-transparent border-none p-0 cursor-pointer"
                                                    >
                                                        ...외 {providers.length - 10}마리 (더 보기)
                                                    </button>
                                                )}
                                                {hasMore && isListExpanded && (
                                                    <button
                                                        onClick={(e) => togglePokemonList(ri.ingredient.name, e)}
                                                        className="text-xs text-gray-400 hover:text-gray-600 bg-transparent border-none p-0 cursor-pointer ml-1"
                                                    >
                                                        (접기)
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {bestPokemons.length > 0 && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                        <h3 className="font-bold text-green-800 mb-2">추천 포켓몬 (효율 최고!)</h3>
                        <p className="text-xs text-green-600 mb-2">이 레시피의 재료를 2가지 이상 가지고 있어요.</p>
                        <div className="flex flex-wrap gap-2">
                            {bestPokemons.map(p => (
                                <span key={p.id} className="bg-white text-green-700 border border-green-200 px-2 py-1 rounded shadow-sm text-sm font-medium">
                                    {p.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetailModal;
