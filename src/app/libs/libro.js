import { supabase } from "@/app/libs/supabaseClient";
export async function deleteLibro(libro){
  const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar ${libro.titulo}? Esta acción es irreversible.`);
  if (confirmed) {
    const res = await fetch("/api/libro", {
      method: 'DELETE',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({'id': libro.id}),
    });

    return res;
  }else{
    return null;
  }
}

export function formatearFechaBonita(fecha) {
  const fechaObj = (fecha instanceof Date) ? fecha : new Date(fecha);

  if (isNaN(fechaObj)) {
    return 'Fecha inválida';
  }

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const dia = fechaObj.getDate();
  const mes = meses[fechaObj.getMonth()];
  const anio = fechaObj.getFullYear();

  return `${dia} de ${mes} de ${anio}`;
}

//Parsea la fecha quedandose como la fecha sin la hora
export function parseDateWithoutTimezone(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('T')[0].split('-'); // solo parte fecha
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // mes base 0
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

/**
 * Devuelve las fechas en las que un libro no puede ser reservado. 
 * Estas fechas son las fechas adquisicion - fecha devolucion de los libros cuya
 * fecha de devolucion sea mayor que hoy. 
 * - Si de estas fechas, hay alguna cuya fecha de adquisicion es menor que hoy por minimo dos dias,
 * se debe mirar la condicion de este registro para evaluar si es una reserva que no se ha efectuado 
 * (condicion = "reservado"). Si la reserva no se ha efectuado, este registro no se incluye.
 * @param {} idLibro 
 */
export async function getFechasInvalidas(idLibro) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const { data: registrosLibro, error } = await supabase
    .from('usuario_libro')
    .select('*')
    .eq('libro', idLibro)
    .gt('fecha_devolucion', hoy.toISOString().split('T')[0]);

  if (error) {
    console.log(error);
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  console.log("Registros sin filtrar:", registrosLibro);

  const registrosFiltrados = registrosLibro
    .filter((registro) => {
      const fechaAdq = parseDateWithoutTimezone(registro.fecha_adquisicion);
      fechaAdq.setHours(0, 0, 0, 0);
      const diferenciaDias = (hoy - fechaAdq) / (1000 * 60 * 60 * 24);
      const excluir = diferenciaDias >= 2 && registro.condicion !== "reservado";
      return !excluir;
    })
    .map((registro) => {
      const fechaAdq = parseDateWithoutTimezone(registro.fecha_adquisicion);
      fechaAdq.setHours(0, 0, 0, 0);

      // Parsear fecha_devolucion manualmente (evitar interpretación como UTC)
      const [year, month, day] = registro.fecha_devolucion.split('-').map(Number);
      const fechaDev = parseDateWithoutTimezone(year, month - 1, day, 12); 

      return [fechaAdq, fechaDev];
    });

  console.log("Registros filtrados:", registrosFiltrados);
  return registrosFiltrados;
}

export function validarDatosNuevoLibro(body){
  let mensajeError = '';

  // ISBN: requerido, 10 o 13 dígitos
  if (!body.isbn || !body.isbn.trim()) {
    mensajeError += 'El ISBN es obligatorio.\n';
  } else {
    const isbnLimpio = body.isbn.replace(/[-\s]/g, '');
    if (!/^\d{10}(\d{3})?$/.test(isbnLimpio)) {
      mensajeError += 'El ISBN debe tener 10 o 13 dígitos numéricos.\n';
    }
  }

  // Título
  if (!body.titulo || !body.titulo.trim()) {
    mensajeError += 'El título es obligatorio.\n';
  }

  // Autor
  if (!body.autor || !body.autor.trim()) {
    mensajeError += 'El autor es obligatorio.\n';
  }

  // Editorial
  if (!body.editorial || !body.editorial.trim()) {
    mensajeError += 'La editorial es obligatoria.\n';
  }

  // Valor: requerido, numérico
  if (!body.valor || !body.valor.toString().trim()) {
    mensajeError += 'El valor es obligatorio.\n';
  } else {
    const valorNumerico = parseFloat(body.valor.replace(',', '.'));
    if (isNaN(valorNumerico)) {
      mensajeError += 'El valor debe ser un número válido (usa . o , como separador decimal).\n';
    } else {
      body.valor = valorNumerico.toString();
    }
  }

  // Año de publicación: requerido, numérico
  if (!body.ano_publicacion || !body.ano_publicacion.toString().trim()) {
    mensajeError += 'El año de publicación es obligatorio.\n';
  } else if (isNaN(Number(body.ano_publicacion))) {
    mensajeError += 'El Año de publicación debe ser un número válido.\n';
  }

  // Género
  if (!body.genero || !body.genero.trim()) {
    mensajeError += 'El género es obligatorio.\n';
  }

  // Estante
  if (!body.estante || !body.estante.trim()) {
    mensajeError += 'El estante es obligatorio.\n';
  }

  // Balda
  if (!body.balda || !body.balda.trim()) {
    mensajeError += 'La balda es obligatoria.\n';
  }

  // Descripción
  if (!body.descripcion || !body.descripcion.trim()) {
    mensajeError += 'La descripción es obligatoria.\n';
  }

  // Condición: valor por defecto
  if (!body.condicion || !body.condicion.trim()) {
    body.condicion = 'Nuevo';
  }

  // Días de préstamo: valor por defecto o número
  if (!body.dias_prestamo || !body.dias_prestamo.toString().trim()) {
    body.dias_prestamo = '4';
  } else if (isNaN(Number(body.dias_prestamo))) {
    mensajeError += 'Los días de préstamo deben ser un número válido (cantidad de días).\n';
  }

  // Imagen
  if (!body.imagen) {
    mensajeError += 'La portada del libro es obligatoria.\n';
  }

  return {
    valid: mensajeError === '',
    message: mensajeError
  };
}

