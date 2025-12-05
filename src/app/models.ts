// src/app/models.ts
export interface SwapiFilm {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  release_date: string;
  characters: string[];
  poster?: string;
}

export interface SwapiPerson {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  url: string;
}
