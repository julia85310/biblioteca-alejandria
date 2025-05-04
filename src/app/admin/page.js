'use client'
import { AuthContext } from "../contexts/AuthContext"
import { useContext } from "react"
import { useRouter } from "next/navigation";
import MyHeader from "../components/MyHeader";

export default function AdminPage(){
    const router = useRouter();
    const {logout} = useContext(AuthContext)

    function cerrarSesion(){
        logout();
        router.push("/")
    }

    return <div>
        <MyHeader ubiHeader="Perfil"></MyHeader>
        <h1>Pagina no implementada</h1>
        <img src="/iconos/icono-logout-azul.png" onClick={cerrarSesion}></img>
    </div>
}