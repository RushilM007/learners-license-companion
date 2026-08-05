import Header from "./Header"
import "./HomeScreen.css"
import "./Questionbank.css"
import React, {useState, useEffect} from "react"
import Questions from "./Questions.js"
import {auth, db} from "./firebase.js"
import {doc, getDoc, updateDoc, setDoc} from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"

export default function Questionbank(){

    const [currentQuestionNumber, updateQuestionNumber] = useState();

    useEffect(()=>{
        setQuestionNumberInFirstRender();
    },[])

    useEffect(()=>{
        storeLastSeenQuestionNumberInDB();
    },[currentQuestionNumber])

    useEffect(()=>{
        document.addEventListener('keydown', detectKeyDown, true);
    },[])

    const detectKeyDown = (e) =>{
        if (e.key === 'ArrowRight'){
            updateQuestionNumber(prev=>prev+1);
        }
        if (e.key === 'ArrowLeft'){
            updateQuestionNumber(prev=>prev-1);
        }

    }

    const navigate = useNavigate();

    const currentQuestion = Questions.filter((question)=>question.id===currentQuestionNumber);

    function storeLastSeenQuestionNumberInDB(){
        auth.onAuthStateChanged((user)=>{
            const docRef=doc(db,"Users", user.uid);
            const data = {
                LastSeenThisQuestion: currentQuestionNumber
            }
            updateDoc(docRef,data);
        })
    };

    async function setQuestionNumberInFirstRender(){
        auth.onAuthStateChanged(async(user)=>{
            const docRef = doc(db,'Users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()){
                updateQuestionNumber(docSnap.data().LastSeenThisQuestion);
            }
        })
    }

    function moveLeft(e){
        let key = e.key;
        if (key == "ArrowRight"){
            updateQuestionNumber(prev=>prev-1);
        } else {
            updateQuestionNumber(prev=>prev-1);
        }


    }

    function displayByCategory(){

    }

    function resetPage(){

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
                functionOne = {()=>navigate("/HomeScreen")}
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
                 
                    {currentQuestionNumber>1 && <button onClick = {()=>updateQuestionNumber(prev=>prev-1)} id = "NavigateQuestionsLeft"><img className = "NavigateBetweenQuestionsSymbol" src = "../public/assets/images/icons/left-arrow.png" alt = "left arrow"/></button>}
                    
                    {currentQuestionNumber < Questions.length && <button onClick = {()=>updateQuestionNumber(prev=>prev+1)} id = "NavigateQuestionsRight"><img  className = "NavigateBetweenQuestionsSymbol" src = "../public/assets/images/icons/right-arrow.png" alt = "right arrow" /></button>}
                   
                </div>

            </section>
            <section id = "displayRightAndWrongCount">
                <img id = "checkMark" src = "../public/assets/images/icons/check.png" alt = "check mark " />
                <p id = "rightCount">100</p>
                <img id = "xMark" src = "../public/assets/images/icons/remove.png" alt = "x mark" />
                <p id = "wrongCount">7</p>

            </section>
        </>
    )
}