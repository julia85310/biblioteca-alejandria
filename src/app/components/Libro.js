'use client'
import { useRouter } from "next/navigation";

export default function Libro({libro, admin, onDelete}){
    const router = useRouter();

    async function handleClickButton(){
        if(admin){
            const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar ${libro.titulo}? Esta acción es irreversible.`);
            if (confirmed) {
                try {
                    const res = await fetch("/api/libro", {
                        method: 'DELETE',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({'id': libro.id}),
                    });
                
                    if (res.ok) {
                        alert(`${libro.titulo} eliminado correctamente`)
                        onDelete?.(libro.id);
                    } else {
                        alert("Ha ocurrido un error. Inténtelo de nuevo más tarde");
                    }
                } catch (error) {
                    alert("Ha ocurrido un error. Inténtelo de nuevo más tarde");
                }
            }
        }else{
            alert("No implementado")
            //router.push("/" + libro.id);
        }
    }

    return <div className=" flex flex border border-[var(--lion)] border-2 rounded-xl">
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