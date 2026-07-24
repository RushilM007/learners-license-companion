import React from "react"
import './LoginScreen.css'

export default function LoginScreen(){
    return (
        <>
        <main>
            <div id = "LoginCard">
                <h3 id = "loginCardHeader">Sign in to Learner's License Companion</h3>
                <form id = "signInForm">
                    <label className = "loginScreenLabel" htmlFor="email">Email Address</label>
                    <input className = "loginScreenInputs" id = "emailInput" placeholder = "name@example.com" type = "email" name = "email" />
                    <label className = "loginScreenLabel" htmlFor="password">Password</label>
                    <input className = "loginScreenInputs" id = "password" placeholder = "••••••••" type = "password" name = "password" />
                    <a id = "forgotPassword">Forgot Password?</a>
                    <button id = "signInButton">Sign In</button>

                    <hr></hr>

                    <p id = "signUpLiner">Don't have an account? <a id = "signUpHyperLink">Sign Up</a></p>
                </form>

            </div>
        </main>
        </>
        

    )
}