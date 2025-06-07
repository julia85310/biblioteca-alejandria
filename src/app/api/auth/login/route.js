import { supabase } from "@/app/libs/supabaseClient";
import bcrypt from "bcryptjs"; // ← CAMBIADO
import { validarDatosLogin } from "@/app/libs/user";

//Coger los datos del user con el id
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "Falta el parámetro id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: user, error } = await supabase
      .from("usuario")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ message: "Usuario no encontrado" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Eliminar la propiedad password antes de enviar la respuesta
    if (user.password) {
      delete user.password;
    }

    return new Response(
      JSON.stringify({ user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * Inicio de sesión de un usuario.
 */
export async function POST(req) {
  try {
    const { email, password } = await req.json();
    console.log("email: " + email + "pass: " + password)
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
      .from("usuario")
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
      user: usuarioSinPassword,
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

