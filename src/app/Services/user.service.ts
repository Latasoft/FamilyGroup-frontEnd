import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod'
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = `${environment.apiUrl}/api/users`; // Base de las rutas de usuarios

  constructor(private http: HttpClient) {}

  /**
   * Crear un nuevo usuario.
   * @param user Objeto con los datos del usuario a crear.
   * @returns Observable con la respuesta del servidor.
   */
  createUser(user: User): Observable<any> {
    return this.http.post(`${this.API_URL}`, user, { withCredentials: true });
  }

  /**
   * Actualizar un usuario existente por ID.
   * @param user Objeto con los datos actualizados del usuario.
   * @returns Observable con la respuesta del servidor.
   */
  updateUser(_id:string,user: User): Observable<any> {
    return this.http.put(`${this.API_URL}/${_id}`, user, { withCredentials: true });
  }

  /**
   * Desactivar un usuario existente por ID.
   * @param id ID del usuario a desactivar.
   * @returns Observable con la respuesta del servidor.
   */
  deactivateUser(_id: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/${_id}`, {}, { withCredentials: true });
  }

  /**
   * Obtener un usuario por su ID.
   * @param id ID del usuario a buscar.
   * @returns Observable con los datos del usuario.
   */
  getUserById(_id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${_id}`, { withCredentials: true });
  }

  /**
   * Obtener la lista completa de usuarios.
   * @returns Observable con la lista de usuarios.
   */
  getAllUsers(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}?page=${page}&limit=${limit}`, { withCredentials: true });
  }
}
