// Componente reutilizable para los 3 estados: cargando, sin resultados y error

interface Props {
  tipo: 'cargando' | 'vacio' | 'error';
  texto: string;
  onReintentar?: () => void;
}

export function Mensaje({ tipo, texto, onReintentar }: Props) {
  return (
    <div className={`mensaje mensaje-${tipo}`} role={tipo === 'error' ? 'alert' : 'status'}>
      <p>{texto}</p>
      {tipo === 'error' && onReintentar && (
        <button onClick={onReintentar}>Reintentar</button>
      )}
    </div>
  );
}
