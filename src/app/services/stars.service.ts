import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StarsService {
  generateStars(count: number = 50) {
    return Array.from({ length: count }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 5 + 's',
      animationDuration: (Math.random() * 3 + 2) + 's',
      opacity: Math.random() * 0.5 + 0.3
    }));
  }
}