'use client'
import MyHeader from "../components/MyHeader"
import {useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import User from "../components/User"
import DesplegableCalendarSelectEvent from "../components/DesplegableCalendarSelectEvent"
import LibrosPosesion from "../components/LibrosPosesion"
import LibrosReservados from "../components/LibrosReservados"
import Historial from "../components/Historial"

export default function VerUsuariosPage(){
    const router = useRouter();
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState(null)
    const [filtroNombre, setFiltroNombre] = useState("")
    const [moreUserData, setMoreUserData] = useState()
    const [loading, setLoading] = useState(true) // asumiendo que estaba faltando esto

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
            setLoading(false);
        }

        fetchDataUsers();
         
    }, [])

    async function handleSelectUser(userSeleccionado) {
        setUser(userSeleccionado)
        const res = await fetch("/api/userdata?u=" + userSeleccionado.id);
        if(!res.ok){
            alert("Ha ocurrido un error. Inténtelo de nuevo más tarde.")
            router.push("/")
            return
        }
        const data = await res.json();
        
        let totalLibrosPrestados = 0;
        data.historial.map(libro => {
            if(libro.condicion != "reservado"){
                totalLibrosPrestados++;
            }
        })
        totalLibrosPrestados += data.librosEnPosesion.length;

        const hoy = new Date();
        const fechaPenalizacion = new Date(userSeleccionado.fecha_penalizacion);
        hoy.setHours(0, 0, 0, 0);
        const penalizado = hoy < fechaPenalizacion;

        setMoreUserData({...data, totalLibrosPrestados, penalizado})
    }

    function onChangefiltroNombre(e){
        setFiltroNombre(e.target.value)
    }

    if (loading) return null;

    // Filtrar usuarios por nombre
    const usuariosFiltrados = users?.filter(u =>
        u.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    );

    return (
    <div className="min-h-[100vh] flex flex-col bg-[var(--aliceBlue)]">
        <MyHeader />
        <main className="lg:mt-0 lg:mx-4 flex-1 mx-12 gap-8 my-8 flex flex-col">
            <div className="flex flex-col lg:items-start items-start gap-2 relative lg:ml-12 ml-4">
                <div className="flex border-[var(--chamoise)] border rounded-2xl py-1 px-2 bg-white w-[250px]">
                    <img className="w-4 object-contain mx-2" src="/iconos/lupa_icon.png" />
                    <input 
                        type="text"
                        value={filtroNombre}
                        className="flex-1 placeholder-[var(--lion)] md:text-base lg:text-xs text-xs w-auto" 
                        placeholder="Buscar por nombre" 
                        onChange={onChangefiltroNombre}
                    />
                </div>

                {filtroNombre.length > 0 && usuariosFiltrados?.length > 0 && (
                    <select
                        onChange={(e) => {
                            const selectedId = e.target.value;
                            const selectedUser = users.find(u => u.id === selectedId);
                            if (selectedUser) handleSelectUser(selectedUser);
                        }}
                        className="border-[var(--chamoise)] border rounded-2xl py-1 px-3 text-xs bg-white text-[var(--lion)] w-[250px]"
                        defaultValue=""
                    >
                        <option value="" disabled>Selecciona un usuario</option>
                        {usuariosFiltrados.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.nombre}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {user ? (
            <div className="flex flex-col lg:flex-row lg:justify-between">
                <User 
                    cerrarSesion={cerrarSesion}
                    moreUserData={moreUserData}
                    user={user}
                    admin={true}
                />
                <div id="libros" className="flex flex-col lg:gap-1 gap-8 lg:flex-1 lg:w-full lg:justify-between">
                    <LibrosPosesion moreUserData={moreUserData} admin={true} />
                    <LibrosReservados moreUserData={moreUserData} admin={true} />
                    <Historial moreUserData={moreUserData} admin={true} />
                </div>
                <DesplegableCalendarSelectEvent moreUserData={moreUserData} admin={true} />
            </div>
            ) : <p className="ml-12 mt-4 text-[var(--lion)]">Selecciona un usuario</p>}
        </main>
    </div>
    )
}
