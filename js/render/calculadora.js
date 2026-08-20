// =============================================================
// PANTALLA: Calculadora — teclado + pantalla + voz
// =============================================================
import { state, guardarCalculoEnHistorial } from '../state.js';
import { guardarEnLocalStorage } from '../storage.js';
import { leerTexto } from '../tts.js';
import { escucharNumero } from '../voice.js';
import { formatearNumero, textoANumero } from '../utils.js';
import { registrarPantalla } from '../navegacion.js';
import * as motor from '../motor.js';

function actualizarEstado(nuevoEstado) {
  state.calculadora = nuevoEstado;
  guardarEnLocalStorage();
  renderCalculadora();
}

/** El número que se está escribiendo pero todavía no se confirmó con +, −, ×, ÷ o =. */
function numeroEnCurso(estado) {
  const { pantalla, esperandoNuevoNumero } = estado;
  if (esperandoNuevoNumero) return null;
  if (pantalla === "0" || pantalla === "Error") return null;
  return pantalla;
}

export function renderCalculadora() {
  const { pantalla, valorAnterior, operadorPendiente, cinta } = state.calculadora;

  const numeroMostrado = pantalla === "Error" ? "Error" : formatearNumero(parseFloat(pantalla));
  document.getElementById("pantalla-principal").textContent = numeroMostrado;

  document.getElementById("pantalla-pendiente").textContent =
    valorAnterior !== null && operadorPendiente
      ? `${formatearNumero(valorAnterior)} ${operadorPendiente}`
      : "";

  const enCurso = numeroEnCurso(state.calculadora);
  const contenedorCinta = document.getElementById("cinta-calculo");

  if (cinta.length === 0 && enCurso === null) {
    contenedorCinta.innerHTML = `<p class="cinta-vacia">Aquí verás cada número que vayas ingresando.</p>`;
    return;
  }

  const filasConfirmadas = cinta.map((linea) => `<div class="cinta-linea">${linea}</div>`).join("");
  const filaEnCurso = enCurso !== null
    ? `<div class="cinta-linea cinta-linea-actual">${enCurso}</div>`
    : "";

  contenedorCinta.innerHTML = filasConfirmadas + filaEnCurso;
  contenedorCinta.scrollTop = contenedorCinta.scrollHeight;
}

function manejarTeclaDigito(digito) {
  actualizarEstado(motor.ingresarDigito(state.calculadora, digito));
}

function manejarTeclaOperador(operador) {
  actualizarEstado(motor.aplicarOperador(state.calculadora, operador));
}

function manejarIgual() {
  const habiaOperacionPendiente = state.calculadora.operadorPendiente !== null;
  const nuevoEstado = motor.aplicarIgual(state.calculadora);

  state.calculadora = nuevoEstado;
  if (habiaOperacionPendiente) {
    guardarCalculoEnHistorial();
  }
  guardarEnLocalStorage();
  renderCalculadora();
}

export function configurarCalculadora() {
  registrarPantalla("calculadora", renderCalculadora);

  document.getElementById("teclado").addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-tecla]");
    if (!boton) return;

    const tecla = boton.dataset.tecla;

    if (/^[0-9]$/.test(tecla)) {
      manejarTeclaDigito(tecla);
      return;
    }

    switch (tecla) {
      case ".":
        actualizarEstado(motor.ingresarPunto(state.calculadora));
        break;
      case "+":
      case "-":
      case "×":
      case "÷":
        manejarTeclaOperador(tecla);
        break;
      case "=":
        manejarIgual();
        break;
      case "C":
        actualizarEstado(motor.limpiarTodo());
        break;
      case "⌫":
        actualizarEstado(motor.borrarUltimo(state.calculadora));
        break;
      case "±":
        actualizarEstado(motor.cambiarSigno(state.calculadora));
        break;
    }
  });

  document.getElementById("btn-dictar-numero").addEventListener("click", (evento) => {
    escucharNumero(evento.currentTarget, (transcripcion) => {
      const numero = textoANumero(transcripcion);
      if (numero === null) {
        leerTexto(`No entendí un número. Escuché: ${transcripcion}`);
        return;
      }
      actualizarEstado(motor.escribirNumeroDictado(state.calculadora, numero));
    });
  });

  document.getElementById("btn-leer-pantalla").addEventListener("click", (evento) => {
    const texto = motor.textoLecturaPantalla(state.calculadora, formatearNumero);
    leerTexto(texto, evento.currentTarget);
  });

  document.getElementById("btn-leer-cinta").addEventListener("click", (evento) => {
    const { cinta } = state.calculadora;
    const enCurso = numeroEnCurso(state.calculadora);
    const lineas = enCurso !== null ? [...cinta, `${enCurso}, sin confirmar todavía`] : cinta;

    if (lineas.length === 0) {
      leerTexto("Todavía no ingresaste ningún número.", evento.currentTarget);
      return;
    }
    leerTexto(lineas.join(". "), evento.currentTarget);
  });
}
