import Header from "./Header"
import "./HomeScreen.css"
import "./Questionbank.css"
import React, {useState, useEffect, useRef} from "react"
import Questions from "./Questions.js"
import {auth, db} from "./firebase.js"
import {doc, getDoc, updateDoc, setDoc} from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import {clsx} from 'clsx'

export default function Questionbank(){

    const refCurrentQuestionNumber = useRef(null)
    const refDropDownCategory = useRef(null)

    const [currentQuestionNumber, updateQuestionNumber] = useState();
    const [displayCategoryError, updateDisplayCategoryError] = useState(false)
    const [answers, updateAnswers] = useState({})
    const [rightAnswerCount, updateRightAnswerCount] = useState()
    const [wrongAnswerCount, updateWrongAnswerCount] = useState()
    const [dataLoaded, setDataLoaded] = useState(false)

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (user)=>{
            if (user){
                setDataLoaded(false)
                ReloadDataInDB();
            }
        })
        return () => unsub()
    },[])

    useEffect(()=>{
        storeDataInDB();
    },[currentQuestionNumber])

    useEffect(()=>{
        document.addEventListener('keydown', detectKeyDown, true);
    },[])

    useEffect(()=>{
        storeAnswers()
    }, [answers])

    const currentQuestion = Questions.filter((question)=>question.id===currentQuestionNumber);
    const RoadSignQuestions = Questions.filter((question)=>question.category==="Road Signs");
    const RoadRulesQuestions = Questions.filter((question)=>question.category==="Rules of the Road")
    const GDPQuestions = Questions.filter((question)=>question.category==="General Driving Principles")

    let answersEmptyDict = {}
        for (let i = 1; i < Questions.length+1; i ++){
                answersEmptyDict[i] = null
            }
    

    async function resetAllProgress(){
        const user = auth.currentUser
        const docRef=doc(db,"Users", user.uid);
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()){
            const data = {
            LastSeenThisQuestion: 1,
            LastSeenCategory: "Category: All",
            rightAnswerCount: 0,
            wrongAnswerCount: 0,
            answers: answersEmptyDict
            }
            // refCurrentQuestionNumber.current = currentQuestionNumber;
            updateDoc(docRef,data);
        }
        
        window.location.reload()


    }

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

    async function storeDataInDB(){
        if (!dataLoaded) return;
        const user = auth.currentUser
        if (!user) return

        const docRef=doc(db,"Users", user.uid);
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()){
            const data = {
            LastSeenThisQuestion: currentQuestionNumber,
            LastSeenCategory: refDropDownCategory.current
            }
            refCurrentQuestionNumber.current = currentQuestionNumber;
            updateDoc(docRef,data);
        }
    };

    //answers state is updated with the answers dict in db. 
    async function ReloadDataInDB(){
        const user = auth.currentUser
        if (!user) return;
        const docRef = doc(db,'Users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()){
            updateQuestionNumber(docSnap.data().LastSeenThisQuestion);
            refDropDownCategory.current = docSnap.data().LastSeenCategory;
            document.getElementById('DropDownForCategory').value = refDropDownCategory.current
            console.log(docSnap.data().answers)
            updateAnswers(docSnap.data().answers)
            updateRightAnswerCount(docSnap.data().rightAnswerCount)
            updateWrongAnswerCount(docSnap.data().wrongAnswerCount)
            console.log(answers)
        }
        setDataLoaded(true)
        
    }

    function storeAnswers(){ // count here 
            if (!dataLoaded) return;
            const user = auth.currentUser;
            console.log(user)
            if (!user) return;
            const docRef = doc(db,'Users', user.uid);
            const data = {
                answers: answers,
                wrongAnswerCount: wrongAnswerCount,
                rightAnswerCount: rightAnswerCount
            }
            updateDoc(docRef,data)
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
        if (e.target.value === "Category: Road Signs"){
            const RoadSignQuestions = Questions.filter((question)=>question.category==="Road Signs")
            updateQuestionNumber(RoadSignQuestions[0].id)
            document.getElementById('DropDownForCategory').blur()

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

        function handleClickingAnswer(question, index){
            if (answers[question.id]!=null){
                return;
            }
            updateAnswers({
                ...answers,
                [question.id]: index
            })

            if (question.correctAnswerIndex===index){
                updateRightAnswerCount(prev=>prev+1)
            } else {
                updateWrongAnswerCount(prev=>prev+1)
            }
        }

        const displayOptions = question.options.map((option, index)=>{
            return (
                <>
                <button id = {index} key = {index} onClick = {()=>handleClickingAnswer(question, index)} 
                className = {
                    clsx({
                        "Answer":answers[question.id]===null || (answers[question.id]!=null && index!=question.correctAnswerIndex || index!=answers[question.id]) ,

                        //question is answered and 
                        "rightAnswer":(answers[question.id]!=null && index===question.correctAnswerIndex),

                        //if option is the user's answer and answer is incorrect
                        "wrongAnswer": (answers[question.id]!= question.correctAnswerIndex && index===answers[question.id])

                    })
                }
                >{option}</button>
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
                imagePathOne = "..assets/images/icons/home.png"
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

                <button onClick = {resetAllProgress} className = "refreshButton">
                    <img className = "refreshImage" src = "..assets/images/icons/refresh.png" alt = "refresh button" />
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
                <img id = "checkMark" src = "..assets/images/icons/check.png" alt = "check mark " />
                <p id = "rightCount">{rightAnswerCount}</p>
                <img id = "xMark" src = "..assets/images/icons/remove.png" alt = "x mark" />
                <p id = "wrongCount">{wrongAnswerCount}</p>

            </section>
        </>
    )
}