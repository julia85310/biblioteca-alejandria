'use client'
import MyFooter from "@/app/components/MyFooter.js"
import { useRouter } from "next/navigation";
import MyHeader from "@/app/components/MyHeader.js"
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

    return <div className="min-h-[100vh] flex flex-col">
        <MyHeader></MyHeader>
        <main className="flex-1 bg-[var(--seashell)] px-10 flex flex-col">
            <h1 className="text-xl font-bold">Regístrate</h1>
            <div className="flex-1 flex justify-center items-center flex-col gap-3">
                <form onSubmit={(e) => signupRequest(e)} className="flex flex-col lg:flex-row lg:gap-32 border rounded p-6 gap-6">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col">
                            <label>Nombre</label>
                            <input 
                                className="inputsignup"
                                type="text"
                                placeholder="Nombre Apellido Apellido2" 
                                onChange={(e) =>
                                    setFormData({ ...formData, nombre: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Email</label>
                            <input 
                                className="inputsignup"
                                type="email"
                                placeholder="correoejemplo@ejemplo.com" 
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Teléfono</label>
                            <input 
                                className="inputsignup"
                                type="tel"
                                placeholder="612345678" 
                                onChange={(e) =>
                                    setFormData({ ...formData, telefono: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col">
                            <label>Contraseña</label>
                            <input 
                                className="inputsignup"
                                type="password"
                                placeholder="Contraseña segura" 
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex flex-col">
                            <label>Repite la contraseña</label>
                            <input 
                                className="inputsignup"
                                type="password"
                                placeholder="Contraseña segura" 
                                onChange={(e) =>
                                    setFormData({ ...formData, password2: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <div>
                                <input 
                                    className="mr-2 accent-[var(--lion)] rounded"
                                    type="checkbox"
                                    required
                                /><label>Acepto los términos y condiciones</label>
                            </div>
                            <div>
                                <input 
                                    className="mr-2 accent-[var(--lion)] rounded"
                                    type="checkbox"
                                    onChange={(e) =>
                                        setFormData({ ...formData, recuerdame: e.target.checked })
                                    }
                                    checked={formData.recuerdame}
                                /><label>Recuérdame</label>
                            </div>
                            <input 
                                className="bg-[var(--seashell)] border rounded-4xl px-4 py-1 mt-4"
                                type="submit"
                                value="Ok"
                            />
                        </div>
                    </div>
                </form>
                {mensaje && <h2 className="font-bold text-sm">{mensaje}</h2>}
            </div>
        </main>
        <MyFooter/>
    </div>
}