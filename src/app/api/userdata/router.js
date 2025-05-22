import { getLibrosPosesion, getLibrosReservados } from "@/app/libs/user";

/**
 * Devuelve los libros reservados y en posesion actuales.
 * Data {librosEnPosesion: , librosReservados: }
 */
export async function GET(request){
    const { searchParams } = new URL(request.url);
    const id_user = searchParams.get('u');

    try{
        const librosEnPosesion = await getLibrosPosesion(id_user);
        const librosReservados = await getLibrosReservados(id_user);

        return new Response(JSON.stringify(
            {librosEnPosesion: librosEnPosesion, 
            librosReservados: librosReservados}
        ), {
            headers: { 'Content-Type': 'application/json' },
        });

    }catch(error) {  
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

}
