import React, {useState, useEffect} from "react"
import Header from "./Header"
import { useNavigate } from "react-router-dom"
import "./Settings.css"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"

export default function Settings(){
    const [signedInwithGoogle, setSignedInWithGoogle] = useState(false)
    const navigate = useNavigate()

    //check if signed in with own credentials to change password and email
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            if (currentUser){
                const providers = currentUser.providerData.map(p=>p.providerId)
                if (providers.includes('google.com')){
                    setSignedInWithGoogle(true)
                }
            }
        })
        return () => unsubscribe()
    }, [])

    return (
        <>
        <header className = "HomeScreenHeader">
            <Header 
                title = "Settings"
                imagePathOne = "../assets/images/icons/home.png"
                altOne = "go to home screen image"
                functionOne = {()=>navigate("/HomeScreen")}
            />
        </header>

        <div className = "OptionsInSettings">
            <button className = "SettingOptionButton" onClick = {()=>navigate("/Credits")}>Credits</button>
            {!signedInwithGoogle && <button className = "SettingOptionButton" onClick = {()=>navigate('/ChangePassword')}>Change Password</button>}
            {!signedInwithGoogle && <button className = "SettingOptionButton" onClick = {()=>navigate("/ChangeEmail")}>Change Email</button>}
        </div>
        </>
    )
}