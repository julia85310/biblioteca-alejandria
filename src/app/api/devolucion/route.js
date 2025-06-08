import { supabase } from "@/app/libs/supabaseClient";

/**
 * Realiza la devolucion de un libro:
 * - Cambia la disponibilidad del libro a Disponible
 * - Si la fecha de devolucion no es hoy, actualizar el registro
 * - Cambia el registro usuario-libro (actualiza la condicion y los dias de penalizacion)
 * - Si hay dias de penalizacion, penaliza al usuario.
 * body{
        dias_penalizacion:
        condicion_nueva: 
        libro: 
        user_libro_id: 
        usuario: 
    }¡
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Penalizar al usuario si hay días de penalización
        if (body.dias_penalizacion > 0) {
            const fecha_penalizacion = new Date(hoy);
            fecha_penalizacion.setDate(fecha_penalizacion.getDate() + body.dias_penalizacion);

            const { error: penalizarError } = await supabase
                .from('usuario')
                .update({ fecha_penalizacion: fecha_penalizacion })
                .eq('id', body.usuario);

            console.log("Penalización al usuario");

            if (penalizarError) {
                console.log('Error penalizando usuario:', penalizarError);
                return new Response(JSON.stringify({ error: "Error penalizando usuario" }), { status: 500 });
            }
        }

        // Cambiar disponibilidad del libro a "Disponible"
        const { error: libroError } = await supabase
            .from('libro')
            .update({ disponibilidad: 'Disponible' })
            .eq('id', body.libro);

        console.log("Libro actualizado a Disponible");

        if (libroError) {
            console.log('Error actualizando libro:', libroError);
            return new Response(JSON.stringify({ error: "Error actualizando disponibilidad del libro" }), { status: 500 });
        }

        // Obtener el registro de usuario_libro para verificar la fecha de devolución
        const { data: registro, error: fetchError } = await supabase
            .from('usuario_libro')
            .select('fecha_devolucion')
            .eq('id', body.user_libro_id)
            .single();

        if (fetchError || !registro) {
            console.log('Error obteniendo el registro de usuario_libro:', fetchError);
            return new Response(JSON.stringify({ error: "No se encontró el registro de préstamo" }), { status: 500 });
        }

        // Si la fecha de devolución no es hoy, actualizarla
        const fechaDev = new Date(registro.fecha_devolucion);
        fechaDev.setHours(0, 0, 0, 0);

        const updateFields = {
            condicion: body.condicion_nueva,
            dias_penalizacion: body.dias_penalizacion
        };

        if (fechaDev.getTime() !== hoy.getTime()) {
            updateFields.fecha_devolucion = hoy;
            console.log("Fecha de devolución actualizada a hoy");
        }

        // Actualizar el registro en usuario_libro
        const { error: updateUsuarioLibroError } = await supabase
            .from('usuario_libro')
            .update(updateFields)
            .eq('id', body.user_libro_id);

        console.log("Registro usuario_libro actualizado");

        if (updateUsuarioLibroError) {
            console.log('Error actualizando usuario_libro:', updateUsuarioLibroError);
            return new Response(JSON.stringify({ error: "Error actualizando el registro de usuario_libro" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}