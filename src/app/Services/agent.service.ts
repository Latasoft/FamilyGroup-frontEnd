import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agent } from '../../models/agent';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  
  private API_URL = `${environment.apiUrl}/api/agent`; 
  private http=inject(HttpClient);

  createAgent(agent:Agent, foto_agente:File):Observable<Agent>{
    const formData:FormData=new FormData();
    formData.append('titulo_agente', agent.titulo_agente);
    formData.append('nombre', agent.nombre);
    formData.append('apellido', agent.apellido);
    formData.append('rut_agente', agent.rut_agente);
    formData.append('email_agente', agent.email_agente);
    formData.append('telefono_agente', agent.telefono_agente);
    if (foto_agente) {
    
      formData.append('foto_agente', foto_agente);
    } else {
      console.log('No se agregó ninguna imagen al FormData.');
    }
    
    return this.http.post<Agent>(`${this.API_URL}`,formData)
  }


  updateAgent(_id:string,agent:Agent, foto_agente:File):Observable<Agent>{
    const formData:FormData=new FormData();
    formData.append('titulo_agente', agent.titulo_agente);
    formData.append('nombre', agent.nombre);
    formData.append('apellido', agent.apellido);
    formData.append('rut_agente', agent.rut_agente);
    formData.append('email_agente', agent.email_agente);
    formData.append('telefono_agente', agent.telefono_agente);
    if (foto_agente) {
    
      formData.append('foto_agente', foto_agente);
    } else {
      console.log('No se agregó ninguna imagen al FormData.');
    }
    
    return this.http.put<Agent>(`${this.API_URL}/${_id}`,formData)
  }
  getAllAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.API_URL}`);
  }

  getAgentById(_id:string):Observable<Agent>{
    return this.http.get<Agent>(`${this.API_URL}/${_id}`)
  }

  getAllAgentPaginated(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/paginated?page=${page}&limit=${limit}`, { withCredentials: true });
  }

}
