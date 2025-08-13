import { Component, inject } from '@angular/core';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Agent } from '../../../models/agent';
import { AgentService } from '../../Services/agent.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agent-list',
  standalone: true,
  imports: [PaginationComponent, RouterLink, CommonModule],
  templateUrl: './agent-list.component.html',
  styleUrl: './agent-list.component.css'
})
export class AgentListComponent {
  agents: Agent[] = [];
  currentPage: number = 1;
  totalPages: number = 1;


  private agentService=inject(AgentService);
    private router = inject(Router);
    private toastr=inject(ToastrService)
  
  
    ngOnInit(){
      this.getAgents(this.currentPage, 10);
  
    }

  
    presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
      this.toastr[tipo](mensaje, titulo, {
        timeOut: 5000,               // Duración del mensaje
        positionClass: 'toast-top-center', // Posición: arriba en el centro
        
      });
    }
  
    getAgents(page: number, limit: number) {
      this.agentService.getAllAgentPaginated(page, limit).subscribe(
        (response) => {
          this.agents=response.agents;
          
          this.currentPage = response.currentPage;
          this.totalPages = response.totalPages;
        },
        (error) => {
          this.presentToast('Error al cargar los agentes', 'Error', 'error');
          this.agents = [];
        }
      );
    }
  
    handleAction(_id: string| undefined): void {
      this.router.navigate(['/agentes'], { queryParams: { _id: _id } }); // Navegar con el ID como query param
    }
  
    onPageChange(newPage: number) {
      this.getAgents(newPage, 10); // Límite fijo, puede hacerse dinámico
    }

}
