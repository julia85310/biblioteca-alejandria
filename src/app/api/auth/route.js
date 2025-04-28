import { supabase } from "@/app/libs/supabaseClient";
import bcrypt from "bcryptjs";
import {validarDatosRegistro} from "@/app/libs/user";

/**
 * Inicio de sesion de un usuario. 
 */
export async function GET(){
}

/**
 * Registro de usuario.
 */
export async function POST(request) {
    const { nombre, email, telefono, password } = await request.json();

    // Validar datos requeridos
    const { valid, message } = validarDatosRegistro({ nombre, email, telefono, password });

    if (!valid) {
        return new Response(JSON.stringify({ message }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    // Verificar si ya existe un usuario con ese email
    const { data: existingUser, error: searchError } = await supabase
    .from("usuario")
    .select("*")
    .eq("email", email)
    .single();

    //'PGRST116' error de no rows found
    if(searchError && searchError.code !== 'PGRST116'){
        return new Response(JSON.stringify({ message: "Error buscando usuario" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
    }

    if (existingUser) {
        return new Response(JSON.stringify({ message: "Email ya registrado" }), {
            status: 409,
            headers: {
            "Content-Type": "application/json",
            },
        });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario
    const { error: insertError } = await supabase
    .from("usuario")
    .insert([{ nombre, email, telefono, password: hashedPassword }]);

    if (insertError) {
        console.error(insertError);
        return new Response(JSON.stringify({ message: "Error al crear usuario" }), {
            status: 500,
            headers: {
            "Content-Type": "application/json",
            },
        });
    }

    // Registro exitoso
    return new Response(JSON.stringify({ message: "Usuario registrado con éxito" }), {
        status: 201,
        headers: {
            "Content-Type": "application/json",
        },
    });
}