'use client'
import { useState, useEffect } from "react"
export default function User({user, moreUserData, cerrarSesion, admin}){
    const [hidden, setHidden] = useState(true)

    let fondo = "[var(--linen)]"
    let letras = "[var(--chamoise)]"
    if (admin){
        fondo = "[var(--columbiaBlue)]"
        letras = "[var(--paynesGray)]"
    }

    useEffect(() => {
        if (window.innerWidth >= 1024) { 
            setHidden(false);
        }
    }, []);

    return <div id="infoUser" className={`bg-${fondo} p-4 rounded-xl text-${letras} lg:min-w-[20vw]`}>
        <div id="desplegado" className={`${hidden? 'hidden':'flex'} flex-col gap-7 lg:gap-3 justify-between h-full`} >
            <div id="header" className={`flex flex-row justify-between mb-2 text-[var(--cafeNoir)]`}>
                <b className="text-[var(--cafeNoir)]">{user?.nombre}</b>
                <img src="/iconos/icono-flecha.png" onClick={() => setHidden(!hidden)} className={`object-contain w-6 lg:hidden rotate-90`}></img>
            </div>
            <div id="info" className={`flex flex-col text-${admin? letras:'[var(--lion)]'} text-sm ml-2 gap-6 lg:text-xs lg:gap-[4vh]`}>
                <div className="flex flex-row gap-2"><b>Email:</b>{user.email}</div>
                <div className="flex flex-row gap-2"><b>Teléfono:</b>{user.telefono}</div>
                <div className="flex flex-row gap-2"><b>Fecha de registro:</b>{new Date(user.fecha_registro).toLocaleDateString('es-ES')}</div>
                <div className="flex flex-row gap-2"><b>Total libros prestados:</b>{moreUserData.totalLibrosPrestados}</div>
            </div>
            <hr className={`border-t-2 border-${admin? "[var(--paynesGray)]":"[var(--lion)]"} m-4 `} />
            <div id="moreInfo" className=" text-sm ml-2 flex flex-col gap-3 lg:text-xs lg:gap-[4vh]">
                <div className="flex flex-row gap-2"><b>Préstamos máximos simultaneos:</b>{moreUserData.maxLibrosPrestar}</div>
                <div className="flex flex-row gap-2 mb-4"><b>Reservas máximas simultaneas:</b>{moreUserData.maxLibrosReservar}</div>
                <div className="flex flex-row gap-2"><b>Libros en posesión:</b>{moreUserData.librosEnPosesion.length}</div>
                <div className="flex flex-row gap-2"><b>Libros reservados:</b>{moreUserData.librosReservados.length}</div>
            </div>
            <div id="footer" className={`flex flex-row justify-between text-${admin?"[var(--paynesGray)]":"[var(--chamoise)]"} text-sm lg:text-xs`}>
                <div className="flex flex-row items-center gap-3">
                    <div className={`${!moreUserData.penalizado? "bg-[var(--verde)]": "bg-[var(--rojo)]"} w-5 h-5 rounded-xl `}></div>
                    <b>
                    {moreUserData.penalizado 
                        ? `Penalizado hasta el ${new Date(user.fecha_penalizacion).toLocaleDateString('es-ES')}` 
                        : "No penalizado"}
                    </b>
                </div>
                {!admin && <img src="/iconos/icono-logout.png" onClick={cerrarSesion} className="object-contain w-14 lg:w-10"></img>}
            </div>
        </div>
        <div id="plegado" className={`${!hidden? 'hidden':'flex'} flex-row justify-between`}>
            <b className="text-[var(--cafeNoir)]">{user?.nombre}</b>
            <img src="/iconos/icono-flecha.png" onClick={() => setHidden(!hidden)} className="object-contain w-6 lg:hidden"></img>
        </div>
    </div>
}