import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {SpinnerComponent} from '../../../components/spinner/spinner.component/spinner.component'
import { 
  LucideAngularModule, 
  UserIcon, 
  EyeIcon, 
  RulerIcon, 
  WeightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-angular';

import { CharacterImageService } from '../../../services/character-image.service';

interface Character {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  url: string;
  image?: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, SpinnerComponent],
  templateUrl: './characters.component.html',
})
export class CharactersComponent implements OnInit {
  characters: Character[] = [];
  loading = true;
  loadingMore = false;
  currentPage = 1;
  totalPages = 1;
  hasNextPage = false;
  hasPreviousPage = false;

  // Ícones Lucide
  readonly UserIcon = UserIcon;
  readonly EyeIcon = EyeIcon;
  readonly RulerIcon = RulerIcon;
  readonly WeightIcon = WeightIcon;
  readonly ChevronLeftIcon = ChevronLeftIcon;
  readonly ChevronRightIcon = ChevronRightIcon;

  constructor(
    private http: HttpClient,
    private characterImageService: CharacterImageService
  ) {}

  ngOnInit(): void {
    this.fetchCharacters(1);
  }

  fetchCharacters(page: number = 1) {
    this.loading = true;
    this.currentPage = page;
    
    const url = `https://swapi.dev/api/people/?page=${page}`;
    
    this.http.get<ApiResponse>(url).subscribe({
      next: (data) => {
        // Inicializa com imagens de fallback
        this.characters = data.results.map(character => ({
          ...character,
          image: this.characterImageService.getCharacterImageSync(character.name)
        }));

        // Calcula paginação
        this.totalPages = Math.ceil(data.count / 10);
        this.hasNextPage = data.next !== null;
        this.hasPreviousPage = data.previous !== null;

        this.loading = false;
        this.loadRealCharacterImages();
      },
      error: (error) => {
        console.error('Erro ao buscar personagens:', error);
        this.loading = false;
      }
    });
  }

  loadMoreCharacters() {
    if (this.loadingMore || !this.hasNextPage) return;

    this.loadingMore = true;
    const nextPage = this.currentPage + 1;
    
    const url = `https://swapi.dev/api/people/?page=${nextPage}`;
    
    this.http.get<ApiResponse>(url).subscribe({
      next: (data) => {
        const newCharacters = data.results.map(character => ({
          ...character,
          image: this.characterImageService.getCharacterImageSync(character.name)
        }));

        this.characters = [...this.characters, ...newCharacters];
        this.currentPage = nextPage;
        this.hasNextPage = data.next !== null;
        this.loadingMore = false;

        // Carrega imagens dos novos personagens
        this.loadRealCharacterImagesForNew(newCharacters);
      },
      error: (error) => {
        console.error('Erro ao carregar mais personagens:', error);
        this.loadingMore = false;
      }
    });
  }

  loadRealCharacterImages() {
    this.characters.forEach((character, index) => {
      this.characterImageService.getCharacterImage(character.name).subscribe({
        next: (realImageUrl) => {
          if (realImageUrl !== this.characterImageService.getCharacterImageSync(character.name)) {
            this.characters[index].image = realImageUrl;
          }
        },
        error: (error) => {
          console.error(`Erro ao carregar imagem para ${character.name}:`, error);
        }
      });
    });
  }

  loadRealCharacterImagesForNew(newCharacters: Character[]) {
    const startIndex = this.characters.length - newCharacters.length;
    
    newCharacters.forEach((character, offsetIndex) => {
      const actualIndex = startIndex + offsetIndex;
      this.characterImageService.getCharacterImage(character.name).subscribe({
        next: (realImageUrl) => {
          if (realImageUrl !== this.characterImageService.getCharacterImageSync(character.name)) {
            this.characters[actualIndex].image = realImageUrl;
          }
        },
        error: (error) => {
          console.error(`Erro ao carregar imagem para ${character.name}:`, error);
        }
      });
    });
  }

  getCharacterId(url: string): string {
    const matches = url.match(/\/people\/(\d+)\//);
    return matches ? matches[1] : '1';
  }

  onImageError(character: Character) {
    character.image = this.characterImageService.getCharacterImageSync(character.name);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.fetchCharacters(page);
  }

  getPageNumbers(): number[] {
    const pages = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}