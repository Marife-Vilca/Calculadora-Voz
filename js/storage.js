// =============================================================
// PERSISTENCIA EN LOCALSTORAGE
// =============================================================
import { state } from './state.js';

const CLAVE_ESTADO = "calculadora_voz_state_v2";

export function guardarEnLocalStorage() {
  localStorage.setItem(
    CLAVE_ESTADO,
    JSON.stringify({
      calculadora: state.calculadora,
      historial: state.historial
    })
  );
}

export function cargarDeLocalStorage() {
  const dataGuardada = localStorage.getItem(CLAVE_ESTADO);
  if (!dataGuardada) return;

  try {
    const parsed = JSON.parse(dataGuardada);
    if (parsed.calculadora) state.calculadora = parsed.calculadora;
    if (Array.isArray(parsed.historial)) state.historial = parsed.historial;
  } catch (e) {
    console.error("Error al leer datos guardados:", e);
  }
}
