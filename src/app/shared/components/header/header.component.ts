import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() rolUsuario: string | null = null;
  private cdr = inject(ChangeDetectorRef);
  private authService=inject(AuthService)
  private router=inject(Router)

  @Output() roleCleared = new EventEmitter<void>(); 
  ngOnChanges(): void {
    this.cdr.detectChanges(); // Forzar la detección del cambio
  }


  logout() {
    this.authService.logout().subscribe(
      () => {
        this.roleCleared.emit(); // Limpia el rol
        this.router.navigate(['/login']); // Navega sin recargar
      },
      (error) => {
        
      }
    );
  }
  

}
