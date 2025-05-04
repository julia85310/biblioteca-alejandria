import { supabase } from "@/app/libs/supabaseClient";

/**
 * Devuelve todos los eventos con la fecha formateada
 */
export async function GET(){
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
    .from('evento')
    .select('*')
    .gte('fecha', today);

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
    
    for (const evento of data){
        evento.fechaFormateada = formatearFechaBonita(new Date(evento.fecha))
    }

    return Response.json(data);
}

function formatearFechaBonita(fecha) {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();
    const fechaFormateada = `${dia} de ${mes} de ${anio}`
    return fechaFormateada;
}