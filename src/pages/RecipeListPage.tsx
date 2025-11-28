import React from 'react';
import RecipeList from '../components/RecipeList';

const RecipeListPage: React.FC = () => {
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold text-black mb-6">레시피 목록</h1>
      <RecipeList />
    </div>
  );
};

export default RecipeListPage; 