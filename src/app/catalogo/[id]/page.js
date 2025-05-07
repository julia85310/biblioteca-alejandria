'use client'
import MyHeader from "@/app/components/MyHeader";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import MyFooter from "@/app/components/MyFooter";

export default function LibroPage({ params }){
    const id = params.id;
    const [libro, setLibro] = useState();
    const {user} = useContext(AuthContext);

    const fondo = ubiHeader === "Home"
        ? "bg-[var(--seashell)]"
        : user?.admin
            ? "bg-[var(--aliceBlue)]"
            : "bg-[var(--seashell)]";

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/api/libro?id=" + id);
            const data = await res.json();
            setLibro(data)
        }
        
        fetchData(); 
    },[])

    return <div className={`${fondo} min-h-[100vh] flex flex-col`}>
        <MyHeader ubiHeader=""/>
        <main className="flex-1 flex flex-col">
            <h1>{libro.titulo}</h1>
            <div className="flex flex-col lg:flex-row">
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <img src={libro.imagen_url}></img>
                        <div id="caracteristicasMovil" 
                        className="lg:hidden">

                        </div>
                        <div id="descripPC" 
                        className="hidden">

                        </div>
                    </div>
                    <div className="flex flex-row">
                        <div id="disponibilidad" className="flex">
                            <div className={`${libro.disponibilidad == "Disponible"? "bg-[var(--verde)]": "bg-[var(--rojo)]"} w-3 h-3 rounded-xl`}></div>
                            <p className="ml-1">{libro.disponibilidad}</p>
                        </div>
                        <div id="isbn" className="flex">
                            <img src="/iconos/isbn-icon.png"></img>
                            <p>{libro.isbn}</p>
                        </div>
                        <div id="ubicacion" className="flex">
                            <img src="/iconos/icono-ubi.png"></img>
                            <p>Estante {libro.estante}</p>
                            <p>Balda {libro.balda}</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div id="caracteristicasPC" 
                        className="hidden flex-1">

                    </div>
                    <div id="descripMovil" 
                        className="lg:hidden flex-1">

                    </div>
                    <div className="flex justify-end lg:justify-start">
                        <button className={`${admin? "bg-[var(--chamoise)]": "bg-[var(--ecru)]"} text-[var(--seashell)] px-2 rounded-xl`} onClick={handleClickButton}>{admin? "Eliminar": "Reservar"}</button>
                    </div>
                </div>
            </div>
        </main>
        { !user.admin && <MyFooter/> }
    </div>
}