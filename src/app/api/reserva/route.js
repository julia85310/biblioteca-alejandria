import { getFechasInvalidas } from "@/app/libs/libro";
import { userValidoReserva } from "@/app/libs/user";

/**
 * Si hay filtro de usuario: Devuelve un error si el usuario no puede reservar el libro.
 * Si hay filtro de libro: Devuelve las fechas en las que el libro no se puede reservar.
 * Fechas ocupadas: [[fechaAdq, fechaDev], [fechaAdq, fechaDev]...]
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id_libro = searchParams.get('l');
    const id_user = searchParams.get('u');

    try{
        if (id_user){
            const data = await userValidoReserva(id_user)
            
            return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
            });
        }

        if (id_libro){
            const fechasOcupadas = await getFechasInvalidas(id_libro)
            console.log(fechasOcupadas)
            return new Response(JSON.stringify(fechasOcupadas), {
            headers: { 'Content-Type': 'application/json' },
            });
        }
    }catch(error) {  
        console.log(error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
    
}