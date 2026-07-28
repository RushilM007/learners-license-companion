import {useEffect, useState} from 'react'
import {auth,db} from "./firebase"
import {doc, getDoc} from "firebase/firestore"
import { useNavigate } from 'react-router-dom'

export default function HomeScreen(){
    const [userDetails, setUserDetails] = useState(null)

    const navigate = useNavigate()

    async function fetchUserData(){
        auth.onAuthStateChanged(async(user)=>{
            const docRef=doc(db,"Users", user.uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()){
                setUserDetails(docSnap.data())
                console.log(docSnap.data())
            } else{
                console.log("user is not logged in")
            }
        })
    };

    function logout(){
        navigate("/")
    }

    useEffect(()=>{
        fetchUserData()
    },[])

    return (
        <>
        {}
        <h1>Home</h1>
        <button onClick = {logout}>Logout</button>
        </>
    )
}