import Header from "./Header"
import "./HomeScreen.css"
import "./Questionbank.css"
import React, {useState, useEffect} from "react"
import Questions from "./Questions.js"
import {auth, db} from "./firebase.js"
import {doc, getDoc, updateDoc, setDoc} from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

export default function Questionbank(){

    const [currentQuestionNumber, updateQuestionNumber] = useState();

    const currentQuestion = Questions.filter((question)=>question.id===currentQuestionNumber);

    function storeLastSeenQuestionNumberInDB(){
        auth.onAuthStateChanged((user)=>{
            const docRef=doc(db,"Users", user.uid)
            const data = {
                LastSeenThisQuestion: currentQuestionNumber
            }
            updateDoc(docRef,data)
        })
    };

    async function setQuestionNumberInFirstRender(){
        auth.onAuthStateChanged(async(user)=>{
            const docRef = doc(db,'Users', user.uid)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()){
                updateQuestionNumber(docSnap.data().LastSeenThisQuestion)
            }
        })
    }

    useEffect(()=>{
        storeLastSeenQuestionNumberInDB()
    },[])

    useEffect(()=>{
        fetchUserData()
    },[currentQuestionNumber])

    function decrementQuestionNumber(){
        updateQuestionNumber(prev=>prev-1);
    }

    function incrementQuestionNumber(){
        updateQuestionNumber(prev=>prev+1)
    }

    const displayCurrentQuestion = currentQuestion.map(question=>{
        const displayOptions = question.options.map((option)=>{
            return (
                <>
                <button className = "Answer">{option}</button>
                </>
            )
        })
        
        return (
            <>
            <p className = "Question">{question.question}</p>

            {question.image!==null && <img className = "QuestionImage" src = {question.image} alt = "image, part of question" />}

            <div className = "AnswersBox">
                {displayOptions}
            </div>
            </>
        )
    })

    return(
        <>
        <header className = "HomeScreenHeader">
            <Header 
                title = "Question Bank"
                imagePathOne = "../public/assets/images/icons/home.png"
                altOne = "go to home screen image"
            />
        </header>

            <section id = "ControlPanelBelowHeader">
                <select name = "category" id = "DropDownForCategory">
                    <option>Category: All</option>
                    <option>Category: Road Signs</option>
                    <option>Category: Rules of the Road</option>
                    <option>Category: General Driving Principles</option>
                </select>

                <button className = "refreshButton">
                    <img className = "refreshImage" src = "../public/assets/images/icons/refresh.png" alt = "refresh button" />
                </button>

               
                <div className = "currentQuestionNumberBox"><p className = "CurrentQuestionNumber">Question: {currentQuestionNumber} of {Questions.length}</p></div>

            </section>

            <section className = "QuestionBox">

                {displayCurrentQuestion}

                <div className = "NavigateQuestionsBox">
                 
                    {currentQuestionNumber>1 && <button onClick = {decrementQuestionNumber} id = "NavigateQuestionsLeft"><img className = "NavigateBetweenQuestionsSymbol" src = "../public/assets/images/icons/left-arrow.png" alt = "left arrow"/></button>}
                    
                    {currentQuestionNumber < Questions.length && <button onClick = {incrementQuestionNumber} id = "NavigateQuestionsRight"><img  className = "NavigateBetweenQuestionsSymbol" src = "../public/assets/images/icons/right-arrow.png" alt = "right arrow" /></button>}
                   
                </div>

            </section>
        </>
    )
}