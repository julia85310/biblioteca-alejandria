'use client'
import { AuthContext } from "../contexts/AuthContext"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import MyHeader from "../components/MyHeader";
import Loader from "../components/loader/Loader";

export default function AdminPage(){
    const router = useRouter();
    const {user, modoAdmin, logout} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)

    function cerrarSesion(){
        setLoading(true)
        logout();
        router.push("/")
    }

    useEffect(() => {
        if(!user || !modoAdmin){
            router.push("/");
        }
        setLoading(false)
    }, [])
    

    return <div className="h-[100vh] flex flex-col font-admin">
        <MyHeader ubiHeader="Perfil"></MyHeader>
        {loading? 
        <Loader tailwind="w-screen h-[60vh]"></Loader>:
        <main className="bg-[var(--aliceBlue)] flex-1 flex flex-col p-8  text-[var(--paynesGray)] ">
            <div className="flex-1 grid gap-8 lg:gap-x-12 lg:mx-24 grid-cols-4 md:grid-cols-6 m-6 py-12 lg:py-0 justify-center">
                <div onClick={() => router.push("/admin/addLibro")} className="lg:justify-around lg:py-4 px-6 col-span-2 flex flex-col p-5 rounded-2xl lg:flex-row bg-[var(--columbiaBlue)] items-center justify-center">
                    <img src="/iconos/icono-add-libro.png" className="lg:w-[12vh] object-contain py-4"></img>
                    <p className="text-center lg:font-center lg:text-[3vh] text-lg whitespace-nowrap lg:whitespace-normal">Añadir <br className="hidden lg:block" /> Libro</p>
                </div>
                <div onClick={() =>  router.push("/admin/addEvento")} className="lg:justify-around lg:py-4 px-6 col-span-2 flex flex-col p-5 rounded-2xl lg:flex-row bg-[var(--columbiaBlue)] items-center justify-center">
                    <img src="/iconos/icono-add-evento.png" className="lg:w-[12vh]  object-contain p-1"></img>
                    <p className="text-center lg:text-[3vh] text-lg whitespace-nowrap lg:whitespace-normal">Añadir <br className="hidden lg:block" /> Evento</p>
                </div>
                <div onClick={() => router.push("/admin/verUsuarios")} className="lg:justify-around lg:py-4 px-6 col-span-2 flex flex-col p-5 rounded-2xl lg:flex-row bg-[var(--columbiaBlue)] items-center justify-center ">
                    <img src="/iconos/icono-usuarios.png" className="lg:w-[12vh]  object-contain p-1"></img>
                    <p className="text-center lg:text-[3vh] text-lg whitespace-nowrap lg:whitespace-normal">Ver <br className="hidden lg:block" /> Usuarios</p>
                </div>
                <div onClick={() => router.push("/admin/nuevoPrestamo")} className="lg:justify-around lg:py-8 px-6 col-span-2 md:col-start-2 flex flex-col p-5 rounded-2xl lg:flex-row bg-[var(--columbiaBlue)] items-center justify-center">
                    <img src="/iconos/icono-prestamo.png" className="lg:w-[12vh]  object-contain p-1"></img>
                    <p className="text-center lg:text-[3vh] text-lg whitespace-nowrap lg:whitespace-normal">Nuevo <br className="hidden lg:block" /> préstamo</p>
                </div>
                <div onClick={() => router.push("/admin/nuevaDevolucion")} className="lg:justify-around lg:py-8 px-6 col-span-2 col-start-2 md:col-start-4 flex flex-col p-5 rounded-2xl lg:flex-row bg-[var(--columbiaBlue)] items-center justify-center">
                    <img src="/iconos/icono-devolucion.png" className="lg:w-[12vh]  object-contain p-1" />
                    <p className="text-center lg:text-[3vh] text-lg whitespace-nowrap lg:whitespace-normal">Nueva <br className="hidden lg:block" /> devolución</p>
                </div>
            </div>
            <div className="flex justify-end">
                <img src="/iconos/icono-logout-azul.png" onClick={cerrarSesion} className="w-16 object-contain"></img>
            </div>
        </main>}
    </div>
}