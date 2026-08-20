// =============================================================
// COMPONENTE DE LECTURA EN VOZ ALTA (Text-to-Speech)
// =============================================================

export function soportaLecturaVoz() {
  return "speechSynthesis" in window;
}

export function inicializarSoporteLectura() {
  if (!soportaLecturaVoz()) {
    document.body.classList.add("lectura-no-disponible");
  }
}

/**
 * Lee un texto en voz alta. Si se pasa un botón, le agrega la
 * clase "leyendo" mientras dura la lectura (feedback visual).
 */
export function leerTexto(texto, boton = null) {
  if (!soportaLecturaVoz() || !texto) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "es-PE";
  utterance.rate = 0.95;

  if (boton) {
    boton.classList.add("leyendo");
    utterance.onend = () => boton.classList.remove("leyendo");
    utterance.onerror = () => boton.classList.remove("leyendo");
  }

  window.speechSynthesis.speak(utterance);
}
