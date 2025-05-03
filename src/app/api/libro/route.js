import { supabase } from "@/app/libs/supabaseClient";

/**
 * Devuelve todos los libros.
 */
export async function GET(){

    const { data, error } = await supabase
    .from('libro')
    .select('*');

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
}