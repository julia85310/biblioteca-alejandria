import Footer from "./components/footer"
import Header from "./components/header"
import { useState } from "react"

export default function Home() {
  const [eventos, setEventos] = useState([])

  return <div className="w-[100vw] flex flex-col">
    <Header ubiHeader="Home"></Header>
    <main className="flex-1 flex flex-col lg:flex-row">
      <p className="lg:hidden block">Bienvenido a nuestra querida biblioteca</p>
      <div id="eventos">
        {!eventos && <p>La sala de eventos está en pausa. ¡Vuelve pronto a hojear nuevas actividades!</p>}
        {eventos.map((evento) => {
          const fecha = new Date(evento.fecha);
          const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          return <div key={evento.id}>
            <img src={evento.imagen_url} alt="Imagen del evento"></img>
            <p>{fechaFormateada}</p>
            <p>evento.descripcion</p>
            <p>evento.titulo</p>
          </div>
        })}
      </div>
      <div id="descripcion">
        <p className="lg:block hidden">Bienvenido a nuestra querida biblioteca</p>
        <p>Con 70 años de historia, somos un espacio dedicado al conocimiento y al entretenimiento, con un catálogo muy amplio que abarca desde literatura clásica hasta ciencia, arte, historia y mucho más.<br/>
          Estamos ubicados en Calle de los Álamos, 42, Villa Nieve, donde los libros siguen cobrando vida cada día. Desde esta página puedes explorar nuestro catálogo, reservar ejemplares y consultar si tienes libros pendientes de devolución, para que otras personas también puedan disfrutarlos.<br/>
          Además, organizamos eventos culturales, talleres y encuentros literarios que mantienen viva la biblioteca y fomentan la pasión por la lectura.<br/>
          ¡Descubre tu próximo libro con nosotros!</p><br/>
      </div>
    </main>
    <Footer></Footer>
  </div>
}
