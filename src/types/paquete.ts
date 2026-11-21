// Tipos que describen el JSON que devuelve GET /public/paquetes
// (se copiaron de la respuesta real que se vio en Swagger)

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  unidadMedida: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface PaqueteServicio {
  id: number;
  paqueteId: number;
  servicioId: number;
  cantidad: number | null;
  detalle: string | null;
  orden: number;
  servicio: Servicio;
}

export interface Paquete {
  id: number;
  nombre: string;
  descripcion: string;
  precioColones: number;
  activo: boolean;
  paquetesServicios: PaqueteServicio[];
}
