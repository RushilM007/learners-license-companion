import {useEffect, useState} from 'react'
import {auth,db} from "./firebase"
import {doc, getDoc} from "firebase/firestore"
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import "./HomeScreen.css"
import  {ModulesInformation}  from './ModulesInformation'
import Header from './Header'

export default function HomeScreen(){
    //Stores all user data 
    const [userDetails, setUserDetails] = useState(null)

    //used to make react router work 
    const navigate = useNavigate()

    function logout(){
        auth.signOut()

        navigate("/")
    }

    const HomeScreenModuleChips = ModulesInformation.map((module, index)=>{
        return (
            <button key = {module.navigate} className = "ModuleButton" onClick = {()=>navigate(module.navigate)}>
                <img key = {module.image} className = "ModuleImage" src = {module.image} />
                <div className = "ModuleText">
                    <p key = {module.name} className = "ModuleName">{module.name}</p>
                    <p key = {module.description} className = "ModuleDescription">{module.description}</p>
                </div>
            </button>
        )
    })

    return (
        <>  
        <header className = "HomeScreenHeader">

            <Header 
                title = "Learner's License Companion" 
                imagePathOne = "../assets/images/icons/setting.png"
                altOne = "settings icon"
                imagePathTwo = "../assets/images/icons/logout.png"
                altTwo = "logout icon"
                functionTwo = {()=>logout()}
            />
            
        </header>

        <div id = "ModuleGrid">
            {HomeScreenModuleChips}
        </div>
        </>
    )
}