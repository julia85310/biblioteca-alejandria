'use client'
import Footer from "@/app/components/Footer"
import Header from "@/app/components/Header"
import {AuthContext} from "../../contexts/AuthContext.js"
import { useContext, useState} from "react";

export default function signupPage(){
    const { signup } = useContext(AuthContext);
    const [formData, setFormData] = useState({ nombre: "", email: "", telefono:"", password:"", password2:"", recuerdame:true});
    const [mensaje, setMensaje] = useState('');

    function signup(){

    }

    return <div>
        <Header></Header>
        <main>
            <h1>Regístrate</h1>
            <form onSubmit={(e) => signup(e)} className="flex flex-col lg:flex-row">
                <div>
                    <label>Nombre</label>
                    <input 
                        type="text"
                        placeholder="Nombre Apellido Apellido2" 
                        onChange={(e) =>
                            setFormData({ ...formData, nombre: e.target.value })
                        }
                        required
                    />
                    <label>Email</label>
                    <input 
                        type="email"
                        placeholder="correoejemplo@ejemplo.com" 
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        required
                    />
                    <label>Teléfono</label>
                    <input 
                        type="text"
                        placeholder="666 666 666" 
                        onChange={(e) =>
                            setFormData({ ...formData, telefono: e.target.value })
                        }
                        required
                    />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input 
                        type="text"
                        placeholder="Contraseña segura" 
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        required
                    />
                    <label>Contraseña</label>
                    <input 
                        type="text"
                        placeholder="Contraseña segura" 
                        onChange={(e) =>
                            setFormData({ ...formData, password2: e.target.value })
                        }
                        required
                    />
                    <input 
                        type="checkbox"
                        required
                    /><label>Acepto los términos y condiciones</label>
                    <input 
                        type="checkbox"
                        onChange={(e) =>
                            setFormData({ ...formData, recuerdame: e.target.checked })
                        }
                        checked
                    /><label>Recuérdame</label>
                    <input 
                        type="submit"
                        value="Ok"
                    />
                </div>
                {mensaje && <h2>{mensaje}</h2>}
            </form>
        </main>
        <Footer></Footer>
    </div>
}