
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