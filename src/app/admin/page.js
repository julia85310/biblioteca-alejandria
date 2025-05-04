'use client'
import { AuthContext } from "../contexts/AuthContext"
import { useContext } from "react"
import { useRouter } from "next/navigation";
import Header from "../components/Header";

export default function AdminPage(){
    const router = useRouter();
    const {logout} = useContext(AuthContext)

    function cerrarSesion(){
        logout();
        router.push("/")
    }

    return <div>
        <Header ubiHeader="Perfil"></Header>
        <h1>Pagina no implementada</h1>
        <img src="/iconos/icono-logout-azul.png" onClick={cerrarSesion}></img>
    </div>
}