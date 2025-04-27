
export default function Evento({evento}){
    return <div>
        <img src={evento.imagen_url} alt="Imagen del evento"></img>
        <p>evento.fecha</p>
        <p>evento.descripcion</p>
        <p>evento.titulo</p>
    </div>
}