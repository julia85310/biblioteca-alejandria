import { userValidoPrestamo } from "@/app/libs/user";
import { supabase } from "@/app/libs/supabaseClient";

/**
 * Comprobación de usuario: Devuelve un error si el usuario no puede obtener el libro.
 * Comprobación de libro: Devuelve un error si el libro no puede ser prestado hoy.
 * Realiza el préstamo si pasa estas comprobaciones.
 * body {
 *  libro, user, dias_prestamo
 * }
 */
export async function POST(request) {
    const body = await request.json();
    const id_libro = body.libro;
    const id_user = body.user;

    try{
        //validacion del usuario
        const data = await userValidoPrestamo(id_user)

        //validacion del libro
        //Buscar el libro
        const { data: libro, error: errorLibro } = await supabase
            .from('libro')
            .select('*')
            .eq('id', id_libro)
            .single();

        if (errorLibro || !libro) {
            throw new Error("El libro no existe.");
        }

        //Verificar disponibilidad
        if (libro.disponibilidad !== "Disponible") {
            throw new Error("El libro no está disponible.");
        }

        //Comprobar si fue adquirido hoy o ayer (esta en una reserva)
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString();
        const endOfToday = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        const { data: adquisiciones, error: errorAdq } = await supabase
            .from('usuario_libro')
            .select('*')
            .eq('libro', id_libro)
            .gte('fecha_adquisicion', startOfYesterday)
            .lte('fecha_adquisicion', endOfToday);

        if (errorAdq) {
            console.log(errorAdq)
            throw new Error("Ha ocurrido un error. Intentelo de nuevo más tarde.");
        }

        if (adquisiciones && adquisiciones.length > 0) {
            throw new Error("El libro está reservado");
        }

        //realizar el prestamo
        const hoy = new Date();
        const fechaDev = new Date(hoy); 
        fechaDev.setDate(fechaDev.getDate() + body.dias_prestamo);

        const { data: insert, error: insertError } = await supabase
            .from('usuario_libro')
            .insert([{
                fecha_devolucion: fechaDev, 
                libro: id_libro,
                usuario: id_user
            }]);

        if (insertError) {
            console.log(insertError)
            throw new Error("Ha ocurrido un error. Intentelo de nuevo más tarde.");
        }

        return new Response(JSON.stringify(insert), {
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