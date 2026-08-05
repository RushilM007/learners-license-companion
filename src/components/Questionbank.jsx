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
    const refDropDownCategory = useRef(null)

    const [currentQuestionNumber, updateQuestionNumber] = useState();
    const [displayCategoryError, updateDisplayCategoryError] = useState(false)

    useEffect(()=>{
        ReloadDataInDB();
    },[])

    useEffect(()=>{
        storeDataInDB();
    },[currentQuestionNumber])

    useEffect(()=>{
        document.addEventListener('keydown', detectKeyDown, true);
    },[])

    const currentQuestion = Questions.filter((question)=>question.id===currentQuestionNumber);
    const RoadSignQuestions = Questions.filter((question)=>question.category==="Road Signs");
    const RoadRulesQuestions = Questions.filter((question)=>question.category==="Rules of the Road")
    const GDPQuestions = Questions.filter((question)=>question.category==="General Driving Principles")

    function moveRight(){
        if (refDropDownCategory.current==="Category: Road Signs"){
            if (refCurrentQuestionNumber.current>= RoadSignQuestions[0].id && refCurrentQuestionNumber.current < RoadSignQuestions[RoadSignQuestions.length-1].id){
                updateQuestionNumber(prev=>prev+1)
            }
        } else if (refDropDownCategory.current==="Category: Rules of the Road"){
            if (refCurrentQuestionNumber.current >= RoadRulesQuestions[0].id && refCurrentQuestionNumber.current < RoadRulesQuestions[RoadRulesQuestions.length-1].id)
            updateQuestionNumber(prev=>prev+1)
        } else if (refDropDownCategory.current==="Category: General Driving Principles"){
            if (refCurrentQuestionNumber.current >= GDPQuestions[0].id && refCurrentQuestionNumber.current < GDPQuestions[GDPQuestions.length-1].id){
                updateQuestionNumber(prev=>prev+1)
            }
        } else {
            updateQuestionNumber(prev=>prev+1)
        }
    }

    function moveLeft(){
        console.log(RoadSignQuestions[0].id)
        if (refDropDownCategory.current==="Category: Road Signs"){
            if (refCurrentQuestionNumber.current>= RoadSignQuestions[0].id && refCurrentQuestionNumber.current <= RoadSignQuestions[RoadSignQuestions.length-1].id){
                updateQuestionNumber(prev=>prev-1)
            }
        } else if (refDropDownCategory.current==="Category: Rules of the Road"){
            if (refCurrentQuestionNumber.current > RoadRulesQuestions[0].id && refCurrentQuestionNumber.current < RoadRulesQuestions[RoadRulesQuestions.length-1].id)
            updateQuestionNumber(prev=>prev-1)
        } else if (refDropDownCategory.current==="Category: General Driving Principles"){
            if (refCurrentQuestionNumber.current > GDPQuestions[0].id && refCurrentQuestionNumber.current < GDPQuestions[GDPQuestions.length-1].id){
                updateQuestionNumber(prev=>prev-1)
            }
        } else {
            updateQuestionNumber(prev=>prev-1)
        }
    }

    const detectKeyDown = (e) =>{
        if (e.key === 'ArrowRight'){
            moveRight()
        }
        if (e.key === 'ArrowLeft'){
            moveLeft()
        }
    }

    const navigate = useNavigate();

    function storeDataInDB(){
        auth.onAuthStateChanged((user)=>{
            const docRef=doc(db,"Users", user.uid);
            const data = {
                LastSeenThisQuestion: currentQuestionNumber,
                LastSeenCategory: refDropDownCategory.current
            }
            refCurrentQuestionNumber.current = currentQuestionNumber;
            updateDoc(docRef,data);
        })
    };

    async function ReloadDataInDB(){
        auth.onAuthStateChanged(async(user)=>{
            const docRef = doc(db,'Users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()){
                updateQuestionNumber(docSnap.data().LastSeenThisQuestion);
                refDropDownCategory.current = docSnap.data().LastSeenCategory;
                console.log(refDropDownCategory)
                document.getElementById('DropDownForCategory').value = refDropDownCategory.current
            }
        })
    }

    function jumpToQuestion(e){
        //it should only be within the bound of the category 
        if (refDropDownCategory.current === "Category: Road Signs"){
            if (e.target.valueAsNumber >= RoadSignQuestions[0].id && e.target.valueAsNumber <= RoadSignQuestions[RoadSignQuestions.length-1].id){
                updateDisplayCategoryError(false)
                updateQuestionNumber(e.target.valueAsNumber)
            } else {
                updateDisplayCategoryError(true)
            }
        }  

        if (refDropDownCategory.current === "Category: Rules of the Road"){
            if (e.target.valueAsNumber >= RoadRulesQuestions[0].id && e.target.valueAsNumber <= RoadRulesQuestions[RoadRulesQuestions.length-1].id){
                updateDisplayCategoryError(false)
                updateQuestionNumber(e.target.valueAsNumber)
            } else {
                updateDisplayCategoryError(true)
            }
        }

        if (refDropDownCategory.current === "Category: General Driving Principles"){
            if (e.target.valueAsNumber >= GDPQuestions[0].id && e.target.valueAsNumber <= GDPQuestions[GDPQuestions.length-1].id){
                updateDisplayCategoryError(false)
                updateQuestionNumber(e.target.valueAsNumber)
            } else {
                updateDisplayCategoryError(true)
            }
        } 
        
        if (refDropDownCategory.current === "Category: All"){
            if (e.target.valueAsNumber >= Questions[0].id && e.target.valueAsNumber <= Questions[Questions.length-1].id){
                updateDisplayCategoryError(false)
                updateQuestionNumber(e.target.valueAsNumber)
            } else {
                updateDisplayCategoryError(true)
            }
        } 
    }

    function changeCategory(e){
        refDropDownCategory.current = e.target.value
        console.log(e.target.value)
        if (e.target.value === "Category: Road Signs"){
            const RoadSignQuestions = Questions.filter((question)=>question.category==="Road Signs")
            updateQuestionNumber(RoadSignQuestions[0].id)
            document.getElementById('DropDownForCategory').blur()
            console.log(document.getElementById('DropDownForCategory').value==="Category: Road Signs")

        } else if (e.target.value === "Category: Rules of the Road"){
            const RoadRulesQuestions = Questions.filter((question)=>question.category==="Rules of the Road")
            updateQuestionNumber(RoadRulesQuestions[0].id)
            document.getElementById('DropDownForCategory').blur()


        } else if (e.target.value === "Category: General Driving Principles"){
            const GDPQuestions = Questions.filter((question)=>question.category==="General Driving Principles")
            updateQuestionNumber(GDPQuestions[0].id)
            document.getElementById('DropDownForCategory').blur()

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
                    
                        {currentQuestionNumber>1 && <button onClick = {moveLeft} id = "NavigateQuestionsLeft"><img className = "NavigateBetweenQuestionsSymbol" src = "../public/assets/images/icons/left-arrow.png" alt = "left arrow"/></button>}
                        
                        {currentQuestionNumber < Questions.length && <button onClick = {moveRight} id = "NavigateQuestionsRight"><img  className = "NavigateBetweenQuestionsSymbol" src = "../public/assets/images/icons/right-arrow.png" alt = "right arrow" /></button>}
                    
                    </div>
                </section>
                <section id = "jumpToQuestionBox">
                    <p id = "jumpToQuestionText">Jump to Question: <input type = "number" max = {Questions.length} min = {1} id = "jumpToQuestionInput" onChange={jumpToQuestion}></input></p>
                    {displayCategoryError && <p id = "outOfBoundsErrorMessage">Out of Bounds of Category.</p>}
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