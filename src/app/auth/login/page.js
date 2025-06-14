'use client'
import MyFooter from "@/app/components/MyFooter.js"
import { useRouter } from "next/navigation";
import MyHeader from "@/app/components/MyHeader.js"
import {AuthContext} from "../../contexts/AuthContext.js"
import { useContext, useState} from "react";
import {validarDatosLogin} from "@/app/libs/user";

export default function loginPage(){
    const router = useRouter();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: "", password:"", recuerdame:true});
    const [mensaje, setMensaje] = useState('');

    async function loginRequest(e){
        e.preventDefault();

        const { valid, message } = await validarDatosLogin(formData.email, formData.password);

        if (!valid) {
            setMensaje(message)
        }else{
            const { success, message, admin } = await login(formData.email, formData.password, formData.recuerdame)
            if (!success){
                setMensaje(message)
            }else{
                //alerta personalizada
                alert("¡Bienvenido de nuevo!")
                if(admin){
                    router.push("../../admin")
                }else{
                    router.push("/");
                }
            }
        }
        
    }

    

    return <div className="min-h-[100vh] flex flex-col">
        <MyHeader ubiHeader="Perfil"></MyHeader>
        <main className="py-4 pb-8 lg:py-4 lg:pb-8 md:py-6 md:px-20 w-[100%] h-[100%] bg-[var(--seashell)] flex-1 flex flex-col justify-center items-center">
            <form onSubmit={(e) => loginRequest(e)} className="justify-around lg:h-[40vh] lg:max-w-[35vw] w-[75%]  px-8 rounded-xl mb-2 py-8 bg-[var(--lion)] flex flex-col gap-4 lg:gap-4 md:gap-8">
                <h1 className="mb-4 text-white text-center lg:text-[3vh] text-xl md:text-2xl font-bold">Inicia Sesión</h1>
                <div className="flex bg-[var(--seashell)] rounded pr-2 pl-2 py-1">
                    <img className="w-4 object-contain mr-2" src="/iconos/email-icon.png" ></img>
                    <input 
                        type="email"
                        placeholder="Email" 
                        className="flex-1 font-admin placeholder-[var(--lion)] md:text-base lg:text-[2.2vh] text-xs w-auto"
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />
                </div>
                <div className="flex bg-[var(--seashell)] rounded pr-2 pl-2 py-1">
                    <img className="w-4 object-contain mr-2" src="/iconos/icono-password.png"></img>
                    <input 
                        type="password"
                        className="flex-1 font-admin placeholder-[var(--lion)] md:text-base lg:text-[2.2vh] text-xs w-auto" 
                        placeholder="Contraseña " 
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                    />
                </div>
                {mensaje && <h2 className="lg:text-xs md:text-sm text-sm text-center font-bold">{mensaje}</h2>}
                <div className="flex">
                    <input 
                        type="checkbox"
                        onChange={(e) =>
                            setFormData({ ...formData, recuerdame: e.target.checked })
                        }
                        className="mr-2 rounded accent-[var(--seashell)]"
                        checked={formData.recuerdame}
                    /><label className="font-admin text-[var(--seashell)] md:text-base lg:text-[2.2vh] text-sm">Recuérdame</label>
                </div>
                <div className="flex justify-end">
                    <input 
                        className="bg-[var(--seashell)] border rounded-4xl px-4 py-1 lg:text-[2.2vh]"
                        type="submit"
                        value="Ok"
                    />
                </div>
            </form>
            <p className="underline underline-offset-4 lg:text-[2vh] md:text-base text-sm mt-4" onClick={() => router.push("/auth/signup")}>No tengo una cuenta</p>
        </main>
        <MyFooter/>
    </div>
}