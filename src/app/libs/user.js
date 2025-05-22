import { supabase } from "@/app/libs/supabaseClient";
import { formatearFechaBonita } from "./libro";

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

  let librosReservadosCount = await getLibrosReservados(idUsuario);
  console.log("libros reservados:" + librosReservadosCount)

  if(librosReservadosCount >= maxLibrosReservar){
    throw new Error("No puedes reservar más libros, has alcanzado el máximo.");
  }

  return true;
}

/**
 * Devuelve los libros maximos que una persona puede reservar simultaneamente
 * @param {*} idUsuario 
 * @returns 
 */
export async function getMaxLibrosReservar(idUsuario){
  const { data: maxLibrosReservar, error5 } = await supabase
    .from('usuario')
    .select('num_max_reservas')
    .eq('id', idUsuario)
    .single();

  if(error5){
    console.log(error5)
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  return maxLibrosReservar.num_max_reservas;
}

/**
 * Funcion que mira si el usuario tiene libros no devueltos.
 * Devuelve el error o un true si no tiene.
 * @param {*} idUsuario 
 */
export async function filterUsuarioLibrosNoDevueltos(idUsuario){
  const hoy = new Date().toISOString().split('T')[0];

  //usuario con libros no devueltos (fecha de devolución > hoy)
  const { data: librosEnPosesion, error2 } = await supabase
    .from('usuario_libro')
    .select('*')
    .eq('usuario', idUsuario)
    .eq('condicion', 'no devuelto')
    .gt('fecha_devolucion', hoy);

  if(error2){
    console.log(error2)
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  if (librosEnPosesion.length > 0){
    throw new Error("Tienes libros no devueltos. Por favor, devuélvelos lo antes posible.");
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
    throw new Error("Su penalización finaliza el " + formatearFechaBonita(user.fecha_penalizacion));
  }

  return true;
}

/**
 * Funcion que devuelve el numero de libros que tiene una persona en reserva.
 * - Solo valida la condicion "reservado", para evitar libros adquiridos
 * @param {} idUsuario 
 * @returns 
 */
export async function getLibrosReservados(idUsuario) {
  const hoy = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  const { data: librosReservados, error } = await supabase
    .from('usuario_libro')
    .select('*')
    .eq('usuario', idUsuario)
    .eq('condicion', 'reservado')
    .gte('fecha_adquisicion', hoy);

  if (error) {
    console.error(error);
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  return librosReservados.length;
}

/**
 * Devuelve los libros en posesion, que son libros con fecha_adquisicion <= hoy
 * y fecha_devolucion >= hoy. 
 * - Solo valida la condicion "no devuelto", para evitar libros no adquiridos(ya devueltos o en reserva)
 * @param {} idUsuario 
 */
export async function getLibrosPosesion(idUsuario){
  const hoy = new Date().toISOString().split('T')[0];

  const { data: librosEnPosesion, error} = await supabase
    .from('usuario_libro')
    .select('*')
    .eq('usuario', idUsuario)
    .eq('condicion', 'no devuelto')
    .lte('fecha_adquisicion', hoy)
    .gte('fecha_devolucion', hoy);

  if(error){
    console.log(error)
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  return librosEnPosesion.length;
}