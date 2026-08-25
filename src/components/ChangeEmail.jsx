import React, {useState} from "react"
import Header from "./Header"
import { auth } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import "./Settings.css"


export default function ChangeEmail(){
    const [currentEmail, setCurrentEmail] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const navigate = useNavigate()

    function updateEmail(){
        
    }
    
    return (
        <>
        <header className = "HomeScreenHeader">

        <Header 
            title = "Change Email"
            imagePathTwo = "../assets/images/icons/back.png"
            altTwo = "go to home screen image"
            functionTwo = {()=>navigate("/Settings")}
        />
        </header>

        <div className = "ChangePasswordBox">
        <label>Enter Current Email: <input onChange = {(e)=>setCurrentEmail(e.target.value)}></input> </label>
        <label>Enter New Email: <input onChange = {(e)=>setNewEmail(e.target.value)}></input></label>
        <button className = "ConfirmChangesButtonSettings">Confirm Changes</button>
        </div>
        </>
    )
}