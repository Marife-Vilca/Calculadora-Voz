// =============================================================
// NAVEGACIÓN: muestra/oculta pantallas y dispara su renderizado
// =============================================================

const NOMBRES_PANTALLA = ["calculadora", "historial"];
const renderizadores = {};

/** Cada pantalla se registra con su propia función de renderizado. */
export function registrarPantalla(nombre, renderFn) {
  renderizadores[nombre] = renderFn;
}

export function mostrarPantalla(nombre) {
  NOMBRES_PANTALLA.forEach((p) => {
    const el = document.getElementById(`pantalla-${p}`);
    if (el) el.classList.toggle("activa", p === nombre);
  });

  window.scrollTo(0, 0);

  const render = renderizadores[nombre];
  if (render) render();
}
