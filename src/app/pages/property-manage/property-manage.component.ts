import { Component, inject } from '@angular/core';
import { PropertycardComponent } from '../../shared/components/propertycard/propertycard.component';
import { MOCK_PROPERTIES } from './mock-properties';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { Property } from '../../../models/property';
import { PropertyService } from '../../Services/property.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-property-manage',
  standalone: true,
  imports: [PropertycardComponent,PaginationComponent,CommonModule,RouterLink],
  templateUrl: './property-manage.component.html',
  styleUrl: './property-manage.component.css'
})
export class PropertyManageComponent  {
  properties: Property[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  private propertyService = inject(PropertyService);
  private router = inject(Router);
  private toastr=inject(ToastrService)

  ngOnInit() {
    this.getProperties(this.currentPage, 10); // Página inicial y límite por defecto
  }

  onEdit(_id: string) {
    this.router.navigate(['/propiedades'], { queryParams: { _id: _id } }); // Navegar con el ID como query param
  }
  

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro
      
    });
  }

  onDelete(_id: string) {
    this.propertyService.desactivateProperty(_id).subscribe({
      next: (response) => {
        this.presentToast(response.message, 'Notificación', 'success');
        
      },
      error: (err) => {
        this.presentToast(err.message, 'Notificación', 'error');
      }
    });
    
  }

  getProperties(page: number, limit: number) {
    this.propertyService.getAllPropertiesIcludeInactive(page, limit).subscribe(
      (response) => {
        this.properties = response.properties;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
      },
      (error) => {
        this.properties = [];
      }
    );
  }

  onPageChange(newPage: number) {
    this.getProperties(newPage, 10); // Límite fijo, puede hacerse dinámico
  }
  
  
    

}
