import {useEffect, useState} from 'react'
import {auth,db} from "./firebase"
import {doc, getDoc} from "firebase/firestore"
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import "./HomeScreen.css"
import  {ModulesInformation}  from './ModulesInformation'

export default function HomeScreen(){
    //Stores all user data 
    const [userDetails, setUserDetails] = useState(null)

    //used to make react router work 
    const navigate = useNavigate()

    //fetches all user data from database 
    async function fetchUserData(){
        auth.onAuthStateChanged(async(user)=>{
            const docRef=doc(db,"Users", user.uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()){
                setUserDetails(docSnap.data())
                console.log(docSnap.data())
            } else{
                console.log("user is not logged in")
            }
        })
    };

    useEffect(()=>{
        fetchUserData()
    },[])

    function logout(){
        signOut(auth)
        navigate("/")
    }

    const HomeScreenModuleChips = ModulesInformation.map((module, index)=>{
        return (
            <>
            <button key = {index} className = "ModuleButton" onClick = {()=>navigate(module.navigate)}>
                <img className = "ModuleImage" src = {module.image} />
                <div className = "ModuleText">
                    <p className = "ModuleName">{module.name}</p>
                    <p className = "ModuleDescription">{module.description}</p>
                </div>
            </button>
            </>
        )
    })

    return (
        <>
        <header className= "HomeScreenHeader">
            <h1 id = "HomeScreenHeaderText">Learner's License Companion</h1>

            <button className = "HeaderButton">
                <img className = "HeaderImage" src = "../assets/images/icons/setting.png" alt = "settings icon"  />
            </button>
            <button onClick = {logout} className = "HeaderButton">
                <img className = "HeaderImage" src = "../assets/images/icons/logout.png" alt = "logout icon"/>
            </button>

        </header>
        <body>
            <div id = "ModuleGrid">
                {HomeScreenModuleChips}
            </div>
        </body>
        </>
    )
}