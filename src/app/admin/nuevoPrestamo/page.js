'use client'
import MyHeader from "../../components/MyHeader";
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import User from "../../components/User"
import LibrosReservadosSeleccion from "../../components/LibrosReservadosSeleccion"
import LibroSeleccion from "@/app/components/LibroSeleccion";
import Loader from "@/app/components/loader/Loader";
import { parseDateWithoutTimezone } from "@/app/libs/libro";

export default function nuevoPrestamo(){
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [allLibros, setAllLibros] = useState([]);
    const [libros, setLibros] = useState([]);
    const [libro, setLibro] = useState(null)
    const [users, setUsers] = useState(null)
    const [filtroNombre, setFiltroNombre] = useState("")
    const [filtroLibro, setFiltroLibro] = useState("")
    const [moreUserData, setMoreUserData] = useState()
    const [loading, setLoading] = useState(true)
    const [mostrarLista, setMostrarLista] = useState(false)
    const [fechaDev, setFechaDev] = useState("")
    const [reservadoSeleccionado, setReservadoSeleccionado] = useState(null)

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
            if(libros){
               setLoading(false) 
            }
        }
        async function fetchDataLibros() {
            const res = await fetch("/api/libro?d=1");
            console.log(res)
            if(!res.ok){
                alert("Ha ocurrido un error. Intentelo de nuevo mas tarde")
                router.push("../admin")
                return
            }
            const data = await res.json();
            const librosDisponibles = data.filter(libro => libro.disponibilidad == "Disponible")
            setLibros(librosDisponibles)
            setAllLibros(librosDisponibles)
            if(users){
               setLoading(false) 
            }
        }
        fetchDataLibros();
        fetchDataUsers()
    }, [])

    useEffect(() => {
        let filtrados = [...allLibros];
        if (filtroLibro) {
            filtrados = filtrados.filter(libro =>
                libro.titulo.toLowerCase().includes(filtroLibro.toLowerCase())
            );
        }
        setLibros(filtrados);
    }, [filtroLibro, allLibros]);

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
        const fechaPenalizacion = parseDateWithoutTimezone(userSeleccionado.fecha_penalizacion)
        hoy.setHours(0, 0, 0, 0)
        const penalizado = hoy < fechaPenalizacion

        console.log('moreuserdata:', { ...data, totalLibrosPrestados, penalizado })
        setMoreUserData({ ...data, totalLibrosPrestados, penalizado })
    }

    function handleUserSelect(user) {
        setLoading(true)
        handleSelectUser(user)
        setFiltroNombre(user.nombre)
        setLibro(null)
        setFechaDev("")
        setMostrarLista(false)
        setLoading(false)
    }

    function handleSelectLibro(libro, user_libro) {
        setLibro(libro);

        const fechaDev = new Date(); 
        fechaDev.setDate(fechaDev.getDate() + libro.dias_prestamo -1);
        console.log(fechaDev)

        const dia = String(fechaDev.getDate()).padStart(2, '0');
        const mes = String(fechaDev.getMonth() + 1).padStart(2, '0'); 
        const anio = fechaDev.getFullYear();

        const fechaFormateada = `${dia}/${mes}/${anio}`;

        setFechaDev(fechaFormateada);
        console.log(libro);

        if(user_libro){
            setReservadoSeleccionado(user_libro)
        }else{
            setReservadoSeleccionado(null)
        }
    }


    const usuariosFiltrados = users?.filter(u =>
        u.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    )

    async function realizarPrestamo(){
        if(!user){
            alert("Selecciona el usuario desde el buscador de nombres.")
            return
        }
        if(!libro){
            alert("Selecciona el libro pulsando \"Seleccionar\".")
            return
        }

        try {
            setLoading(true)
            let response;
            if (reservadoSeleccionado){
                response = await fetch("/api/prestamo", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        reservadoSeleccionado
                    }),
                });
            }else{
                response = await fetch("/api/prestamo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        dias_prestamo: libro.dias_prestamo,
                        user: user.id,
                        libro: libro.id
                    }),
                });
            }
    
            const data = await response.json();
    
            if (response.status === 200) {
                alert("Préstamo realizado con éxito.")
                router.push("../admin")
            } else {
                setLoading(false)
                alert(typeof data.error === 'string' ? data.error : data.error.message || "Error desconocido");
            }
        } catch {
            alert("Ha ocurrido un error realizando la reserva. Inténtelo de nuevo más tarde.");
        }
    }

    return <div className="min-h-screen bg-[var(--aliceBlue)]">
        {!loading && <MyHeader></MyHeader>}
        {loading? 
            <Loader tailwind="w-screen h-[90vh]"></Loader>:
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
            <div id="libros" className="flex flex-col">
                {allLibros.length > 0? 
                <div id="catalogo" className="flex-1 flex flex-col">
                    <div id="buscador" className="flex justify-start w-[250px] ml-4">
                        <div className="bg-[var(--darkAliceBlue)] w-full flex border-[var(--chamoise)] border rounded-2xl py-1 px-2">
                            <img className="w-4 object-contain mx-2" src="/iconos/lupa_icon.png" />
                            <input 
                            type="text"
                            value={filtroLibro}
                            className="placeholder-[var(--lion)] text-sm md:text-base w-full" 
                            placeholder="Buscar por título" 
                            onChange={(e) => setFiltroLibro(e.target.value)}
                            />
                        </div>
                        </div>
                    <div id="libros" className={`${libros.length == 0 && "hidden"}`}>
                        <div className="pr-4 my-4 overflow-y-auto grid grid-cols-2 gap-3 max-h-[50vh] lg:max-h-[40vh]">
                            {libros.map((libroMap) =>
                                <LibroSeleccion
                                    key={libroMap.id}
                                    libroDado={libroMap}
                                    handleSeleccion={handleSelectLibro}
                                    idSeleccionado={libro?.id}
                                ></LibroSeleccion>
                            )}
                        </div>
                    </div>
                </div>:
                <p>La biblioteca no cuenta con libros. Añade libros <b onClick={() => router.push("../admin/addLibro")}><u>aquí</u></b>.</p>
                }
                {moreUserData && 
                <LibrosReservadosSeleccion
                    moreUserData={moreUserData}
                    handleSeleccion={handleSelectLibro}
                    idSeleccionado={libro?.id}
                    userName={user.nombre}
                    libroDado={null}
                ></LibrosReservadosSeleccion> }
            </div>
            <hr className="border-t-2 border-[var(--paynesGray)] m-12 lg:hidden" />
            <div id="resumenfinal" className="flex flex-col text-[var(--paynesGray)] pl-4 gap-6 lg:justify-between lg:min-h-[70vh] lg:pt-14">
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
                <div id="fechaDev" className="flex flex-col items-end">
                    <p>Fecha de devolución</p>
                    <p className="text-3xl">{fechaDev? fechaDev: "DD/MM/AAAA"}</p>
                </div>
                <div id="botonFinal" className="font-admin flex justify-end">
                    <button onClick={realizarPrestamo} className="text-xl px-6 py-2 rounded font-bold bg-[var(--columbiaBlue)] rounded-3xl">
                        Finalizar préstamo
                    </button>
                </div>
            </div>
        </main>}
    </div>    
}