import { getFechasInvalidas } from "@/app/libs/libro";
import { userValidoReserva } from "@/app/libs/user";
import { supabase } from "@/app/libs/supabaseClient";

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

/**
 * Funcion para crear una reserva
 * @param {usuario, libro, fecha_adquisicion, fecha_devolucion} request 
 */
export async function POST(request) {
    const body = await request.json();
    try{
        //no va a pasar en el frontend pero por si acaso
        if (body.fecha_devolucion <= body.fecha_adquisicion) {
            return new Response(
                JSON.stringify({ error: 'Error inesperado: La fecha de devolución debe ser posterior a la fecha de adquisición.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        //mira si el usuario es valido para la reserva
        await userValidoReserva(body.usuario)
        
        body.fecha_adquisicion = new Date(body.fecha_adquisicion);
        body.fecha_devolucion = new Date(body.fecha_devolucion);

        // Validar que la fecha de adquisición no esté en el pasado ni más allá de 6 meses
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const seisMesesDespues = new Date(hoy);
        seisMesesDespues.setDate(seisMesesDespues.getDate() + 180);

        if (body.fecha_adquisicion < hoy || body.fecha_devolucion > seisMesesDespues) {
            return new Response(
                JSON.stringify({ error: 'La fecha de adquisición debe ser hoy o dentro de los próximos 6 meses.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        //mira que el rango que nos ha llegado es valido para el libro
        const fechasOcupadas = await getFechasInvalidas(body.libro)

        const haySolapamiento = fechasOcupadas.some(([fechaAdq, fechaDev]) => {
            const ocupadaInicio = new Date(fechaAdq);
            const ocupadaFin = new Date(fechaDev);

            return (
                body.fecha_adquisicion <= ocupadaFin &&
                body.fecha_devolucion >= ocupadaInicio
            );
        });

        if (haySolapamiento) {
            return new Response(
                JSON.stringify({ error: 'El libro no se encuentra disponible en la fecha seleccionada.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        //realizar la reserva
        const insertData = [{...body, condicion: "reservado"}]
        console.log(insertData)
        const { data, error } = await supabase
            .from('usuario_libro')
            .insert(insertData);

        if (error){
            console.log(error)
            return new Response(
                JSON.stringify({ error: 'Ha ocurrido un error realizando la reserva. Inténtelo de nuevo más tarde.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }
        
        return new Response(JSON.stringify(data), {
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