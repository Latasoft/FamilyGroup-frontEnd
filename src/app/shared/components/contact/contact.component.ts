import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../../Services/contact.service';
import { Contact } from '../../../../models/contact';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm: FormGroup;
  messageStatus: string = '';

  constructor(private fb: FormBuilder,  private contactService: ContactService,private toastr:ToastrService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro
      
    });
  }
  submit(): void {
    if (this.contactForm.valid) {
      const contactData: Contact = {
        ...this.contactForm.value, // Obtén los valores del formulario (name, email, message)
        subject: 'Consulta de servicios', // Asigna el subject manualmente
      };

      this.contactService.sendMessage(contactData).subscribe({
        next: () => {
          this.presentToast('Mensaje enviado correctamente', 'Notificación', 'success');
          this.contactForm.reset();
        },
        error: () => {
          this.presentToast('Error al enviar el mensaje', 'Error', 'error');
        },
      });
    } else {
    }
  }

}
