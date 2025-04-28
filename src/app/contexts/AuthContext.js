'use client'
import { createContext, useState, useEffect } from 'react';
import {validarDatosRegistro} from "@/app/libs/user";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Cargar el usuario desde localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  async function signup(nombre, email, telefono, password, recuerdame){
    const prevUser = { nombre, email, telefono, password }
    try {
        const { valid, message } = validarDatosRegistro(prevUser);

        if (!valid) {
            return { success: valid, message: message }
        }
        
        const response = await fetch("/api/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(prevUser),
        });

        const data = await response.json();

        if (response.status === 201) {
            setUser({nombre, email, telefono, admin: false}); 
            if (recuerdame){
                guardarUsuario(user)
            }
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        return { success: false, message: "Error al registrar usuario" };
    }
  };

  const guardarUsuario = (usuario) => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
