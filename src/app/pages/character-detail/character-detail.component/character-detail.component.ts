import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { 
  LucideAngularModule, 
  ArrowLeftIcon, 
  UserIcon, 
  CalendarIcon, 
  RulerIcon, 
  WeightIcon, 
  EyeIcon 
} from 'lucide-angular';

import { CharacterImageService, StarWarsCharacter } from '../../../services/character-image.service';
import { SpinnerComponent } from "../../../components/spinner/spinner.component/spinner.component";

interface Character {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
}

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, SpinnerComponent],
  templateUrl: './character-detail.component.html',
})
export class CharacterDetailComponent implements OnInit, OnDestroy {
  character: Character | null = null;
  characterImage: string = '';
  characterInfo: StarWarsCharacter | null = null;
  loading = true;
  imageLoading = true;
  id: number | undefined;
  name: string | undefined;
  image: string | undefined;
  height?: number;
  mass?: number;
  gender?: string;
  species?: string;
  homeworld?: string;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  // Ícones Lucide
  readonly ArrowLeftIcon = ArrowLeftIcon;
  readonly UserIcon = UserIcon;
  readonly CalendarIcon = CalendarIcon;
  readonly RulerIcon = RulerIcon;
  readonly WeightIcon = WeightIcon;
  readonly EyeIcon = EyeIcon;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private characterImageService: CharacterImageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchCharacter(id);
    } else {
      this.loading = false;
      this.error = 'ID do personagem não encontrado';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchCharacter(id: string) {
  this.loading = true;
  this.error = null;

  this.http.get<Character>(`https://swapi.dev/api/people/${id}/`).subscribe({
    next: (data) => {
      this.character = data;
      // Define imagem de fallback imediatamente
      this.characterImage = this.characterImageService.getCharacterImageSync(data.name);
      this.loadCharacterInfo(data.name);
      this.loading = false;
      
      // Carrega imagem real em segundo plano
      this.loadRealCharacterImage(data.name);
    },
    error: (error) => {
      console.error('Erro ao buscar personagem:', error);
      this.error = 'Erro ao carregar personagem. Tente novamente.';
      this.loading = false;
    }
  });

  
}
loadRealCharacterImage(name: string) {
  this.characterImageService.getCharacterImage(name).subscribe({
    next: (realImageUrl) => {
      if (realImageUrl !== this.characterImageService.getCharacterImageSync(name)) {
        this.characterImage = realImageUrl;
      }
    },
    error: (error) => {
      console.error('Erro ao carregar imagem real:', error);
    }
  });
}

  loadCharacterImage(name: string) {
    this.imageLoading = true;
    this.characterImageService.getCharacterImage(name)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (imageUrl) => {
          this.characterImage = imageUrl;
          this.imageLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar imagem:', error);
          this.characterImage = this.getFallbackImage();
          this.imageLoading = false;
        }
      });
  }

  loadCharacterInfo(name: string) {
    this.characterImageService.getCharacterInfo(name)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (info) => {
          this.characterInfo = info;
        },
        error: (error) => {
          console.error('Erro ao carregar informações adicionais:', error);
        }
      });
  }

  getCharacterImage(): string {
    return this.characterImage || this.getFallbackImage();
  }

  private getFallbackImage(): string {
    return 'https://starwars-visualguide.com/assets/img/big-placeholder.jpg';
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  // Método para obter informações extras da API de imagens
  getCharacterHeight(): number | null {
    return this.characterInfo?.height || null;
  }

  getCharacterMass(): number | null {
    return this.characterInfo?.mass || null;
  }

  // Adicione estes métodos à classe CharacterDetailComponent:

getCharacterId(): string {
  return this.route.snapshot.paramMap.get('id') || 'unknown';
}

onImageLoad(): void {
  this.imageLoading = false;
}

onImageError(): void {
  this.imageLoading = false;
  this.characterImage = this.getFallbackImage();
}

}