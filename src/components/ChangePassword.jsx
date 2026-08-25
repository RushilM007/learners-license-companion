import React, {useState} from "react"
import Header from "./Header"
import { useNavigate } from "react-router-dom"

export default function ChangePassword(){
    const [currentPassword, updateCurrentPassword ] = useState("")
    const [newPassword, updateNewPassword] = useState("")
    const [confirmNewPassword, updateConfirmNewPassword] = useState("")

    const navigate = useNavigate()

    function updatePassword(){

    }
    return (
        <>
        <header className = "HomeScreenHeader">
         <Header 
            title = "Change Password"
            imagePathTwo = "../assets/images/icons/back.png"
            altTwo = "go to home screen image"
            functionTwo = {()=>navigate("/Settings")}
        />
        </header>
        <div className = "ChangePasswordBox">
            <label>Enter Current Password: <input onChange = {(e)=>updateCurrentPassword(e.target.value)}></input> </label>
            <label>Enter New Password: <input onChange = {(e)=>updateCurrentPassword(e.target.value)}></input> </label>
            <label>Confirm New Password: <input onChange = {(e)=>updateConfirmNewPassword(e.target.value)}></input> </label>
            <button className = "ConfirmChangesButtonSettings">Confirm Changes</button>
        </div>

        </>
    )
}