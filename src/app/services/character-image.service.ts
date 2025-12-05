import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, catchError } from 'rxjs';

export interface StarWarsCharacter {
  id: number;
  name: string;
  image: string;
  height?: number;
  mass?: number;
  gender?: string;
  species?: string;
  homeworld?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CharacterImageService {
  private charactersCache: StarWarsCharacter[] = [];
  private imageCache = new Map<string, string>();
  private apiUrl = 'https://akabab.github.io/starwars-api/api/all.json';

  constructor(private http: HttpClient) {}

  // Carrega todos os personagens da API de imagens
  loadCharacters(): Observable<StarWarsCharacter[]> {
    if (this.charactersCache.length > 0) {
      return of(this.charactersCache);
    }

    return this.http.get<StarWarsCharacter[]>(this.apiUrl).pipe(
      map(characters => {
        this.charactersCache = characters;
        return characters;
      }),
      catchError(() => {
        // Em caso de erro, retorna array vazio
        this.charactersCache = [];
        return of([]);
      })
    );
  }

  // Busca a imagem de um personagem pelo nome (assíncrono)
  getCharacterImage(name: string): Observable<string> {
    // Verifica cache primeiro
    const cached = this.imageCache.get(name);
    if (cached) {
      return of(cached);
    }

    return this.loadCharacters().pipe(
      map(characters => {
        // Tenta encontrar correspondência exata primeiro
        let character = characters.find(c => 
          c.name.toLowerCase() === name.toLowerCase()
        );

        // Se não encontrar, tenta correspondência parcial
        if (!character) {
          character = characters.find(c => 
            c.name.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(c.name.toLowerCase())
          );
        }

        const imageUrl = character?.image || this.getFallbackImage(name);
        
        // Cache a imagem encontrada
        this.imageCache.set(name, imageUrl);
        return imageUrl;
      }),
      catchError(() => {
        const fallback = this.getFallbackImage(name);
        this.imageCache.set(name, fallback);
        return of(fallback);
      })
    );
  }

  // Busca informações completas do personagem
  getCharacterInfo(name: string): Observable<StarWarsCharacter | null> {
    return this.loadCharacters().pipe(
      map(characters => {
        let character = characters.find(c => 
          c.name.toLowerCase() === name.toLowerCase()
        );

        if (!character) {
          character = characters.find(c => 
            c.name.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(c.name.toLowerCase())
          );
        }

        return character || null;
      }),
      catchError(() => of(null))
    );
  }

  // Imagem de fallback síncrona para uso imediato
  getCharacterImageSync(name: string): string {
    const cached = this.imageCache.get(name);
    if (cached) {
      return cached;
    }
    return this.getFallbackImage(name);
  }

  // Imagem de fallback baseada no gênero/espécie
  private getFallbackImage(name: string): string {
    // Fallback para personagens específicos baseado no nome
    const fallbackImages: { [key: string]: string } = {
      'luke skywalker': 'https://starwars-visualguide.com/assets/img/characters/1.jpg',
      'c-3po': 'https://starwars-visualguide.com/assets/img/characters/2.jpg',
      'r2-d2': 'https://starwars-visualguide.com/assets/img/characters/3.jpg',
      'darth vader': 'https://starwars-visualguide.com/assets/img/characters/4.jpg',
      'leia organa': 'https://starwars-visualguide.com/assets/img/characters/5.jpg',
      'owen lars': 'https://starwars-visualguide.com/assets/img/characters/6.jpg',
      'beru lars': 'https://starwars-visualguide.com/assets/img/characters/7.jpg',
      'r5-d4': 'https://starwars-visualguide.com/assets/img/characters/8.jpg',
      'biggs darklighter': 'https://starwars-visualguide.com/assets/img/characters/9.jpg',
      'obi-wan kenobi': 'https://starwars-visualguide.com/assets/img/characters/10.jpg',
    };

    const lowerName = name.toLowerCase();
    return fallbackImages[lowerName] || 'https://starwars-visualguide.com/assets/img/big-placeholder.jpg';
  }
}