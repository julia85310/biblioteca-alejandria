import { supabase } from "@/app/libs/supabaseClient";
import { formatearFechaBonita } from "@/app/libs/libro";
import { validarDatosNuevoEvento } from "@/app/libs/evento";

/**
 * Devuelve todos los eventos con la fecha formateada
 */
export async function GET(){
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
    .from('evento')
    .select('*')
    .gte('fecha', today);

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
    
    for (const evento of data){
        evento.fechaFormateada = formatearFechaBonita(new Date(evento.fecha))
    }

    return Response.json(data);
}

export async function POST(request) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries());

  console.log("Datos del evento recibido:", body);

  const validacion = validarDatosNuevoEvento(body);
  if (!validacion.valid) {
    return Response.json({ error: validacion.message }, { status: 400 });
  }

  const file = body.imagen;

  let imagen_url = null;

  if (file && typeof file === 'object' && 'arrayBuffer' in file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const filename = `${file.name}_${timestamp}`;

    const { data, error } = await supabase.storage
      .from("eventos")
      .upload(filename, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error("Error subiendo imagen:", error);
      return Response.json(
        { error: "Error subiendo la imagen. Inténtelo de nuevo más tarde." },
        { status: 500 }
      );
    }

    const { data: publicUrl } = supabase.storage
      .from("eventos")
      .getPublicUrl(filename);

    imagen_url = publicUrl?.publicUrl;
  } else {
    return Response.json(
      { error: "Error con la imagen. Asegúrate de subir un archivo válido." },
      { status: 400 }
    );
  }

  try {
    delete body.imagen;
    const insert = [{ ...body, imagen_url }];

    const { data, error } = await supabase.from("evento").insert(insert);

    if (error) {
      console.error("Error insertando evento:", error);
      return Response.json(
        {
          error: "Error al añadir el evento. Inténtelo de nuevo más tarde.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Excepción insertando evento:", error);
    return Response.json(
      {
        error: "Error inesperado al añadir el evento.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

