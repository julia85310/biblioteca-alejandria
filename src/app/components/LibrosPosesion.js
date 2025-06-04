'use client'
import { useState, useEffect } from "react"
import LibroUser from "../components/LibroUser"
export default function LibrosPosesion({moreUserData, admin}){
const [hidden, setHidden] = useState(true)

    let border = "[var(--chamoise)]"
    let letras = "[var(--cafeNoir)]"
    if (admin){
        letras = "[var(--paynesGray)]"
        border = "[var(--columbiaBlue)]"
    }

    useEffect(() => {
        if (window.innerWidth >= 1024) { 
            setHidden(false);
        }
    }, []);

    return <div id="posesion">
        <div id="desplegado" className={`${hidden? 'hidden':'flex'} flex-col justify-between p-4 border border-3 border-[var(--seashell)] gap-8 lg:gap-3`} >
            <div className="flex flex-row justify-between">
                <b className={`text-${letras}`}>Libros en posesion</b>
                <img src="/iconos/icono-flecha.png" onClick={() => setHidden(!hidden)} className={`object-contain w-6 rotate-90 lg:hidden`}></img>
            </div>
            {moreUserData.librosEnPosesion.length == 0?
            <p className="text-center text-lg text-[var(--chamoise)] lg:text-xs lg:h-full">No tienes libros prestados. ¡Explora el <b onClick={() => router.push("/catalogo")}><u>catálogo</u></b>!</p>
            :<div className="flex flex-row overflow-y-auto mx-[-2em] justify-center lg:justify-between elemento-con-scroll">
                {
                    moreUserData.librosEnPosesion.map((userLibro) =>
                    <LibroUser
                        key={userLibro.id}
                        esHistorial={false}
                        texto1="Adquirido"
                        user_libro={userLibro}
                        texto2="Devolución hasta"
                    ></LibroUser>
                    )
                }
            </div>}
        </div>
        <div id="plegado" className={`${!hidden? 'hidden':'flex'} flex-row justify-between border border-3 border-${border} p-4 rounded-xl`}>
            <b>Libros en posesion</b>
            <img src="/iconos/icono-flecha.png" onClick={() => setHidden(!hidden)} className={`object-contain w-6 lg:hidden`}></img>
        </div>
    </div>
}