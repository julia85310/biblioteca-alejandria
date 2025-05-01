'use client'
import Footer from "./components/Footer"
import Header from "./components/Header"
import Evento from "./components/Evento"
import { useState, useEffect } from "react"

export default function Home() {
  const [eventos, setEventos] = useState([])
  const [indexEvento, setIndexEvento] = useState(1)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/evento");
      const data = await res.json();
      setEventos(data)
      console.log(data)
    }
  
    fetchData(); 
  }, []);

  function nextEvento(){
    if(indexEvento == eventos.length){
      setIndexEvento(1)
    }else{
      setIndexEvento(indexEvento+1)
    }
  }

  function previousEvento(){
    if(indexEvento == 1){
      setIndexEvento(eventos.length)
    }else{
      setIndexEvento(indexEvento-1)
    }
  }

  return <div className="w-[100vw] flex flex-col">
    <Header ubiHeader="Home"></Header>
    <main className="flex-1 flex flex-col lg:flex-row">
      <h2 className="lg:hidden block">Bienvenido a nuestra querida biblioteca</h2>
      <div id="eventos">
        {!eventos? 
          <p>La sala de eventos está en pausa. ¡Vuelve pronto a hojear nuevas actividades!</p>:
          <div className="flex flex-row items-center">
            <img src="/iconos/icono-flecha.png" className="w-6 h-6 rotate-180" onClick={previousEvento}></img>
            {eventos.map((evento) => {
              if(evento.id == indexEvento){
                return <Evento key={evento.id} evento={evento}></Evento>
              }
            })}
            <img className="w-6 h-6" src="/iconos/icono-flecha.png" onClick={nextEvento}></img>
          </div>
        }
      </div>
      <div id="descripcion">
        <h2 className="lg:block hidden">Bienvenido a nuestra querida biblioteca</h2>
        <p>Con 70 años de historia, somos un espacio dedicado al conocimiento y al entretenimiento, con un catálogo muy amplio que abarca desde literatura clásica hasta ciencia, arte, historia y mucho más.<br/>
          Estamos ubicados en Calle de los Álamos, 42, Villa Nieve, donde los libros siguen cobrando vida cada día. Desde esta página puedes explorar nuestro catálogo, reservar ejemplares y consultar si tienes libros pendientes de devolución, para que otras personas también puedan disfrutarlos.<br/>
          Además, organizamos eventos culturales, talleres y encuentros literarios que mantienen viva la biblioteca y fomentan la pasión por la lectura.<br/>
          ¡Descubre tu próximo libro con nosotros!</p><br/>
      </div>
    </main>
    <Footer></Footer>
  </div>
}
