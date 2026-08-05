import Header from "./Header"
import "./HomeScreen.css"
import "./Questionbank.css"
import React, {useState, useEffect, useRef} from "react"
import Questions from "./Questions.js"
import {auth, db} from "./firebase.js"
import {doc, getDoc, updateDoc, setDoc} from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"

export default function Questionbank(){

    const refCurrentQuestionNumber = useRef(null)

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
            if (refCurrentQuestionNumber.current < Questions.length){
                updateQuestionNumber(prev=>prev+1);
            }
        }
        if (e.key === 'ArrowLeft'){
            if (refCurrentQuestionNumber.current >1){
            updateQuestionNumber(prev=>prev-1);
        }
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
            refCurrentQuestionNumber.current = currentQuestionNumber;
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

    function jumpToQuestion(e){
        if (e.target.valueAsNumber > 0 && e.target.valueAsNumber<Questions.length+1){
            updateQuestionNumber(e.target.valueAsNumber)
        }
    }

    function changeCategory(e){
        console.log(e.target.value)
        if (e.target.value === "Category: Road Signs"){
            const firstRoadSignQuestion = Questions.filter((question)=>question.category==="Road Signs")
            updateQuestionNumber(firstRoadSignQuestion[0].id)
        } else if (e.target.value === "Category: Rules of the Road"){
            const firstRoadRulesQuestion = Questions.filter((question)=>question.category==="Rules of the Road")
            updateQuestionNumber(firstRoadRulesQuestion[0].id)
        } else if (e.target.value === "Category: General Driving Principles"){
            const firstGDPQuestion = Questions.filter((question)=>question.category==="General Driving Principles")
            updateQuestionNumber(firstGDPQuestion[0].id)
        }
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
                <select name = "category" id = "DropDownForCategory" onChange = {changeCategory}>
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

            <section id ="QuestionBoxAndJumpQuestion">
                <section className = "QuestionBox">

                    {displayCurrentQuestion}

                    <div className = "NavigateQuestionsBox">
                    
                        {currentQuestionNumber>1 && <button onClick = {()=>updateQuestionNumber(prev=>prev-1)} id = "NavigateQuestionsLeft"><img className = "NavigateBetweenQuestionsSymbol" src = "../public/assets/images/icons/left-arrow.png" alt = "left arrow"/></button>}
                        
                        {currentQuestionNumber < Questions.length && <button onClick = {()=>updateQuestionNumber(prev=>prev+1)} id = "NavigateQuestionsRight"><img  className = "NavigateBetweenQuestionsSymbol" src = "../public/assets/images/icons/right-arrow.png" alt = "right arrow" /></button>}
                    
                    </div>
                </section>
                <section id = "jumpToQuestionBox">
                    <p id = "jumpToQuestionText">Jump to Question: <input type = "number" max = {Questions.length} min = {1} id = "jumpToQuestionInput" onChange={jumpToQuestion}></input></p>
                </section>
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