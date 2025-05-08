'use client'
import { useRouter } from "next/navigation";
import { deleteLibro } from "../libs/libro";

export default function Libro({libro, admin, onDelete, user}){
    const router = useRouter();

    async function handleClickButton(){
        if(admin){
            try {
                const res = await deleteLibro();
            
                if (res.ok) {
                    alert(`${libro.titulo} eliminado correctamente`)
                    onDelete?.(libro.id);
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

    return <div className=" flex flex border border-[var(--lion)] border-2 rounded-xl" onClick={() => router.push(`/catalogo/${libro.id}`)}>
        <img className=" w-18 m-2 rounded object-contain" src={libro.imagen_url} alt={"Portada de " + libro.titulo}></img>
        <div className="m-2 flex flex-col justify-between flex-1">
            <div>
                <p className="font-bold">{libro.titulo}</p>
                <p className="text-xs">{libro.editorial}</p>
                <div className="mt-2 text-xs text-[var(--lion)] flex items-center mb-4">
                    <div className={`${libro.disponibilidad == "Disponible"? "bg-[var(--verde)]": "bg-[var(--rojo)]"} w-3 h-3 rounded-xl`}></div>
                    <p className="ml-1">{libro.disponibilidad}</p>
                </div>
            </div>
            <div className="flex justify-end">
                <button className={`${admin? "bg-[var(--chamoise)]": "bg-[var(--ecru)]"} text-[var(--seashell)] px-2 rounded-xl`} onClick={handleClickButton}>{admin? "Eliminar": "Reservar"}</button>
            </div>
        </div>
    </div> 
}