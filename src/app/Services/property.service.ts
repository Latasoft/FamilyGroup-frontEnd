import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Property, PropertyWithAgent } from '../../models/property';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private API_URL = `${environment.apiUrl}/api/property`;
  private http=inject(HttpClient);


  // Método para crear un nuevo material
  createProperty(propiedad: Property, foto_casa: File[]): Observable<Property> {
    const formData: FormData = new FormData();
  
    // Agregar campos simples
    formData.append('nombre', propiedad.nombre);
    formData.append('direccion', propiedad.direccion);
    formData.append('descripcion', propiedad.descripcion);
    formData.append('region', propiedad.region);
    formData.append('comuna', propiedad.comuna);
    formData.append('banos', propiedad.banos.toString());
    formData.append('dormitorios', propiedad.dormitorios.toString());
    formData.append('superficie', propiedad.superficie.toString());
    formData.append('tipo_propiedad', propiedad.tipo_propiedad);
    formData.append('tipo_operacion', propiedad.tipo_operacion);
    formData.append('detalles_adicionales', propiedad.detalles_adicionales);
    formData.append('detalles_destacados', propiedad.detalles_destacados);
    formData.append('is_activated', propiedad.is_activated?.toString() || 'true'); // Valor predeterminado true
    formData.append('mostrar_propiedad', propiedad.mostrar_propiedad?.toString() ); // Valor predeterminado true
    formData.append('propiedad_destacada', propiedad.propiedad_destacada.toString());
  
    // Agregar campos de precio (desglose del objeto)
    formData.append('precio_valor', propiedad.precio.valor.toString());
    formData.append('precio_moneda', propiedad.precio.moneda);
  
    // Agregar archivos (fotos de la propiedad)
    foto_casa.forEach((archivo) => {
      formData.append('foto_casa', archivo, archivo.name);
    });
  
    // Si tienes un agente asociado, lo agregas (opcional)
    if (propiedad.agent) {
      formData.append('agent', propiedad.agent);
    }
  
    // Realizar la solicitud HTTP POST
    return this.http.post<Property>(`${this.API_URL}`, formData);
  }
  

  //HttpParams para manejar los parámetros de paginación, y evitar contenido de paginación en URL, cuando no hay filtros
  getAllProperties(page: number, limit: number): Observable<any> {
    const url = `${this.API_URL}?page=${encodeURIComponent(page.toString())}&limit=${encodeURIComponent(limit.toString())}`;
    return this.http.get<any>(url);
  }

  getAllPropertiesIcludeInactive(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/all?page=${page}&limit=${limit}`);
  }

  getPropertiesByType(tipo_operacion: string): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.API_URL}/tipo-operacion/${tipo_operacion}`);
  }

  getFilteredProperties(filters: any): Observable<any> {
    let params = new HttpParams();

    // Añadir los filtros dinámicamente
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params = params.append(key, filters[key]);
      }
    });

    return this.http.get(`${this.API_URL}/filter`, { params });
  }

  getPropertyById(_id: string): Observable<Property> {
    return this.http.get<Property>(`${this.API_URL}/${_id}`);
  }
  updateProperty(_id: string, propiedad: Property, archivos: File[]): Observable<Property> {
    const formData: FormData = new FormData();
  
    formData.append('nombre', propiedad.nombre);
    formData.append('direccion', propiedad.direccion);
    formData.append('descripcion', propiedad.descripcion);
    formData.append('region', propiedad.region);
    formData.append('comuna', propiedad.comuna);
    formData.append('dormitorios', propiedad.dormitorios.toString());
    formData.append('banos', propiedad.banos.toString());
    formData.append('precio_valor', propiedad.precio.valor.toString());
    formData.append('precio_moneda', propiedad.precio.moneda);
    formData.append('superficie', propiedad.superficie.toString());
    formData.append('tipo_propiedad', propiedad.tipo_propiedad);
    formData.append('tipo_operacion', propiedad.tipo_operacion);
    formData.append('detalles_adicionales', propiedad.detalles_adicionales);
    formData.append('detalles_destacados', propiedad.detalles_destacados);
    formData.append('propiedad_destacada', propiedad.propiedad_destacada.toString());
    formData.append('mostrar_propiedad', propiedad.mostrar_propiedad.toString());
    formData.append('is_activated', propiedad.is_activated.toString());

  
    if (propiedad.agent) {
      formData.append('agent', propiedad.agent);
    }
  
    archivos.forEach((archivo) => {
      formData.append('foto_casa', archivo, archivo.name);
    });
  
    return this.http.put<Property>(`${this.API_URL}/${_id}`, formData);
  }
  
  


  getPropertyWithAgent(_id:string):Observable<PropertyWithAgent>{
    return this.http.get<PropertyWithAgent>(`${this.API_URL}/all-with-agent/${_id}`)

  }

  getPropertyFatured(): Observable<PropertyWithAgent[]> {
    return this.http.get<{ properties: PropertyWithAgent[] }>(`${this.API_URL}/featured`).pipe(
      map((response) => response.properties)
    );
  }
  

  desactivateProperty(_id: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/${_id}/desactivate`, {}); // Retorna el observable
  }

  activateProperty(_id: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/${_id}/activate`, {}); // Retorna el observable
  }

  // Método para verificar si se puede eliminar (paso 1)
  checkDropProperty(_id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${_id}`); // Primera llamada sin confirmación
  }

  // Método para confirmar la eliminación (paso 2)
  confirmDropProperty(_id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${_id}?confirm=true`); // Con confirmación
  }

  // Método original que puedes mantener como wrapper
  dropProperty(_id: string, confirm: boolean = false): Observable<any> {
    const url = confirm 
      ? `${this.API_URL}/${_id}?confirm=true`
      : `${this.API_URL}/${_id}`;
    return this.http.delete(url);
  }

}
