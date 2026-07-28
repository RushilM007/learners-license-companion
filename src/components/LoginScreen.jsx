import React from "react"
import { Link } from "react-router-dom"
import './LoginScreen.css'
import {useState} from 'react'
import {signInWithEmailAndPassword} from "firebase/auth"
import {auth} from "./firebase"

export default function LoginScreen(){
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
   
    async function onSubmit(e){
        e.preventDefault();
        try{
            await signInWithEmailAndPassword(auth,email,password);
            console.log("Signed In")
        } catch (error){
            setError(`Firebase Error [${error.code}]: ${error.message}`);
        }
    }

    return (
        <>
        <main>
            <div id = "LoginCard">
                <h3 id = "LoginCardHeader">Sign in to Learner's License Companion</h3>
                <form id = "LoginForm">
                    <label className = "LoginScreenLabel" htmlFor="email"> Email Address </label>
                    
                    <input 
                        className = "LoginScreenInput" 
                        id = "email" 
                        onChange = {(e)=>setEmail(e.target.value)} 
                        placeholder = "name@example.com" 
                        type = "email" 
                        name = "email" 
                    />

                    <label className = "LoginScreenLabel" htmlFor="password">Password</label>
                    
                    <input 
                        className = "LoginScreenInput" 
                        id = "password" 
                        placeholder = "••••••••" 
                        onChange = {(e)=>setPassword(e.target.value)} 
                        type = "password" 
                        name = "password" 
                    />

                    <a id = "ForgotPassword">Forgot Password?</a>

                    <button id = "SignInButton" onClick = {onSubmit}>Sign In</button>

                    <p id = "SignUpLiner">Don't have an account? <Link to="/SignUp" id = "SignUpHyperLink">Sign Up</Link></p>

                    {error!=='' && <p id = "ErrorMessage">{error}</p>}

                </form>
            </div>
        </main>
        </>
        

    )
}