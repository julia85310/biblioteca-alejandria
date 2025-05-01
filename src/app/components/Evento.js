
export default function Evento({evento}){
    return <div className="relative w-fit">
        <div id="fondo" className="z-10 absolute top-0 left-20 right-0 bottom-0 bg-[var(--lion)] "></div>
        <div className="flex flex-col pr-4">
            <p className="relative z-20 text-end text-white mr-2 mt-5 text-sm">{evento.fechaFormateada}</p>
            <div className="flex flex-row">
                <img className="flex-shrink relative z-20 max-w-[22rem] h-auto object-contain" src={evento.imagen_url} alt="Imagen del evento"></img>
                <p className="elemento-con-scroll overflow-y-auto max-h-[15rem] min-w-[9rem] w-full whitespace-pre-line flex-1 relative z-20 text-[var(--seashell)] text-[0.55rem] leading-loose ml-4 mt-6 mr-8">{evento.descripcion}</p>
            </div>
            <p className="ml-20 relative z-20 text-center py-8 text-xs">{evento.titulo}</p>
        </div>
    </div>
}