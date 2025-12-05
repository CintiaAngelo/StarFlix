import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component/home.component';
import { VehiclesComponent } from './pages/vehicles/vehicles.component/vehicles.component';
import { MoviesComponent } from './pages/movies/movies.component/movies.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail';
import { CharactersComponent } from './pages/characters/characters.component/characters.component';
import { CharacterDetailComponent } from './pages/character-detail/character-detail.component/character-detail.component';
import { PlanetsComponent } from './pages/planets/planets.component/planets.component';
import { SpeciesComponent } from './pages/species/species.component/species.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'vehicles', component: VehiclesComponent },
      { path: 'movies', component: MoviesComponent },
      { 
        path: 'movies/:id', 
        component: MovieDetailComponent,
        data: { preload: false }
      },
      { path: 'characters', component: CharactersComponent },
      { 
        path: 'characters/:id', 
        component: CharacterDetailComponent,
        data: { preload: false }
      },
      { path: 'planets', component: PlanetsComponent },
      { path: 'species', component: SpeciesComponent },
    ]
  }
];