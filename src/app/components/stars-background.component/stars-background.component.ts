import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stars-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      @for (star of stars; track $index) {
        <div 
          class="absolute w-1 h-1 bg-yellow-300 rounded-full animate-pulse"
          [style.left.%]="star.left"
          [style.top.%]="star.top"
          [style.animation-delay]="star.animationDelay"
          [style.animation-duration]="star.animationDuration"
          [style.opacity]="star.opacity"
        ></div>
      }
      <!-- Efeito de nebulosa sutil -->
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-400/3 via-transparent to-blue-400/3"></div>
    </div>
  `
})
export class StarsBackgroundComponent {
  @Input() starCount: number = 50;
  @Input() minOpacity: number = 0.3;
  @Input() maxOpacity: number = 0.8;

  stars = Array.from({ length: this.starCount }).map(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    animationDelay: Math.random() * 5 + 's',
    animationDuration: (Math.random() * 3 + 2) + 's',
    opacity: Math.random() * (this.maxOpacity - this.minOpacity) + this.minOpacity
  }));
}