import { supabase } from "@/app/libs/supabaseClient";
import { formatearFechaBonita, validarDatosNuevoLibro } from "@/app/libs/libro";

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
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries())

  console.log(body)

  const validacion = validarDatosNuevoLibro(body)
  if (!validacion.valid){
    return Response.json({ error: validacion.message }, { status: 500 });
  } 

  const file = body.imagen;

  let imagen_url = null;

  if (file && typeof file === 'object' && 'arrayBuffer' in file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const filename = `${file.name}_${timestamp}`

    const { data, error } = await supabase.storage
      .from('portadas')
      .upload(filename, buffer, {
        contentType: file.type,
    })

    if (error) {
      console.log(error)
      return Response.json({ error: 'Error subiendo la imagen. Vuelve a intentarlo más tarde.'}, { status: 500 })
    }

    const { data: publicUrl } = supabase
      .storage
      .from('portadas')
      .getPublicUrl(filename);

    imagen_url = publicUrl.publicUrl;
  }else{
    return Response.json({ error: 'Error subiendo la imagen. Vuelve a intentarlo más tarde.'}, { status: 500 })
  }

  try {
    delete body.imagen;
    const insert = [{ ...body, imagen_url: imagen_url }]
    console.log(insert)
    const { data, error } = await supabase
      .from('libro')
      .insert(insert)

    if (error) {
      console.log(error)
      return Response.json(
        { error: 'Error al añadir el nuevo libro. Inténtelo de nuevo más tarde', details: error.message },
        { status: 500 }
      )
    }

    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error)
    return Response.json(
      { error: 'Error al añadir el nuevo libro. Inténtelo de nuevo más tarde', details: error.message },
      { status: 500 }
    )
  }
}