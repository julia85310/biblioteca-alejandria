export function validarDatosNuevoEvento(body) {
  let mensajeError = '';

  // Título
  if (!body.titulo || !body.titulo.trim()) {
    mensajeError += 'El título es obligatorio.\n';
  }

  // Descripción
  if (!body.descripcion || !body.descripcion.trim()) {
    mensajeError += 'La descripción es obligatoria.\n';
  }

  // Fecha
  if (!body.fecha || !body.fecha.trim()) {
    mensajeError += 'La fecha es obligatoria.\n';
  } else {
    const fechaEvento = new Date(body.fecha);
    const ahora = new Date();
    if (isNaN(fechaEvento.getTime())) {
      mensajeError += 'La fecha no es válida.\n';
    } else if (fechaEvento < ahora) {
      mensajeError += 'La fecha debe ser futura.\n';
    }
  }

  // Imagen
  if (!body.imagen) {
    mensajeError += 'La imagen descriptiva del evento es obligatoria.\n';
  }

  return {
    valid: mensajeError === '',
    message: mensajeError
  };
}