'use client'
import MyHeader from "../../components/MyHeader"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import User from "../../components/User"
import DesplegableCalendarSelectEvent from "../../components/DesplegableCalendarSelectEvent"
import LibrosPosesion from "../../components/LibrosPosesion"
import LibrosReservados from "../../components/LibrosReservados"
import Historial from "../../components/Historial"
import Loader from "@/app/components/loader/Loader"
import { parseDateWithoutTimezone } from "@/app/libs/libro"

export default function VerUsuariosPage() {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState(null)
    const [filtroNombre, setFiltroNombre] = useState("")
    const [moreUserData, setMoreUserData] = useState()
    const [loading, setLoading] = useState(true)
    const [mostrarLista, setMostrarLista] = useState(false)

    useEffect(() => {
        async function fetchDataUsers() {
            const res = await fetch("/api/users")
            if (!res.ok) {
                alert("Ha ocurrido un error. Inténtelo de nuevo más tarde.")
                router.push("../admin")
                return
            }
            const data = await res.json()
            setUsers(data)
            const timer = setTimeout(() => {
                setLoading(false)
            }, 700);

            return () => clearTimeout(timer);
        }

        fetchDataUsers()
    }, [])

    async function handleSelectUser(userSeleccionado) {
        setUser(userSeleccionado)
        const res = await fetch("/api/userdata?u=" + userSeleccionado.id)
        if (!res.ok) {
            alert("Ha ocurrido un error. Inténtelo de nuevo más tarde.")
            router.push("/")
            return
        }
        const data = await res.json()
        console.log(data)
        let totalLibrosPrestados = 0
        data.historial.forEach(libro => {
            if (libro.condicion !== "reservado") {
                totalLibrosPrestados++
            }
        })
        totalLibrosPrestados += data.librosEnPosesion.length

        const hoy = new Date()
        const fechaPenalizacion = parseDateWithoutTimezone(userSeleccionado.fecha_penalizacion)
        hoy.setHours(0, 0, 0, 0)
        const penalizado = hoy < fechaPenalizacion

        setMoreUserData({ ...data, totalLibrosPrestados, penalizado })
        console.log('moreUserData:', { ...data, totalLibrosPrestados, penalizado })
        
    }

    function handleUserSelect(user) {
        setLoading(true)
        handleSelectUser(user)
        setFiltroNombre(user.nombre)
        setMostrarLista(false)
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }


    const usuariosFiltrados = users?.filter(u =>
        u.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    )

    console.log('userData:', moreUserData)

    return (
        <div className="min-h-[100vh] flex flex-col bg-[var(--aliceBlue)]">
            {!loading && <MyHeader />}
            {loading? 
            <Loader tailwind="w-screen h-[90vh]"></Loader>:
            <main className="lg:mt-0 mx-4 flex-1  my-8 flex flex-col">
                <div id="buscadorFuncional" className="flex flex-col lg:items-start items-start relative lg:ml-4 ml-4 w-[250px]">
                    <div className="bg-[var(--darkAliceBlue)] flex border-[var(--chamoise)] border rounded-2xl py-1 px-2 w-full">
                        <img className="w-4 object-contain mx-2" src="/iconos/lupa_icon.png" />
                        <input
                            type="text"
                            value={filtroNombre}
                            className="flex-1 placeholder-[var(--lion)] md:text-base text-sm "
                            placeholder="Buscar por nombre"
                            onChange={(e) => setFiltroNombre(e.target.value)}
                            onFocus={() => setMostrarLista(true)}
                            onBlur={() => setTimeout(() => setMostrarLista(false), 100)}
                        />
                    </div>

                    {mostrarLista && usuariosFiltrados?.length > 0 && (
                        <ul className="absolute top-full left-0 mt-1 w-full bg-[var(--darkAliceBlue)] border border-[var(--chamoise)] rounded-xl shadow-md z-10 max-h-60 overflow-y-auto">
                            {usuariosFiltrados.map(user => (
                                <li
                                    key={user.id}
                                    onMouseDown={() => handleUserSelect(user)}
                                    className="text-sm px-4 py-2 text-[var(--lion)] hover:bg-[var(--chamoise)] hover:text-white cursor-pointer"
                                >
                                    {user.nombre}
                                </li>
                            ))}
                        </ul>
                    )}

                    {mostrarLista && usuariosFiltrados?.length === 0 && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-[var(--chamoise)] rounded-xl shadow-md z-10 p-2 text-[var(--lion)] text-sm italic">
                            No hay coincidencias
                        </div>
                    )}
                </div>

                {moreUserData && (
                    <div className="flex flex-col lg:flex-row lg:justify-between mx-6 lg:mx-2 flex-1 lg:flex-row  gap-8 my-8 ">
                        <User
                            cerrarSesion={() => router.push("/")}
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
                )}
            </main>}
        </div>
    )
}
