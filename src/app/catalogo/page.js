'use client'
import Footer from "../components/Footer";
import Libro from "../components/Libro"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../contexts/AuthContext";

//QUEDA: cambio del header
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
    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/api/libro");
            const data = await res.json();
            setAllLibros(data)
            setLibros(data)
            console.log(data)

            const generosUnicos = [...new Set(data.map(libro => libro.genero))];
            const autoresUnicos = [...new Set(data.map(libro => libro.autor))];
            const disponibilidadesUnicas = [...new Set(data.map(libro => libro.disponibilidad))];

            setGeneros(generosUnicos);
            setAutores(autoresUnicos);
            setDisponibilidades(disponibilidadesUnicas);
        }
        fetchData();
    }, []);

    useEffect(() => {
        let filtrados = [...allLibros];
        if (filtroGenero) {
            filtrados = filtrados.filter(libro => libro.genero === filtroGenero);
        }
        if (filtroAutor) {
            filtrados = filtrados.filter(libro => libro.autor === filtroAutor);
        }
        if (filtroDisponible) {
            filtrados = filtrados.filter(libro => libro.disponibilidad === filtroDisponible);
        }
        if (filtroTitulo) {
            filtrados = filtrados.filter(libro =>
                libro.titulo.toLowerCase().includes(filtroTitulo.toLowerCase())
            );
        }
        setLibros(filtrados);
    }, [filtroGenero, filtroAutor, filtroDisponible, filtroTitulo, allLibros]);


    return <div>
        <Header ubiHeader="Catalogo" setFiltro={setFiltroTitulo}></Header>
        <main>
            <div>
                <div>
                    <p>Género</p>
                    <select value={filtroGenero} onChange={(e) => setFiltroGenero(e.target.value)}>
                        <option value={all} selected>Todos</option>
                        {generos.map((genero) =>
                            <option value={genero}>{genero}</option>
                        )}
                    </select>
                </div>
                <div>
                    <p>Autor</p>
                    <select value={filtroAutor} onChange={(e) => setFiltroAutor(e.target.value)}>
                        <option value={all} selected>Todos</option>
                        {autores.map((autor) =>
                            <option value={autor}>{autor}</option>
                        )}
                    </select>
                </div>
                <div>
                    <p>Disponibilidad</p>
                    <select value={filtroDisponible} onChange={(e) => setFiltroDisponible(e.target.value)}>
                        <option value={all} selected>Todos</option>
                        {disponibilidades.map((disponibilidad) =>
                            <option value={disponibilidad}>{disponibilidad}</option>
                        )}
                    </select>
                </div>
            </div>
            <div>
                {libros.length == 0 && <h1>Lamentablemente, no tenemos este libro, pero nuestras páginas están llenas de otros títulos. ¡Echa un vistazo!</h1>}
                {libros.map((libro) =>
                    <Libro libro={libro}
                        admin={user.admin}></Libro>
                )}
            </div>
        </main>
        <Footer></Footer>
    </div>
}