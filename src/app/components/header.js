'use client'
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Header({ubiHeader}){
    const { user } = useContext(AuthContext);
    const [menuHidden, setMenuHidden] = useState(true);
    const router = useRouter();

    function abrirMenu(){
        setMenuHidden(!menuHidden);
    }

    function handleClickNav(botonNav, ubiHeader){
        if (botonNav != ubiHeader){
            if(botonNav == "Home"){
                router.push("../");
            }else if(botonNav == "Catalogo"){
                router.push("../catalogo");
            }else if(botonNav == "Perfil"){
                console.log("usuario:")
                console.log(user)
                if(!user){
                    router.push("../auth/login"); 
                }else if(user.admin){
                    router.push("../admin");
                }else{
                    router.push("../perfil");
                }
            }
        }
    }

    return <header className={`flex flex-row px-12 pt-10 justify-between pb-6 ${user?.admin ? "bg-[var(--aliceBlue)]" : "bg-[var(--seashell)]"}`}>
        <img src="../logo.png" className="w-[10vw]"/> 
        <img className="block lg:hidden z-10" src="../iconos/icono-menu-hb.png" onClick={abrirMenu}></img>
        <nav className={`${menuHidden ? 'hidden' : 'flex'}  z-20 lg:static lg:flex flex-col lg:flex-row justify-end items-end gap-16 px-18`}>
            <p onClick={()=>handleClickNav("Home", ubiHeader)}>Conócenos</p>
            <p onClick={()=>handleClickNav("Catalogo", ubiHeader)}>Catálogo</p>
            <p onClick={()=>handleClickNav("Perfil", ubiHeader)}>{user?.admin ? "Panel de Administración" : "Mi perfil"}</p>
        </nav>
    </header>
}

