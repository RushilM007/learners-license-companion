import React from "react"
import './AuthScreens.css'
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, setDoc, getDoc, addDoc } from "firebase/firestore";
import { Navigate, useNavigate } from "react-router-dom";
import Questions from "./Questions";


export default function SignInWithGoogle(){

    let answers = {}
    for (let i = 1; i < Questions.length+1; i ++){
            answers[i] = 0
        }

    const navigate = useNavigate();

    function handleGoogleSignIn(){
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(async(result)=>{
            const user = result.user
            const docRef = doc(db,"Users",user.uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()){
                navigate("/HomeScreen")
            } else {
                await setDoc(doc(db,"Users", user.uid),{
                    email:user.email,
                    name:user.displayName,
                    LastSeenThisQuestion: 1,
                    LastSeenCategory: "Category: All",
                    answers: answers
                })
                navigate("/HomeScreen")
            }
        })

    }
    return (
        <>
        <div id = "AuthGoogleOption">
            <p className = "AuthDescriptor">--Or continue with --</p>
            <button onClick = {handleGoogleSignIn} id = "BoxInsideGoogleAuth">

                <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="32px" height="32px">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.1-6.68-4.93H1.27v3.15C3.26 21.31 7.32 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.32 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.19 0 10.05 0 12s.46 3.81 1.27 5.42l4.05-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.26 2.69 1.27 6.58l4.05 3.15c.94-2.83 3.57-4.98 6.68-4.98z"/>
                </svg>

                <p id = "SignInWithGoogleTag">Sign In With Google</p>


            </button>

        </div>
        </>
    )
}