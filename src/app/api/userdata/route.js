import {  getHistorial, getMaxLibrosPrestados, getLibrosPosesion, getLibrosReservados, getMaxLibrosReservar } from "@/app/libs/user";

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
        const maxLibrosReservar = await getMaxLibrosReservar(id_user);
        const maxLibrosPrestar = await getMaxLibrosPrestados(id_user);
        const historial = await getHistorial(id_user);

        const response = {librosEnPosesion: librosEnPosesion, 
            librosReservados: librosReservados,
            maxLibrosReservar: maxLibrosReservar,
            maxLibrosPrestar: maxLibrosPrestar,
            historial: historial}
        
        console.log(response)

        return new Response(JSON.stringify(response), {
            headers: { 'Content-Type': 'application/json' },
        });

    }catch(error) { 
        console.log(error) 
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

}
