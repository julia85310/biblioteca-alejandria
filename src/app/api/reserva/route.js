import { supabase } from "@/app/libs/supabaseClient";

/**
 * Devuelve todos los libros.
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id_libro = searchParams.get('l');
    const id_user = searchParams.get('u');

    let query = supabase.from('libro').select('*');

    

    const { data, error } = await query;

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    console.log(data[0].fecha_adquisicion)
    if (id) {
        data[0].fecha_adquisicion = formatearFechaBonita(data[0].fecha_adquisicion)
    }

    return Response.json(data);
}