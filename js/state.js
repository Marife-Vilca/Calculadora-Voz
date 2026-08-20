// =============================================================
// ESTADO GLOBAL DE LA CALCULADORA
// =============================================================
import { generarId, fechaHoraActual } from './utils.js';
import { estadoInicial } from './motor.js';

export const state = {
  calculadora: estadoInicial(),
  historial: [] // { id, fecha, cinta: [...líneas], resultado }
};

/** Guarda el cálculo actual (su cinta + resultado) como un registro de historial. */
export function guardarCalculoEnHistorial() {
  const { cinta, pantalla } = state.calculadora;
  if (cinta.length === 0) return null;

  const registro = {
    id: generarId(),
    fecha: fechaHoraActual(),
    cinta: [...cinta],
    resultado: pantalla
  };

  state.historial.unshift(registro);
  return registro;
}

export function eliminarDelHistorial(registroId) {
  state.historial = state.historial.filter((r) => r.id !== registroId);
}

export function vaciarHistorial() {
  state.historial = [];
}
