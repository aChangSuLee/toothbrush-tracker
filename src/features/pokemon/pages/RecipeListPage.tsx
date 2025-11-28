import React from 'react';
import RecipeList from '../components/RecipeList';

const RecipeListPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<'curry' | 'dessert' | 'salad'>('curry');

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold text-black mb-6">레시피 목록</h1>
      <RecipeList
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
    </div>
  );
};

export default RecipeListPage; 