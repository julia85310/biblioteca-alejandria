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