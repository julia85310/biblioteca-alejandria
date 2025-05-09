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