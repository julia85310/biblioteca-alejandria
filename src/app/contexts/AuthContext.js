'use client'
import { createContext, useState, useEffect } from 'react';
import {validarDatosRegistro, validarDatosLogin} from "@/app/libs/user";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const modoAdmin = user?.admin === true;
  const [loading, setLoading] = useState(true);

  // Cargar el usuario desde localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      console.log("usuario cargado de localStorage:")
      console.log(JSON.parse(storedUser))
      setUser(JSON.parse(storedUser));
      refreshUserData();
    }
    setLoading(false);
  }, []);

  async function signup(nombre, email, telefono, password, recuerdame){
    try {
        const { valid, message } = validarDatosRegistro(nombre, email, telefono, password);

        if (!valid) {
            return { success: valid, message: message }
        }
        
        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({nombre, email, telefono, password}),
        });

        const data = await response.json();

        if (response.status === 201) {
          setUser(data.user); //Aun no se pueden crear cuentas de admin
          if (recuerdame){
            guardarUsuario(data.user)
          }
          return { success: true, message: data.message };
        } else {
          console.log("Error en authcontext: " + data.message)
          return { success: false, message: data.message };
        }
    } catch (error) {
        return { success: false, message: "Error al registrar usuario" };
    }
  };

  async function refreshUserData() {
    if (!user?.id) return;  // Si no hay usuario o id, no hace nada

    try {
      const response = await fetch(`/api/login?id=${user.id}`);
      if (!response.ok) {
        console.error("Error al refrescar usuario");
        return null;
      }
      const data = await response.json();

      setUser(data.user);                // Actualiza estado
      localStorage.setItem('usuario', JSON.stringify(data.user));  // Actualiza localStorage

      return data.user;
    } catch (error) {
      console.error("Error en refreshUserData:", error);
      return null;
    }
  }

  async function login(email, password, recuerdame) {
    try {
      const { valid, message } = validarDatosLogin(email, password);

      if (!valid) {
          return { success: valid, message: message }
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
          setUser(data.user);
        if (recuerdame){
          guardarUsuario(data.user);
        } 
        return { success: true, message: data.message, admin: data.user.admin };
      } else {
        return { success: false, message: data.message };
      }
    } catch {
      return { success: false, message: "Error al iniciar sesión" };
    }
  }

  const guardarUsuario = (usuario) => {
    console.log("Usuario guardado")
    console.log(usuario)
    localStorage.setItem('usuario', JSON.stringify(usuario));
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    setUser(null);
    console.log("Sesion cerrada")
  };

  return (
    <AuthContext.Provider value={{loading, user, signup, logout, login, modoAdmin, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
