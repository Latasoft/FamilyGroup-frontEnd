import { Component, inject } from '@angular/core';
import { MOCK_PROPERTIES } from './mock-properties';
import { CommonModule } from '@angular/common';
import { PropertycardComponent } from '../../shared/components/propertycard/propertycard.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { Property } from '../../../models/property';
import { PropertyService } from '../../Services/property.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-properties-list',
  standalone: true,
  imports: [CommonModule,PropertycardComponent,PaginationComponent],
  templateUrl: './properties-list.component.html',
  styleUrl: './properties-list.component.css'
})
export class PropertiesListComponent {
  

  regions = ['Valparaíso', 'Metropolitana', 'Coquimbo'];
  comunas = ['Viña del Mar', 'Santiago Centro', 'La Serena'];
  
  properties: Property[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  isLoading: boolean = false;
  noResults: boolean = false; // Indica si no se encontraron resultados

  private propertyService = inject(PropertyService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log("Filtros recibidos en el frontend:", params); // Depuración
  
      if (Object.keys(params).length > 0) {
        if (params['tipo_operacion'] && Object.keys(params).length === 1) {
          // Si solo se filtra por tipo de operación, usa el método específico
          this.getPropertiesByType(params['tipo_operacion']);
        } else {
          this.getFilteredProperties(params);
        }
      } else {
        // Si no hay filtros, carga todas las propiedades
        this.getProperties(this.currentPage, 10);
      }
    });
  }
  

  /**
   * Obtener todas las propiedades.
   */

  getFilteredProperties(filters: any) {
    this.isLoading = true;
    
  
    this.propertyService.getFilteredProperties(filters).subscribe(
      (response) => {
        this.properties = response.properties;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.noResults = this.properties.length === 0; // Si no hay resultados, mostrar mensaje
        this.isLoading = false;
      },
      (error) => {
        console.error("Error obteniendo propiedades filtradas");
        this.properties = [];
        this.noResults = true;
        this.isLoading = false;
      }
    );
  }
  
  getProperties(page: number, limit: number) {
    this.isLoading = true;
    this.propertyService.getAllProperties(page, limit).subscribe(
      (response) => {
        this.properties = response.properties;
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.noResults = this.properties.length === 0; // Si no hay propiedades, activa noResults
        this.isLoading = false;
      },
      (error) => {
        this.properties = [];
        this.noResults = true;
        this.isLoading = false;
      }
    );
  }

  /**
   * Obtener propiedades filtradas por tipo de operación.
   */
  getPropertiesByType(tipoOperacion: string) {
    this.isLoading = true;
    this.propertyService.getPropertiesByType(tipoOperacion).subscribe(
      (response) => {
        this.properties = response;
        this.totalPages = 1; // No se aplica paginación si es un filtro único
        this.noResults = this.properties.length === 0; // Si no hay propiedades, activa noResults
        this.isLoading = false;
      },
      (error) => {
        this.properties = [];
        this.noResults = true;
        this.isLoading = false;
      }
    );
  }

  /**
   * Manejo de paginación.
   */
  onPageChange(newPage: number) {
    this.getProperties(newPage, 10); // Límite fijo, puede hacerse dinámico
  }

}
