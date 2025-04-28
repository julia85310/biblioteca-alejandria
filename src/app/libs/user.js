/**
 * Valida los datos del registro:
 * - que existan
 * - que email sea valido
 * - que telefono sea valido (673 828 834)
 * - que la contraseña sea de longitud 6 minimo y tenga un numero y una letra
 * @param {} param0 
 * @returns 
 */
function validarDatosRegistro({ nombre, email, telefono, password }) {
    if (!nombre || !email || !telefono || !password) {
      return { valid: false, 
        message: "Faltan campos obligatorios" };
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, 
        message: "Email no válido" };
    }
  
    const telefonoRegex = /^\d{3}\s\d{3}\s\d{3}$/;
    if (!telefonoRegex.test(telefono)) {
      return { valid: false, 
        message: "Teléfono no válido (formato: 673 326 236)" };
    }
  
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
    if (!passwordRegex.test(contraseña)) {
      return { valid: false, 
        message: "La contraseña debe tener mínimo 6 caracteres, al menos un número y una letra" };
    }
  
    return { valid: true };
  }