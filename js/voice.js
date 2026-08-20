// =============================================================
// COMPONENTE DE VOZ: dicta un número y lo entrega por callback.
// No depende de inputs de texto (el teclado es la fuente de verdad).
// =============================================================

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

export function soportaReconocimientoVoz() {
  return !!SpeechRecognitionAPI;
}

export function inicializarSoporteVoz() {
  if (!soportaReconocimientoVoz()) {
    document.body.classList.add("voz-no-disponible");
  }
}

/**
 * Escucha un número por voz. Llama a onTranscripcion(texto) cuando
 * el reconocimiento termina, para que quien invoque decida cómo
 * interpretarlo (permite reintentar con textoANumero afuera).
 */
export function escucharNumero(boton, onTranscripcion) {
  if (!soportaReconocimientoVoz()) return;

  const reconocedor = new SpeechRecognitionAPI();
  reconocedor.lang = "es-PE";
  reconocedor.continuous = false;
  reconocedor.interimResults = false;
  reconocedor.maxAlternatives = 1;

  boton.classList.add("escuchando");
  boton.setAttribute("aria-label", "Escuchando, diga un número");

  reconocedor.onresult = (evento) => {
    const transcripcion = evento.results[0][0].transcript;
    onTranscripcion(transcripcion);
  };

  reconocedor.onerror = (evento) => {
    if (evento.error === "no-speech") return;
    if (evento.error === "not-allowed" || evento.error === "service-not-allowed") {
      alert("El navegador no tiene permiso para usar el micrófono.");
    }
  };

  reconocedor.onend = () => {
    boton.classList.remove("escuchando");
    boton.setAttribute("aria-label", "Dictar número por voz");
  };

  try {
    reconocedor.start();
  } catch (e) {
    boton.classList.remove("escuchando");
  }
}
