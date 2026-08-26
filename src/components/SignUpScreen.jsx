import {Navigate, Link, useNavigate, useFormAction} from "react-router-dom"
import './AuthScreens.css'
import React, {useState} from 'react'
import {createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth"
import {auth, db} from "./firebase"
import {setDoc, doc } from "firebase/firestore"
import SignInWithGoogle from "./SignInWithGoogle"
import {Questions} from "./Questions.js"

export default function SignUpScreen(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [name, setName] = useState('');

    const navigate = useNavigate();

    let answers = {}
    for (let i = 1; i < Questions.length+1; i ++){
        answers[i] = null
    }

    async function handleRegister(e){
        e.preventDefault();
        if (name ===""){
            setError("Please fill up the missing fields.")
            return;
        }
        if (password!==confirmPassword){
            setError("Password hasn't been confirmed properly.")
            return;
        }
        
        try{
            await createUserWithEmailAndPassword(auth,email,confirmPassword);
            const user = auth.currentUser;
            
            if (user){
                await setDoc(doc(db,"Users",user.uid),{
                    email:user.email,
                    name: name,
                    LastSeenThisQuestion: 1,
                    LastSeenCategory: "Category: All",
                    answers: answers,
                    rightAnswerCount: 0,
                    wrongAnswerCount: 0,
                    bookmarkData: answers
                })
            }
            } catch (error){
                setError(`Firebase Error [${error.code}]: ${error.message}`);
                return;
            }
        navigate("/")

    }

    return (
        <>
        <main>
            <div id = "AuthCard">

                <h3 id = "AuthHeader">Sign Up for Learner's License Companion</h3>

                <form id = "AuthForm" onSubmit = {handleRegister}>

                    <label className = "AuthLabel" htmlFor="name">Name</label>

                    <input 
                        className = "AuthInput" 
                        onChange = {(e)=>setName(e.target.value)} 
                        id = "name" 
                        placeholder = "John Doe" 
                    />

                    <label className = "AuthLabel" htmlFor="email">Email Address</label>
                    
                    <input 
                        className = "AuthInput" 
                        onChange = {(e)=>setEmail(e.target.value)} 
                        id = "email" 
                        placeholder = "name@example.com" 
                        type = "email" 
                    />

                    <label className = "AuthLabel" htmlFor="password">Password</label>

                    <input 
                        className = "AuthInput" 
                        id = "password" 
                        placeholder = "••••••••" 
                        type = "password" 
                        onChange = {(e)=>setPassword(e.target.value)}
                    />

                    <label className = "AuthLabel" htmlFor="confirmPassword">Confirm Password</label>

                    <input 
                        className = "AuthInput" 
                        id = "confirmPassword" 
                        onChange = {(e)=>setConfirmPassword(e.target.value)} 
                        placeholder = "••••••••" 
                        type = "password" 
                    />

                    <button className = "AuthButton">Sign Up</button>

                    <p className = "AuthAlternateOptionLiner">Have an account? <Link to="/" className = "AuthHyperLink">Login</Link></p>

                    {error!=='' && <p className = "AuthErrorMessage">{error}</p>}

                </form>

                <SignInWithGoogle />
            </div>
        </main>
        </>
    )
}