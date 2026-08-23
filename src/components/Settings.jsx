import React from "react"
import Header from "./Header"
import { useNavigate } from "react-router-dom"
import "./Settings.css"

export default function Settings(){
    const navigate = useNavigate()

    return (
        <>
        <header className = "HomeScreenHeader">
            <Header 
                title = "Question Bank"
                imagePathOne = "../assets/images/icons/home.png"
                altOne = "go to home screen image"
                functionOne = {()=>navigate("/HomeScreen")}
            />
        </header>

        <div className = "OptionsInSettings">
            <button className = "SettingOptionButton" onClick = {()=>navigate("/Credits")}>Credits</button>
            <button className = "SettingOptionButton">Change Password</button>
            <button className = "SettingOptionButton">Change Email</button>
        </div>
        </>
    )
}