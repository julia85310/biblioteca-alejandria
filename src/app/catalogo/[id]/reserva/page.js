'use client'
import MyFooter from "@/app/components/MyFooter";
import MyHeader from "@/app/components/MyHeader";

import { AuthContext } from "@/app/contexts/AuthContext";
import { useContext, useState, use, useEffect } from "react";

export default function ReservaPage(props){
    const params = use(props.params);
    const id = params.id;
    const [libro, setLibro] = useState(null);
    const {user} = useContext(AuthContext);
    const [fechaAdquisicion, setFechaAdquisicion] = useState("DD/MM/AAAA")
    const [fechaDevolucion, setFechaDevolucion] = useState("DD/MM/AAAA")
    const [librosEnPropiedad, setLibrosEnPropiedad] = useState(0)
    const [librosEnReserva, setLibrosEnReserva] = useState(0)
    const [alertaHidden, setAlertaHidden] = useState(true)

    //hay que hacer comprobaciones de cuando hay errores con esto
    useEffect(() => {
        if (!user) return;
        async function fetchDataLibro() {
            const res = await fetch("/api/libro?id=" + id);
            const data = await res.json();
            setLibro(data)
        }

        async function fetchDataUser() {
            const res = await fetch("/api/userdata?u=" + user.id);
            const data = await res.json();
            setLibrosEnPropiedad(data.librosEnPosesion)
            setLibrosEnReserva(data.librosReservados)
            console.log(data)
        }

        fetchDataUser();
        fetchDataLibro(); 
    }, [user])

    function reservar(){

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
                                    <p>{fechaAdquisicion}</p>
                                </div>
                            </div>
                            <div id="fechaDevolucion" className="flex flex-col">
                                <p>Fecha de devolución</p>
                                <p>{fechaDevolucion}</p>
                            </div>
                        </div>
                    </div>
                    <div id="calendario" className="flex flex-col">
                        <p>Seleccionar la fecha de adquisición</p>
                        {/*calendario aqui*/}
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
                                        <p>{fechaAdquisicion}</p>
                                    </div>
                            </div>
                            <div id="fechaDevolucion" className="flex flex-col">
                                <p>Fecha de devolución</p>
                                <p>{fechaDevolucion}</p>
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