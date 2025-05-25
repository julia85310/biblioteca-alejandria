'use client'
import { AuthContext } from "../contexts/AuthContext"
import MyHeader from "../components/MyHeader"
import MyFooter from "../components/MyFooter"
import { useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation";

export default function PerfilPage(){
    const router = useRouter();
    const {logout, user, loading} = useContext(AuthContext)
    const [hiddenUser, setHiddenUser] = useState(true)
    const [hiddenLPosesion, setHiddenLPosesion] = useState(true)
    const [hiddenLReservados, setHiddenLReservados] = useState(true)
    const [hiddenHistorial, setHiddenHistorial] = useState(true)
    const [hiddenCalendario, setHiddenCalendario] = useState(true)
    const [moreUserData, setMoreUserData] = useState()

    useEffect(() => {
        if (window.innerWidth >= 1024) { 
            setHiddenUser(false);
            setHiddenLPosesion(false);
            setHiddenLReservados(false);
            setHiddenHistorial(false);
            setHiddenCalendario(false);
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        async function fetchDataUser() {
            const res = await fetch("/api/userdata?u=" + user.id);
            if(!res.ok){
                alert("Ha ocurrido un error. Intentelo de nuevo mas tarde")
                router.push("/")
                return
            }
            const data = await res.json();
            setMoreUserData(data)
            console.log(data)
        }
        fetchDataUser();
         
    }, [user])

    function cerrarSesion(){
        logout();
        router.push("/")
    }

    if (loading) return null; //aqui va el futuro spinner
    if (!user) router.push("/");

    return <div className="min-h-[100vh] flex flex-col bg-[var(--seashell)] ">
        <MyHeader ubiHeader="Perfil"></MyHeader>
        <main className="flex-1 flex flex-col lg:flex-row mx-12 gap-8">
            <div id="infoUser" className="bg-[var(--linen)] p-4 rounded-xl mt-8 ">
                <div id="desplegado" className={`${hiddenUser? 'hidden':'flex'} flex-col gap-5`} >
                    <div id="header" className="flex flex-row justify-between mb-2">
                        <b>{user?.nombre}</b>
                        <img src="/iconos/icono-flecha.png" onClick={() => setHiddenUser(!hiddenUser)} className={`object-contain w-6 lg:hidden rotate-90`}></img>
                    </div>
                    <div id="info" className="flex flex-col text-[var(--lion)] text-sm ml-2 gap-4">
                        <div className="flex flex-row gap-2"><b>Email:</b>{user.email}</div>
                        <div className="flex flex-row gap-2"><b>Teléfono:</b>{user.telefono}</div>
                        <div className="flex flex-row gap-2"><b>Fecha de registro:</b>{new Date(user.fecha_registro).toLocaleDateString('es-ES')}</div>
                        <div className="flex flex-row gap-2"><b>Total libros prestados:</b>{new Date(user.fecha_registro).toLocaleDateString('es-ES')}</div>
                    </div>
                    <div id="moreInfo">

                    </div>
                    <div id="footer">

                    </div>
                </div>
                <div id="plegado" className={`${!hiddenUser? 'hidden':'flex'} flex-row justify-between`}>
                    <b>{user?.nombre}</b>
                    <img src="/iconos/icono-flecha.png" onClick={() => setHiddenUser(!hiddenUser)} className="object-contain w-6"></img>
                </div>
            </div>
            <div id="libros" className="flex flex-col lg:flex-row gap-8">
                <div id="posesion" className="border border-3 border-[var(--chamoise)] p-4 rounded-xl">
                    <div id="desplegado" className={`${hiddenLPosesion? 'hidden':'flex'}`} ></div>
                    <div id="plegado" className={`${!hiddenLPosesion? 'hidden':'flex'} flex-row justify-between`}>
                        <b>Libros en posesion</b>
                        <img src="/iconos/icono-flecha.png" onClick={() => setHiddenUser(!hiddenUser)} className="object-contain w-6"></img>
                    </div>
                </div>
                <div id="reservados" className="border border-3 border-[var(--chamoise)] p-4 rounded-xl">
                    <div id="desplegado" className={`${hiddenLReservados? 'hidden':'flex'}`} ></div>
                    <div id="plegado" className={`${!hiddenLReservados? 'hidden':'flex'} flex-row justify-between`}>
                        <b>Libros reservados</b>
                        <img src="/iconos/icono-flecha.png" onClick={() => setHiddenUser(!hiddenUser)} className="object-contain w-6"></img>
                    </div>
                </div>
                <div id="historial" className="border border-3 border-[var(--chamoise)] p-4 rounded-xl">
                    <div id="desplegado" className={`${hiddenHistorial? 'hidden':'flex'}`} ></div>
                    <div id="plegado" className={`${!hiddenHistorial? 'hidden':'flex'} flex-row justify-between`}>
                        <b>Historial de préstamos</b>
                        <img src="/iconos/icono-flecha.png" onClick={() => setHiddenUser(!hiddenUser)} className="object-contain w-6"></img>
                    </div>
                </div>
            </div>
            <div id="calendario" className="bg-[var(--linen)] p-4 rounded-xl">
                <div id="desplegado" className={`${hiddenCalendario? 'hidden':'flex'}`} ></div>
                <div id="plegado" className={`${!hiddenCalendario? 'hidden':'flex'} flex-row justify-between`}>
                    <b>Calendario</b>
                    <img src="/iconos/icono-flecha.png" onClick={() => setHiddenUser(!hiddenUser)} className="object-contain w-6"></img>
                </div>
            </div>
            {/*<img src="/iconos/icono-logout.png" onClick={cerrarSesion}></img>*/}
        </main>
        <MyFooter/>
    </div>
}