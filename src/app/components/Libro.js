
export default function Libro({libro, admin}){
    return <div>
        <img src="libro.imagen_url" alt={"Portada de " + libro.titulo}></img>
        <div>
            <p>{libro.titulo}</p>
            <p>{libro.autor}</p>
            <div>
                <div></div>
                <p>{libro.disponibilidad}</p>
            </div>
            <button>Reservar</button>
        </div>
    </div>
}