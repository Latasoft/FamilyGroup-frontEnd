import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slaider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slaider.component.html',
  styleUrl: './slaider.component.css'
})
export class SlaiderComponent {
  @Input() images: string[] = [];
  activeIndex = 0;

  prevSlide() {
    this.activeIndex = (this.activeIndex > 0) ? this.activeIndex - 1 : this.images.length - 1;
  }

  nextSlide() {
    this.activeIndex = (this.activeIndex < this.images.length - 1) ? this.activeIndex + 1 : 0;
  }

}
