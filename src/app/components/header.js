'use client'
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
const router = useRouter();
const { user } = useContext(AuthContext);

export default function Header({ubiHeader}){
    function abrirMenu(){
        
    }

    return <header>
        <img src="../logo.png"/> 
        <nav>
            <p onClick={()=>handleClickNav("Home", ubiHeader)}>Conócenos</p>
            <p onClick={()=>handleClickNav("Catalogo", ubiHeader)}>Catálogo</p>
            <p onClick={()=>handleClickNav("Perfil", ubiHeader)}>{user?"Mi perfil":!user.admin? "Mi perfil":"Panel de Administración"}</p>
        </nav>
        <img src="../iconos/icono-menu-hb.png" onClick={abirMenu()}></img>
    </header>
}


function handleClickNav(botonNav, ubiHeader){
    if (botonNav != ubiHeader){
        if(botonNav == "Home"){
            router.push("../");
        }else if(botonNav == "Catalogo"){
            router.push("../catalogo");
        }else if(botonNav == "Perfil"){
            if(!user){
                router.push("../authentication/signin"); 
            }else if(user.admin){
                router.push("../admin");
            }else{
                router.push("../perfil");
            }
        }
    }
}