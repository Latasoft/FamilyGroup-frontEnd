import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-propertycard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './propertycard.component.html',
  styleUrl: './propertycard.component.css'
})
export class PropertycardComponent {
  @Input() properties: any[] = [];
  @Input() isAdmin: boolean = false;

  @Output() dropProp = new EventEmitter<string>();
  @Output() activate = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  constructor(private router: Router) {}

  navigateToDetail(_id: string): void {
    // Redirigir a la página de detalles con el ID de la propiedad
    this.router.navigate(['/detalle-propiedad'], { queryParams: { _id: _id } });
  }

  // Método para emitir el evento de edición
  onEditProperty(_id: string) {
    this.edit.emit(_id);
  }

  // Método para emitir el evento de eliminación
  onDeleteProperty(_id: string) {
    this.delete.emit(_id);
  }

  onRestoreProperty(_id: string) {
    this.activate.emit(_id);
  }

  onDropProperty(_id: string) {
    this.dropProp.emit(_id);
  }
}
