import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Agent } from '../../../../models/agent';
import { AgentService } from '../../../Services/agent.service';
import { CommonModule } from '@angular/common';
register();
@Component({
  selector: 'app-agent-card',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Agregar aquí también
  templateUrl: './agent-card.component.html',
  styleUrl: './agent-card.component.css'
})
export class AgentCardComponent {
  agents: Agent[] = [];

  breakpoints = {
    640: { slidesPerView: 1, spaceBetween: 10 },
    768: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 30 }
  };
  constructor(private agentService: AgentService) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  // Método para cargar los agentes
  loadAgents(): void {
    this.agentService.getAllAgents().subscribe(
      (data) => {
        this.agents = data;
      },
      (error) => {
      }
    );
  }

}
