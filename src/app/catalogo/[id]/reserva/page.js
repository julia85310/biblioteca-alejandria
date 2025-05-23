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
            setLibrosEnPropiedad(data.librosEnPosesion)
            setLibrosEnReserva(data.librosReservados)
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
    
    return <div>
        <MyHeader></MyHeader>
        {libro? <main className="flex flex-col">
            <div className="flex flex-col lg:flex-row">
                <div id="infoLibro" className="flex flex-col">
                    <h1><b>Reserva de <i>{libro.titulo}</i></b></h1>
                    <div className="flex flex-row">
                        <div id="imgydescrip" className="flex flex-col">
                            <div id="imgydescripMovil" className="flex flex-row">
                                <img src={libro.imagen_url}></img>
                                <div id="descrip" className="flex flex-col">
                                    <div className="flex flex-col">
                                        <p>Editorial: {libro.editorial}</p>
                                        <p>Autor: {libro.autor}</p>
                                    </div>
                                    <div id="importanteMovil" className="lg:hidden flex flex-col">
                                        <b>IMPORTANTE: </b> Si usted pierde o deteriora el libro, 
                                        su reposición corre a su cuenta por el costo de {libro.valor}€
                                    </div>
                                </div>
                            </div>
                            <div id="importanteOrdenador" className="hidden lg:block">
                                <b>IMPORTANTE: </b> Si usted pierde o deteriora el libro, 
                                su reposición corre a su cuenta por el costo de {libro.valor}€
                            </div>
                        </div>
                        <div id="alertaOrdenador" className={`hidden lg:${alertaHidden? "hidden": "block"}`}>
                            Plazo de dos días incluyendo la fecha de adquisición para recoger el libro en la biblioteca
                        </div>
                    </div>
                </div>
                <div id="useryreservainfo" className="flex flex-col lg:flex-row">
                    <div id="userInfoyPCFecha" className="flex flex-col">
                        <div id="userInfo" className="flex flex-col">
                            <p>Usuario: {user.nombre} </p>
                            <p>Libros en propiedad: {librosEnPropiedad}</p>
                            <p>Libros en reserva: {librosEnReserva}</p>
                        </div>
                        <div id="fechasPC" className="lg:flex flex-col hidden">
                            <div id="fechaAdquisicion" className="flex flex-row">
                                <button id="alertaButton" onClick={() => setAlertaHidden(!alertaHidden)}>!</button>
                                <div className="flex flex-col">
                                    <p>Fecha de adquisición</p>
                                    <p>{fechaAdquisicion? format(fechaAdquisicion, 'dd/MM/yyyy'): "DD/MM/AAAA"}</p>
                                </div>
                            </div>
                            <div id="fechaDevolucion" className="flex flex-col">
                                <p>Fecha de devolución</p>
                                <p>{fechaDevolucion? format(fechaDevolucion, 'dd/MM/yyyy'): "DD/MM/AAAA"}</p>
                            </div>
                        </div>
                    </div>
                    <div id="calendario" className="flex flex-col">
                        <p>Seleccionar la fecha de adquisición</p>
                        <CalendarSelectFecha 
                            handleDateClick={handleClickCalendarDay}
                            intervalosRestringidos={intervalosRestringidos}
                            diasLibro={libro.dias_prestamo}
                        ></CalendarSelectFecha>
                    </div>
                    <div id="fechasyMovilAlerta" className="flex flex-row">
                        <div id="alertaMovil" className={`${alertaHidden? "hidden": "block"} lg:hidden`}>
                            Plazo de dos días incluyendo la fecha de adquisición para recoger el libro en la biblioteca
                        </div>
                        <div id="fechasMovil" className="lg:hidden flex flex-col">
                            <div id="fechaAdquisicion" className="flex flex-row">
                                    <button id="alertaButton" onClick={() => setAlertaHidden(!alertaHidden)}>!</button>
                                    <div className="flex flex-col">
                                        <p>Fecha de adquisición</p>
                                        <p>{fechaAdquisicion? format(fechaAdquisicion, 'dd/MM/yyyy'): "DD/MM/AAAA"}</p>
                                    </div>
                            </div>
                            <div id="fechaDevolucion" className="flex flex-col">
                                <p>Fecha de devolución</p>
                                <p>{fechaDevolucion? format(fechaDevolucion, 'dd/MM/yyyy'): "DD/MM/AAAA"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button id="FinalizarReserva" onClick={reservar}>Finalizar Reserva</button>
        </main>: <main>Libro no encontrado</main>}
        <MyFooter></MyFooter>
    </div>
}