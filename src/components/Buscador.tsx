interface Props {
  valor: string;
  onCambio: (texto: string) => void;
}

export function Buscador({ valor, onCambio }: Props) {
  return (
    <input
      className="buscador"
      type="search"
      placeholder="Buscar por nombre, descripción o servicio (ej: piscina)"
      value={valor}
      onChange={(e) => onCambio(e.target.value)}
    />
  );
}
