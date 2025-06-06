'use client'
import {useState, useEffect } from "react"
import { useRouter } from "next/navigation";

export default function LibroSeleccion({user_libro, handleSeleccion, idSeleccionado,libroDado, mostrarDevolucion}){
    
    const [libro, setLibro] = useState(libroDado);
    const [seleccionado, setSeleccionado] = useState(false)
    const router = useRouter();

    if (!user_libro) user_libro = null
    let fechaDevCad;

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/api/libro?id=" + user_libro.libro);
            const data = await res.json();

            if(!res.ok){
                alert("Ha ocurrido un error. Intentelo de nuevo mas tarde")
                router.push("/admin")
                return
            }
            setLibro(data);
        }
        if (!libro){
            fetchData();
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaDevolucion = new Date(user_libro.fecha_devolucion);
        fechaDevolucion.setHours(0, 0, 0, 0);
        fechaDevCad = hoy > fechaDevolucion
    },[])


    useEffect(() => {
        setSeleccionado(libro?.id == idSeleccionado)
    },[libro, idSeleccionado])

    
    

    return <div className={` flex flex border border-${seleccionado? "[var(--cafeNoir)]": "[var(--lion)]"} border-${seleccionado? "4": "2"} rounded-xl`} onClick={() => router.push(`/catalogo/${libro.id}`)}>
        {libro && <img className=" w-14 m-2 rounded object-contain" src={libro.imagen_url} alt={"Portada de " + libro.titulo}></img>}
        {libro &&<div className="m-2 flex flex-col justify-between flex-1 gap-2">
            <div>
                <p className="font-bold">{libro.titulo}</p>
                <p className="text-xs">{libro.editorial}</p>
            </div>
            {mostrarDevolucion && 
            <div>
                <p className="text-[var(--lion)] text-xs">Devolución hasta</p>
                <div className={`flex justify-end ${fechaDevCad && "text-[var(--rojoOscuro)]"}`}>{user_libro.fecha_devolucion}</div>
            </div>}
            <div className="flex justify-end ">
                {seleccionado? 
                <b className="px-1 text-sm text-[var(--chamoise)]">Seleccionado</b>
                :<button className="bg-[var(--chamoise)] text-[var(--seashell)] px-2 rounded-xl text-sm" onClick={(e) => {e.stopPropagation(); handleSeleccion(libro, user_libro)}}>Seleccionar</button>}
            </div>
        </div>}
    </div> 
}