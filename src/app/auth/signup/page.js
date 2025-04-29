'use client'
import Footer from "@/app/components/Footer.js"
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header.js"
import {AuthContext} from "../../contexts/AuthContext.js"
import { useContext, useState} from "react";
import {validarDatosRegistro} from "@/app/libs/user";

export default function signupPage(){
    const router = useRouter();
    const { signup } = useContext(AuthContext);
    const [formData, setFormData] = useState({ nombre: "", email: "", telefono:"", password:"", password2:"", recuerdame:true});
    const [mensaje, setMensaje] = useState('');

    async function signupRequest(e){
        console.log("boton pulsado")
        e.preventDefault();

        if (formData.password2 != formData.password){
            setMensaje("Las contraseñas no coinciden")
        }else{
            const { valid, message } = await validarDatosRegistro(formData.nombre, formData.email, formData.telefono, formData.password);

            if (!valid) {
                setMensaje(message)
            }else{
                console.log("datos validos")
                const { success, message } = await signup(formData.nombre, formData.email, formData.telefono, formData.password, formData.recuerdame)
                console.log(message)
                if (!success){
                    console.log("error en authcontext: " + message)
                    setMensaje(message)
                }else{
                    console.log("registro exitoso")
                    //alerta personalizada
                    alert("Te has registrado con éxito, ¡bienvenido!")
                    router.push("../../perfil");
                }
            }
        }
    }

    return <div>
        <Header></Header>
        <main>
            <h1>Regístrate</h1>
            <form onSubmit={(e) => signupRequest(e)} className="flex flex-col lg:flex-row">
                <div>
                    <label>Nombre</label>
                    <input 
                        type="text"
                        placeholder="Nombre Apellido Apellido2" 
                        onChange={(e) =>
                            setFormData({ ...formData, nombre: e.target.value })
                        }
                    />
                    <label>Email</label>
                    <input 
                        type="email"
                        placeholder="correoejemplo@ejemplo.com" 
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />
                    <label>Teléfono</label>
                    <input 
                        type="tel"
                        placeholder="612345678" 
                        onChange={(e) =>
                            setFormData({ ...formData, telefono: e.target.value })
                        }
                    />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input 
                        type="password"
                        placeholder="Contraseña segura" 
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                    />
                    <label>Repite la contraseña</label>
                    <input 
                        type="password"
                        placeholder="Contraseña segura" 
                        onChange={(e) =>
                            setFormData({ ...formData, password2: e.target.value })
                        }
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