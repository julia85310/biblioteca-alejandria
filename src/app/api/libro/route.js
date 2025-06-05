import { supabase } from "@/app/libs/supabaseClient";
import { formatearFechaBonita, validarDatosNuevoLibro } from "@/app/libs/libro";

/**
 * Devuelve todos los libros.
 */
export async function GET(request) {
  try{
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const d = searchParams.get('d')

    let query = supabase.from('libro').select('*');

    if (id) {
      query = query.eq('id', id).single();
    }
    if(d){
      //quita los libros que estan en posesion de alguien
      query = query.eq('disponibilidad', "Disponible");
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString();
      const endOfToday = new Date(today.setHours(23, 59, 59, 999)).toISOString();
      //obtener los ids de libros reservados para hoy u ayer
      const { data: reservados, error: errorAdquiridos } = await supabase
        .from('usuario_libro')
        .select('libro')
        .gte('fecha_adquisicion', startOfYesterday)
        .lte('fecha_adquisicion', endOfToday);
      const librosExcluidos = reservados?.map(reserva => reserva.libro);
      
      if(errorAdquiridos){
        console.log(errorAdquiridos)
        return Response.json({ error: errorAdquiridos.message }, { status: 500 });
      }

      if (librosExcluidos.length > 0){
        //quita esos libros
        query = query.not('id', 'in', librosExcluidos);
      }
    }

    const { data, error } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (id) {
      data.fecha_adquisicion = formatearFechaBonita(data.fecha_adquisicion)
    }

    return Response.json(data);
  } catch (error) {
    console.log(error)
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Elimina un libro
 * @param {id del libro a eliminar} request 
 * @returns 
 */
export async function DELETE(request) {
  const body = await request.json();
  const libroId = body.id;
  console.log(body)

  try {
    // 1. Obtener el libro para acceder a la imagen_url
    const { data: libro, error: getError } = await supabase
      .from('libro')
      .select('imagen_url')
      .eq('id', libroId)
      .single();

    if (getError) {
      console.log(getError)
      return Response.json({ error: 'Libro no encontrado', details: getError.message }, { status: 404 });
    }

    // 2. Extraer el nombre del archivo del URL
    const imagenUrl = libro.imagen_url;
    const partes = imagenUrl.split('/');
    const nombreArchivo = partes[partes.length - 1];

    // 3. Eliminar la imagen del bucket
    const { error: deleteImgError } = await supabase
      .storage
      .from('portadas')
      .remove([nombreArchivo]);

    if (deleteImgError) {
      console.log(deleteImgError)
      return Response.json({ error: 'Error al eliminar la imagen', details: getError.message }, { status: 404 });
    }

    // 4. Eliminar el registro del libro
    const { data, error } = await supabase
      .from('libro')
      .delete()
      .eq('id', libroId);

    if (error) {
      console.log(error)
      return Response.json({ error: error.message }, { status: 500 });
    }

    console.log("Libro eliminado con exito")
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.log(error)
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