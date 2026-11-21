// Aquí vive TODA la lógica de consumo de la API (requisito: separar los servicios).
// Los componentes no usan fetch directamente: solo llaman a estas funciones.

import type { Paquete } from '../types/paquete';

export const BASE_URL = 'https://villa-penas-production.up.railway.app';

// Función base: hace el GET y lanza un error si la API no responde con 200
async function pedir(ruta: string): Promise<Response> {
  const respuesta = await fetch(`${BASE_URL}${ruta}`);
  if (!respuesta.ok) {
    throw new Error(`La API respondió con error ${respuesta.status} en ${ruta}`);
  }
  return respuesta;
}

// ENDPOINT 1: GET /public/paquetes  -> lista de paquetes (JSON)
export async function obtenerPaquetes(): Promise<Paquete[]> {
  const respuesta = await pedir('/public/paquetes');
  return respuesta.json();
}

// ENDPOINT 2: GET /public/paquetes/{id}  -> detalle de un paquete (JSON)
export async function obtenerPaquete(id: number): Promise<Paquete> {
  const respuesta = await pedir(`/public/paquetes/${id}`);
  return respuesta.json();
}

// ENDPOINT 3: GET /public/paquetes/reporte/pdf  -> catálogo de todos los paquetes (PDF)
// Se descarga como "blob" y se convierte en una URL temporal para mostrarlo en la página
export async function obtenerPdfCatalogo(): Promise<string> {
  const respuesta = await pedir('/public/paquetes/reporte/pdf');
  const blob = await respuesta.blob();
  return URL.createObjectURL(blob);
}

// ENDPOINT 4: GET /public/paquetes/{id}/reporte/pdf  -> PDF de un paquete
export async function obtenerPdfPaquete(id: number): Promise<string> {
  const respuesta = await pedir(`/public/paquetes/${id}/reporte/pdf`);
  const blob = await respuesta.blob();
  return URL.createObjectURL(blob);
}
