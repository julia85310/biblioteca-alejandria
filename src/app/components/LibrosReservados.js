'use client'
import { useState, useEffect } from "react"
import LibroUser from "../components/LibroUser"
export default function LibrosPosesion({moreUserData}){
    const [hidden, setHidden] = useState(true)
    useEffect(() => {
        if (window.innerWidth >= 1024) { 
            hidden(false);
        }
    }, []);

    return <div id="reservados">
        <div id="desplegado" className={`${hidden? 'hidden':'flex'} flex-col justify-between p-4 border border-3 border-[var(--seashell)] gap-8 lg:gap-3`} >
            <div className="flex flex-row justify-between">
                <b>Libros reservados</b>
                <img src="/iconos/icono-flecha.png" onClick={() => setHidden(!hidden)} className={`object-contain w-6 rotate-90 lg:hidden`}></img>
            </div>
            {moreUserData.librosReservados.length == 0?
            <p className="text-center text-lg text-[var(--chamoise)] lg:text-xs lg:h-full">¡Reserva un libro para el momento que desees!</p>
            :<div className="flex flex-row overflow-y-auto mx-[-2em] justify-center lg:justify-between elemento-con-scroll">
                {
                    moreUserData.librosReservados.map((userLibro) =>
                    <LibroUser
                        key={userLibro.id}
                        esHistorial={false}
                        texto1="Reservado para"
                        user_libro={userLibro}
                        texto2="Devolución hasta"
                    ></LibroUser>
                    )
                }
            </div>}
        </div>
        <div id="plegado" className={`${!hidden? 'hidden':'flex'} flex-row justify-between border border-3 border-[var(--chamoise)] p-4 rounded-xl`}>
            <b>Libros reservados</b>
            <img src="/iconos/icono-flecha.png" onClick={() => setHidden(!hidden)} className="object-contain w-6 lg:hidden"></img>
        </div>
    </div>
}