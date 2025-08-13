import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MOCK_PROPERTIES } from '../properties-list/mock-properties';
import { SlaiderComponent } from '../../shared/components/slaider/slaider.component';
import { PropertyService } from '../../Services/property.service';
import { PropertyWithAgent } from '../../../models/property';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-properties-detil',
  standalone: true,
  imports: [CommonModule,SlaiderComponent],
  templateUrl: './properties-detil.component.html',
  styleUrl: './properties-detil.component.css'
})
export class PropertiesDetilComponent {
  selectedProperty!: PropertyWithAgent; // Se asegura que siempre esté definido
  _id!: string; // ID de la propiedad seleccionada
  whatsappLink: string = '';
  constructor(
    private propertyService: PropertyService,
    private route: ActivatedRoute
  ) {}

 

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this._id = params['_id']; // Leer el parámetro "id" de la URL
      this.fetchPropertyDetails();
    });
  }

  private fetchPropertyDetails(): void {
    this.propertyService.getPropertyWithAgent(this._id).subscribe({
      next: (property) => {
        this.selectedProperty = {
          ...property,
          detalles_adicionales: Array.isArray(property.detalles_adicionales)
            ? property.detalles_adicionales
            : typeof property.detalles_adicionales === 'string'
            ? property.detalles_adicionales.split(',').map((d) => d.trim())
            : [],
          detalles_destacados: Array.isArray(property.detalles_destacados)
            ? property.detalles_destacados
            : typeof property.detalles_destacados === 'string'
            ? property.detalles_destacados.split(',').map((d) => d.trim())
            : [],
        };
  
        this.whatsappLink = this.generateWhatsAppLink(this.selectedProperty.agent?.telefono_agente || '');
      },
      error: (err) => {
      },
    });
  }
  
  // In your component class
getDetallesArray(detalles: string | string[]): string[] {
  return Array.isArray(detalles) ? detalles : detalles.split(',').map(d => d.trim());
}
  private generateWhatsAppLink(phone: string): string {
    const mensaje = `Hola, estoy interesado en la propiedad ${this.selectedProperty?.nombre}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`;
  }

  hasDetails(details: any[] | undefined): boolean {
    return Array.isArray(details) && details.length > 0;
  }

  getImageUrls(): string[] {
    return this.selectedProperty?.foto_casa?.map((f) => f.url) || [];
  }

  abrirWhatsApp(): void {
    window.open(this.whatsappLink, '_blank');
  }

  shareOnWhatsApp(property: any): void {
    const url = `https://familypropiedades.cl/detalle-propiedad?_id=${property._id}`;
    const message = `🏡 Mira esta propiedad en Family Propiedades:\n\n📍 Ubicación: ${property.comuna}, ${property.region}\n💰 Precio: ${property.precio.valor} ${property.precio.moneda}\n🔗 ${url}`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  }
  shareByEmail(property: any): void {
    const url = `http://familypropiedades.cl/detalle-propiedad?_id=${property._id}`;
    const subject = `🏡 Mira esta propiedad en Family Propiedades`;
    const body = `Hola,\n\nMira esta propiedad en Family Propiedades:\n\n📍 Ubicación: ${property.comuna}, ${property.region}\n💰 Precio: ${property.precio.valor} ${property.precio.moneda}\n🔗 ${url}\n\nSaludos.`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(mailtoUrl, '_blank');
}

formatPrice(price: { valor: number; moneda: string }): string {
  if (!price) return ''; // Evita errores si el precio es undefined
  if (price.moneda === 'UF') {
    return `UF ${price.valor.toLocaleString('es-CL')}`;
  }
  return `$ ${price.valor.toLocaleString('es-CL')}`;
}


  
}
