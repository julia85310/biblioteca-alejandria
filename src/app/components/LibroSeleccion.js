'use client'
import {useState, useEffect } from "react"
import { useRouter } from "next/navigation";

export default function LibroSeleccion({user_libro, handleSeleccion, idSeleccionado,libroDado}){
    const [libro, setLibro] = useState(libroDado);
    const router = useRouter();

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
    },[user_libro?.libro, libro])

    const seleccionado = libro.id == idSeleccionado;

    return <div className={` flex flex border border-${seleccionado? "[var(--cafeNoir)]": "[var(--lion)]"} border-${seleccionado? "4": "2"} rounded-xl`} onClick={() => router.push(`/catalogo/${libro.id}`)}>
        <img className=" w-14 m-2 rounded object-contain" src={libro.imagen_url} alt={"Portada de " + libro.titulo}></img>
        <div className="m-2 flex flex-col justify-between flex-1 gap-2">
            <div>
                <p className="font-bold">{libro.titulo}</p>
                <p className="text-xs">{libro.editorial}</p>
            </div>
            <div className="flex justify-end">
                {seleccionado? 
                <b className="px-1 text-sm text-[var(--chamoise)]">Seleccionado</b>
                :<button className="bg-[var(--chamoise)] text-[var(--seashell)] px-2 rounded-xl text-sm" onClick={(e) => {e.stopPropagation(); handleSeleccion(libro)}}>Seleccionar</button>}
            </div>
        </div>
    </div> 
}