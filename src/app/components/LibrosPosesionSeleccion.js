'use client'
import { useState, useEffect } from "react"
import LibroSeleccion from "./LibroSeleccion";

export default function LibrosPosesionSeleccion({moreUserData, userName,handleSeleccion, idSeleccionado }) {
    const [hidden, setHidden] = useState(true)

    useEffect(() => {
        if (window.innerWidth >= 1024) { 
            setHidden(false);
        }
    }, []);

    return <div id="reservados">
        <div id="desplegado" className={`${hidden ? 'hidden' : 'flex'} flex-col justify-between p-4 gap-8 lg:gap-3`}>
            <div className="flex flex-row justify-between">
                <b className={`text-[var(--paynesGray)]`}>Libros en posesión de {userName}</b>
                <img src="/iconos/icono-flecha.png" onClick={() => setHidden(!hidden)} className="object-contain w-6 rotate-90 lg:hidden" />
            </div>
            {moreUserData.librosPosesion.length === 0 ?
                <p className="text-center text-lg lg:text-base text-[var(--chamoise)] lg:h-full">
                    El usuario no tiene ningún libro para ser devuelto.
                </p>
                :
                <div className="flex flex-row overflow-y-auto mx-[-2em] justify-center lg:justify-between elemento-con-scroll">
                    {
                        moreUserData.librosPosesion.map((userLibro) =>
                            <LibroSeleccion
                                key={userLibro.id}
                                user_libro={userLibro}
                                handleSeleccion={handleSeleccion}
                                idSeleccionado={idSeleccionado}
                                mostrarDevolucion={true}
                            />
                        )
                    }
                </div>
            }
        </div>
        <div id="plegado" className={`${!hidden ? 'hidden' : 'flex'} flex-row justify-between border border-3 border-[var(--columbiaBlue)] p-4 rounded-xl`}>
            <b className={`text-[var(--paynesGray)]`}>Libros en posesión</b>
            <img src="/iconos/icono-flecha.png" onClick={() => setHidden(!hidden)} className="object-contain w-6 lg:hidden" />
        </div>
    </div>
}