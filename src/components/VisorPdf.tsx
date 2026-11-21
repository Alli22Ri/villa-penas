interface Props {
  titulo: string;
  url: string;
  onCerrar: () => void;
}

// Muestra el PDF descargado de la API dentro de la página
export function VisorPdf({ titulo, url, onCerrar }: Props) {
  return (
    <section className="visor">
      <div className="detalle-encabezado">
        <h3>{titulo}</h3>
        <button className="secundario" onClick={onCerrar}>Cerrar PDF</button>
      </div>
      <iframe src={url} title={titulo} />
    </section>
  );
}
