'use client'
import MyHeader from "../../components/MyHeader";
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import User from "../../components/User"
import LibrosPosesionSeleccion from "@/app/components/LibrosPosesionSeleccion";
import Loader from "@/app/components/loader/Loader";

export default function nuevaDevolucion(){
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [libro, setLibro] = useState(null)
    const [user_libro, setUser_libro] = useState(null)
    const [users, setUsers] = useState(null)
    const [filtroNombre, setFiltroNombre] = useState("")
    const [moreUserData, setMoreUserData] = useState()
    const [loading, setLoading] = useState(true)
    const [mostrarLista, setMostrarLista] = useState(false)

    const devolucionDataVacio = {
        diasAtraso: 0,
        penalizacionAtraso: false,
        condicionActual: '',
        penalizacionCondicion: false,
        diasPenalizacionAtraso: 0,
        diasPenalizacionCondicion: 0,
        diasPenalizacionTotal: 0
    };

    const [devolucionData, setDevolucionData] = useState(devolucionDataVacio)
    
    useEffect(() => {
        let diasTotales = 0;
        if(devolucionData.penalizacionAtraso){
            diasTotales += Number(devolucionData.diasPenalizacionAtraso)
        }
        if(devolucionData.penalizacionCondicion){
            diasTotales += Number(devolucionData.diasPenalizacionCondicion)
        }
        setDevolucionData({...devolucionData, diasPenalizacionTotal: diasTotales})
    }, [devolucionData.penalizacionAtraso, devolucionData.penalizacionCondicion, devolucionData.diasPenalizacionCondicion])

    const aplicadoRef = useRef(false);

    //cuando escribes una nueva condicion
    useEffect(() => {
        //solo se aplica la primera vez que se escribe 
        if (aplicadoRef.current == false){
            aplicadoRef.current = true
            if (devolucionData.diasPenalizacionCondicion == 0){
                setDevolucionData({...devolucionData, penalizacionCondicion: true, diasPenalizacionCondicion: 3}) //por defecto
            }else{
                setDevolucionData({...devolucionData, penalizacionCondicion: true})
            }
        }
        //se resetea la primera vez
        if(devolucionData.condicionActual == ''){
            aplicadoRef.current = false
            setDevolucionData({...devolucionData, penalizacionCondicion: false})
        }
    }, [devolucionData.condicionActual])

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
            const timer = setTimeout(() => {
                setLoading(false)
            }, 700);
            return () => clearTimeout(timer);
        }
        fetchDataUsers()
    }, [])

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0);


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
        const penalizado = hoy < fechaPenalizacion

        setMoreUserData({ ...data, totalLibrosPrestados, penalizado })
        console.log('moreUserData: ', { ...data, totalLibrosPrestados, penalizado })
    }

    function handleUserSelect(user) {
        setLoading(true)
        handleSelectUser(user)
        setFiltroNombre(user.nombre)
        setMostrarLista(false)
        setLibro(null)
        setUser_libro(null)
        setDevolucionData(devolucionDataVacio)
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }

    const usuariosFiltrados = users?.filter(u =>
        u.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    )

    async function realizarDevolucion(){
        if(!user){
            alert("Selecciona el usuario desde el buscador de nombres.")
            return
        }
        if(!libro){
            alert("Selecciona el libro pulsando \"Seleccionar\".")
            return
        }
        if(!user_libro){
            alert("Ha ocurrido un error. Inténtalo más tarde.")
            return
        }
        try {
            setLoading(true)
            let nuevaCondicion;
            if (devolucionData.condicionActual != libro.condicion){
                nuevaCondicion = devolucionData.condicionActual
            }else{
                nuevaCondicion = libro.condicion
            }
            
            const body = {
                dias_penalizacion: devolucionData.diasPenalizacionTotal,
                condicion_nueva: nuevaCondicion,
                libro: libro.id,
                user_libro_id: user_libro.id,
                usuario: user_libro.usuario
            }
            console.log('body: ', body)
            const response = await fetch("/api/devolucion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
    
            const data = await response.json();
    
            if (response.status === 200) {
                alert("Devolución realizada con éxito.")
                router.push("../admin")
            } else {
                setLoading(false)
                alert("Ha ocurrido un error realizando la reserva. Inténtelo de nuevo más tarde.");
            }
        } catch {
            setLoading(false)
            alert("Ha ocurrido un error realizando la reserva. Inténtelo de nuevo más tarde.");
        }
    }

    function handleSelectLibro(libro, user_libro) {
        setLibro(libro);
        setUser_libro(user_libro)


        //Calculo de los dias de atraso
        const fechaDevolucion = new Date(user_libro.fecha_devolucion);
        let diferenciaMs = hoy - fechaDevolucion;
        if (diferenciaMs < 0){
            diferenciaMs = 0
        }
        const diasAtraso = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));    
        
        setDevolucionData(prev => ({
            ...prev,
            diasAtraso: diasAtraso,
            diasPenalizacionAtraso: diasAtraso * 3,
            penalizacionAtraso: diasAtraso > 0,
            diasPenalizacionTotal: diasAtraso * 3,
        }));
        console.log('dias atraso: ' + diasAtraso)
    }

    


    return <div className="min-h-screen bg-[var(--aliceBlue)]">
        {!loading && <MyHeader></MyHeader>}
        {loading? 
            <Loader tailwind="w-screen h-[90vh]"></Loader>:
            <main className="p-4 pt-1 flex flex-col lg:flex-row pb-10 lg:gap-1 justify-between">
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
            <div id="noUser" className="flex flex-col gap-16 lg:gap-4">
                <div id="posesionYSelecciones" className="flex flex-col lg:flex-row gap-10 lg:mt-6">
                    <div id="posesion">
                        {moreUserData && <LibrosPosesionSeleccion
                            handleSeleccion={handleSelectLibro}
                            idSeleccionado={libro?.id}
                            userName={user.nombre}
                            libroDado={null}
                            moreUserData={moreUserData}
                        ></LibrosPosesionSeleccion>}
                    </div>
                    <div id="seleccionados" className="font-admin flex flex-col gap-2 text-[var(--paynesGray)] items-end mr-4 text-end lg:text-start whitespace-nowrap">
                        <div className="flex flex-col lg:gap-5">
                        <div className="flex flex-col text-xl ">
                            <p>Usuario seleccionado</p>
                            <p className="ml-6 mr-6 text-[var(--cafeNoir)] text-lg ">{user? user.nombre: "Sin seleccionar"}</p>
                        </div>
                        <div className="flex flex-col text-xl">
                            <p>Libro seleccionado</p>
                            <p className="ml-6 mr-6 text-[var(--cafeNoir)] text-lg " >{libro? libro.titulo: "Sin seleccionar"}</p>
                        </div>
                        </div>
                    </div>
                </div>        
                {libro && <div id="forms" className="flex flex-col lg:flex-row font-admin text-[var(--paynesGray)] text-lg lg:text-base gap-10 mx-6">
                    <div id="izq" className="flex flex-col gap-4">
                        <div id="atraso" className="flex flex-col ">
                            <p className="text-xl">Días de atraso: {devolucionData.diasAtraso}</p>
                            {devolucionData.diasAtraso > 0 &&
                            <div className="flex text-[var(--columbiaBlue)] gap-2">
                                <input
                                    type="checkbox"
                                    checked={devolucionData.penalizacionAtraso}
                                    onChange={() => setDevolucionData({...devolucionData, penalizacionAtraso: !devolucionData.penalizacionAtraso})}
                                    className={`accent-[var(--columbiaBlue)] rounded p-2 w-4 h-4`}
                                ></input>
                                <p>Aplicar penalización por retraso</p>   
                            </div>}
                        </div>
                        <div id="condicion" className="flex flex-col gap-2">
                            <p>Condición anterior: {libro.condicion}</p>
                            <p>Condición actual:</p>
                            <input 
                                type="text" 
                                value={devolucionData.condicionActual} 
                                placeholder={libro.condicion} 
                                onChange={(e) => setDevolucionData({ ...devolucionData, condicionActual : e.target.value })} 
                                className="border rounded-xl border-[var(--columbiaBlue)] p-2 w-max-[50vw] ml-4" 
                            />
                            {devolucionData.condicionActual &&
                            <div className="flex text-[var(--columbiaBlue)] gap-2 items-center">
                                <input
                                    type="checkbox"
                                    checked={devolucionData.penalizacionCondicion}
                                    className={`accent-[var(--columbiaBlue)] rounded p-2 w-4 h-4`}
                                    onChange={() => setDevolucionData({...devolucionData, penalizacionCondicion: !devolucionData.penalizacionCondicion})}
                                ></input>
                                <p>Aplicar penalización por deterioro</p>   
                            </div>}
                        </div>
                    </div>
                    <div id="der" className="flex flex-col justify-end items-end text-end gap-4">
                        <div className="flex text-[var(--columbiaBlue)] flex-col gap-3">
                            <p>Días de penalizacion por retraso: {devolucionData.diasPenalizacionAtraso}</p>
                            <div className="flex gap-2 items-center">
                                <p>Días de penalización por deterioro: </p>
                                <input 
                                    type="number" 
                                    value={devolucionData.penalizacionCondicion? devolucionData.diasPenalizacionCondicion:0} 
                                    onChange={(e) => setDevolucionData({ ...devolucionData, diasPenalizacionCondicion : e.target.value })} 
                                    className="border rounded-xl border-[var(--columbiaBlue)] p-1 pl-2 w-18" 
                                />
                            </div>
                        </div>
                        <p className="text-xl font-bold">Días totales de penalización: {devolucionData.diasPenalizacionTotal}</p>
                        <button onClick={realizarDevolucion} className="text-xl px-6 my-6 py-2 rounded font-bold bg-[var(--columbiaBlue)] rounded-3xl">
                            Finalizar devolución
                        </button>
                    </div>
                </div>}
            </div>
        </main>}
    </div>    
}