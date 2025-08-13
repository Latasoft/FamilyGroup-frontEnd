import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../../Services/property.service';
import { Property, PropertyWithAgent } from '../../../../models/property';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
register();
@Component({
  selector: 'app-featured-properties',
  standalone: true,
  imports: [RouterLink,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './featured-properties.component.html',
  styleUrl: './featured-properties.component.css'
})
export class FeaturedPropertiesComponent {

  featuredProperties: PropertyWithAgent[] = [];
  private propertyService = inject(PropertyService);

  ngOnInit() {
    this.getFeaturedProperties();
  }

  getFeaturedProperties(): void {
    this.propertyService.getPropertyFatured().subscribe({
      next: (data: PropertyWithAgent[]) => {
        this.featuredProperties = data;
      },
      error: (err) => {
      },
    });
  }

  formatPrice(price: { valor: number; moneda: string }): string {
    if (!price) return ''; // Evita errores si el precio es undefined
    if (price.moneda === 'UF') {
      return `UF ${price.valor.toLocaleString('es-CL')}`;
    }
    return `$ ${price.valor.toLocaleString('es-CL')}`;
}


}
