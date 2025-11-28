export interface Ingredient {
  id: string;
  name: string;
  description?: string;
  image?: string;
  pokemonId?: string; // 포켓몬 ID를 저장하기 위한 필드
}

export interface Pokemon {
  id: string;
  name: string;
  ingredients: Ingredient[];
}

export interface PokemonSelection {
  pokemon: Pokemon;
  ingredients: Ingredient[];
} 