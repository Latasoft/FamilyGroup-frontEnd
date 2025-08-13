import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../../Services/property.service';
import { Property } from '../../../models/property';
import { AgentService } from '../../Services/agent.service';
import { Agent } from '../../../models/agent';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SlaiderComponent } from '../../shared/components/slaider/slaider.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-house-manage',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,SlaiderComponent],
  templateUrl: './house-manage.component.html',
  styleUrls: ['./house-manage.component.css']
})
export class HouseManageComponent implements OnInit {
  houseForm!: FormGroup;
  agents: Agent[] = [];
  selectedFiles: File[] = [];
  isEditMode: boolean = false;
  _id: string | null = null;
  existFiles: string[] = [];
  isModalOpen: boolean = false; // Estado del modal

  constructor(
    private propertyService: PropertyService,
    private fb: FormBuilder,
    private agentService: AgentService,
    private route: ActivatedRoute,
    private toastr:ToastrService // Inyección del ActivatedRoute para capturar el ID
    
  ) { }

  ngOnInit(): void {
    this.initializeForm(); // Inicializa el formulario vacío
    this.getAgents(); // Cargar agentes y reconstruir el formulario

    // Detectar si estamos en modo edición o creación
    this.route.queryParams.subscribe((params) => {
      this._id = params['_id']; // Leer el parámetro "id" de la URL
      
      if (this._id) {
        this.isEditMode = true;
        this.loadPropertyData(this._id); // Cargar datos de la propiedad
      } else {
        this.isEditMode = false;
      }
    });
  }

  private loadPropertyData(_id: string): void {
    this.propertyService.getPropertyById(_id).subscribe({
      next: (property: Property) => {
        this.existFiles=property.foto_casa? property.foto_casa.map(foto=> foto.url):[];

        // Extraer el ID del agente si está disponible
        const agentId = property.agent && typeof property.agent === 'object' ? property.agent : property.agent;
        
        this.houseForm.patchValue({
          nombre: property.nombre,
          direccion: property.direccion,
          descripcion: property.descripcion,
          region: property.region,
          comuna: property.comuna,
          dormitorios: property.dormitorios,
          banos: property.banos,
          precio_valor: property.precio.valor,
          precio_moneda: property.precio.moneda,
          superficie: property.superficie,
          agent: agentId, // Asignar solo el ID del agente
          tipo_propiedad: property.tipo_propiedad,
          tipo_operacion: property.tipo_operacion,
          detalles_adicionales: property.detalles_adicionales,
          detalles_destacados: property.detalles_destacados,
          propiedad_destacada:property.propiedad_destacada,
          mostrar_propiedad:property.mostrar_propiedad,
          is_activated: property.is_activated,

        });
  
        // Asegurarse de que el agente esté sincronizado con la lista
        this.getAgents();
      },
      
    });
  }
 
  openSlider(): void {
    this.isModalOpen = true;
  }

  closeSlider(): void {
    this.isModalOpen = false;
  }
  


  private initializeForm(): void {
    // Crear un formulario vacío con valores iniciales
    this.houseForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      descripcion: ['', Validators.required],
      region: ['', Validators.required],
      comuna: ['', Validators.required],
      dormitorios: ['', Validators.required],
      banos: ['', Validators.required],
      precio_valor: ['', Validators.required],
      precio_moneda: ['', Validators.required],
      superficie: ['', Validators.required],
      agent: [''], // Valor temporal hasta que se carguen los agentes
      tipo_propiedad: ['CASA', Validators.required],
      tipo_operacion: ['VENTA', Validators.required],
      detalles_adicionales: ['', Validators.required],
      detalles_destacados: ['', Validators.required],
      propiedad_destacada:[false],
      is_activated: [true],
      mostrar_propiedad:[true],
      foto_casa: ['']
    });
  }

  private buildFormHouse(): void {
    const currentAgent = this.houseForm.get('agent')?.value;
    if (!currentAgent && this.agents.length > 0) {
      this.houseForm.patchValue({ agent: this.agents[0]._id }); // Seleccionar el primer agente si no hay uno asignado
    }
  }


  getAgents(): void {
    this.agentService.getAllAgents().subscribe({
      next: (agents: Agent[]) => {
        this.agents = agents;
  
        // Si estamos en modo edición, asegurarnos de que el agente esté seleccionado
        const currentAgentId = this.houseForm.get('agent')?.value;
        if (currentAgentId && this.agents.some(agent => agent._id === currentAgentId)) {
          this.houseForm.patchValue({ agent: currentAgentId });
        } else if (!this.isEditMode && this.agents.length > 0) {
          // En modo creación, asignar el primer agente como predeterminado
          this.buildFormHouse();
        }
      },
    });
  }
  


  onSubmit(): void {
    if (this.houseForm.invalid) {
      this.presentToast('Formulario inválido. Por favor, complete todos los campos.','Error','error');
      return;
    }

    // Obtener los valores del formulario
    const propiedad: Property = {
      nombre: this.houseForm.get('nombre')?.value,
      direccion: this.houseForm.get('direccion')?.value,
      descripcion: this.houseForm.get('descripcion')?.value,
      region: this.houseForm.get('region')?.value,
      comuna: this.houseForm.get('comuna')?.value,
      banos: parseInt(this.houseForm.get('banos')?.value, 10),
      dormitorios: parseInt(this.houseForm.get('dormitorios')?.value, 10),
      precio: {
        valor: parseFloat(this.houseForm.get('precio_valor')?.value),
        moneda: this.houseForm.get('precio_moneda')?.value,
      },
      superficie: parseFloat(this.houseForm.get('superficie')?.value),
      tipo_propiedad: this.houseForm.get('tipo_propiedad')?.value,
      tipo_operacion: this.houseForm.get('tipo_operacion')?.value,
      detalles_adicionales: this.houseForm.get('detalles_adicionales')?.value,
      detalles_destacados: this.houseForm.get('detalles_destacados')?.value,
      is_activated: this.houseForm.get('is_activated')?.value ?? true,
      propiedad_destacada:this.houseForm.get('propiedad_destacada')?.value,
      mostrar_propiedad:this.houseForm.get('mostrar_propiedad')?.value,
      agent: this.houseForm.get('agent')?.value,
      foto_casa: [], // Inicializar para combinar fotos existentes y nuevas
    };

    const archivos: File[] = this.selectedFiles;

    // Si estamos en modo edición, mantener las fotos existentes si no se seleccionaron nuevas
    if (this.isEditMode && this._id) {
      this.propertyService.getPropertyById(this._id).subscribe({
        next: (property: Property) => {
          // Combinar fotos existentes con nuevas
          propiedad.foto_casa = [
            ...(property.foto_casa || []).map((foto) => ({ url: foto.url })), // Fotos existentes
            ...archivos.map((file) => ({ url: '' })), // Nuevas fotos se procesarán en el backend
          ];

          // Actualizar la propiedad
          this.updateProperty(propiedad, archivos);
        },
        error: (err) => {
          this.presentToast(err.message, 'Error', 'error');
        },
      });
    } else {
      // Crear nueva propiedad
      this.createProperty(propiedad, archivos);
    }
  }

  presentToast(mensaje: string, titulo: string = 'Notificación', tipo: 'success' | 'error' | 'warning' | 'info') {
    this.toastr[tipo](mensaje, titulo, {
      timeOut: 5000,               // Duración del mensaje
      positionClass: 'toast-top-center', // Posición: arriba en el centro
      
    });
  }

  private updateProperty(propiedad: Property, archivos: File[]): void {
    if (this._id) {
      this.propertyService.updateProperty(this._id, propiedad, archivos).subscribe({
        next: (response) => {
          this.presentToast('Propirdad Actualizada', 'Notificación', 'success');
          // Opcional: Redirigir a una lista de propiedades
        },
        error: (err) => {
          this.presentToast(err.message, 'Error', 'error');
        },
      });
    }
  }

  private createProperty(propiedad: Property, archivos: File[]): void {
    this.propertyService.createProperty(propiedad, archivos).subscribe({
      next: (response) => {
        this.presentToast('Propiedad Creada', 'Notificación', 'success');
        this.houseForm.reset();
        this.selectedFiles = [];
      },
      error: (err) => {
       this.presentToast(err.message,'Error','error')
      },
    });
  }


  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
    }
  }
}
