import { supabase } from "@/app/libs/supabaseClient";

/**
 * Devuelve todos los nombres e ids de los usuarios
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("usuario")
      .select("id, nombre, email, telefono, fecha_registro, fecha_penalizacion")
      .eq('admin', false);

    if (error) {
      console.log("Error consultando usuarios:", error);
      return new Response(
        JSON.stringify({ error: "Error al obtener usuarios", details: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.log("Excepción al obtener usuarios:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}