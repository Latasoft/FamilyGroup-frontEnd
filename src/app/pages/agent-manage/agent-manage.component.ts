import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SlaiderComponent } from '../../shared/components/slaider/slaider.component';
import { Agent } from '../../../models/agent';
import { AgentService } from '../../Services/agent.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-agent-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SlaiderComponent],
  templateUrl: './agent-manage.component.html',
  styleUrl: './agent-manage.component.css',
})
export class AgentManageComponent {
  agentForm!: FormGroup;
  agent: Agent[] = [];
  existFile: string = ''; // Ajustado a tipo string para URL de imagen
  isModalOpen: boolean = false; // Estado del modal
  isEditMode: boolean = false;
  selectedFile: File | null = null; // Ajustado a tipo File para manejar archivos
  _id: string = '';

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private route: ActivatedRoute,
    private toastr: ToastrService // Inyección del ActivatedRoute para capturar el ID
  ) {}

  ngOnInit() {
    this.initializeForm();

    // Detectar si estamos en modo edición o creación
    this.route.queryParams.subscribe((params) => {
      this._id = params['_id']; // Leer el parámetro "id" de la URL

      if (this._id) {
        this.isEditMode = true;
        this.loadAgentData(this._id); // Cargar datos del agente
      } else {
        this.isEditMode = false;
      }
    });
  }


  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro
      
    });
  }
  private loadAgentData(_id: string): void {
    this.agentService.getAgentById(_id).subscribe({
      next: (agent: Agent) => {
        this.existFile = agent.foto_agente; // Mantener como URL de la imagen
        this.agentForm.patchValue({
          titulo_agente:agent.titulo_agente,
          nombre: agent.nombre,
          apellido: agent.apellido,
          rut_agente: agent.rut_agente,
          email_agente: agent.email_agente,
          telefono_agente: agent.telefono_agente,
        });
      },
      error: (error) => this.presentToast(error.message, 'Error', 'error')
    });
  }

  private initializeForm(): void {
    this.agentForm = this.fb.group({
      titulo_agente:['',Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      rut_agente: ['', Validators.required],
      email_agente: ['', [Validators.required, Validators.email]],
      telefono_agente: ['', Validators.required],
      foto_agente: [''], // Solo para cargar archivos
    });
  }

  onSubmit(): void {
    if (this.agentForm.invalid) {
      this.presentToast('Formulario inválido','Error','error');
      return;
    }
  
    const agent: Agent = {
      titulo_agente:this.agentForm.get('titulo_agente')?.value,
      nombre: this.agentForm.get('nombre')?.value,
      apellido: this.agentForm.get('apellido')?.value,
      rut_agente: this.agentForm.get('rut_agente')?.value,
      email_agente: this.agentForm.get('email_agente')?.value,
      telefono_agente: this.agentForm.get('telefono_agente')?.value,
      foto_agente: this.existFile
    };
  
    if (this.isEditMode && this._id) {
      this.agentService.getAgentById(this._id).subscribe({
        next: (currentAgent: Agent) => {
          if (this.selectedFile) {
            this.updateAgent(agent, this.selectedFile);
          } else {
            this.updateAgent(agent, new File([], ""));
          }
        },
        error: (err) => this.presentToast(err.message, 'Error', 'error')
      });
    } else {
      if (this.selectedFile) {
        this.createAgent(agent, this.selectedFile);
      } else {
        this.presentToast('No se ha seleccionado ningún archivo','Error','error');
        return;
      }
    }
  }
  
  
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Asignar el archivo seleccionado
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(this.selectedFile.type)) {
        
        this.selectedFile = null; // Reiniciar si no es válido
      }
    }
  }
  private updateAgent(agent: Agent, foto_agente:File): void {
      if (this._id) {
        this.agentService.updateAgent(this._id, agent, foto_agente).subscribe({
          next: (response) => {
            this.presentToast('Agente Actualizado', 'Agente actualizado', 'success');
            // Opcional: Redirigir a una lista de propiedades
          },
          error: (err) => {
            this.presentToast(err.message, 'Error', 'error');
          },
        });
      }
    }
  
    private createAgent(agent: Agent, foto_agente:File): void {
      this.agentService.createAgent(agent, foto_agente).subscribe({
        next: (response) => {
          this.presentToast('Agente Creado', 'Notificacion', 'success');
          this.agentForm.reset();
          this.selectedFile = null;
        },
        error: (err) => {
          this.presentToast('Error al Crear', 'Error', 'error');
        },
      });
    }
}
