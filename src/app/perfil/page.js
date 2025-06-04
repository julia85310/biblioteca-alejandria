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

export default function PerfilPage(){
    const router = useRouter();
    const {logout, user, loading} = useContext(AuthContext)
    const [moreUserData, setMoreUserData] = useState()

    useEffect(() => {
        if (!user) return;

        async function fetchDataUser() {
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
        }
        fetchDataUser();
         
    }, [user])


    function cerrarSesion(){
        logout();
        router.push("/")
    }

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [loading, user]);

    if (loading) return null; //aqui va el futuro spinner
    if (!user) return null;
    if (!moreUserData) return null;

    return <div className="min-h-[100vh] flex flex-col bg-[var(--seashell)] ">
        <MyHeader ubiHeader="Perfil"></MyHeader>
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
        </main>
        <MyFooter/>
    </div>
}