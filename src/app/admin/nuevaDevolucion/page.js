'use client'
import MyHeader from "../../components/MyHeader";
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import User from "../../components/User"
import LibrosReservadosSeleccion from "../../components/LibrosReservadosSeleccion"
import LibroSeleccion from "@/app/components/LibroSeleccion";

export default function nuevaDevolucion(){
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [libro, setLibro] = useState(null)
    const [users, setUsers] = useState(null)
    const [filtroNombre, setFiltroNombre] = useState("")
    const [moreUserData, setMoreUserData] = useState()
    const [loading, setLoading] = useState(true)
    const [mostrarLista, setMostrarLista] = useState(false)

    useEffect(() => {
        async function fetchDataUsers() {
            const res = await fetch("/api/users");
            
            if (!res.ok) {
                alert("Ha ocurrido un error. Inténtelo de nuevo más tarde.")
                router.push("../admin")
                return
            }
            const data = await res.json()
            setUsers(data)
            setLoading(false)
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

        let totalLibrosPrestados = 0
        data.historial.forEach(libro => {
            if (libro.condicion !== "reservado") {
                totalLibrosPrestados++
            }
        })
        totalLibrosPrestados += data.librosEnPosesion.length

        const hoy = new Date()
        const fechaPenalizacion = new Date(userSeleccionado.fecha_penalizacion)
        hoy.setHours(0, 0, 0, 0)
        const penalizado = hoy < fechaPenalizacion

        setMoreUserData({ ...data, totalLibrosPrestados, penalizado })
    }

    function handleUserSelect(user) {
        handleSelectUser(user)
        setFiltroNombre(user.nombre)
        setMostrarLista(false)
    }

    if (loading) return null

    const usuariosFiltrados = users?.filter(u =>
        u.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    )

    async function realizarDevolucion(){
        
    }

    return <div className="min-h-screen bg-[var(--aliceBlue)]">
        <MyHeader></MyHeader>
        <main className="p-4 pt-1 flex flex-col lg:flex-row pb-10 lg:gap-4">
            <div id="buscarUser" className="flex flex-col">
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
                <div className="m-6">
                    {!moreUserData? 
                    <p className="text-[var(--chamoise)] text-center">Usuario no seleccionado</p>: 
                    <User
                        admin={true}
                        moreUserData={moreUserData}
                        user={user}
                    />}
                </div>
            </div>
            <div id="col2" className="flex flex-col">
                <div id="librosPosesion">

                </div>
                <div id="formulario">

                </div>
            </div>
            <hr className="border-t-2 border-[var(--paynesGray)] m-12 lg:hidden" />
            <div id="resumenfinal" className="flex flex-col text-[var(--paynesGray)] pl-4 gap-6 lg:justify-between lg:min-h-[70vh] lg:pt-6">
                <div id="seleccionados" className="font-admin flex flex-col gap-2">
                    <div className="flex flex-col text-xl ">
                        <p>Usuario seleccionado</p>
                        <p className="ml-6 text-[var(--cafeNoir)] text-lg">{user? user.nombre: "Sin seleccionar"}</p>
                    </div>
                    <div className="flex flex-col text-xl">
                        <p>Libro seleccionado</p>
                        <p className="ml-6 text-[var(--cafeNoir)] text-lg">{libro? libro.titulo: "Sin seleccionar"}</p>
                    </div>
                </div>
                <div id="penalizacion" className="flex flex-col items-end">
                    
                </div>
                <div id="botonFinal" className="font-admin flex justify-end">
                    <button onClick={realizarDevolucion} className="text-xl px-6 py-2 rounded font-bold bg-[var(--columbiaBlue)] rounded-3xl">
                        Finalizar devolución
                    </button>
                </div>
            </div>
        </main>
    </div>    
}