import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Star, Heart, Code, Github, Linkedin, Mail } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  // Ícones Lucide
  readonly StarIcon = Star;
  readonly HeartIcon = Heart;
  readonly CodeIcon = Code;
  readonly GithubIcon = Github;
  readonly LinkedinIcon = Linkedin;
  readonly MailIcon = Mail;

  navItems = [
    { path: '/movies', label: 'Filmes' },
    { path: '/characters', label: 'Personagens' },
    { path: '/planets', label: 'Planetas' },
    { path: '/species', label: 'Espécies' },
    { path: '/vehicles', label: 'Veículos' },
  ];

  techStack = ['Angular 20', 'TypeScript', 'Tailwind CSS', 'Lucide Angular', 'SWAPI'];

  // Gerar estrelas para o background
  stars = Array.from({ length: 50 }).map(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    animationDelay: Math.random() * 5 + 's',
    animationDuration: Math.random() * 3 + 2 + 's'
  }));

}