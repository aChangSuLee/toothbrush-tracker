import { PokemonSelection } from '../types/pokemon';
import { setCookie, getCookie } from '../../../shared/utils/cookie';

export interface PokemonRepository {
    getSelections(): Promise<PokemonSelection[]>;
    saveSelections(selections: PokemonSelection[]): Promise<void>;
}

export class CookiePokemonRepository implements PokemonRepository {
    private readonly COOKIE_NAME = 'pokemonSelections';

    async getSelections(): Promise<PokemonSelection[]> {
        const saved = getCookie(this.COOKIE_NAME);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse pokemon selections from cookie', e);
                return [];
            }
        }
        return [];
    }

    async saveSelections(selections: PokemonSelection[]): Promise<void> {
        setCookie(this.COOKIE_NAME, JSON.stringify(selections));
    }
}
