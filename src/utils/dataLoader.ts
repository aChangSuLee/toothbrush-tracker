import { Pokemon, Ingredient } from '../types/pokemon';
import { Recipe, RecipeIngredient } from '../types/recipe';


// 캐시된 데이터를 저장할 변수들
let cachedPokemons: Pokemon[] | null = null;
let cachedIngredients: Ingredient[] | null = null;
const cachedRecipes: Record<string, Recipe[]> = {};

export const getPokemons = async (): Promise<Pokemon[]> => {
  if (cachedPokemons) return cachedPokemons;

  const [ingredients, pokemonData, pokemonIngredientsData] = await Promise.all([
    getIngredients(),
    fetch('/data/pokemons.json').then(res => res.json()) as Promise<{ id: number; name: string }[]>,
    fetch('/data/pokemon_ingredients.json').then(res => res.json()) as Promise<{ pokemon: string; ingredients: string[] }[]>
  ]);

  cachedPokemons = pokemonData.map(p => {
    // Find ingredients for this pokemon
    // The pokemon_ingredients.json uses Pokemon Name to link
    const pIngredients = pokemonIngredientsData.find(pi => pi.pokemon === p.name);

    const myIngredients: Ingredient[] = [];
    if (pIngredients) {
      for (const ingName of pIngredients.ingredients) {
        const found = ingredients.find(i => i.name === ingName);
        if (found) {
          myIngredients.push({ ...found, pokemonId: p.name });
        }
      }
    }

    return {
      id: p.id.toString(),
      name: p.name,
      ingredients: myIngredients
    };
  });

  return cachedPokemons;
};

export const getIngredients = async (): Promise<Ingredient[]> => {
  if (cachedIngredients) return cachedIngredients;

  const ingredientData = await fetch('/data/ingredients.json').then(res => res.json()) as { id: number; name: string }[];

  cachedIngredients = ingredientData.map(row => ({
    id: row.id.toString(),
    name: row.name,
    description: ''
  }));

  return cachedIngredients;
};

interface RecipeData {
  id: string;
  name: string;
  ingredients: Array<{
    name: string;
    amount: number;
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
      const matchedIngredient = ingredientData.find(ing => ing.name === item.name);
      return {
        ingredient: matchedIngredient || {
          id: 'unknown',
          name: item.name, // 매칭되지 않으면 JSON의 이름을 그대로 사용
          description: ''
        },
        quantity: item.amount
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