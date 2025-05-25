'use client'
import { AuthContext } from "../contexts/AuthContext"
import MyHeader from "../components/MyHeader"
import MyFooter from "../components/MyFooter"
import { useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import LibroUser from "../components/LibroUser"

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
            
            //Calculo del totalLibrosPrestados (historial no reservado y en posesion)
            let totalLibrosPrestados = 0;
            data.historial.map(libro => {
                if(libro.condicion != "reservado"){
                    totalLibrosPrestados++;
                }
            })
            totalLibrosPrestados = totalLibrosPrestados + data.librosEnPosesion.length;

            //mirar si esta penalizado
            const hoy = new Date();
            const fechaPenalizacion = new Date(user.fecha_penalizacion);

            hoy.setHours(0, 0, 0, 0);

            const penalizado = hoy < fechaPenalizacion;
            setMoreUserData({...data, totalLibrosPrestados: totalLibrosPrestados, penalizado: penalizado})
        }
        fetchDataUser();
         
    }, [user])

    function cerrarSesion(){
        logout();
        router.push("/")
    }

    if (loading) return null; //aqui va el futuro spinner
    if (!user) router.push("/");
    if (!moreUserData) return null;

    return <div className="min-h-[100vh] flex flex-col bg-[var(--seashell)] ">
        <MyHeader ubiHeader="Perfil"></MyHeader>
        <main className="flex-1 flex flex-col lg:flex-row mx-12 gap-8 my-8">
            <div id="infoUser" className="bg-[var(--linen)] p-4 rounded-xl ">
                <div id="desplegado" className={`${hiddenUser? 'hidden':'flex'} flex-col gap-7`} >
                    <div id="header" className="flex flex-row justify-between mb-2 ">
                        <b>{user?.nombre}</b>
                        <img src="/iconos/icono-flecha.png" onClick={() => setHiddenUser(!hiddenUser)} className={`object-contain w-6 lg:hidden rotate-90`}></img>
                    </div>
                    <div id="info" className="flex flex-col text-[var(--lion)] text-sm ml-2 gap-6">
                        <div className="flex flex-row gap-2"><b>Email:</b>{user.email}</div>
                        <div className="flex flex-row gap-2"><b>Teléfono:</b>{user.telefono}</div>
                        <div className="flex flex-row gap-2"><b>Fecha de registro:</b>{new Date(user.fecha_registro).toLocaleDateString('es-ES')}</div>
                        <div className="flex flex-row gap-2"><b>Total libros prestados:</b>{moreUserData.totalLibrosPrestados}</div>
                    </div>
                    <hr className="border-t-2 border-[var(--lion)] m-4 " />
                    <div id="moreInfo" className="text-[var(--chamoise)] text-sm ml-2 flex flex-col gap-3">
                        <div className="flex flex-row gap-2"><b>Préstamos máximos simultaneos:</b>{moreUserData.maxLibrosPrestar}</div>
                        <div className="flex flex-row gap-2 mb-4"><b>Reservas máximas simultaneas:</b>{moreUserData.maxLibrosReservar}</div>
                        <div className="flex flex-row gap-2"><b>Libros en posesión:</b>{moreUserData.librosEnPosesion.length}</div>
                        <div className="flex flex-row gap-2"><b>Libros reservados:</b>{moreUserData.librosReservados.length}</div>
                    </div>
                    <div id="footer" className="flex flex-row justify-between text-[var(--chamoise)] text-sm">
                        <div className="flex flex-row items-center gap-3">
                            <div className={`${!moreUserData.penalizado? "bg-[var(--verde)]": "bg-[var(--rojo)]"} w-5 h-5 rounded-xl `}></div>
                            <b>
                            {moreUserData.penalizado 
                                ? `Penalizado hasta el ${new Date(user.fecha_penalizacion).toLocaleDateString('es-ES')}` 
                                : "No penalizado"}
                            </b>
                        </div>
                        <img src="/iconos/icono-logout.png" onClick={cerrarSesion} className="object-contain w-14"></img>
                    </div>
                </div>
                <div id="plegado" className={`${!hiddenUser? 'hidden':'flex'} flex-row justify-between`}>
                    <b>{user?.nombre}</b>
                    <img src="/iconos/icono-flecha.png" onClick={() => setHiddenUser(!hiddenUser)} className="object-contain w-6"></img>
                </div>
            </div>
            <div id="libros" className="flex flex-col lg:flex-row gap-8">
                <div id="posesion" className="">
                    <div id="desplegado" className={`${hiddenLPosesion? 'hidden':'flex'} flex-col justify-between p-4 border border-3 border-[var(--seashell)] gap-8`} >
                        <div className="flex flex-row justify-between">
                            <b>Libros en posesion</b>
                            <img src="/iconos/icono-flecha.png" onClick={() => setHiddenLPosesion(!hiddenLPosesion)} className={`object-contain w-6 rotate-90`}></img>
                        </div>
                        {moreUserData.librosEnPosesion.length == 0?
                        <p className="text-center text-lg text-[var(--chamoise)]">No tienes libros prestados. ¡Explora el <b onClick={() => router.push("/catalogo")}>catálogo</b>!</p>
                        :<div className="flex flex-row overflow-y-auto">
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
                    <div id="plegado" className={`${!hiddenLPosesion? 'hidden':'flex'} flex-row justify-between border border-3 border-[var(--chamoise)] p-4 rounded-xl`}>
                        <b>Libros en posesion</b>
                        <img src="/iconos/icono-flecha.png" onClick={() => setHiddenLPosesion(!hiddenLPosesion)} className={`object-contain w-6`}></img>
                    </div>
                </div>
                <div id="reservados">
                    <div id="desplegado" className={`${hiddenLReservados? 'hidden':'flex'} flex-col justify-between p-4 border border-3 border-[var(--seashell)] gap-8`} >
                        <div className="flex flex-row justify-between">
                            <b>Libros reservados</b>
                            <img src="/iconos/icono-flecha.png" onClick={() => setHiddenLReservados(!hiddenLReservados)} className={`object-contain w-6 rotate-90`}></img>
                        </div>
                        {moreUserData.librosReservados.length == 0?
                        <p className="text-center text-lg text-[var(--chamoise)]">¡Reserva un libro para el momento que desees!</p>
                        :<div className="flex flex-row overflow-y-auto">
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
                    <div id="plegado" className={`${!hiddenLReservados? 'hidden':'flex'} flex-row justify-between border border-3 border-[var(--chamoise)] p-4 rounded-xl`}>
                        <b>Libros reservados</b>
                        <img src="/iconos/icono-flecha.png" onClick={() => setHiddenLReservados(!hiddenLReservados)} className="object-contain w-6"></img>
                    </div>
                </div>
                <div id="historial" className="border border-3 border-[var(--chamoise)] p-4 rounded-xl">
                    <div id="desplegado" className={`${hiddenHistorial? 'hidden':'flex'}`} ></div>
                    <div id="plegado" className={`${!hiddenHistorial? 'hidden':'flex'} flex-row justify-between`}>
                        <b>Historial de préstamos</b>
                        <img src="/iconos/icono-flecha.png" onClick={() => setHiddenHistorial(!hiddenHistorial)} className="object-contain w-6"></img>
                    </div>
                </div>
            </div>
            <div id="calendario" className="bg-[var(--linen)] p-4 rounded-xl">
                <div id="desplegado" className={`${hiddenCalendario? 'hidden':'flex'}`} ></div>
                <div id="plegado" className={`${!hiddenCalendario? 'hidden':'flex'} flex-row justify-between`}>
                    <b>Calendario</b>
                    <img src="/iconos/icono-flecha.png" onClick={() => setHiddenCalendario(!hiddenCalendario)} className="object-contain w-6"></img>
                </div>
            </div>
        </main>
        <MyFooter/>
    </div>
}