import type { Paquete } from '../types/paquete';

interface Props {
  paquete: Paquete;
  onVerPdf: (paquete: Paquete) => void;
  onCerrar: () => void;
}

export function DetallePaquete({ paquete, onVerPdf, onCerrar }: Props) {
  // Ordenamos los servicios según el campo "orden" que trae la API
  const servicios = [...paquete.paquetesServicios].sort((a, b) => a.orden - b.orden);

  return (
    <section className="detalle">
      <div className="detalle-encabezado">
        <h2>{paquete.nombre}</h2>
        <button className="secundario" onClick={onCerrar}>Cerrar</button>
      </div>
      <p className="precio">₡{paquete.precioColones.toLocaleString('es-CR')}</p>
      <p>{paquete.descripcion}</p>

      <h4>Servicios incluidos</h4>
      <ul>
        {servicios.map((ps) => (
          <li key={ps.id}>
            <strong>{ps.servicio.nombre}</strong> ({ps.servicio.unidadMedida})
            <br />
            <span className="pequeno">{ps.servicio.descripcion}</span>
          </li>
        ))}
      </ul>

      <button onClick={() => onVerPdf(paquete)}>Ver PDF de este paquete</button>
    </section>
  );
}
