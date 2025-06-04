'use client'
import MyHeader from "../components/MyHeader"
import {useState, useEffect } from "react"
import User from "../components/User"
import DesplegableCalendarSelectEvent from "../components/DesplegableCalendarSelectEvent"
import LibrosPosesion from "../components/LibrosPosesion"
import LibrosReservados from "../components/LibrosReservados"
import Historial from "../components/Historial"

export default function VerUsuariosPage(){
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState(null)
    const [moreUserData, setMoreUserData] = useState()

    useEffect(() => {
        async function fetchDataUsers() {
            const res = await fetch("/api/users");
            if(!res.ok){
                alert("Ha ocurrido un error. Inténtelo de nuevo más tarde.")
                router.push("/")
                return
            }
            const data = await res.json();
            setUsers(data);
        }

        fetchDataUsers();
         
    }, [])

    /*useEffect(() => {
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
         
    }, [user])*/


    useEffect(() => {
        if (!loading) {
            router.push("/");
        }
    }, [loading]);

    if (loading) return null; //aqui va el futuro spinner

    return <div className="min-h-[100vh] flex flex-col bg-[var(--aliceBlue)] ">
        <MyHeader></MyHeader>
        <main className="lg:mt-0 lg:mx-4 flex-1 mx-12 gap-8 my-8">
        {user? 
        <div className="flex flex-col lg:flex-row lg:justify-between">
            <User 
                cerrarSesion={cerrarSesion}
                moreUserData={moreUserData}
                user={user}
                admin={true}
            />
            <div id="libros" className="flex flex-col lg:gap-1 gap-8 lg:flex-1 lg:w-full lg:justify-between">
                <LibrosPosesion
                    moreUserData={moreUserData}
                    admin={true}
                />
                <LibrosReservados
                    moreUserData={moreUserData}
                    admin={true}
                ></LibrosReservados>
                <Historial
                    moreUserData={moreUserData}
                    admin={true}
                ></Historial>
            </div>
            <DesplegableCalendarSelectEvent 
                moreUserData={moreUserData}
                admin={true}
            />
        </div>
        : <p>Selecciona un usuario</p>}
        </main>
    </div>
}