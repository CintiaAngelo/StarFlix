import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, GlobeIcon, ThermometerIcon, MountainIcon, UsersIcon, LoaderIcon } from 'lucide-angular';
import { SwapiService } from '../../../services/swapi.service';
import { SpinnerComponent } from "../../../components/spinner/spinner.component/spinner.component";

interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  url: string;
  image?: string;
}

@Component({
  selector: 'app-planets',
  standalone: true,
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.css'],
  imports: [CommonModule, LucideAngularModule, SpinnerComponent],
})
export class PlanetsComponent implements OnInit {
  planets: Planet[] = [];
  loading = true;
  loadingMore = false;
  currentPage = 1;
  hasNextPage = true;

  readonly GlobeIcon = GlobeIcon;
  readonly ThermometerIcon = ThermometerIcon;
  readonly MountainIcon = MountainIcon;
  readonly UsersIcon = UsersIcon;
  readonly LoaderIcon = LoaderIcon;

  constructor(private swapiService: SwapiService) {}

  ngOnInit(): void {
    this.fetchPlanetsWithImages();
  }

  fetchPlanetsWithImages() {
    this.swapiService.getPlanets(this.currentPage).subscribe({
      next: (data) => {
        const planetsFromSwapi = data.results;
        
        // Inicializa com imagens de fallback
        const newPlanets = planetsFromSwapi.map((planet: any) => ({
          ...planet,
          image: this.swapiService.getPlanetImageSync(planet.name)
        }));

        this.planets = [...this.planets, ...newPlanets];
        this.hasNextPage = !!data.next; // Verifica se há próxima página
        this.loading = false;
        this.loadingMore = false;

        // Busca imagens reais da API para os novos planetas
        this.loadRealPlanetImages(newPlanets);
      },
      error: (err) => {
        console.error('Erro ao buscar planetas:', err);
        this.loading = false;
        this.loadingMore = false;
      }
    });
  }

  loadRealPlanetImages(planetsToLoad: Planet[]) {
    planetsToLoad.forEach((planet, index) => {
      const globalIndex = this.planets.findIndex(p => p.url === planet.url);
      if (globalIndex !== -1) {
        this.swapiService.getPlanetImage(planet.name).subscribe({
          next: (realImageUrl) => {
            if (realImageUrl !== this.swapiService.getPlanetImageSync(planet.name)) {
              this.planets[globalIndex].image = realImageUrl;
            }
          },
          error: (err) => {
            console.error(`Erro ao carregar imagem para ${planet.name}:`, err);
          }
        });
      }
    });
  }

  loadMorePlanets() {
    if (this.loadingMore || !this.hasNextPage) return;

    this.loadingMore = true;
    this.currentPage++;
    this.fetchPlanetsWithImages();
  }

  getPlanetId(url: string): string {
    const matches = url.match(/\/planets\/(\d+)\//);
    return matches ? matches[1] : '1';
  }

  onImageError(planet: Planet) {
    planet.image = this.swapiService.getPlanetImageSync(planet.name);
  }

  formatPopulation(population: string): string {
    if (population === 'unknown') return 'Desconhecida';
    const num = parseInt(population);
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return population;
  }
}