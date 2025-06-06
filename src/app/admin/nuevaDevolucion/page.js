'use client'
import MyHeader from "../../components/MyHeader";
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import User from "../../components/User"
import LibrosPosesionSeleccion from "@/app/components/LibrosPosesionSeleccion";

export default function nuevaDevolucion(){
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [libro, setLibro] = useState(null)
    const [users, setUsers] = useState(null)
    const [filtroNombre, setFiltroNombre] = useState("")
    const [moreUserData, setMoreUserData] = useState()
    const [loading, setLoading] = useState(true)
    const [mostrarLista, setMostrarLista] = useState(false)
    const [devolucionData, setDevolucionData] = useState({
        diasAtraso: 0,
        penalizacionAtraso: false,
        condicionActual: null,
        penalizacionCondicion: false,
        diasPenalizacionAtraso: 0,
        diasPenalizacionCondicion: 0,
        diasPenalizaciionTotal: 0
    })
    const hoy = new Date()

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

    function handleSelectLibro(libro, user_libro) {
        setLibro(libro);
        const diasAtraso = 
        
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
            <div id="noUser" className="flex flex-col">
                <div id="posesionYSelecciones" className="flex flex-col lg:flex-row">
                    <div id="posesion">
                        {moreUserData && <LibrosPosesionSeleccion
                            handleSeleccion={handleSelectLibro}
                            idSeleccionado={libro?.id}
                            userName={user.nombre}
                            libroDado={null}
                            moreUserData={moreUserData}
                        ></LibrosPosesionSeleccion>}
                    </div>
                    <div id="seleccionados" className="font-admin flex flex-col gap-2 text-[var(--paynesGray)]">
                        <div className="flex flex-col text-xl ">
                            <p>Usuario seleccionado</p>
                            <p className="ml-6 text-[var(--cafeNoir)] text-lg">{user? user.nombre: "Sin seleccionar"}</p>
                        </div>
                        <div className="flex flex-col text-xl">
                            <p>Libro seleccionado</p>
                            <p className="ml-6 text-[var(--cafeNoir)] text-lg">{libro? libro.titulo: "Sin seleccionar"}</p>
                        </div>
                    </div>
                </div>        
                <div id="forms" className="flex flex-col lg:flex-row font-admin text-[var(--paynesGray)]">
                    <div id="izq" className="flex flex-col gap-3">
                        <div id="atraso">
                            <p>Días de atraso: {devolucionData.diasAtraso}</p>
                            {devolucionData.diasAtraso > 0 &&
                            <div className="flex text-[var(--columbiaBlue)] gap-2">
                                <input
                                    type="checkbox"
                                    checked={devolucionData.penalizacionAtraso}
                                    onChange={() => setDevolucionData({...setDevolucionData, penalizacionAtraso: !devolucionData.penalizacionAtraso})}
                                ></input>
                                <p>Aplicar penalización por retraso</p>   
                            </div>}
                        </div>
                        <div id="condicion" className="flex gap-2">
                            <p>Condición anterior: {libro.condicion}</p>
                            <p>Condición actual:</p>
                        </div>
                    </div>
                    <div id="der" className="flex flex-col items-end">
                        <button onClick={realizarDevolucion} className="text-xl px-6 py-2 rounded font-bold bg-[var(--columbiaBlue)] rounded-3xl">
                            Finalizar devolución
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>    
}