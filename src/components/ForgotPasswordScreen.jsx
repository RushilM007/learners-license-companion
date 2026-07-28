import React, {useEffect, useState} from "react"
import { Navigate, useNavigate, Link } from "react-router-dom"
import './AuthScreens.css'
export default function ForgotPasswordScreen(){

    const [error, setError] = useState('')

    function resetPassword(){

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

                    <button id = "AuthButton" onClick = {resetPassword}>Reset Password</button>

                    <p id = "AuthAlternateOptionLiner">Remember your password? <Link to="/" id = "AuthHyperLink">Login</Link></p>

                    {error!=='' && <p id = "AuthErrorMessage">{error}</p>}

                </form>
            </div>
        </main>
        
        </>

    )
}