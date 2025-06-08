import { supabase } from "@/app/libs/supabaseClient";
import { formatearFechaBonita } from "./libro";

const MENSAJE_LIBROS_NO_DEV = "Tienes libros no devueltos. Por favor, devuélvelos lo antes posible."


/**
 * Valida los datos del registro:
 * - que existan
 * - que email sea valido
 * - que telefono sea valido (673 828 834)
 * - que la contraseña sea de longitud 6 minimo y tenga un numero y una letra
 * @param {nombre, email, telefono, contraseña}  
 * @returns {valid: boolean, message}
 */
export function validarDatosRegistro( nombre, email, telefono, password ) {
    if (!nombre) {
      return { valid: false, 
        message: "Introduce tu nombre para completar el registro." };
    }
    if (!email) {
      return { valid: false, 
        message: "Introduce tu email para completar el registro." };
    }
    if (!telefono) {
      return { valid: false, 
        message: "Introduce tu telefono para completar el registro." };
    }
    if (!password) {
      return { valid: false, 
        message: "Introduce una contraseña segura para completar el registro." };
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, 
        message: "Introduce un email válido para completar el registro." };
    }
  
    const telefonoRegex = /^\d{9}$/;
    if (!telefonoRegex.test(telefono)) {
      return { valid: false, 
        message: "Introduce un telefono válido para completar el registro." };
    }
  
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return { valid: false, 
        message: "La contraseña debe tener mínimo 6 caracteres, al menos un número y una letra." };
    }
  
    return { valid: true };
}

/**
 * Valida los datos del login:
 * - que existan
 * - que email sea valido
 * - que la contraseña sea de longitud 6 minimo y tenga un numero y una letra
 * @param {nombre, email, telefono, contraseña}  
 * @returns {valid: boolean, message}
 */
export function validarDatosLogin(email, password) {
  if (!email) {
    return { valid: false, 
      message: "Introduce tu email para completar el inicio de sesión." };
  }
  if (!password) {
    return { valid: false, 
      message: "Introduce tu contraseña para completar el inicio de sesión." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, 
      message: "Credenciales incorrectas." };
  }

  const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
  if (!passwordRegex.test(password)) {
    return { valid: false, 
      message: "Credenciales incorrectas." };
  }

  return { valid: true };
}

/**
 * Funcion que determina si un usuario es válido para hacer una reserva.
 * Devuelve un error si no es válido con el mensaje descriptivo.
 * Esto se da cuando:
 * - Fecha de penalización < hoy
 * - El usuario no tiene un libro cuya fecha de devolución > hoy y condicion = "no devuelto"
 * - El usuario tiene libros reservados(libros cuya fecha_adquisicion > hoy 
 *    (si es igual mirar si el libro está disponible)) < num_max_reservas
 */
export async function userValidoReserva(idUsuario){
  console.log("iduser:" + idUsuario)
  //usuario no penalizado
  await filterUsuarioPenalizado(idUsuario)
  
  //usuario sin libros no devueltos
  await filterUsuarioLibrosNoDevueltos(idUsuario)

  //maximo de libros para reservar de esta persona
  let maxLibrosReservar = await getMaxLibrosReservar(idUsuario)
  console.log("max libros que puedes reservar:" + maxLibrosReservar)
  console.log(maxLibrosReservar)

  let librosReservadosCount = (await getLibrosReservados(idUsuario)).length;
  console.log("libros reservados:" + librosReservadosCount)

  if(librosReservadosCount >= maxLibrosReservar){
    throw new Error("Por el momento no puedes reservar más libros, has alcanzado el máximo.");
  }

  return true;
}

/**
 * Funcion que determina si un usuario es válido para hacer un préstamo.
 * Devuelve un error si no es válido con el mensaje descriptivo.
 * Esto se da cuando:
 * - Fecha de penalización < hoy
 * - El usuario no tiene un libro cuya fecha de devolución > hoy y condicion = "no devuelto"
 * - El usuario tiene libros en posesion < num_max_prestamos
 */
export async function userValidoPrestamo(idUsuario){
  console.log("iduser:" + idUsuario)
  //usuario no penalizado
  await filterUsuarioPenalizado(idUsuario)
  
  try{
    //usuario sin libros no devueltos
    await filterUsuarioLibrosNoDevueltos(idUsuario)
  }catch(error){
    console.log(error)
    if (error.message == MENSAJE_LIBROS_NO_DEV){
      throw new Error("El usuario tiene libros cuya fecha de devolución ha pasado."); 
    }else{
      throw error
    }
  }
  
  //maximo de libros para poseer de esta persona
  let maxLibrosPosesion = await getMaxLibrosPrestados(idUsuario)
  console.log("max libros que puedes reservar:" + maxLibrosPosesion)
  console.log(maxLibrosPosesion)

  let librosPosesionCount = (await getLibrosPosesion(idUsuario)).length;
  console.log("libros en posesion:" + librosPosesionCount)

  if(librosPosesionCount >= maxLibrosPosesion){
    throw new Error("El usuario ya tiene en posesión " + librosPosesionCount + " de " + maxLibrosPosesion + " libros que puede tener.");
  }

  return true;
}

/**
 * Devuelve los libros maximos que una persona puede reservar simultaneamente
 * @param {*} idUsuario 
 * @returns 
 */
export async function getMaxLibrosReservar(idUsuario){
  const { data: maxLibrosReservar, error } = await supabase
    .from('usuario')
    .select('num_max_reservas')
    .eq('id', idUsuario)
    .single();

  if(error){
    console.log(error)
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  return maxLibrosReservar.num_max_reservas;
}

/**
 * Devuelve los libros maximos que una persona puede poseer simultaneamente
 * @param {*} idUsuario 
 * @returns 
 */
export async function getMaxLibrosPrestados(idUsuario){
  const { data: maxLibrosPrestados, error } = await supabase
    .from('usuario')
    .select('num_max_prestamos')
    .eq('id', idUsuario)
    .single();

  if(error){
    console.log(error)
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  return maxLibrosPrestados.num_max_prestamos;
}

/**
 * Devuelve los libros que un usuario ha tenido en el pasado (devolucion menor o igual que hoy)
 * Excepcion: los libros que aun tengan la condicion reservado (no se ha realizado el prestamo)
 * y hayan pasado mas de dos dias desde la fecha de adquisicion
 * @param {*} idUsuario 
 * @returns 
 */
export async function getHistorial(idUsuario){
  const today = new Date().toISOString().split('T')[0]; 
  const haceDosDias = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(); 

  const { data: historial, error } = await supabase
    .from('usuario_libro')
    .select('*')
    .eq('usuario', idUsuario)
    .or(
      `and(fecha_devolucion.lte.${today},condicion.neq.reservado),and(condicion.eq.reservado,fecha_adquisicion.lt.${haceDosDias})`
    );

  if(error){
    console.log(error)
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  return historial;
}

/**
 * Funcion que mira si el usuario tiene libros no devueltos.
 * Devuelve el error o un true si no tiene.
 * @param {*} idUsuario 
 */
export async function filterUsuarioLibrosNoDevueltos(idUsuario){
  const hoy = new Date().toISOString().split('T')[0];

  //usuario con libros no devueltos (fecha de devolución < hoy)
  const { data: librosEnPosesion, error2 } = await supabase
    .from('usuario_libro')
    .select('*')
    .eq('usuario', idUsuario)
    .eq('condicion', 'no devuelto')
    .lt('fecha_devolucion', hoy);

  console.log('libros no devueltos ', librosEnPosesion)

  if(error2){
    console.log(error2)
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  if (librosEnPosesion.length > 0){
    throw new Error(MENSAJE_LIBROS_NO_DEV);
  }

  return true;
}

/**
 * Funcion que mira si el usuario existe y si no esta penalizado.
 * Devuelve el error o un true si existe y no está penalizado.
 * @param {*} idUsuario 
 */
export async function filterUsuarioPenalizado(idUsuario){
  const hoy = new Date().toISOString().split('T')[0];
  const { data: user, error } = await supabase.from('usuario').select('*').eq('id', idUsuario).single();

  if(error){
    console.log(error)
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }
  
  if (!user){
    console.log("Usuario no encontrado")
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  if (user.fecha_penalizacion >= hoy){
    throw new Error("Su penalización finaliza el " + formatearFechaBonita(user.fecha_penalizacion) + ".");
  }

  return true;
}

/**
 * Devuelve libros reservados que todavía se consideran activos.
 * Es decir, aquellos cuya fecha_adquisicion + 1 día ≥ hoy.
 * @param {} idUsuario 
 * @returns {} Libros reservados activos
 */
export async function getLibrosReservados(idUsuario) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  const ayerStr = ayer.toISOString().split('T')[0]; // fecha_adquisicion >= ayer

  const { data: librosReservados, error } = await supabase
    .from('usuario_libro')
    .select('*')
    .eq('usuario', idUsuario)
    .eq('condicion', 'reservado')
    .gte('fecha_adquisicion', ayerStr); // aún cuentan como reservados

  if (error) {
    console.log(error);
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  return librosReservados;
}

/**
 * Devuelve los libros en posesión (condición = "no devuelto").
 * @param {} idUsuario 
 * @returns {} Libros en posesión
 */
export async function getLibrosPosesion(idUsuario) {
  const { data: librosEnPosesion, error } = await supabase
    .from('usuario_libro')
    .select('*')
    .eq('usuario', idUsuario)
    .eq('condicion', 'no devuelto');

  if (error) {
    console.log(error);
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  return librosEnPosesion;
}

/**
 * Devuelve los libros del historial (condición !== "no devuelto").
 * Si son reservas, solo se consideran historial si su fecha_adquisicion + 1 día < hoy.
 * @param {} idUsuario 
 * @returns {} Libros del historial
 */
export async function getLibrosHistorial(idUsuario) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const { data: libros, error } = await supabase
    .from('usuario_libro')
    .select('*')
    .eq('usuario', idUsuario)
    .neq('condicion', 'no devuelto');

  if (error) {
    console.log(error);
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  const historialFiltrado = libros.filter(libro => {
    if (libro.condicion !== 'reservado') return true;

    const fechaAdq = new Date(libro.fecha_adquisicion);
    fechaAdq.setDate(fechaAdq.getDate() + 1);
    fechaAdq.setHours(0, 0, 0, 0);

    return fechaAdq < hoy;
  });

  return historialFiltrado;
}