import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Film, Users, Globe, Dna, Car, Play, Sparkles } from 'lucide-angular';
import { StarsBackgroundComponent } from '../../../components/stars-background.component/stars-background.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, StarsBackgroundComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  // Ícones
  readonly FilmIcon = Film;
  readonly UsersIcon = Users;
  readonly GlobeIcon = Globe;
  readonly DnaIcon = Dna;
  readonly CarIcon = Car;
  readonly PlayIcon = Play;
  readonly SparklesIcon = Sparkles;

  featuredPlanets = [
    { 
      name: 'TATOOINE', 
      description: 'Planeta desértico nos Territórios da Orla Externa', 
      climate: 'Árido' 
    },
    { 
      name: 'HOTH', 
      description: 'Mundo de gelo e neve no Sistema Stivin', 
      climate: 'Congelado' 
    },
    { 
      name: 'ENDOR', 
      description: 'Lua florestal com os Ewoks', 
      climate: 'Temperado' 
    }
  ];

  categories = [
    { 
      icon: this.FilmIcon, 
      title: 'FILMES', 
      description: 'Crônicas cinematográficas da galáxia', 
      path: '/movies', 
      color: 'from-yellow-400 to-yellow-600' 
    },
    { 
      icon: this.UsersIcon, 
      title: 'PERSONAGENS', 
      description: 'Arquivos de heróis e vilões', 
      path: '/characters', 
      color: 'from-blue-400 to-cyan-600' 
    },
    { 
      icon: this.GlobeIcon, 
      title: 'PLANETAS', 
      description: 'Sistemas estelares e mundos', 
      path: '/planets', 
      color: 'from-green-400 to-emerald-600' 
    }
  ];
}