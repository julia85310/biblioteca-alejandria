import { supabase } from "@/app/libs/supabaseClient";
import { formatearFechaBonita } from "@/app/libs/libro";

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

