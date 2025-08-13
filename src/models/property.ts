export interface Property {
    _id?: string; // Opcional, ya que puede no estar definido al crear una nueva propiedad
    nombre: string;
    direccion: string;
    descripcion: string;
    region: string;
    comuna: string;
    banos: number;
    dormitorios: number;
    superficie: number; // Representa los metros cuadrados
    precio: {
      valor: number;
      moneda: 'CLP' | 'UF';
    };
    tipo_propiedad: 'CASA' | 'DEPARTAMENTO' | 'LOCAL COMERCIAL' | 'TERRENO';
    tipo_operacion: 'VENTA' | 'ARRIENDO';
    foto_casa?: {
      url: string;
    }[];
    agent?: string; // Representa el ID del agente asociado
    detalles_adicionales: string;
    detalles_destacados: string;
    propiedad_destacada:boolean;
    mostrar_propiedad:boolean;
    is_activated: boolean; // Opcional, con un valor predeterminado de true
  }

  export interface PropertyWithAgent {
    _id?: string; // Opcional, ya que puede no estar definido al crear una nueva propiedad
    nombre: string;
    direccion: string;
    descripcion: string;
    region: string;
    comuna: string;
    banos: number;
    dormitorios: number;
    superficie: number; // Representa los metros cuadrados
    precio: {
      valor: number;
      moneda: 'CLP' | 'UF';
    };
    tipo_propiedad: 'CASA' | 'DEPARTAMENTO' | 'LOCAL COMERCIAL' | 'TERRENO';
    tipo_operacion: 'VENTA' | 'ARRIENDO';
    foto_casa?: {
      url: string;
    }[];
    agent?: {
      nombre:string,
      apellido:string,
      telefono_agente:string,
      titulo_agente:string,
      foto_agente:string}; // Representa el ID del agente asociado
      detalles_adicionales: string | string[]; // Permite ambos tipos
  detalles_destacados: string | string[]; // Permite ambos tipos
    is_activated?: boolean; // Opcional, con un valor predeterminado de true
  }
  