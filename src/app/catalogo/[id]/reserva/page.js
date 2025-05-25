'use client'
import CalendarSelectFecha from "@/app/components/CalendarSelectFecha";
import MyFooter from "@/app/components/MyFooter";
import MyHeader from "@/app/components/MyHeader";

import { format } from 'date-fns';
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/contexts/AuthContext";
import { useContext, useState, use, useEffect } from "react";

export default function ReservaPage(props){
    const router = useRouter();
    const params = use(props.params);
    const id = params.id;
    const [libro, setLibro] = useState(null);
    const {user} = useContext(AuthContext);
    const [fechaAdquisicion, setFechaAdquisicion] = useState('')
    const [fechaDevolucion, setFechaDevolucion] = useState('')
    const [librosEnPropiedad, setLibrosEnPropiedad] = useState(0)
    const [librosEnReserva, setLibrosEnReserva] = useState(0)
    const [alertaHidden, setAlertaHidden] = useState(true)
    const [intervalosRestringidos, setIntervalosRestrigidos] = useState([])

    useEffect(() => {
        async function fetchDataLibro() {
            const res = await fetch("/api/libro?id=" + id);
            if(!res.ok){
                alert("Ha ocurrido un error. Intentelo de nuevo mas tarde")
                router.push("/catalogo")
                return
            }
            const data = await res.json();
            setLibro(data)
        }
        fetchDataLibro();
    }, [])


    useEffect(() => {
        if (!libro) return;
        async function fetchIntervaloLiboOcupado(){
            const res = await fetch("/api/reserva?l=" + libro.id);
            if(!res.ok){
                alert("Ha ocurrido un error. Intentelo de nuevo mas tarde")
                router.push("/catalogo")
                return
            }
            const data = await res.json();
            setIntervalosRestrigidos(data)
            console.log("Intervalos restringidos")
            console.log(data)
        }
        
        fetchIntervaloLiboOcupado()
        
    }, [libro])

    useEffect(() => {
        if (!user) return;

        async function fetchDataUser() {
            const res = await fetch("/api/userdata?u=" + user.id);
            if(!res.ok){
                alert("Ha ocurrido un error. Intentelo de nuevo mas tarde")
                router.push("/catalogo")
                return
            }
            const data = await res.json();
            setLibrosEnPropiedad(data.librosEnPosesion.length)
            setLibrosEnReserva(data.librosReservados.length)
            console.log("moreuserdata:")
            console.log(data)
        }
        fetchDataUser();
         
    }, [user])

    async function reservar(){
        if (!fechaAdquisicion || !fechaDevolucion){
            alert("Selecciona la fecha en la que deseas adquirir el libro.")
            return
        }
        const body = {
            usuario: user.id,
            libro: libro.id,
            fecha_adquisicion: fechaAdquisicion,
            fecha_devolucion: fechaDevolucion
        }   
        console.log(body)
        try {
            const response = await fetch("/api/reserva", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
    
            const data = await response.json();
    
            if (response.status === 200) {
                alert("Reserva realizada con éxito. ¡Gracias!")
                router.push("/catalogo")
            } else {
                alert(data.error);
            }
        } catch {
            alert("Ha ocurrido un error realizando la reserva. Inténtelo de nuevo más tarde.");
        }
    }

    function handleClickCalendarDay(fechaInicio, fechaFin) {
        setFechaAdquisicion(fechaInicio);
        setFechaDevolucion(fechaFin);
    }
    
    return <div className="min-h-[100vh] flex flex-col">
        <MyHeader></MyHeader>
        {libro? <main className="flex-1 flex flex-col bg-[var(--seashell)] lg:pt-4">
            <div className="flex flex-col lg:flex-row mx-6 gap-4 lg:justify-between lg:gap-2">
                <div id="infoLibro" className="flex flex-col gap-4 lg:ml-6">
                    <h1 className="text-xl lg:ml-14"><b>Reserva de <i>{libro.titulo}</i></b></h1>
                    <div className="flex flex-row ml-4 relative">
                        <div id="imgydescrip" className="flex flex-col lg:gap-4 ">
                            <div id="imgydescripMovil" className="flex flex-row gap-5 ">
                                <img className="object-contain w-[37vw] lg:w-[14vw]" src={libro.imagen_url}></img>
                                <div id="descrip" className="flex flex-col justify-between my-4">
                                    <div className="flex flex-col text-xs gap-2 lg:text-sm">
                                        <div className="flex gap-2"><p className="text-[var(--chamoise)]">Editorial:</p><p>{libro.editorial}</p></div>
                                        <div className="flex gap-2"><p className="text-[var(--chamoise)]">Autor:</p><p> {libro.autor}</p></div>
                                    </div>
                                    <div id="importanteMovil" className="lg:hidden flex flex-col text-sm text-[var(--chamoise)] mr-10">
                                        <b>IMPORTANTE: </b> Si usted pierde o deteriora el libro, 
                                        su reposición corre a su cuenta por el costo de <b className="text-[var(--cafeNoir)]">{libro.valor}€</b>
                                    </div>
                                </div>
                            </div>
                            <div id="importanteOrdenador" className="lg:w-[35vw] ml-1 hidden lg:block flex-col text-[var(--chamoise)] mr-10">
                                <b>IMPORTANTE: </b> Si usted pierde o deteriora el libro, 
                                su reposición corre a su cuenta por el costo de <b className="text-[var(--cafeNoir)]">{libro.valor}€</b>
                            </div>
                        </div>
                        <div id="alertaOrdenador" className={`hidden lg:${alertaHidden? "hidden": "block"} mr-[-2vw] absolute text-[var(--seashell)] text-sm bg-[var(--lion)] rounded-xl  ml-4 flex justify-center p-4 w-[12vw] text-xs bottom-4 right-0`}>
                            <p>Plazo de <b>dos días</b> incluyendo la fecha de adquisición para recoger el libro en la biblioteca</p>
                        </div>
                    </div>
                </div>
                <div id="useryreservainfo" className="flex flex-col lg:flex-row lg:justify-between">
                    <div id="userInfoyPCFecha" className="flex flex-col p-4 lg:justify-between">
                        <div id="userInfo" className="flex flex-col gap-1">
                            <div className="flex gap-2"><p className="text-[var(--chamoise)]">Usuario:</p> <p>{user.nombre} </p></div>
                            <div className="flex gap-2"><p className="text-[var(--chamoise)]">Libros en propiedad:</p><p>  {librosEnPropiedad}</p></div>
                            <div className="flex gap-2"><p className="text-[var(--chamoise)]">Libros en reserva: </p> <p>{librosEnReserva}</p></div>
                        </div>
                        <div id="fechasPC" className="lg:flex flex-col hidden text-[var(--chamoise)] gap-4 relative">
                            <div id="fechaAdquisicion" className="flex flex-row ">
                                <button className="left-[-2em] absolute mt-[1em]  text-white bg-[var(--chamoise)] px-[0.6em] rounded-2xl" id="alertaButton" 
                                onClick={(e) => {
                                    // Solo permitir onClick en pantallas pequeñas
                                    if (window.innerWidth < 1024) {
                                        setAlertaHidden(!alertaHidden);
                                    }
                                }}
                                onMouseEnter={() => {
                                    // Solo activar onHover en pantallas grandes
                                    if (window.innerWidth >= 1024) {
                                        setAlertaHidden(false);
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (window.innerWidth >= 1024) {
                                        setAlertaHidden(true);
                                    }
                                }}
                                >!</button>
                                <div className="flex flex-col">
                                    <p>Fecha de adquisición</p>
                                    <p className="text-3xl">{fechaAdquisicion? format(fechaAdquisicion, 'dd/MM/yyyy'): "DD/MM/AAAA"}</p>
                                </div>
                            </div>
                            <div id="fechaDevolucion" className="flex flex-col">
                                <p>Fecha de devolución</p>
                                <p className="text-3xl">{fechaDevolucion? format(fechaDevolucion, 'dd/MM/yyyy'): "DD/MM/AAAA"}</p>
                            </div>
                        </div>
                    </div>
                    <div id="calendario" className="flex flex-col my-6 ml-8 lg:my-0">
                        <div className=" flex flex-col ml-[-1em] font-bold text-[var(--chamoise)] text-xl lg:text-right lg:mr-4"><p>Selecciona</p><p className="mt-[-0.3em]"> la fecha de adquisición</p></div>
                        <CalendarSelectFecha 
                            handleDateClick={handleClickCalendarDay}
                            intervalosRestringidos={intervalosRestringidos}
                            diasLibro={libro.dias_prestamo}
                        ></CalendarSelectFecha>
                    </div>
                    <div id="fechasyMovilAlerta" className="flex flex-row justify-end">
                        <div id="alertaMovil" className={`${alertaHidden? "hidden": "block"} lg:hidden text-[var(--seashell)] text-sm bg-[var(--lion)] rounded-xl mr-10 ml-4 flex justify-center p-4`}>
                            <p>Plazo de <b>dos días</b> incluyendo la fecha de adquisición para recoger el libro en la biblioteca</p>
                        </div>
                        <div id="fechasMovil" className="lg:hidden flex flex-col text-[var(--chamoise)] gap-4">
                            <div id="fechaAdquisicion" className="flex flex-row relative">
                                    <button className="left-[-2em] absolute mt-[1em]  text-white bg-[var(--chamoise)] px-[0.6em] rounded-2xl" id="alertaButton" onClick={() => setAlertaHidden(!alertaHidden)}>!</button>
                                    <div className="flex flex-col">
                                        <p className="text-lg flex">Fecha de adquisición</p>
                                        <p className="text-3xl">{fechaAdquisicion? format(fechaAdquisicion, 'dd/MM/yyyy'): "DD/MM/AAAA"}</p>
                                    </div>
                            </div>
                            <div id="fechaDevolucion" className="flex flex-col">
                                <p className="text-lg flex">Fecha de devolución</p>
                                <p className="text-3xl">{fechaDevolucion? format(fechaDevolucion, 'dd/MM/yyyy'): "DD/MM/AAAA"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end my-8 mr-4 lg:mt-0">
                <button id="finalizarReserva" onClick={reservar} className="lg:px-4 lg:text-base px-5 py-1 rounded-3xl text-xl text-white bg-[var(--chamoise)] ">Finalizar Reserva</button>
            </div>
        </main>: <main>Libro no encontrado</main>}
        <MyFooter></MyFooter>
    </div>
}