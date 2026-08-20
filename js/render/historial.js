// =============================================================
// PANTALLA: Historial — cálculos anteriores
// =============================================================
import { state, eliminarDelHistorial, vaciarHistorial } from '../state.js';
import { guardarEnLocalStorage } from '../storage.js';
import { leerTexto } from '../tts.js';
import { formatearNumero } from '../utils.js';
import { mostrarPantalla, registrarPantalla } from '../navegacion.js';

function textoDelRegistro(registro) {
  return `Cálculo del ${registro.fecha}. ${registro.cinta.join(", ")}. Total: ${formatearNumero(parseFloat(registro.resultado))}.`;
}

export function renderHistorial() {
  const contenedor = document.getElementById("lista-historial");

  if (state.historial.length === 0) {
    contenedor.innerHTML = `<p class="historial-vacio">Todavía no hay cálculos guardados.</p>`;
    return;
  }

  contenedor.innerHTML = state.historial
    .map(
      (registro) => `
      <div class="historial-item">
        <div class="historial-item-cabecera">
          <span class="historial-fecha">${registro.fecha}</span>
          <span class="historial-total">${formatearNumero(parseFloat(registro.resultado))}</span>
        </div>
        <div class="historial-cinta">${registro.cinta.join(" &nbsp;·&nbsp; ")}</div>
        <div class="historial-item-botones">
          <button class="btn-grande btn-secundario btn-escuchar-registro" data-action="escuchar-registro" data-id="${registro.id}">
            <i class="fa-solid fa-volume-high"></i> Escuchar
          </button>
          <button class="btn-grande btn-peligro" data-action="eliminar-registro" data-id="${registro.id}">
            <i class="fa-solid fa-trash-can"></i> Eliminar
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

export function configurarHistorial() {
  registrarPantalla("historial", renderHistorial);

  document.getElementById("lista-historial").addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-action]");
    if (!boton) return;

    const registroId = Number(boton.dataset.id);
    const registro = state.historial.find((r) => r.id === registroId);
    if (!registro) return;

    if (boton.dataset.action === "escuchar-registro") {
      leerTexto(textoDelRegistro(registro), boton);
    }

    if (boton.dataset.action === "eliminar-registro") {
      if (!confirm("¿Eliminar este cálculo del historial?")) return;
      eliminarDelHistorial(registroId);
      guardarEnLocalStorage();
      renderHistorial();
    }
  });

  document.getElementById("btn-vaciar-historial").addEventListener("click", () => {
    if (state.historial.length === 0) return;
    if (!confirm("¿Vaciar todo el historial? Esta acción no se puede deshacer.")) return;
    vaciarHistorial();
    guardarEnLocalStorage();
    renderHistorial();
  });

  document.getElementById("btn-historial-volver").addEventListener("click", () => {
    mostrarPantalla("calculadora");
  });
}
