import { Pokemon, Ingredient } from '../types/pokemon';
import { Recipe, RecipeIngredient } from '../types/recipe';
import { parseCsvFile, csvToObjects } from './csvParser';

// 캐시된 데이터를 저장할 변수들
let cachedPokemons: Pokemon[] | null = null;
let cachedIngredients: Ingredient[] | null = null;
const cachedRecipes: Record<string, Recipe[]> = {};

export const getPokemons = async (): Promise<Pokemon[]> => {
  if (cachedPokemons) return cachedPokemons;

  // 먼저 모든 재료를 로드
  const ingredients = await getIngredients();
  
  // 포켓몬 데이터를 처리
  const csvData = await parseCsvFile('/data/pokemon_ingredients.csv');
  const pokemons = csvData.map(row => {
      const [name, ingredientsStr] = row;
      const ingredientNames = ingredientsStr.split('/');
      
      // 해당 포켓몬의 재료들을 찾음
      const pokemonIngredients = ingredients
        .filter(ing => ingredientNames.includes(ing.name))
        .map(ing => ({
          ...ing,
          pokemonId: name // 포켓몬 이름을 ID로 사용
        }));

      return {
        id: name,
        name: name,
        ingredients: pokemonIngredients
      };
    });

  cachedPokemons = pokemons;
  return cachedPokemons;
};

export const getIngredients = async (): Promise<Ingredient[]> => {
  if (cachedIngredients) return cachedIngredients;

  const csvData = await parseCsvFile('/data/ingredients.csv');
  const headers = ['id', 'name', 'description'];
  
  cachedIngredients = csvToObjects<Ingredient>(csvData, headers, (row) => ({
    id: row.id,
    name: row.name,
    description: row.description
  }));

  return cachedIngredients;
};

interface RecipeData {
  id: string;
  name: string;
  ingredients: Array<{
    ingredient: {
      name: string;
    };
    quantity: number;
  }>;
}

export const getRecipes = async (recipeType: string): Promise<Recipe[]> => {
  if (cachedRecipes[recipeType]) return cachedRecipes[recipeType];

  const [recipeJson, ingredientData] = await Promise.all([
    fetch(`/data/${recipeType}_recipes.json`).then(res => res.json()) as Promise<RecipeData[]>,
    getIngredients()
  ]);

  cachedRecipes[recipeType] = recipeJson.map(recipe => {
    const ingredients: RecipeIngredient[] = recipe.ingredients.map(item => {
      const matchedIngredient = ingredientData.find(ing => ing.name === item.ingredient.name);
      return {
        ingredient: matchedIngredient || {
          id: 'unknown',
          name: '알 수 없는 재료',
          description: ''
        },
        quantity: item.quantity
      };
    });

    return {
      id: recipe.id,
      name: recipe.name,
      recipeName: recipe.name,
      ingredients
    };
  });

  return cachedRecipes[recipeType];
};

export const getPokemonById = async (id: string): Promise<Pokemon | undefined> => {
  const pokemons = await getPokemons();
  return pokemons.find(pokemon => pokemon.id === id);
};

export const getIngredientById = async (id: string): Promise<Ingredient | undefined> => {
  const ingredients = await getIngredients();
  return ingredients.find(ingredient => ingredient.id === id);
};

export const getRecipeById = async (recipeType: string, id: string): Promise<Recipe | undefined> => {
  const recipes = await getRecipes(recipeType);
  return recipes.find(recipe => recipe.id === id);
}; 