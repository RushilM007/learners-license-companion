import React, {useEffect, useState} from "react"
import { Navigate, useNavigate, Link } from "react-router-dom"
import './AuthScreens.css'
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "./firebase"
export default function ForgotPasswordScreen(){

    const [errorMessage, setErrorMessage] = useState('')
    const [errorExists, setErrorExists] = useState(false)
    const [email, setEmail] = useState('')

    async function resetPassword(e){
        e.preventDefault();
        try{
            await sendPasswordResetEmail(auth,email)
            setErrorMessage('none')
        } catch (error){
            setErrorMessage(error.message)
            setErrorExists(true)
        }
    }

    return(
        <>
         <main>
            <div id = "AuthCard">
                <form id = "AuthForm">
                    <p className = "AuthDescriptor">If the email ID that you provided is valid, you will recieve a link to reset your password.</p>
                    <label className = "AuthLabel" htmlFor="email"> Email Address </label>
                    
                    <input 
                        className = "AuthInput" 
                        id = "email" 
                        onChange = {(e)=>setEmail(e.target.value)} 
                        placeholder = "name@example.com" 
                        type = "email" 
                    />

                    <button className = "AuthButton" onClick = {resetPassword}>Reset Password</button>

                    <p className = "AuthAlternateOptionLiner">Remember your password? <Link to="/" className = "AuthHyperLink">Login</Link></p>

                    {errorExists&&<p className ="AuthErrorMessage">{errorMessage}</p>}
                    {!errorExists&&errorMessage!==''&& <p className ="AuthSuccessMessage">Email Sent Successfully!</p>}

                </form>
            </div>
        </main>
        </>

    )
}