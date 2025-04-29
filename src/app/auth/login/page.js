'use client'
import Footer from "@/app/components/Footer.js"
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header.js"
import {AuthContext} from "../../contexts/AuthContext.js"
import { useContext, useState} from "react";
import {validarDatosLogin} from "@/app/libs/user";

export default function signupPage(){
    const router = useRouter();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: "", password:"", recuerdame:true});
    const [mensaje, setMensaje] = useState('');

    function loginRequest(e){
        e.preventDefault();

        const { valid, message } = validarDatosLogin(email, password);

        if (!valid) {
            setMensaje(message)
        }else{
            const { success, message } = login(formData)
            if (!success){
                setMensaje(message)
            }else{
                //alerta personalizada
                alert("¡Bienvenido de nuevo!")
                router.push("../../perfil");
            }
        }
        
    }

    return <div>
        <Header ubiHeader="Perfil"></Header>
        <main>
            <form onSubmit={(e) => loginRequest(e)} className="flex flex-col">
                <h1>Inicia Sesión</h1>
                <div>
                    <img src="/iconos/email-icon.png"></img>
                    <input 
                        type="email"
                        placeholder="correoejemplo@ejemplo.com" 
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />
                </div>
                <div>
                    <img src="/iconos/icono-contraseña.png"></img>
                    <input 
                        type="password"
                        placeholder="Su contraseña" 
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                    />
                </div>
                {mensaje && <h2>{mensaje}</h2>}
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
            </form>
            <p onClick={() => router.push("/auth/signup")}>No tengo una cuenta</p>
        </main>
        <Footer></Footer>
    </div>
}