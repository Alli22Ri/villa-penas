import { useEffect, useMemo, useState } from 'react';
import type { Paquete } from './types/paquete';
import {
  obtenerPaquete,
  obtenerPaquetes,
  obtenerPdfCatalogo,
  obtenerPdfPaquete,
} from './services/paquetesService';
import { Buscador } from './components/Buscador';
import { Mensaje } from './components/Mensaje';
import { TarjetaPaquete } from './components/TarjetaPaquete';
import { DetallePaquete } from './components/DetallePaquete';
import { VisorPdf } from './components/VisorPdf';
import './App.css';

type Estado = 'cargando' | 'listo' | 'error';

function App() {
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [estado, setEstado] = useState<Estado>('cargando');
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState<Paquete | null>(null);

  // Estado de la consulta de detalle (GET /public/paquetes/{id})
  const [detalleCargando, setDetalleCargando] = useState(false);
  const [detalleError, setDetalleError] = useState('');

  // Estado del visor de PDF
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfTitulo, setPdfTitulo] = useState('');
  const [pdfCargando, setPdfCargando] = useState(false);
  const [pdfError, setPdfError] = useState('');

  // Consulta la lista de paquetes a la API
  const cargarPaquetes = async () => {
    setEstado('cargando');
    setError('');
    try {
      const datos = await obtenerPaquetes();
      setPaquetes(datos);
      setEstado('listo');
    } catch (e) {
      setError(
        e instanceof Error
          ? `No se pudo cargar la información: ${e.message}`
          : 'No se pudo conectar con la API (revise internet o CORS).',
      );
      setEstado('error');
    }
  };

  // Se ejecuta una vez cuando la página carga
  useEffect(() => {
    cargarPaquetes();
  }, []);

  // Filtro de búsqueda (interacción útil)
  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return paquetes;
    return paquetes.filter(
      (p) =>
        p.nombre.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto) ||
        p.paquetesServicios.some((ps) => ps.servicio.nombre.toLowerCase().includes(texto)),
    );
  }, [paquetes, busqueda]);

  // Pide a la API el detalle completo del paquete elegido
  const seleccionarPaquete = async (paquete: Paquete) => {
    setDetalleCargando(true);
    setDetalleError('');
    try {
      const completo = await obtenerPaquete(paquete.id);
      setSeleccionado(completo);
    } catch (e) {
      setSeleccionado(null);
      setDetalleError(
        e instanceof Error ? e.message : 'No se pudo cargar el detalle del paquete.',
      );
    } finally {
      setDetalleCargando(false);
    }
  };

  // Descarga un PDF de la API y lo muestra
  const abrirPdf = async (titulo: string, obtener: () => Promise<string>) => {
    setPdfCargando(true);
    setPdfError('');
    try {
      const url = await obtener();
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(url);
      setPdfTitulo(titulo);
    } catch (e) {
      setPdfError(e instanceof Error ? e.message : 'No se pudo descargar el PDF.');
    } finally {
      setPdfCargando(false);
    }
  };

  const cerrarPdf = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
  };

  return (
    <main className="contenedor">
      <header>
        <h1>Villa Peñas</h1>
        <p>Paquetes para eventos (datos reales de la API)</p>
        <button
          disabled={pdfCargando}
          onClick={() => abrirPdf('Catálogo de paquetes', obtenerPdfCatalogo)}
        >
          {pdfCargando ? 'Descargando PDF...' : 'Ver catálogo en PDF'}
        </button>
        {pdfError && <Mensaje tipo="error" texto={pdfError} />}
      </header>

      {pdfUrl && <VisorPdf titulo={pdfTitulo} url={pdfUrl} onCerrar={cerrarPdf} />}

      <Buscador valor={busqueda} onCambio={setBusqueda} />

      {estado === 'cargando' && <Mensaje tipo="cargando" texto="Cargando paquetes..." />}

      {estado === 'error' && (
        <Mensaje tipo="error" texto={error} onReintentar={cargarPaquetes} />
      )}

      {estado === 'listo' && filtrados.length === 0 && (
        <Mensaje tipo="vacio" texto="No se encontraron paquetes con esa búsqueda." />
      )}

      {detalleCargando && <Mensaje tipo="cargando" texto="Cargando detalle..." />}
      {detalleError && <Mensaje tipo="error" texto={detalleError} />}

      {seleccionado && (
        <DetallePaquete
          paquete={seleccionado}
          onCerrar={() => setSeleccionado(null)}
          onVerPdf={(p) =>
            abrirPdf(`PDF: ${p.nombre}`, () => obtenerPdfPaquete(p.id))
          }
        />
      )}

      {estado === 'listo' && filtrados.length > 0 && (
        <div className="grid">
          {filtrados.map((p) => (
            <TarjetaPaquete
              key={p.id}
              paquete={p}
              seleccionado={seleccionado?.id === p.id}
              onSeleccionar={seleccionarPaquete}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default App;
