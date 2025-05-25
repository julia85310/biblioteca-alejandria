'use client'
import MyFooter from "./components/MyFooter"
import MyHeader from "./components/MyHeader"
import Evento from "./components/Evento"
import { useState, useEffect } from "react"

export default function Home() {
  const [eventos, setEventos] = useState([])
  const [indexEvento, setIndexEvento] = useState(1)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/evento");
      if(!res.ok){
          alert("Ha ocurrido un error cargando los eventos. Intentelo de nuevo mas tarde")
          return
      }
      const data = await res.json();
      setEventos(data)
      console.log(data)
    }
  
    fetchData(); 
  }, []);

  return <div className="lg:h-[100vh] w-[100%] h-[100%] flex flex-col bg-[var(--seashell)] ">
    <MyHeader ubiHeader="Home"></MyHeader>
    <main className="flex-1 flex flex-col lg:flex-row justify-around px-2">
      <h2 className="lg:hidden block font-bold text-xl ml-6 mt-2">Bienvenido a nuestra <br/> querida biblioteca</h2>
      <div id="eventos">
        {!eventos? 
          <p>La sala de eventos está en pausa. ¡Vuelve pronto a hojear nuevas actividades!</p>:
          <div className="flex flex-row items-center">
            <img src="/iconos/icono-flecha.png" className={`mr-2 ${indexEvento == 1 && "invisible"} w-6 h-6 rotate-180`} onClick={() => setIndexEvento(indexEvento-1)}></img>
            {eventos.map((evento) => {
              if(evento.id == indexEvento){
                return <Evento key={evento.id} evento={evento}></Evento>
              }
            })}
            <img className={`${indexEvento == eventos.length && "invisible"} w-6 h-6`} src="/iconos/icono-flecha.png" onClick={() => setIndexEvento(indexEvento+1)}></img>
          </div>
        }
      </div>
      <div id="descripcion" className="px-10 lg:ml-8">
        <h2 className="lg:block hidden lg:pl-4 lg:text-xl"><b>Bienvenido a nuestra <br/> querida biblioteca</b></h2>
        <p className="lg:text-start text-center px-4 py-6 lg:text-xs"><b>Con 70 años de historia</b>, somos un espacio dedicado al conocimiento y al entretenimiento, con un catálogo muy amplio que abarca desde literatura clásica hasta ciencia, arte, historia y mucho más.<br/><br/>
          Estamos ubicados en <b>Calle de los Álamos, 42, Villa Nieve</b>, donde los libros siguen cobrando vida cada día. Desde esta página puedes explorar nuestro catálogo, <b>reservar</b> ejemplares y <b>consultar</b> si tienes libros pendientes de devolución, para que otras personas también puedan disfrutarlos.<br/><br/>
          Además, organizamos <b>eventos</b> culturales, talleres y encuentros literarios que mantienen viva la biblioteca y fomentan la pasión por la lectura.<br/><br/>
          <b>¡Descubre tu próximo libro con nosotros!</b>
        </p>
      </div>
    </main>
    <MyFooter></MyFooter>
  </div>
}
