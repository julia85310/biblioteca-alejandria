'use client'
import {useState, useEffect } from "react"
import { useRouter } from "next/navigation";

export default function LibroUser({texto1, texto2, user_libro, esHistorial}){
    
    const [libro, setLibro] = useState();
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/api/libro?id=" + user_libro.libro);
            const data = await res.json();
            console.log("llamada")
            if(!res.ok){
                alert("Ha ocurrido un error. Intentelo de nuevo mas tarde")
                router.push("/perfil")
                return
            }
            setLibro(data);
        }
        fetchData(); 
    },[user_libro.libro])
    
    const reservaNoRealizada = esHistorial && user_libro.condicion == "reservado";

    if(!libro) return null;

    return <div className="pr-3 p-1 flex flex border border-[var(--chamoise)] border-2 mr-2 rounded-xl" onClick={() => router.push(`/catalogo/${libro.id}`)}>
        <img className=" w-24 m-2 rounded object-contain" src={libro.imagen_url} alt={"Portada de " + libro.titulo}></img>
        <div className="m-2 flex flex-col justify-between flex-1 flex flex-col gap-5">
            <div className="flex flex-col gap-1">
                <p className="font-bold">{libro.titulo}</p>
                <p className="text-xs">{libro.editorial}</p>
            </div>
            <div className="flex flex-col gap-4 ml-4">
                <div>
                    <p className="text-[var(--lion)] text-xs">{reservaNoRealizada? "Reservado para": texto1}</p>
                    <p className="text-sm text-right">{new Date(user_libro.fecha_adquisicion).toLocaleDateString('es-ES')}</p>
                </div>
                {reservaNoRealizada?
                    <p className="text-sm">No adquirido</p>
                    :
                    <div>
                        <p className="text-[var(--lion)] text-xs">{texto2}</p>
                        <p className="text-right min-w-30 mr-1">{new Date(user_libro.fecha_devolucion).toLocaleDateString('es-ES')}</p>
                    </div>}  
            </div>  
        </div>
    </div> 
}