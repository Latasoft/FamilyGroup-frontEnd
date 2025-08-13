import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { UserService } from './Services/user.service';
import { AuthService } from './Services/auth.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './shared/components/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FooterComponent,HeaderComponent,CommonModule,ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto-inmobiliario';
  isTokenExpired: boolean = false; // Modal de sesión expirada
  rolUsuario: string = '';
  isLoading: boolean = true; // Spinner de carga inicial
  isAuthenticated: boolean = false; // Controla si el usuario está autenticado
  currentUrl:string=''

  private tokenExpirationTimer: any;
  private authService=inject(AuthService);
  private router=inject(Router);

   ngOnInit(): void {
    const savedUrl = sessionStorage.getItem('redirectUrl');
    this.currentUrl = savedUrl || this.router.url;
    this.checkAuthentication();
    
  }

  checkAuthentication(): void {
    this.authService.isAuthenticated().subscribe(
      (response) => {
        if (response.authenticated) {
          this.isAuthenticated = true; // Marca como autenticado
          this.getRole(); // Obtén el rol del usuario
          this.checkTokenExpiration(); // Verifica si el token está próximo a expirar
        } else {
          this.handleUnauthenticated();
        }
      },
      (error) => {
        this.handleUnauthenticated();
      }
    );
  }

  private handleUnauthenticated(): void {
    this.isAuthenticated = false;
    this.isLoading = false;
    this.rolUsuario = '';
    // Limpia el timer si existe
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  updateRole(role: string): void {
    this.rolUsuario = role;
    this.isAuthenticated = false; // Actualiza el estado de autenticación
  }
  
  
  // Obtiene el rol del usuario
  getRole(): void {
    this.authService.getRole().subscribe(
      (response) => {
        this.rolUsuario = response.role;
        this.isLoading = false; // Detiene el spinner después de cargar
      },
      (error) => {
        console.error('Error obteniendo el rol del usuario:', error);
        this.router.navigate(['/login']);
        this.isAuthenticated = false; // Asegura que el usuario no quede como autenticado
        this.isLoading = false; // Detiene el spinner
      }
    );
  }

  ngOnDestroy(): void {
    // Limpia el timer cuando el componente se destruye
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  // Verifica si el token está próximo a expirar
  checkTokenExpiration(): void {
    // Limpia cualquier timer existente
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.authService.getRemainingTime().subscribe({
      next: (response) => {
        const remainingTime = response.remainingTime;
        
        if (remainingTime <= 0) {
          this.handleTokenExpiration();
        } else {
          this.tokenExpirationTimer = setTimeout(() => {
            this.handleTokenExpiration();
          }, remainingTime);
        }
      },
      error: () => {
        this.handleTokenExpiration();
      }
    });
  }

  // Maneja la expiración del token
  handleTokenExpiration(): void {
    this.isTokenExpired = true;
    // Asegurarse de que el usuario está autenticado cuando se muestra el modal
    if (!this.isAuthenticated) {
      this.isAuthenticated = true;
    }
  }

  handleSuccessfulLogin(): void {
    const redirectUrl = sessionStorage.getItem('redirectUrl');
    if (redirectUrl) {
      sessionStorage.removeItem('redirectUrl');
      this.router.navigateByUrl(redirectUrl);
    } else {
      this.router.navigate(['/catalogo']); // O la ruta por defecto que prefieras
    }
  }
  // Maneja el cierre de sesión desde el modal
  handleLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.isTokenExpired = false;
        this.handleUnauthenticated();
        // Fuerza la recarga de la página para actualizar todo el estado
        window.location.href = '/login';
      },
      error: () => {
        this.isTokenExpired = false;
        this.handleUnauthenticated();
        window.location.href = '/login';
      }
    });
  }
 
  

  
}
