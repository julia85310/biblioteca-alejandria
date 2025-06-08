'use client'
import MyFooter from "../components/MyFooter";
import Libro from "../components/Libro"
import MyHeader from "../components/MyHeader"
import { useState, useEffect, useContext } from "react"
import Loader from "../components/loader/Loader";
import { AuthContext } from "../contexts/AuthContext";


export default function CatalogoPage() {
    const [filtroTitulo, setFiltroTitulo] = useState("")
    const [allLibros, setAllLibros] = useState([]);
    const [libros, setLibros] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [autores, setAutores] = useState([]);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [filtroGenero, setFiltroGenero] = useState("all");
    const [filtroAutor, setFiltroAutor] = useState("all");
    const [filtroDisponible, setFiltroDisponible] = useState("all");
    const { modoAdmin, user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true)
    const bgFilters = modoAdmin? 'bg-[var(--darkAliceBlue)]': 'bg-[var(--darkSeashell)]';

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/api/libro");
            if(!res.ok){
                alert("Ha ocurrido un error. Intentelo de nuevo mas tarde")
                router.push("/")
                return
            }
            const data = await res.json();
            setAllLibros(data)
            setLibros(data)
            console.log(data)

            const generosUnicos = [...new Set(data.map(libro => libro.genero))].sort();
            const autoresUnicos = [...new Set(data.map(libro => libro.autor))].sort();
            const disponibilidadesUnicas = [...new Set(data.map(libro => libro.disponibilidad))].sort();

            setGeneros(generosUnicos);
            setAutores(autoresUnicos);
            setDisponibilidades(disponibilidadesUnicas);
            const timer = setTimeout(() => {
                setLoading(false)
            }, 800);

            return () => clearTimeout(timer);
        }
        fetchData();
    }, []);

    useEffect(() => {
        let filtrados = [...allLibros];
        if (filtroGenero != "all") {
            filtrados = filtrados.filter(libro => libro.genero === filtroGenero);
        }
        if (filtroAutor != "all") {
            filtrados = filtrados.filter(libro => libro.autor === filtroAutor);
        }
        if (filtroDisponible != "all") {
            filtrados = filtrados.filter(libro => libro.disponibilidad === filtroDisponible);
        }
        if (filtroTitulo) {
            filtrados = filtrados.filter(libro =>
                libro.titulo.toLowerCase().includes(filtroTitulo.toLowerCase())
            );
        }
        setLibros(filtrados);
    }, [filtroGenero, filtroAutor, filtroDisponible, filtroTitulo, allLibros]);


    function onDelete(id){
        setLibros(prev => prev.filter(libro => libro.id !== id));
        setAllLibros(prev => prev.filter(libro => libro.id !== id));
    }

    function onChangeDisponibilidad(id){
        setLibros(prev => prev.map(libro => 
        {
            if (libro.id == id){
                return {...libro, disponibilidad: "No Disponible"}
            }else{
                return libro
            }
        }
        ));
        setAllLibros(prev => prev.map(libro => 
        {
            if (libro.id == id){
                return {...libro, disponibilidad: "No Disponible"}
            }else{
                return libro
            }
        }
        ));
    }

    return <div className={`min-h-[100vh] flex flex-col ${modoAdmin? "bg-[var(--aliceBlue)]": "bg-[var(--seashell)]"}`}>
        <MyHeader ubiHeader="Catalogo"></MyHeader>
        {loading? 
        <Loader tailwind="w-screen h-[60vh]"></Loader>:
        <main className={`flex flex-col flex-1 ${modoAdmin? "bg-[var(--aliceBlue)]": "bg-[var(--seashell)]"}`}>
            <div className="flex lg:flex-row flex-col justify-between">
                <div className="flex lg:justify-center lg:items-center ">
                    <div className={`${bgFilters} flex border-[var(--chamoise)] border rounded-2xl lg:ml-12 ml-4 py-1`}>
                        <img className="w-4 object-contain mx-2" src="/iconos/lupa_icon.png"></img>
                        <input 
                            type="text"
                            value={filtroTitulo}
                            className="flex-1 placeholder-[var(--lion)] md:text-base lg:text-xs text-xs w-auto" 
                            placeholder="Buscar por título" 
                            onChange={(e) =>
                                setFiltroTitulo(e.target.value)
                            }
                        />
                    </div>
                </div>
                <div className="flex flex-row md:text-base lg:text-sm text-sm lg:gap-20 gap-3 justify-around lg:mr-16 mb-4 mt-4 lg:mt-0">
                    <div>
                        <p className="">Género</p>
                        <select className={`${bgFilters} text-[var(--chamoise)] text-xs flex border-[var(--chamoise)] border rounded-2xl mt-1 pl-1 pr-1 lg:pr-4`} value={filtroGenero} onChange={(e) => setFiltroGenero(e.target.value)}>
                            <option value={"all"}>Todos</option>
                            {generos.map((genero) =>
                                <option key={genero} value={genero}>{genero}</option>
                            )}
                        </select>
                    </div>
                    <div >
                        <p>Autor</p>
                        <select className={`${bgFilters} text-[var(--chamoise)] text-xs flex border-[var(--chamoise)] border rounded-2xl mt-1 pl-1 pr-1 lg:pr-4`} value={filtroAutor} onChange={(e) => setFiltroAutor(e.target.value)}>
                            <option value={"all"}>Todos</option>
                            {autores.map((autor) =>
                                <option key={autor} value={autor}>{autor}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <p>Disponibilidad</p>
                        <select className={`${bgFilters} text-[var(--chamoise)] text-xs flex border-[var(--chamoise)] border rounded-2xl mt-1 pl-1 pr-1 lg:pr-4`} value={filtroDisponible} onChange={(e) => setFiltroDisponible(e.target.value)}>
                            <option value={"all"}>Todos</option>
                            {disponibilidades.map((disponibilidad) =>
                                <option key={disponibilidad} value={disponibilidad}>{disponibilidad}</option>
                            )}
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex">
                <div className=" flex items-center justify-center">
                    {!modoAdmin && libros.length == 0 && <h1 className="pb-20 text-center px-14">Lamentablemente, <b>no tenemos este libro</b>, pero nuestras páginas están llenas de otros títulos. ¡Echa un vistazo!</h1>}
                    {modoAdmin && libros.length == 0 && <h1 className="pb-20 text-center px-14">Libro no encontrado</h1>}
                </div>
                <div className={`${libros.length == 0 && "hidden"} flex flex-1`}>
                    <div className="lg:m-4 flex-1 w-full overflow-y-auto grid grid-cols-2 mx-2 lg:grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-3">
                        {libros.map((libro) =>
                            <Libro
                                user={user}
                                onDelete={onDelete}
                                key={libro.id} 
                                libro={libro}
                                onChangeDisponibilidad = {onChangeDisponibilidad}
                                setLoading={setLoading}
                                admin={modoAdmin}></Libro>
                        )}
                    </div>
                </div>
            </div>
        </main>}
        {!loading && !modoAdmin && <MyFooter/>}
    </div>
}