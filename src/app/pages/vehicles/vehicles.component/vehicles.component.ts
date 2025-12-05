import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CarIcon, UsersIcon, ZapIcon, DollarSignIcon, LoaderIcon } from 'lucide-angular';
import { SwapiService } from '../../../services/swapi.service';
import { SpinnerComponent } from "../../../components/spinner/spinner.component/spinner.component";

interface Vehicle {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  vehicle_class: string;
  url: string;
  image?: string;
}

@Component({
  selector: 'app-vehicles',
  standalone: true,
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css'],
  imports: [CommonModule, LucideAngularModule, SpinnerComponent],
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;
  loadingMore = false;
  currentPage = 1;
  hasNextPage = true;

  readonly CarIcon = CarIcon;
  readonly UsersIcon = UsersIcon;
  readonly ZapIcon = ZapIcon;
  readonly DollarSignIcon = DollarSignIcon;
  readonly LoaderIcon = LoaderIcon;

  constructor(private swapiService: SwapiService) {}

  ngOnInit(): void {
    this.fetchVehiclesWithImages();
  }

  fetchVehiclesWithImages() {
    this.swapiService.getVehicles(this.currentPage).subscribe({
      next: (data) => {
        const vehiclesFromSwapi = data.results;
        
        const newVehicles = vehiclesFromSwapi.map((vehicle: any) => ({
          ...vehicle,
          image: this.swapiService.getVehicleImageSync(vehicle.name)
        }));

        this.vehicles = [...this.vehicles, ...newVehicles];
        this.hasNextPage = !!data.next; 
        this.loading = false;
        this.loadingMore = false;

        this.loadRealVehicleImages(newVehicles);
      },
      error: (err) => {
        console.error('Erro ao buscar veículos:', err);
        this.loading = false;
        this.loadingMore = false;
      }
    });
  }

  loadRealVehicleImages(vehiclesToLoad: Vehicle[]) {
    vehiclesToLoad.forEach((vehicle, index) => {
      const globalIndex = this.vehicles.findIndex(v => v.url === vehicle.url);
      if (globalIndex !== -1) {
        this.swapiService.getVehicleImage(vehicle.name).subscribe({
          next: (realImageUrl) => {
            if (realImageUrl !== this.swapiService.getVehicleImageSync(vehicle.name)) {
              this.vehicles[globalIndex].image = realImageUrl;
            }
          },
          error: (err) => {
            console.error(`Erro ao carregar imagem para ${vehicle.name}:`, err);
          }
        });
      }
    });
  }

  loadMoreVehicles() {
    if (this.loadingMore || !this.hasNextPage) return;

    this.loadingMore = true;
    this.currentPage++;
    this.fetchVehiclesWithImages();
  }

  onImageError(vehicle: Vehicle) {
    vehicle.image = this.swapiService.getVehicleImageSync(vehicle.name);
  }

  formatCredits(credits: string): string {
    if (credits === 'unknown') return 'Desconhecido';
    const num = parseInt(credits);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return credits;
  }

  formatSpeed(speed: string): string {
    if (speed === 'unknown' || speed === 'n/a') return 'N/A';
    return `${speed} km/h`;
  }

  formatLength(length: string): string {
    if (length === 'unknown') return 'Desconhecido';
    return `${length}m`;
  }
}