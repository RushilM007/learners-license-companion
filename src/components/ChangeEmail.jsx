import React, {useState, useEffect} from "react"
import Header from "./Header"
import { auth } from "./firebase"
import { onAuthStateChanged, reauthenticateWithCredential, updateEmail, verifyBeforeUpdateEmail } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import "./Settings.css"
import { EmailAuthProvider } from "firebase/auth/web-extension"


export default function ChangeEmail(){
    const [actualCurrentEmail, setActualCurrentEmail] = useState("")
    const [currentEmailTypedByUser, setCurrentEmailTypedByUser] = useState("")
    const [newEmail, setNewEmail] = useState("")

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user)=>{
            if (user){
                setActualCurrentEmail(user.email)
            }
        })
        //once react unmounts unsub 
        return () => unsub()
    },[])

    const navigate = useNavigate()

    async function callUpdateEmail(){
        if (actualCurrentEmail!=currentEmailTypedByUser){
            window.alert("Current password does not match the current password that you have entered. Please re-type.")
            return;
        }    

        const password = window.prompt("Enter your password to confirm:")
        if (!password) return;

        try {
            const credential = EmailAuthProvider.credential(actualCurrentEmail, password)
            await reauthenticateWithCredential(auth.currentUser, credential)

            await verifyBeforeUpdateEmail(auth.currentUser, newEmail)
            window.alert(`A verification link has been sent to ${newEmail}.`)
            navigate("/Settings")
        } catch (err) {
            window.alert(err.code === "auth/wrong-password" || err.code === "auth/invalid-credential" ? "Incorrect password." : err.message)
        }
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
        <label>Enter Current Email: <input onChange = {(e)=>setCurrentEmailTypedByUser(e.target.value)}></input> </label>
        <label>Enter New Email: <input id = "email" type = "email" onChange = {(e)=>setNewEmail(e.target.value)}></input></label>
        <button className = "ConfirmChangesButtonSettings" onClick = {callUpdateEmail}>Confirm Changes</button>
        </div>
        </>
    )
}