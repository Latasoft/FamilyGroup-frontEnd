import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { UserService } from '../../Services/user.service';
import { User } from '../../../models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,FormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  _id: string | null = null;
  showPasswordField: boolean = false; // Controla la visibilidad del campo de contraseña
 private fb=inject(FormBuilder);
  private route=inject(ActivatedRoute);
  private toastr=inject(ToastrService)
  
  private userService=inject(UserService);

  ngOnInit(): void {
    this.initializeForm();
    
    // Verifica si hay un ID en la URL para activar el modo edición
    this.route.queryParams.subscribe((params) => {
      this._id = params['_id']; // Leer el parámetro "id" de la URL
      if (this._id) {
        this.isEditMode = true;
        this.loadUser(this._id);
      } else {
        this.isEditMode = false
      }
      
    });
  }

  initializeForm(): void {
    this.userForm = this.fb.group({
      _id: [''], // Oculto, solo usado en modo edición
      primer_nombre: ['', [Validators.required]],
      segundo_nombre: [''],
      apellido_paterno: ['', [Validators.required]],
      apellido_materno: ['', [Validators.required]],
      rut: ['', [Validators.required]],
      is_activated: [true],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]], // Solo requerido en modo creación
      newPassword: [''], // Campo opcional para actualizar la contraseña
      rol_usuario: ['ADMINISTRADOR', Validators.required],
    });
    

  }

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro
      
    });
  }

  togglePasswordField(): void {
    this.showPasswordField = !this.showPasswordField;

    if (this.showPasswordField) {
      this.userForm.get('password')?.setValidators([Validators.minLength(6)]);
    } else {
      this.userForm.get('password')?.clearValidators();
    }
    this.userForm.get('password')?.updateValueAndValidity();
  }

  loadUser(_id: string): void {
    // Aquí cargarías los datos del usuario desde tu servicio
    this.userService.getUserById(_id).subscribe({
      next:(user:User)=>{
        this.userForm.patchValue({
          primer_nombre:user.primer_nombre,
          segundo_nombre:user.segundo_nombre,
          apellido_paterno:user.apellido_paterno,
          apellido_materno:user.apellido_materno,
          rut:user.rut,
          email:user.email,
          rol_usuario:user.rol_usuario,
          is_activated:user.is_active


        })
      }
    })
  }

  desactivateUser(): void {
    if (!this._id) {
      return;
    }
  
    this.userService.deactivateUser(this._id).subscribe({
      next: (response) => {
        this.presentToast(response.message, 'Usuario desactivado', 'success');
      },
      error: (err) => {
        this.presentToast(err.error.message, 'Error', 'error');
      },
    });
  }


  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }
  
    const formData = { ...this.userForm.value };
  
    // Si no se va a cambiar la contraseña, elimina los campos relacionados
    if (this.isEditMode && !this.showPasswordField) {
      delete formData.password;
      delete formData.newPassword;
    }
  
    if (this.isEditMode) {
      this.userService.updateUser(this._id!, formData).subscribe({
        next: (response) => {
          this.presentToast(response.message,'Usuario actualizado','success')
        },
        error: (err) => {
          this.presentToast(err.message,'Error al actualizar','error')
        },
      });
    } else {
      this.userService.createUser(formData).subscribe({
        next: (response) => {
          this.presentToast(response.message,'Usuario Creado','success')
        },
        error: (err) => {
          this.presentToast(err.message,'Error al creaar usuario','error')
        },
      });
    }
  }
  
  
}
