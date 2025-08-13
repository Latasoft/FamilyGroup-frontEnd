import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { RoleResponse, userLogin } from '../../models/user';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = `${environment.apiUrl}/api/auth`; 
  constructor(private http: HttpClient) {}

  /**
   * Iniciar sesión del usuario y almacenar el token en una cookie.
   * @param user Objeto con las credenciales del usuario.
   * @returns Observable con la respuesta del servidor.
   */
  login(user: userLogin): Observable<any> {
    
    return this.http.post(`${this.API_URL}/login`, user, { withCredentials: true }).pipe(
      tap((response) => {
      }),
      catchError((error) => {
        return throwError(() => error); // Propaga el error para que el componente lo maneje
      })
    );
  }
  

  /**
   * Cerrar sesión del usuario eliminando la cookie del token.
   * @returns Observable con la respuesta del servidor.
   */
  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/logout`, {}, { withCredentials: true });
  }

  /**
   * Verificar si el usuario está autenticado.
   * @returns Observable<boolean> indicando si está autenticado.
   */
  isAuthenticated(): Observable<{ authenticated: boolean }> {
    return this.http.get<{ authenticated: boolean }>(`${this.API_URL}/isAuthenticated`, { withCredentials: true });
  }
  

  /**
   * Obtener el rol del usuario autenticado.
   * @returns Observable<string> con el rol del usuario.
   */
  getRole(): Observable<RoleResponse> {
    return this.http.get<RoleResponse>(`${this.API_URL}/role`, { withCredentials: true });
  }

  getRemainingTime(): Observable<{ remainingTime: number }> {
    return this.http.get<{ remainingTime: number }>(`${this.API_URL}/remainingTime`, { withCredentials: true });
  }
  
}
