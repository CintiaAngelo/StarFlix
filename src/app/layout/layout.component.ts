import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component/header.component';
import { FooterComponent } from '../components/footer/footer.component/footer.component';
import { StarsBackgroundComponent } from '../components/stars-background.component/stars-background.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, StarsBackgroundComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-black relative">
      <!-- Fundo de estrelas para toda a aplicação -->
      <app-stars-background [starCount]="80"></app-stars-background>
      
      <!-- Header -->
      <app-header class="relative z-10"></app-header>
      
      <!-- Conteúdo principal -->
      <main class="flex-1 relative z-10">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <app-footer class="relative z-10"></app-footer>
    </div>
  `
})
export class LayoutComponent {}