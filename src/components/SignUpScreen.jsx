import {Navigate, Link, useNavigate} from "react-router-dom"
import './SignUpScreen.css'
import React, {useState} from 'react'
import {createUserWithEmailAndPassword} from "firebase/auth"
import {auth, db} from "./firebase"
import {setDoc, doc } from "firebase/firestore"

export default function SignUpScreen(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    async function handleRegister(e){
        e.preventDefault();
        if (firstName === '' || lastName === ''){
            setError("Missing fields")
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
                    firstName: firstName,
                    lastName: lastName
                })
            }
            } catch (error){
                setError(`Firebase Error [${error.code}]: ${error.message}`);
            }
    }

    return (
        <>
        <main>
            <div id = "SignUpCard">

                <h3 id = "SignupCardHeader">Sign Up for Learner's License Companion</h3>

                <form id = "signInForm" onSubmit = {handleRegister}>

                    <label className = "SignupScreenLabel" htmlFor="firstName">First Name</label>

                    <input 
                        className = "SignupScreenInputs" 
                        onChange = {(e)=>setFirstName(e.target.value)} 
                        id = "firstNameInput" 
                        placeholder = "John" 
                    />

                    <label className = "SignupScreenLabel" htmlFor="lastName">Last Name</label>
                    
                    <input 
                        className = "SignupScreenInputs" 
                        onChange = {(e)=>setLastName(e.target.value)} 
                        id = "lastNameInput" 
                        placeholder = "Doe"  
                    />

                    <label className = "SignupScreenLabel" htmlFor="email">Email Address</label>
                    
                    <input 
                        className = "SignupScreenInputs" 
                        onChange = {(e)=>setEmail(e.target.value)} 
                        id = "emailInput" 
                        placeholder = "name@example.com" 
                        type = "email" 
                    />

                    <label className = "SignupScreenLabel" htmlFor="password1">Password</label>

                    <input 
                        className = "SignupScreenInputs" 
                        id = "password1" 
                        placeholder = "••••••••" 
                        type = "password" 
                        name = "password" 
                        onChange = {(e)=>setPassword(e.target.value)}
                    />

                    <label className = "SignupScreenLabel" htmlFor="confirmPassword">Confirm Password</label>

                    <input 
                        className = "SignupScreenInputs" 
                        id = "confirmPassword" 
                        onChange = {(e)=>setConfirmPassword(e.target.value)} 
                        placeholder = "••••••••" 
                        type = "password" 
                    />

                    <button id = "signUpButton">Sign Up</button>

                    <p id = "signInLiner">Have an account? <Link to="/" id = "signUpHyperLink">Login</Link></p>

                    {error!=='' && <p id = "errorMessage">{error}</p>}
                </form>
            </div>
        </main>
        </>
    )
}