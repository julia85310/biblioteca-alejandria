'use client'
import { AuthContext } from "../contexts/AuthContext"
import MyHeader from "../components/MyHeader"
import MyFooter from "../components/MyFooter"
import { useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation";

export default function PerfilPage(){
    const router = useRouter();
    const {logout} = useContext(AuthContext)
    const [hiddenUser, setHiddenUser] = useState(true)
    const [hiddenLPosesion, setHiddenLPosesion] = useState(true)
    const [hiddenLReservados, setHiddenLReservados] = useState(true)
    const [hiddenHistorial, setHiddenHistorial] = useState(true)
    const [hiddenCalendario, setHiddenCalendario] = useState(true)

    useEffect(() => {
        if (window.innerWidth >= 1024) { 
            setHiddenUser(false);
            setHiddenLPosesion(false);
            setHiddenLReservados(false);
            setHiddenHistorial(false);
            setHiddenCalendario(false);
        }
    }, []);

    function cerrarSesion(){
        logout();
        router.push("/")
    }

    return <div className="min-h-[100vh] flex flex-col bg-[var(--seashell)] ">
        <MyHeader ubiHeader="Perfil"></MyHeader>
        <main className="flex-1 flex flex-col lg:flex-row">
            <div id="infoUser" className="bg-[var(--linen)]">
                <div id="desplegado" className={`${hiddenUser? 'hidden':'flex'}`} ></div>
                <div id="plegado" className={`${!hiddenUser? 'hidden':'flex'}`}></div>
            </div>
            <div id="libros" className="flex flex-col lg:flex-row">
                <div id="posesion">
                    <div id="desplegado" className={`${hiddenLPosesion? 'hidden':'flex'}`} ></div>
                <div id="plegado" className={`${!hiddenLPosesion? 'hidden':'flex'}`}></div>
                </div>
                <div id="reservados">
                    <div id="desplegado" className={`${hiddenLReservados? 'hidden':'flex'}`} ></div>
                    <div id="plegado" className={`${!hiddenLReservados? 'hidden':'flex'}`}></div>
                </div>
                <div id="historial">
                    <div id="desplegado" className={`${hiddenHistorial? 'hidden':'flex'}`} ></div>
                    <div id="plegado" className={`${!hiddenHistorial? 'hidden':'flex'}`}></div>
                </div>
            </div>
            <div id="calendario" className="bg-[var(--linen)]">
                    <div id="desplegado" className={`${hiddenCalendario? 'hidden':'flex'}`} ></div>
                    <div id="plegado" className={`${!hiddenCalendario? 'hidden':'flex'}`}></div>
            </div>
            {/*<img src="/iconos/icono-logout.png" onClick={cerrarSesion}></img>*/}
        </main>
        <MyFooter/>
    </div>
}