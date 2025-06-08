'use client'
import { useRouter } from "next/navigation";
import { deleteLibro } from "../libs/libro";

export default function Libro({libro, admin, onDelete, user, setLoading, onChangeDisponibilidad}){
    const router = useRouter();

    async function handleClickButton(e){
        e.stopPropagation();
        if(admin){
            console.log("Eliminar libro")
            try {
                const res = await deleteLibro(libro);
                console.log(res)

                if(res != null){
                    if(res.status == 202){
                        alert("El libro no se pudo eliminar por su uso por los usuarios. Marcado como no disponible.")
                        onChangeDisponibilidad?.(libro.id)
                    }else{
                        if (res.ok) {
                            alert(`${libro.titulo} eliminado correctamente`)
                            onDelete?.(libro.id);
                        } else {
                            alert("Ha ocurrido un error. Inténtelo de nuevo más tarde");
                        }
                    }
                }
                
            } catch (error) {
                alert("Ha ocurrido un error. Inténtelo de nuevo más tarde");
            }
        }else{
            setLoading(true)
            if(user){
                const res = await fetch("/api/reserva?u=" + user.id);
                console.log(res)
                if(res.ok){
                    router.push(`/catalogo/${libro.id}/reserva`);
                    console.log('a reservar')
                }else{
                    const errorData = await res.json();
                    alert(errorData.error);
                    setLoading(false)
                }
            }else{
                router.push(`/auth/login`)
            }
            
        }
    }

    return <div className=" flex flex border border-[var(--lion)] border-2 rounded-xl lg:max-h-[20vh]" onClick={() => router.push(`/catalogo/${libro.id}`)}>
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
                <button className={`${admin? "bg-[var(--chamoise)]": "bg-[var(--ecru)]"} text-[var(--seashell)] px-2 rounded-xl`} onClick={(e) => handleClickButton(e)}>{admin? "Eliminar": "Reservar"}</button>
            </div>
        </div>
    </div> 
}