import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { 
  LucideAngularModule, 
  ArrowLeftIcon, 
  GlobeIcon, 
  ThermometerIcon, 
  MountainIcon, 
  UsersIcon, 
  ClockIcon, 
  ZapIcon 
} from 'lucide-angular';
import { SwapiService } from '../../../../services/swapi.service';
import { SpinnerComponent } from "../../../../components/spinner/spinner.component/spinner.component";

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
  residents: string[];
  films: string[];
  image?: string;
}

@Component({
  standalone: true,
  selector: 'app-planet-detail',
  templateUrl: './planet-detail.component.html',
  styleUrls: ['./planet-detail.component.css'],
  imports: [CommonModule, RouterModule, HttpClientModule, LucideAngularModule, SpinnerComponent],
})
export class PlanetDetailComponent implements OnInit {
  planet: Planet | null = null;
  loading = true;

  // Ícones
  readonly ArrowLeftIcon = ArrowLeftIcon;
  readonly GlobeIcon = GlobeIcon;
  readonly ThermometerIcon = ThermometerIcon;
  readonly MountainIcon = MountainIcon;
  readonly UsersIcon = UsersIcon;
  readonly ClockIcon = ClockIcon;
  readonly ZapIcon = ZapIcon;

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private swapiService: SwapiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.fetchPlanet(id);
  }

  fetchPlanet(id: string) {
    this.http.get<Planet>(`https://swapi.dev/api/planets/${id}/`).subscribe({
      next: (data) => {
        this.planet = {
          ...data,
          image: this.swapiService.getPlanetImageSync(data.name)
        };
        this.loadRealPlanetImage();
      },
      error: (err) => console.error('Erro ao buscar planeta:', err),
      complete: () => (this.loading = false),
    });
  }

  loadRealPlanetImage() {
    if (this.planet) {
      this.swapiService.getPlanetImage(this.planet.name).subscribe({
        next: (realImageUrl) => {
          if (this.planet && realImageUrl !== this.swapiService.getPlanetImageSync(this.planet.name)) {
            this.planet.image = realImageUrl;
          }
        },
        error: (err) => {
          console.error(`Erro ao carregar imagem para ${this.planet?.name}:`, err);
        }
      });
    }
  }

  // Método para tratamento de erro de imagem
  onImageError() {
    if (this.planet) {
      this.planet.image = this.swapiService.getPlanetImageSync(this.planet.name);
    }
  }

  formatPopulation(population: string) {
    if (population === 'unknown') return 'Desconhecida';
    const num = parseInt(population);
    if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)} bilhões`;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} milhões`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)} mil`;
    return population;
  }
}