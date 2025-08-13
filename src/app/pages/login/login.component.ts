import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  isLoggedIn: boolean = false;
  constructor(private authService: AuthService,
     private fb: FormBuilder,
    private router:Router,
    private toastr:ToastrService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          this.authService.isAuthenticated().subscribe(
            (response) => {
              this.isLoggedIn = response.authenticated;
              this.router.navigate(['/gestion-propiedades']).then(() => {
                window.location.reload(); // Recarga la página para asegurar que el token se guarda y se usa correctamente
              });
              
            
            },
            (error) => {
              
            }
          );
          
        },
        (error) => {
          this.presentToast('Credenciales erroneas ', 'Error', 'error');
        }
      );
    } else {
      this.presentToast('Complete todos los campos', 'Error', 'error');
    }
  }

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro
      
    });
  }

}
