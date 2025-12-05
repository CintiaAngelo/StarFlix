import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, DnaIcon, ClockIcon, MessageCircleIcon, RulerIcon, LoaderIcon } from 'lucide-angular';
import { SwapiService } from '../../../services/swapi.service';
import { SpinnerComponent } from "../../../components/spinner/spinner.component/spinner.component";

interface Species {
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  language: string;
  url: string;
  image?: string;
  imageLoading?: boolean;
}

@Component({
  selector: 'app-species',
  standalone: true,
  styleUrls: ['./species.component.css'],
  templateUrl: './species.component.html',
  imports: [CommonModule, LucideAngularModule, SpinnerComponent],
})
export class SpeciesComponent implements OnInit {
  species: Species[] = [];
  loading = true;
  loadingMore = false;
  currentPage = 1;
  hasNextPage = true;

  readonly DnaIcon = DnaIcon;
  readonly ClockIcon = ClockIcon;
  readonly MessageCircleIcon = MessageCircleIcon;
  readonly RulerIcon = RulerIcon;
  readonly LoaderIcon = LoaderIcon;

  constructor(private swapiService: SwapiService) {}

  ngOnInit(): void {
    this.fetchSpeciesWithImages();
  }

  fetchSpeciesWithImages() {
    this.swapiService.getSpecies(this.currentPage).subscribe({
      next: (swapiData) => {
        const speciesFromSwapi = swapiData.results;
        
        // Inicializa com imagens de fallback
        const newSpecies = speciesFromSwapi.map((specie: any) => ({
          ...specie,
          image: this.swapiService.getSpeciesImageSync(specie.name),
          imageLoading: false
        }));

        this.species = [...this.species, ...newSpecies];
        this.hasNextPage = !!swapiData.next; // Verifica se há próxima página
        this.loading = false;
        this.loadingMore = false;

        // Busca imagens reais da API para as novas espécies
        this.loadRealImages(newSpecies);
      },
      error: (err) => {
        console.error('Erro ao buscar espécies:', err);
        this.loading = false;
        this.loadingMore = false;
      }
    });
  }

  loadRealImages(speciesToLoad: Species[]) {
    speciesToLoad.forEach((specie, index) => {
      const globalIndex = this.species.findIndex(s => s.url === specie.url);
      if (globalIndex !== -1) {
        this.swapiService.getSpeciesImage(specie.name).subscribe({
          next: (realImageUrl) => {
            if (realImageUrl !== this.swapiService.getSpeciesImageSync(specie.name)) {
              this.species[globalIndex].image = realImageUrl;
            }
          },
          error: (err) => {
            console.error(`Erro ao carregar imagem para ${specie.name}:`, err);
          }
        });
      }
    });
  }

  loadMoreSpecies() {
    if (this.loadingMore || !this.hasNextPage) return;

    this.loadingMore = true;
    this.currentPage++;
    this.fetchSpeciesWithImages();
  }

  onImageError(specie: Species) {
    specie.image = this.swapiService.getSpeciesImageSync(specie.name);
  }

  formatHeight(height: string): string {
    if (height === 'unknown') return 'Desconhecida';
    return `${height} cm`;
  }

  formatLifespan(lifespan: string): string {
    if (lifespan === 'unknown') return 'Desconhecida';
    return `${lifespan} anos`;
  }

  getDesignationText(designation: string): string {
    const designationMap: { [key: string]: string } = {
      'sentient': 'Senciente',
      'reptilian': 'Reptiliana',
      'mammal': 'Mamífera',
      'unknown': 'Desconhecida'
    };
    return designationMap[designation] || designation;
  }
}