import type { Paquete } from '../types/paquete';

interface Props {
  paquete: Paquete;
  seleccionado: boolean;
  onSeleccionar: (paquete: Paquete) => void;
}

export function TarjetaPaquete({ paquete, seleccionado, onSeleccionar }: Props) {
  return (
    <article className={`tarjeta ${seleccionado ? 'tarjeta-activa' : ''}`}>
      <h3>{paquete.nombre}</h3>
      <p className="precio">₡{paquete.precioColones.toLocaleString('es-CR')}</p>
      <p>{paquete.descripcion}</p>
      <p className="pequeno">{paquete.paquetesServicios.length} servicios incluidos</p>
      <button onClick={() => onSeleccionar(paquete)}>Ver detalle</button>
    </article>
  );
}
