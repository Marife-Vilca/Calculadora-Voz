// =============================================================
// APP.JS — Punto de entrada y raíz de composición
// =============================================================
import { cargarDeLocalStorage } from './storage.js';
import { inicializarSoporteVoz } from './voice.js';
import { inicializarSoporteLectura } from './tts.js';
import { mostrarPantalla } from './navegacion.js';

import { configurarCalculadora } from './render/calculadora.js';
import { configurarHistorial } from './render/historial.js';

document.addEventListener("DOMContentLoaded", () => {
  cargarDeLocalStorage();

  inicializarSoporteVoz();
  inicializarSoporteLectura();

  configurarCalculadora();
  configurarHistorial();

  document.getElementById("btn-ir-historial").addEventListener("click", () => {
    mostrarPantalla("historial");
  });

  mostrarPantalla("calculadora");
});
