export interface User {
    _id: string;
    primer_nombre: string;
    segundo_nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    rut: string;
    is_active: boolean;
    email: string;
    password: string;
    rol_usuario: string;
}  
export interface userLogin{
    email: string;
    password: string;
}


export interface RoleResponse {
    role: string;
    message: string;
  }
