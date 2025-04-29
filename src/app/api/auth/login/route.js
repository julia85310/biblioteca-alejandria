import { supabase } from "@/app/libs/supabaseClient";
import bcrypt from "bcrypt";
import {validarDatosLogin} from "@/app/libs/user";

/**
 * Inicio de sesión de un usuario.
 */
export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validar datos requeridos
    const { valid, message } = validarDatosLogin(email, password);

    if (!valid) {
        return new Response(JSON.stringify({ message }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    // Buscar usuario por email
    const { data: usuarios, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error || usuarios.length === 0) {
      return new Response(JSON.stringify({ message: "Credenciales incorrectas." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const usuario = usuarios[0];

    // Comparar contraseñas
    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      return new Response(JSON.stringify({ message: "Credenciales incorrectas." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Eliminar contraseña del objeto usuario antes de enviarlo
    const { password: _, ...usuarioSinPassword } = usuario;

    return new Response(JSON.stringify({
      message: "Inicio de sesión exitoso",
      user: usuarioSinPassword
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return new Response(JSON.stringify({ message: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
