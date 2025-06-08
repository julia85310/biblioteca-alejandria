'use client'
import { useState, useEffect } from "react"
import CalendarSelectEvent from "../components/CalendarSelectEvent"

export default function LibrosPosesion({ moreUserData, admin }) {
    const [hidden, setHidden] = useState(true)
    const [fechaCalendario, setFechaCalendario] = useState("Selecciona un día marcado")
    const [descripCalendario, setDescripCalendario] = useState("Para ver el evento relacionado")

    useEffect(() => {
        if (window.innerWidth >= 1024) {
            setHidden(false)
        }
    }, [])

    const fondo = admin ? "[var(--columbiaBlue)]" : "[var(--linen)]"
    const letras = admin ? "[var(--paynesGray)]" : "[var(--chamoise)]"

    return (
        <div id="calendario" className={`bg-${fondo} p-4 rounded-xl h-full flex lg:min-h-[80vh]`}>
            <div id="desplegado" className={`${hidden ? 'hidden' : 'flex'} flex-col flex-1 justify-around gap-4 pb-4`}>
                <div className={`flex justify-between flex-row`}>
                    <b className="text-[var(--cafeNoir)]">Calendario de eventos</b>
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
                <div className="flex items-center flex-col gap-5">
                    <b className={`text-${letras} text-center text-lg lg:text-sm`}>
                        {fechaCalendario}
                    </b>
                    <p className={`text-${letras} text-center lg:text-xs`}>
                        {descripCalendario}
                    </p>
                </div>
            </div>
            <div id="plegado" className={`${!hidden ? 'hidden' : 'flex'} flex-row justify-between`}>
                <b>Calendario de eventos</b>
                <img
                    src="/iconos/icono-flecha.png"
                    onClick={() => setHidden(!hidden)}
                    className="object-contain w-6 lg:hidden"
                />
            </div>
        </div>
    )
}
