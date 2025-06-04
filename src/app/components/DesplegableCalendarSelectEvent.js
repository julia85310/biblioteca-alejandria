'use client'
import { useState, useEffect } from "react"
import CalendarSelectEvent from "../components/CalendarSelectEvent"

export default function LibrosPosesion({ moreUserData, admin }) {
    const [hidden, setHidden] = useState(true)
    const [fechaCalendario, setFechaCalendario] = useState("Selecciona un día marcado")
    const [descripCalendario, setDescripCalendario] = useState("Para ver que tienes pendiente")

    useEffect(() => {
        if (window.innerWidth >= 1024) {
            setHidden(false)
        }
    }, [])

    const fondo = admin ? "[var(--columbiaBlue)]" : "[var(--linen)]"
    const letras = admin ? "[var(--paynesGray)]" : "[var(--cafeNoir)]"
    const secundario = "[var(--chamoise)]"

    return (
        <div id="calendario" className={`bg-${fondo} p-4 rounded-xl text-${letras}`}>
            <div id="desplegado" className={`${hidden ? 'hidden' : 'flex'} flex-col justify-between gap-4`}>
                <div className={`flex justify-between flex-row text-${letras}`}>
                    <b className={`text-${letras}`}>Calendario de eventos</b>
                    <img
                        src="/iconos/icono-flecha.png"
                        onClick={() => setHidden(!hidden)}
                        className="object-contain w-6 rotate-90 lg:hidden"
                    />
                </div>
                <div id="calendario">
                    <CalendarSelectEvent
                        reservas={moreUserData.librosReservados}
                        prestamos={moreUserData.librosEnPosesion}
                        historial={moreUserData.historial}
                        handleClick={(fecha, descrip) => {
                            if (!fecha || !descrip) {
                                alert("Ha ocurrido un error. Inténtelo de nuevo más tarde.")
                                return
                            }
                            setFechaCalendario(fecha)
                            setDescripCalendario(descrip)
                        }}
                    />
                </div>
                <b className={`text-${secundario} text-center text-lg lg:text-sm`}>
                    {fechaCalendario}
                </b>
                <p className={`text-${secundario} text-center lg:text-xs`}>
                    {descripCalendario}
                </p>
            </div>
            <div id="plegado" className={`${!hidden ? 'hidden' : 'flex'} flex-row justify-between`}>
                <b className={`text-${letras}`}>Calendario de eventos</b>
                <img
                    src="/iconos/icono-flecha.png"
                    onClick={() => setHidden(!hidden)}
                    className="object-contain w-6 lg:hidden"
                />
            </div>
        </div>
    )
}
