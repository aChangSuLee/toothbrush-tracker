import { Ingredient } from './pokemon';

export interface RecipeIngredient {
  ingredient: Ingredient;
  quantity: number;
}

export interface Recipe {
  id: string;
  name: string;
  recipeName: string;
  ingredients: RecipeIngredient[];
  energy: number;
} 