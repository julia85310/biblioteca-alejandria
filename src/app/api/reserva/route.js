import { supabase } from "@/app/libs/supabaseClient";
import { userValidoReserva } from "@/app/libs/user";

/**
 * Si hay filtro de usuario: Devuelve un error si el usuario no puede reservar el libro.
 * Si hay filtro de libro: Devuelve las fechas en las que el libro no se puede reservar.
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id_libro = searchParams.get('l');
    const id_user = searchParams.get('u');

    try{
        if (id_user){
            await userValidoReserva(id_user)
        }
    }catch(error) {  
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
    
}