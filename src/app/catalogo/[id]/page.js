'use client'
import MyHeader from "@/app/components/MyHeader";
import { useEffect, useState, useContext, use } from "react";
import { AuthContext } from "@/app/contexts/AuthContext";
import MyFooter from "@/app/components/MyFooter";
import DescripcionLibro from "@/app/components/DescripcionLibro";
import { useRouter } from "next/navigation";

export default function LibroPage(props){
    const params = use(props.params);
    const id = params.id;
    const [libro, setLibro] = useState(null);
    const {user, modoAdmin} = useContext(AuthContext);
    const router = useRouter();

    const fondo = modoAdmin? 
            "bg-[var(--aliceBlue)]"
            : "bg-[var(--seashell)]";

    useEffect(() => {
        async function fetchData() {
            const res = await fetch("/api/libro?id=" + id);
            const data = await res.json();
            setLibro(data);
        }
        
        fetchData(); 
    },[])

    async function handleClickButton(){
        if(modoAdmin){
            try {
                const res = await deleteLibro();
            
                if (res.ok) {
                    alert(`${libro.titulo} eliminado correctamente`)
                } else {
                    alert("Ha ocurrido un error. Inténtelo de nuevo más tarde");
                }
            } catch (error) {
                alert("Ha ocurrido un error. Inténtelo de nuevo más tarde");
            }
        }else{
            if(user){
                router.push(`/catalogo/${libro.id}/reserva`);
            }else{
                router.push(`/auth/login`)
            }
        }
            
    }

    return <div className={`${fondo} min-h-[100vh] flex flex-col`}>
        <MyHeader ubiHeader=""/>
        {libro?<main className="flex-1 flex flex-col p-6 lg:pt-4 gap-4 lg:pl-16">
            <h1 className="text-2xl font-bold lg:text-3xl">{libro.titulo}</h1>
            <div className="flex flex-col lg:flex-row pl-4 lg:pl-2 gap-8">
                <div className="flex flex-col gap-2 lg:gap-3 ">
                    <div className="flex flex-row gap-4 lg:gap-8 items-start">
                        <img className="object-contain lg:w-34 w-[38vw]" src={libro.imagen_url}></img>
                        <div id="descripPC" 
                            className="hidden w-[37vw] pr-12 mt-4 pb-8 text-sm text-[var(--lion)] lg:block h-[28vh] overflow-y-auto elemento-con-scroll">
                            {libro.descripcion}
                        </div>
                        <div id="caracteristicasMovil" 
                            className="lg:hidden flex-1">
                            <DescripcionLibro libro={libro}></DescripcionLibro>
                        </div>
                    </div>
                    <div className="flex flex-row text-[var(--lion)] text-[2.4vw] lg:text-base lg:pr-10 pr-5 justify-between items-center lg:-ml-4">
                        <div id="disponibilidad" className="flex justify-between items-center">
                            <div className={`${libro.disponibilidad == "Disponible"? "bg-[var(--verde)]": "bg-[var(--rojo)]"} w-4 h-4 rounded-xl`}></div>
                            <p className="ml-1">{libro.disponibilidad}</p>
                        </div>
                        <div id="isbn" className="flex justify-between items-center">
                            <img className="object-contain h-10 w-10" src="/iconos/isbn-icon.png"></img>
                            <p>{libro.isbn}</p>
                        </div>
                        <div id="ubicacion" className="flex justify-between items-center">
                            <img className="object-contain h-6 w-6" src="/iconos/icono-ubi.png"></img>
                            <div className="flex justify-between items-center gap-1">
                                <p>Estante {libro.estante},</p>
                                <p>Balda {libro.balda}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-12 lg:gap-4">
                    <div id="DescripMovil" 
                        className="h-[19vh] lg:hidden overflow-y-auto elemento-con-scroll text-[3vw] text-[var(--lion)] pr-14">
                        {libro.descripcion}
                    </div>
                    <div id="caracteristicasPC" 
                        className="hidden lg:block">
                        <DescripcionLibro libro={libro}></DescripcionLibro>
                    </div>
                    <div className="flex justify-end lg:justify-start">
                        <button className={`${modoAdmin? "bg-[var(--lion)]": "bg-[var(--ecru)]"} lg:text-xl lg:py-1 text-2xl text-[var(--seashell)] px-4 py-2 rounded-3xl`} onClick={handleClickButton}>{modoAdmin? "Eliminar": "Reservar"}</button>
                    </div>
                </div>
            </div>
        </main>: <main className="flex justify-center items-center"> Libro no encontrado </main>}
        { !modoAdmin && <MyFooter/> }
    </div>
}