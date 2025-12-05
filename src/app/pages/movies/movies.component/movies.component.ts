import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { 
  LucideAngularModule,
  PlayIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon
} from 'lucide-angular';
import { FilmsService } from '../../../services/films.service';
import { SpinnerComponent } from "../../../components/spinner/spinner.component/spinner.component";

interface Movie {
  episode_id: number;
  title: string;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  url: string;
}

interface ApiResponse {
  results: Movie[];
}

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, SpinnerComponent],
  templateUrl: './movies.component.html',
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;
  error: string | null = null;

  // Ícones Lucide
  readonly playIcon = PlayIcon;
  readonly calendarIcon = CalendarIcon;
  readonly clockIcon = ClockIcon;
  readonly starIcon = StarIcon;

  constructor(
    private http: HttpClient,
    private filmsService: FilmsService
  ) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies() {
    this.loading = true;
    this.error = null;
    
    this.http.get<ApiResponse>('https://swapi.dev/api/films/').subscribe({
      next: (data) => {
        // Ordem cronológica: Episódios 1, 2, 3, 4, 5, 6
        this.movies = data.results.sort((a: Movie, b: Movie) => a.episode_id - b.episode_id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar filmes:', error);
        this.error = 'Erro ao carregar filmes. Tente novamente.';
        this.loading = false;
      }
    });
  }

  getMovieId(url: string): string {
    const matches = url.match(/\/films\/(\d+)\//);
    return matches ? matches[1] : '1';
  }

  getMoviePoster(episodeId: number): string {
    return this.filmsService.getMoviePoster(episodeId);
  }

  getMovieRuntime(episodeId: number): string {
    const info = this.filmsService.getMovieAdditionalInfo(episodeId);
    return info.runtime;
  }

  // Método para obter o título formatado com número do episódio
  getMovieTitle(movie: Movie): string {
    const episodeNumbers: { [key: number]: string } = {
      1: 'I',
      2: 'II', 
      3: 'III',
      4: 'IV',
      5: 'V',
      6: 'VI'
    };
    
    return `Episódio ${episodeNumbers[movie.episode_id]} - ${movie.title}`;
  }

  // Método para obter a descrição da trilogia
  getTrilogyDescription(episodeId: number): string {
    const trilogies: { [key: number]: string } = {
      1: 'Trilogia Prequel',
      2: 'Trilogia Prequel',
      3: 'Trilogia Prequel',
      4: 'Trilogia Original', 
      5: 'Trilogia Original',
      6: 'Trilogia Original'
    };
    return trilogies[episodeId] || 'Saga Star Wars';
  }
}