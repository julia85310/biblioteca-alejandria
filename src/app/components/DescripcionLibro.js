
export default function DescripcionLibro({libro}){

    return <div className="lg:-mt-4 flex flex-col justify-between text-[2.3vw] lg:text-[2vh] lg:gap-4 gap-6 py-4">
        <div className="flex flex-col gap-3 lg:gap-1">
            <div id="editorial" className="flex gap-1">
                <p className="text-[var(--lion)]">Editorial: </p>
                <p>{libro.editorial}</p>
            </div>
            <div id="autor" className="flex gap-1">
                <p className="text-[var(--lion)]">Autor: </p>
                <p>{libro.autor}</p>
            </div>
            <div id="publicacion" className="flex gap-1">
                <p className="text-[var(--lion)]">Año de publicación: </p>
                <p>{libro.ano_publicacion > 0? 
                    libro.ano_publicacion
                    :
                    `${libro.ano_publicacion*(-1)} a.C.`}</p>
            </div>
            <div id="genero" className="flex gap-1">
                <p className="text-[var(--lion)]">Género: </p>
                <p>{libro.genero}</p>
            </div>
        </div>
        <div className="flex flex-col gap-3 lg:gap-1">
            <div id="valor" className="flex gap-1">
                <p className="text-[var(--lion)]">Valor: </p>
                <p>{libro.valor} €</p>
            </div>
            <div id="condicion" className="flex gap-1">
                <p className="text-[var(--lion)]">Condición: </p>
                <p>{libro.condicion}</p>
            </div>
            <div id="adquisicion" className="flex gap-1">
                <p className="text-[var(--lion)]">Fecha de adquisicion: </p>
                <p>{libro.fecha_adquisicion}</p>
            </div>
        </div>
    </div>
}