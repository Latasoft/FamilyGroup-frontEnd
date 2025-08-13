import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title: string = 'Título del Diálogo';
  @Input() message: string = 'Mensaje de ejemplo.';
  @Input() confirmText: string = 'Aceptar';
  @Input() cancelText: string | null = 'Cancelar'; // Opcional
  @Input() isVisible: boolean = false;

  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();

  closeModal(): void {
    this.isVisible = false;
    this.onClose.emit();
  }

  confirmAction(): void {
    this.onConfirm.emit();
  }


}
