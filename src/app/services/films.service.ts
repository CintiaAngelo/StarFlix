import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';

export interface MovieTrailer {
  episode_id: number;
  youtubeId: string;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class FilmsService {
  private swapiUrl = 'https://swapi.dev/api/films/';

  constructor(private http: HttpClient) {}

  getFilms(): Observable<any[]> {
    return this.http.get<any>(this.swapiUrl).pipe(
      map(res => res.results.sort((a: any, b: any) => a.episode_id - b.episode_id))
    );
  }

  getFilmById(id: string): Observable<any> {
    return this.http.get<any>(`${this.swapiUrl}${id}/`);
  }

  // Imagens oficiais dos filmes
  getMoviePoster(episodeId: number): string {
    const posters: { [key: number]: string } = {
      1: 'https://m.media-amazon.com/images/I/81KkxZjm-lL._SL1500_.jpg',
      2: 'https://m.media-amazon.com/images/I/711hX6YdhKL._AC_SY879_.jpg',
      3: 'https://m.media-amazon.com/images/M/MV5BNTc4MTc3NTQ5OF5BMl5BanBnXkFtZTcwOTg0NjI4NA@@._V1_.jpg',
      4: 'https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_.jpg',
      5: 'https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
      6: 'https://m.media-amazon.com/images/M/MV5BOWZlMjFiYzgtMTUzNC00Y2IzLTk1NTMtZmNhMTczNTk0ODk1XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg'
    };
    return posters[episodeId] || 'https://starwars-visualguide.com/assets/img/big-placeholder.jpg';
  }

  // Trailers do YouTube
  getMovieTrailer(episodeId: number): MovieTrailer | null {
    const trailers: { [key: number]: MovieTrailer } = {
      4: { episode_id: 4, youtubeId: 'vZ734NWnAHA', title: 'Star Wars: A New Hope' },
      5: { episode_id: 5, youtubeId: 'JNwNXF9Y6kY', title: 'The Empire Strikes Back' },
      6: { episode_id: 6, youtubeId: '5UnjrG_N8hU', title: 'Return of the Jedi' },
      1: { episode_id: 1, youtubeId: 'bD7bpG-zDJQ', title: 'The Phantom Menace' },
      2: { episode_id: 2, youtubeId: 'gYbW1F_c9eM', title: 'Attack of the Clones' },
      3: { episode_id: 3, youtubeId: '5UnjrG_N8hU', title: 'Revenge of the Sith' }
    };
    return trailers[episodeId] || null;
  }

  // Informações adicionais sobre os filmes
  getMovieAdditionalInfo(episodeId: number): any {
    const additionalInfo: { [key: number]: any } = {
      4: { 
        runtime: '121 min', 
        budget: '$11,000,000', 
        box_office: '$775,398,007',
        rating: 'PG'
      },
      5: { 
        runtime: '124 min', 
        budget: '$18,000,000', 
        box_office: '$547,975,067',
        rating: 'PG'
      },
      6: { 
        runtime: '131 min', 
        budget: '$32,500,000', 
        box_office: '$475,106,177',
        rating: 'PG'
      },
      1: { 
        runtime: '136 min', 
        budget: '$115,000,000', 
        box_office: '$1,027,044,677',
        rating: 'PG'
      },
      2: { 
        runtime: '142 min', 
        budget: '$115,000,000', 
        box_office: '$653,779,970',
        rating: 'PG'
      },
      3: { 
        runtime: '140 min', 
        budget: '$113,000,000', 
        box_office: '$868,390,560',
        rating: 'PG-13'
      }
    };
    return additionalInfo[episodeId] || { runtime: 'N/A', budget: 'N/A', box_office: 'N/A', rating: 'N/A' };
  }
}