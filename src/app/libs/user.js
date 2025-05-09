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
 * Esto se da cuando:
 * - Fecha de penalización < hoy
 * - El usuario no tiene un libro cuya fecha de devolución > hoy y condicion = "no devuelto"
 * - El usuario tiene libros reservados(libros cuya fecha_adquisicion > hoy 
 *    (si es igual mirar si el libro está disponible)) < num_max_reservas
 */
export async function user_valido_reserva(idUsuario){
  const hoy = new Date().toISOString().split('T')[0];
  
  //usuario no penalizado
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
  
  //usuario con libros no devueltos
  const { data: libros, error2 } = await supabase
    .from('usuario_libro')
    .select('*')
    .eq('usuario', idUsuario)
    .eq('condicion', 'no devuelto')
    .gt('fecha_adquisicion', hoy);

  if(error2){
    console.log(error2)
    throw new Error("Hubo un error. Inténtelo de nuevo más tarde.");
  }

  if (libros.length > 0){
    throw new Error("Tienes libros no devueltos. Por favor, devuélvelos lo antes posible.");
  }

  //usuario 

  
}