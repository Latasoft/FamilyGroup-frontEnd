import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../../models/contact';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private API_URL=`${environment.apiUrl}/api/contact`;
  constructor(private http:HttpClient) { }

  sendMessage(data: Contact): Observable<any> {
    return this.http.post<any>(this.API_URL, data);
  }
 
}
