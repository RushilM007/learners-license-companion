import React from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import './AuthScreens.css'
import {useState} from 'react'
import {browserLocalPersistence, setPersistence, signInWithEmailAndPassword} from "firebase/auth"
import {auth} from "./firebase"
import SignInWithGoogle from "./SignInWithGoogle.jsx"

export default function LoginScreen(){
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    //for react router. 
    const navigate = useNavigate()
   
    async function onSubmit(e){
        e.preventDefault();
        try{
            await setPersistence(auth,browserLocalPersistence)
            await signInWithEmailAndPassword(auth,email,password);
            navigate("/HomeScreen")
        } catch (error){
            setError(`Firebase Error [${error.code}]: ${error.message}`);
        }
    }

    return (
        <>
        <main>
            <div id = "AuthCard">
                <h3 id = "AuthHeader">Sign in to Learner's License Companion</h3>
                <form id = "AuthForm" onClick = {onSubmit}>
                    <label className = "AuthLabel" htmlFor="email"> Email Address </label>
                    
                    <input 
                        className = "AuthInput" 
                        id = "email" 
                        onChange = {(e)=>setEmail(e.target.value)} 
                        placeholder = "name@example.com" 
                        type = "email" 
                    />

                    <label className = "AuthLabel" htmlFor="password">Password</label>
                    
                    <input 
                        className = "AuthInput" 
                        id = "password" 
                        placeholder = "••••••••" 
                        onChange = {(e)=>setPassword(e.target.value)} 
                        type = "password" 
                    />

                    <Link to="/ForgotPassword" className = "AuthHyperLink">Forgot Password?</Link>

                    <button className = "AuthButton" type = "submit" >Sign In</button>

                    <p className = "AuthAlternateOptionLiner">Don't have an account? <Link to="/SignUp" className = "AuthHyperLink">Sign Up</Link></p>

                    {error!=='' && <p className = "AuthErrorMessage">{error}</p>}

                </form>
                <SignInWithGoogle />
            </div>
        </main>
        </>
        

    )
}