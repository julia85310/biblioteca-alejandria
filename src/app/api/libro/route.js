import { supabase } from "@/app/libs/supabaseClient";
import { formatearFechaBonita } from "@/app/libs/libro";

/**
 * Devuelve todos los libros.
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    let query = supabase.from('libro').select('*');

    if (id) {
        query = query.eq('id', id).single();
    }

    const { data, error } = await query;

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    if (id) {
        data.fecha_adquisicion = formatearFechaBonita(data.fecha_adquisicion)
    }

    return Response.json(data);
}

/**
 * Elimina un libro
 * @param {} request 
 * @returns 
 */
export async function DELETE(request){
    const body = await request.json();
    try{
         
        const { data, error } = await supabase
            .from('libro')
            .delete()
            .eq('id', body.id);

        if (error){
            return Response.json({ error: error.message }, { status: 500 });
        }
        
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    }catch (error) {  
        return new Response(
            JSON.stringify({ error: 'Error interno del servidor', details: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}