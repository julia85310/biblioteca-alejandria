'use client'
import { useState, useEffect } from "react"
import CalendarSelectEvent from "../components/CalendarSelectEvent";
export default function LibrosPosesion({moreUserData}){
    const [hidden, setHidden] = useState(true)
    const [fechaCalendario, setFechaCalendario] = useState("Selecciona un día marcado")
    const [descripCalendario, setDescripCalendario] = useState("Para ver que tienes pendiente")
    useEffect(() => {
        if (window.innerWidth >= 1024) { 
            setHidden(false);
        }
    }, []);

    return <div id="calendario" className="bg-[var(--linen)] p-4 rounded-xl">
        <div id="desplegado" className={`${hidden? 'hidden':'flex'} flex-col justify-between gap-4 `} >
            <div className="flex justify-between flex-row ">
                <b>Calendario de eventos</b> 
                <img src="/iconos/icono-flecha.png" onClick={() => setHidden(!hidden)} className="object-contain w-6 rotate-90 lg:hidden"></img>
            </div>
            <div id="calendario">
                <CalendarSelectEvent
                    reservas={moreUserData.librosReservados}
                    prestamos={moreUserData.librosEnPosesion}
                    historial={moreUserData.historial}
                    handleClick={(fecha, descrip) => { if(!fecha || !descrip){alert("Ha ocurrido un error. Inténtelo de nuevo más tarde."); return;} setFechaCalendario(fecha); setDescripCalendario(descrip)}}
                ></CalendarSelectEvent>
            </div>
            <b className="text-[var(--chamoise)] text-center text-lg  lg:text-sm">
                {fechaCalendario}
            </b>
            <p className="text-[var(--chamoise)] text-center  lg:text-xs">
                {descripCalendario}
            </p>
        </div>
        <div id="plegado" className={`${!hidden? 'hidden':'flex'} flex-row justify-between`}>
            <b>Calendario de eventos</b>
            <img src="/iconos/icono-flecha.png" onClick={() => setHidden(!hidden)} className="object-contain w-6 lg:hidden"></img>
        </div>
    </div>
}