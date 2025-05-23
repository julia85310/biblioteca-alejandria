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

/**
 * Devuelve las fechas en las que un libro no puede ser reservado. 
 * Estas fechas son las fechas adquisicion - fecha devolucion de los libros cuya
 * fecha de devolucion sea mayor que hoy. 
 * - Si de estas fechas, hay alguna cuya fecha de adquisicion es menor que hoy por minimo dos dias,
 * se debe mirar la condicion de este registro para evaluar si es una reserva que no se ha efectuado 
 * (condicion = "reservado"). Si la reserva no se ha efectuado, este registro no se incluye.
 * @param {} idLibro 
 */
export async function getFechasInvalidas(idLibro){
  const hoy = new Date().toISOString().split('T')[0];
  const { data: registrosLibro, error } = await supabase
    .from('usuario_libro')
    .select('*')
    .eq('libro', idLibro)
    .gt('fecha_devolucion', hoy);

  if(error){
    console.log(error)
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  let registrosLibrosFilter = []

  registrosLibro.forEach((registro) => {
    const fechaAdq = new Date(registro.fecha_adquisicion);
    const diferenciaDias = (hoy - fechaAdq) / (1000 * 60 * 60 * 24);
    //filtro que quita a una posible reserva actual no efectuada
    if (diferenciaDias < 2 || registro.condicion != "reservado") {
      registrosLibrosFilter.push([fechaAdq, registro.fecha_devolucion])
    }
  })

  return registrosLibrosFilter;

}