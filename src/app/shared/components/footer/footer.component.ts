import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  screenSize: 'small' | 'medium' | 'large' = 'large';

  ngOnInit(): void {
    this.updateScreenSize();
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.updateScreenSize();
  }

  private updateScreenSize(): void {
    const width = window.innerWidth;

    if (width < 640) {
      this.screenSize = 'small'; // Dispositivos móviles
    } else if (width >= 640 && width < 1024) {
      this.screenSize = 'medium'; // Tablets
    } else {
      this.screenSize = 'large'; // Escritorio
    }
  }

}
