import { userValidoPrestamo } from "@/app/libs/user";
import { supabase } from "@/app/libs/supabaseClient";

/**
 * Comprobación de usuario: Devuelve un error si el usuario no puede obtener el libro.
 * Comprobación de libro: Devuelve un error si el libro no puede ser prestado hoy.
 * Realiza el préstamo si pasa estas comprobaciones.
 * Cambiar el estado del libro a No Disponible
 * body {
 *  libro, user, dias_prestamo
 * }
 */
export async function POST(request) {
    try{
        const body = await request.json();
        const id_libro = body.libro;
        const id_user = body.user;
        console.log(1)

    
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
            throw new Error("Ha ocurrido un error. Inténtelo de nuevo más tarde.");
        }

        if (adquisiciones && adquisiciones.length > 0) {
            throw new Error("El libro está reservado.");
        }

        //realizar el prestamo
        const hoy = new Date();
        const fechaDev = new Date(hoy); 
        fechaDev.setDate(fechaDev.getDate() + body.dias_prestamo - 1);

        const { data: insert, error: insertError } = await supabase
            .from('usuario_libro')
            .insert([{
                fecha_devolucion: fechaDev, 
                libro: id_libro,
                usuario: id_user,
                condicion: "no devuelto"
            }]);

        if (insertError) {
            console.log(insertError)
            throw new Error("Ha ocurrido un error. Inténtelo de nuevo más tarde.");
        }

        return new Response(JSON.stringify(insert), {
            headers: { 'Content-Type': 'application/json' },
        });
    }catch(error) {  
        console.log(error)
        return new Response(
            JSON.stringify({ error: error?.message || "Ha ocurrido un error. Inténtelo de nuevo más tarde." }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } 
}

/**
 * Comprobación de usuario: Devuelve un error si el usuario no puede obtener el libro.
 * Mirar si el libro esta disponible (por si alguien no lo ha devuelto en la fecha que le tocaba)
 * Realiza el préstamo si pasa estas comprobaciones:
 *  - Existe este registro
 *  - Cambia la condicion de reservado a no devuelto
 *  - Cambia el libro a No Disponible 
 * body {
 *  user_libro
 * }
 */
export async function PUT(request) {
    try{
        const body = await request.json();
        const { id, libro } = body;

        //validacion del usuario
        const data = await userValidoPrestamo(id_user)

        //mirar si el libro esta disponible
        const { data: libroDisponible, error: libroError } = await supabase
            .from('libro')
            .select('*')
            .eq('id', libro)
            .eq('disponibilidad', 'Disponible')
            .single();

        if (libroError || !libroDisponible) {
            throw new Error("El libro no se encuentra disponible.");
        }

        // verificar si existe el registro usuario_libro
        const { data: userLibro, error: userLibroError } = await supabase
            .from('usuario_libro')
            .select('*')
            .eq('id', id)
            .single();

        if (userLibroError || !userLibro) {
            throw new Error("Ha ocurrido un error. Vuelve a intentarlo más tarde.");
        }

        // Cambiar la condición del usuario_libro a "no devuelto"
        const { error: updateUserLibroError } = await supabase
            .from('usuario_libro')
            .update({ condicion: 'no devuelto' })
            .eq('id', id);

        if (updateUserLibroError) {
            throw new Error("Ha ocurrido un error. Vuelve a intentarlo más tarde.");
        }

        //Cambiar disponibilidad del libro a "No Disponible"
        const { error: updateLibroError } = await supabase
            .from('libro')
            .update({ disponibilidad: 'No Disponible' })
            .eq('id', libro);

        if (updateLibroError) {
            //si hay un error intentamos revertir lo anterior
            const { error: updateUserLibroError } = await supabase
                .from('usuario_libro')
                .update({ condicion: 'reservado' })
                .eq('id', id);
            throw new Error("Ha ocurrido un error. Vuelve a intentarlo más tarde.");
        }

        return new Response(JSON.stringify({ success: true }), {
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