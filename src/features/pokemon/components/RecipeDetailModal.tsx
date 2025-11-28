import React from 'react';
import { Recipe } from '../types/recipe';

interface RecipeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipe: Recipe | null;
}

const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ isOpen, onClose, recipe }) => {
    if (!isOpen || !recipe) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md m-4 relative shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center text-black">{recipe.name}</h2>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-800 border-b pb-2">필요한 재료</h3>
                    <ul className="space-y-2">
                        {recipe.ingredients.map((ri, idx) => (
                            <li key={idx} className="flex justify-between items-center text-gray-700">
                                <span className="flex items-center gap-2">
                                    {/* Image placeholder if available, otherwise just name */}
                                    {ri.ingredient.name}
                                </span>
                                <span className="font-medium bg-gray-100 px-2 py-1 rounded">
                                    x{ri.quantity}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

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
