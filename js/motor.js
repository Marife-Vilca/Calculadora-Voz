// =============================================================
// MOTOR DE CÁLCULO — lógica pura, sin tocar el DOM.
// Cada función recibe el estado actual y devuelve un estado nuevo.
// =============================================================

export function estadoInicial() {
  return {
    pantalla: "0",
    valorAnterior: null,
    operadorPendiente: null,
    esperandoNuevoNumero: false,
    cinta: [] // líneas de texto ya formateadas, para mostrar/leer el recorrido
  };
}

function limpiarNumero(num) {
  if (!isFinite(num)) return "Error";
  const redondeado = Math.round((num + Number.EPSILON) * 1e8) / 1e8;
  return redondeado.toString();
}

function operar(a, operador, b) {
  switch (operador) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? null : a / b;
    default: return b;
  }
}

function nombreOperador(operador) {
  return { "+": "más", "-": "menos", "×": "por", "÷": "entre" }[operador] || operador;
}

export function ingresarDigito(estado, digito) {
  if (estado.pantalla === "Error") return estadoInicial();

  if (estado.esperandoNuevoNumero || estado.pantalla === "0") {
    return { ...estado, pantalla: digito, esperandoNuevoNumero: false };
  }

  const soloDigitos = estado.pantalla.replace("-", "").replace(".", "");
  if (soloDigitos.length >= 12) return estado; // límite razonable de dígitos visibles

  return { ...estado, pantalla: estado.pantalla + digito };
}

export function ingresarPunto(estado) {
  if (estado.pantalla === "Error") return estadoInicial();
  if (estado.esperandoNuevoNumero) {
    return { ...estado, pantalla: "0.", esperandoNuevoNumero: false };
  }
  if (estado.pantalla.includes(".")) return estado;
  return { ...estado, pantalla: estado.pantalla + "." };
}

export function cambiarSigno(estado) {
  if (estado.pantalla === "0" || estado.pantalla === "Error") return estado;
  const nuevaPantalla = estado.pantalla.startsWith("-")
    ? estado.pantalla.slice(1)
    : "-" + estado.pantalla;
  return { ...estado, pantalla: nuevaPantalla };
}

export function borrarUltimo(estado) {
  if (estado.pantalla === "Error") return estadoInicial();
  if (estado.esperandoNuevoNumero) return estado;
  const nuevaPantalla = estado.pantalla.length > 1 ? estado.pantalla.slice(0, -1) : "0";
  return { ...estado, pantalla: nuevaPantalla };
}

export function limpiarTodo() {
  return estadoInicial();
}

export function escribirNumeroDictado(estado, numero) {
  return { ...estado, pantalla: limpiarNumero(numero), esperandoNuevoNumero: false };
}

export function aplicarOperador(estado, operador) {
  if (estado.pantalla === "Error") return estadoInicial();

  const valorActual = parseFloat(estado.pantalla);

  if (estado.valorAnterior === null) {
    return {
      ...estado,
      valorAnterior: valorActual,
      operadorPendiente: operador,
      esperandoNuevoNumero: true,
      cinta: [...estado.cinta, `${estado.pantalla} ${operador}`]
    };
  }

  if (estado.esperandoNuevoNumero) {
    // Solo se cambia el signo de la operación pendiente, sin duplicar renglón
    const cintaSinUltimo = estado.cinta.slice(0, -1);
    return {
      ...estado,
      operadorPendiente: operador,
      cinta: [...cintaSinUltimo, `${limpiarNumero(estado.valorAnterior)} ${operador}`]
    };
  }

  const resultado = operar(estado.valorAnterior, estado.operadorPendiente, valorActual);
  if (resultado === null) {
    return { ...estadoInicial(), pantalla: "Error" };
  }

  return {
    pantalla: limpiarNumero(resultado),
    valorAnterior: resultado,
    operadorPendiente: operador,
    esperandoNuevoNumero: true,
    cinta: [...estado.cinta, `${estado.pantalla} ${operador}`]
  };
}

export function aplicarIgual(estado) {
  if (estado.pantalla === "Error") return estadoInicial();
  if (estado.operadorPendiente === null || estado.valorAnterior === null) return estado;

  const valorActual = parseFloat(estado.pantalla);
  const resultado = operar(estado.valorAnterior, estado.operadorPendiente, valorActual);

  if (resultado === null) {
    return { ...estadoInicial(), pantalla: "Error" };
  }

  return {
    pantalla: limpiarNumero(resultado),
    valorAnterior: null,
    operadorPendiente: null,
    esperandoNuevoNumero: true,
    cinta: [...estado.cinta, `${estado.pantalla} =`]
  };
}

export function textoLecturaPantalla(estado, formatearNumero) {
  const { pantalla, valorAnterior, operadorPendiente } = estado;

  if (pantalla === "Error") return "Hay un error, no se puede dividir entre cero.";

  if (valorAnterior !== null && operadorPendiente) {
    return `${formatearNumero(valorAnterior)} ${nombreOperador(operadorPendiente)} ${formatearNumero(parseFloat(pantalla))}`;
  }

  return `${formatearNumero(parseFloat(pantalla))}`;
}
