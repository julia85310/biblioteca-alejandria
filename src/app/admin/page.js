'use client'
import { AuthContext } from "../contexts/AuthContext"
import { useContext } from "react"
import { useRouter } from "next/navigation";

export default function AdminPage(){
    const router = useRouter();
    const {logout} = useContext(AuthContext)

    function cerrarSesion(){
        logout();
        router.push("/")
    }

    return <div>
        <Header ubiHeader="Perfil"></Header>
        <img src="/iconos/icono-logout-azul.png" onClick={cerrarSesion}></img>
    </div>
}