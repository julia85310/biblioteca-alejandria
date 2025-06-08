'use client'
import { useState, useEffect } from "react"
import LibroSeleccion from "./LibroSeleccion";

export default function LibrosReservadosSeleccion({ moreUserData, userName,handleSeleccion, idSeleccionado }) {
    const [hidden, setHidden] = useState(true)
    const [librosReservadosHoy, setLibrosReservadosHoy] = useState([])

    //libros cuya fecha de adquisicion fue hoy o ayer
    useEffect(() => {
        let librosReservados;
        if (!moreUserData?.librosReservados) return [];

        const hoy = new Date();
        const ayer = new Date();
        hoy.setHours(0, 0, 0, 0);
        ayer.setDate(hoy.getDate() - 1);
        ayer.setHours(0, 0, 0, 0);

        librosReservados = moreUserData.librosReservados.filter(libro => {
            const fecha = new Date(libro.fecha_adquisicion);
            fecha.setHours(0, 0, 0, 0);
            return fecha.getTime() === hoy.getTime() || fecha.getTime() === ayer.getTime();
        });

        setLibrosReservadosHoy(librosReservados)

        console.log('librosReservadosHoy:', librosReservadosHoy)
    }, [moreUserData?.librosReservados])
    
    useEffect(() => {
        if (window.innerWidth >= 1024) { 
            setHidden(false);
        }
    }, []);

    return <div id="reservados">
        <div id="desplegado" className={`${hidden ? 'hidden' : 'flex'} flex-col justify-between p-4 gap-8 lg:gap-3`}>
            <div className="flex flex-row justify-between">
                <b className={`text-[var(--paynesGray)]`}>Libros reservados de {userName}</b>
                <img src="/iconos/icono-flecha.png" onClick={() => setHidden(!hidden)} className="object-contain w-6 rotate-90 lg:hidden" />
            </div>
            {librosReservadosHoy && librosReservadosHoy?.length === 0 ?
                <p className="text-center text-lg lg:text-base text-[var(--chamoise)] lg:h-full">
                    El usuario no tiene ningún libro reservado para ayer u hoy.
                </p>
                :
                <div className="flex flex-row overflow-y-auto mx-[-2em] justify-center lg:justify-between elemento-con-scroll">
                    {
                        librosReservadosHoy.map((userLibro) =>
                            <LibroSeleccion
                                key={userLibro.id}
                                user_libro={userLibro}
                                handleSeleccion={handleSeleccion}
                                idSeleccionado={idSeleccionado}
                            />
                        )
                    }
                </div>
            }
        </div>
        <div id="plegado" className={`${!hidden ? 'hidden' : 'flex'} flex-row justify-between border border-3 border-[var(--columbiaBlue)] p-4 rounded-xl`}>
            <b className={`text-[var(--paynesGray)]`}>Libros reservados</b>
            <img src="/iconos/icono-flecha.png" onClick={() => setHidden(!hidden)} className="object-contain w-6 lg:hidden" />
        </div>
    </div>
}