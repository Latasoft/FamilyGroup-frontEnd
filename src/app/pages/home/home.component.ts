import { Component, inject } from '@angular/core';
import { CategoriesComponent } from './categories/categories.component';
import { FeaturedPropertiesComponent } from './featured-properties/featured-properties.component';
import { ServicesComponent } from '../../shared/components/services/services.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgentCardComponent } from '../../shared/components/agent-card/agent-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,CategoriesComponent,FeaturedPropertiesComponent,ServicesComponent,FormsModule,AgentCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  filters = {
    tipo_operacion: '',
    tipo_propiedad: '',
    comuna: '',
    precio_min: null,
    precio_max: null,
    moneda: '', // Moneda por defecto
    dormitorios: '',
    banos: '',
    amoblado: false,
    piscina: false,
    estacionamiento: false,
  };
  

  showAdvancedFilters = false;
  private router = inject(Router);
  onSearch(): void {
    // Redirigir a properties-list con los filtros como query params
    const queryParams = { ...this.filters };

    this.router.navigate(['/lista-propiedades'], {
      queryParams,
    });
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }


}
