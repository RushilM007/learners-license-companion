import React, {useState, useEffect} from "react"
import Header from "./Header"
import { useNavigate } from "react-router-dom"
import "./Settings.css"
import { deleteUser, onAuthStateChanged, reauthenticateWithCredential, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth, db } from "./firebase"
import { deleteDoc, doc } from "firebase/firestore"

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

    function changeThePassword(){
        sendPasswordResetEmail(auth,auth.currentUser.email)
        window.alert("A password reset link has been sent to your email")
    }

    async function deleteTheAccount(){
        let yesOrNo = window.confirm("Confirm that you would like to delete the account.")
        if (!yesOrNo){
            return}
        try {
            if (signedInwithGoogle){
                window.alert("Please confirm your Google account in the following popup to continue with the deletion.")
                await reauthenticateWithPopup(auth.currentUser, new GoogleAuthProvider())
            } else {
                const password = window.prompt("Enter your password to confirm:")
                if (!password) return;
                const credential = EmailAuthProvider.credential(auth.currentUser.email, password)
                await reauthenticateWithCredential(auth.currentUser, credential)
            }

            await deleteDoc(doc(db, "Users", auth.currentUser.uid))
            await deleteUser(auth.currentUser)
            navigate("/")
        } catch (err) {
            window.alert(err.message)
        }
    }


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
            {!signedInwithGoogle && <button className = "SettingOptionButton" onClick = {changeThePassword}>Change Password</button>}
            {!signedInwithGoogle && <button className = "SettingOptionButton" onClick = {()=>navigate("/ChangeEmail")}>Change Email</button>}
            <button className = "SettingOptionButton" onClick = {deleteTheAccount}>Delete Account</button>

        </div>
        </>
    )
}