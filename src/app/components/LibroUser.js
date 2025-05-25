'use client'
import {useState, useEffect } from "react"

export default function LibroUser({texto1, texto2, user_libro, esHistorial}){
    
    const [libro, setLibro] = useState();

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/api/libro?id=" + user_libro.libro);
            const data = await res.json();
            if(!res.ok){
                alert("Ha ocurrido un error. Intentelo de nuevo mas tarde")
                router.push("/perfil")
                return
            }
            setLibro(data);
        }
        fetchData(); 
    },[libro])
    
    const reservaNoRealizada = esHistorial && user_libro.condicion == "reservado";

    if(!libro) return null;

    return <div className=" flex flex border border-[var(--lion)] border-2 rounded-xl" onClick={() => router.push(`/catalogo/${libro.id}`)}>
        <img className=" w-18 m-2 rounded object-contain" src={libro.imagen_url} alt={"Portada de " + libro.titulo}></img>
        <div className="m-2 flex flex-col justify-between flex-1">
            <p className="font-bold">{libro.titulo}</p>
            <p className="text-xs">{libro.editorial}</p>
            <div>
                <p className="border-[var(--lion)]">{reservaNoRealizada? "Reservado para": texto1}</p>
                <p>{user_libro.fecha_adquisicion}</p>
            </div>
            {reservaNoRealizada?
                <p>No adquirido</p>
                :
                <div>
                    <p className="border-[var(--lion)]">{texto2}</p>
                    <p>{user_libro.fecha_devolucion}</p>
                </div>}    
        </div>
    </div> 
}