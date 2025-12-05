import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LucideAngularModule, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  isMenuOpen = false;
  currentPath: string = '';

  // Ícones Lucide
  readonly MenuIcon = Menu;
  readonly XIcon = X;

  navItems = [
    { path: '/', label: 'Início' },
    { path: '/movies', label: 'Filmes' },
    { path: '/characters', label: 'Personagens' },
    { path: '/planets', label: 'Planetas' },
    { path: '/species', label: 'Espécies' },
    { path: '/vehicles', label: 'Veículos' },
  ];

  constructor(private router: Router) {
    // Observar mudanças de rota
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentPath = event.url;
      });
  }

  isActive(path: string): boolean {
    return this.currentPath === path;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}