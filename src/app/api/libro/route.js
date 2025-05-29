import { supabase } from "@/app/libs/supabaseClient";
import { formatearFechaBonita } from "@/app/libs/libro";

/**
 * Devuelve todos los libros.
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    let query = supabase.from('libro').select('*');

    if (id) {
        query = query.eq('id', id).single();
    }

    const { data, error } = await query;

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    if (id) {
        data.fecha_adquisicion = formatearFechaBonita(data.fecha_adquisicion)
    }

    return Response.json(data);
}

/**
 * Elimina un libro
 * @param {id del libro a eliminar} request 
 * @returns 
 */
export async function DELETE(request){
    const body = await request.json();
    try{
         
        const { data, error } = await supabase
            .from('libro')
            .delete()
            .eq('id', body.id);

        if (error){
            return Response.json({ error: error.message }, { status: 500 });
        }
        
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
        });
    }catch (error) {  
        return new Response(
            JSON.stringify({ error: 'Error interno del servidor', details: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

/**
 * Añade un Libro
 * @param body {isbn, autor, ano_publicacion, editorial,
 * titulo, genero,  descripcion, imagen, valor, 
 * condicion puede, dias prestamo, estante, balda} request 
 * @returns
 */
export async function POST(request) {
  const body = await request.json();

  const file = formData.get('imagen');

  let imagen_url = null;

  if (file && typeof file === 'object' && 'arrayBuffer' in file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `libros/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from('portadas')
      .upload(filename, buffer, {
        contentType: file.type,
    })

    if (error) {
      return Response.json({ error: 'Error subiendo imagen', details: error.message }, { status: 500 })
    }

    const { data: publicUrl } = supabase
      .storage
      .from('portadas')
      .getPublicUrl(filename);

    imagen_url = publicUrl.publicUrl;
  }

  try {
    const { data, error } = await supabase
      .from('libro')
      .insert([{ ...body, imagen_url }])

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return Response.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}