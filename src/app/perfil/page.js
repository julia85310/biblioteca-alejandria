'use client'
import { AuthContext } from "../contexts/AuthContext"
import MyHeader from "../components/MyHeader"
import MyFooter from "../components/MyFooter"
import { useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import User from "../components/User"
import DesplegableCalendarSelectEvent from "../components/DesplegableCalendarSelectEvent"
import LibrosPosesion from "../components/LibrosPosesion"
import LibrosReservados from "../components/LibrosReservados"
import Historial from "../components/Historial"
import Loader from "../components/loader/Loader"

export default function PerfilPage(){
    const router = useRouter();
    const {logout, user, refreshUserData} = useContext(AuthContext)
    const [moreUserData, setMoreUserData] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return;
        console.log('usuario:', user)

        async function fetchDataUser() {
            await refreshUserData()
            const res = await fetch("/api/userdata?u=" + user.id);
            if(!res.ok){
                alert("Ha ocurrido un error. Inténtelo de nuevo más tarde.")
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

            const timer = setTimeout(() => {
                setLoading(false)
            }, 800);

            return () => clearTimeout(timer);
        }
        fetchDataUser();
         
    }, [user?.id])


    function cerrarSesion(){
        setLoading(true)
        router.push("/")
        logout();
    }

    useEffect(() => {
        if (!loading && !user && !moreUserData) {
            router.push("/");
        }
    }, [loading, user]);

    return <div className="min-h-[100vh] flex flex-col bg-[var(--seashell)] ">
        <MyHeader ubiHeader="Perfil"></MyHeader>
        {loading? 
        <Loader tailwind="w-screen h-[60vh]"></Loader>:
        <main className="lg:mt-0 lg:mx-4 flex-1 flex flex-col lg:flex-row mx-12 gap-8 my-8 lg:justify-between">
            <User 
                cerrarSesion={cerrarSesion}
                moreUserData={moreUserData}
                user={user}
            />
            <div id="libros" className="flex flex-col lg:gap-1 gap-8 lg:flex-1 lg:w-full lg:justify-between">
                <LibrosPosesion
                    moreUserData={moreUserData}
                />
                <LibrosReservados
                    moreUserData={moreUserData}
                ></LibrosReservados>
                <Historial
                    moreUserData={moreUserData}
                ></Historial>
            </div>
            <DesplegableCalendarSelectEvent 
                moreUserData={moreUserData}
            />
        </main>}
        {!loading && <MyFooter/>}
    </div>
}