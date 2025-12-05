import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Correção aqui
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { 
  LucideAngularModule, 
  ArrowLeftIcon, 
  PlayIcon, 
  CalendarIcon, 
  ClockIcon, 
  StarIcon, 
  UsersIcon,
  DollarSignIcon,
  TicketIcon
} from 'lucide-angular';
import { FilmsService, MovieTrailer } from '../../services/films.service';
import { SpinnerComponent } from "../../components/spinner/spinner.component/spinner.component";

interface Movie {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
}

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, SpinnerComponent],
  templateUrl: './movie-detail.html',
})
export class MovieDetailComponent implements OnInit, OnDestroy {
  movie: Movie | null = null;
  loading = true;
  error: string | null = null;
  trailer: MovieTrailer | null = null;
  trailerUrl: SafeResourceUrl | null = null;
  showTrailer = false;
  additionalInfo: any = {};

  private destroy$ = new Subject<void>();

  // Ícones Lucide
  readonly ArrowLeftIcon = ArrowLeftIcon;
  readonly PlayIcon = PlayIcon;
  readonly CalendarIcon = CalendarIcon;
  readonly ClockIcon = ClockIcon;
  readonly StarIcon = StarIcon;
  readonly UsersIcon = UsersIcon;
  readonly DollarSignIcon = DollarSignIcon;
  readonly TicketIcon = TicketIcon;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private filmsService: FilmsService,
    private sanitizer: DomSanitizer // Agora está correto
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchMovie(id);
    } else {
      this.loading = false;
      this.error = 'ID do filme não encontrado';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchMovie(id: string) {
    this.loading = true;
    this.error = null;

    this.http.get<Movie>(`https://swapi.dev/api/films/${id}/`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.movie = data;
          this.loadAdditionalData();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao buscar filme:', error);
          this.error = 'Erro ao carregar filme. Tente novamente.';
          this.loading = false;
        }
      });
  }

  loadAdditionalData() {
    if (!this.movie) return;

    // Carrega trailer
    this.trailer = this.filmsService.getMovieTrailer(this.movie.episode_id);
    if (this.trailer) {
      this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${this.trailer.youtubeId}?autoplay=0`
      );
    }

    // Carrega informações adicionais
    this.additionalInfo = this.filmsService.getMovieAdditionalInfo(this.movie.episode_id);
  }

  getMoviePoster(): string {
    if (!this.movie) return '';
    return this.filmsService.getMoviePoster(this.movie.episode_id);
  }

  getReleaseYear(releaseDate: string): string {
    return new Date(releaseDate).getFullYear().toString();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  formatMoney(amount: string): string {
    if (amount === 'N/A') return amount;
    return amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  toggleTrailer(): void {
    this.showTrailer = !this.showTrailer;
  }

  getTrailerUrl(): SafeResourceUrl | null {
    if (!this.trailer) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.trailer.youtubeId}?autoplay=1`
    );
  }

  // Método calculateROI corrigido
  calculateROI(budget: string, boxOffice: string): string {
    if (budget === 'N/A' || boxOffice === 'N/A') return 'N/A';
    
    const budgetNum = parseFloat(budget.replace(/[^0-9.]/g, ''));
    const boxOfficeNum = parseFloat(boxOffice.replace(/[^0-9.]/g, ''));
    
    if (budgetNum === 0) return 'N/A';
    
    const roi = ((boxOfficeNum - budgetNum) / budgetNum) * 100;
    return `+${roi.toFixed(0)}% ROI`;
  }
}