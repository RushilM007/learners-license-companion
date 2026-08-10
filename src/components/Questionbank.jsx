import Header from "./Header"
import "./HomeScreen.css"
import "./Questionbank.css"
import React, {useState, useEffect, useRef,useMemo} from "react"
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

    const navigate = useNavigate();

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
        storeLastSeenQuestionAndCategory();
    },[currentQuestionNumber])

    useEffect(()=>{
        document.addEventListener('keydown', detectKeyDown, true);
    },[])

    useEffect(()=>{
        storeAnswersAndRightWrongCount()
    }, [answers])

    const answersEmptyDict = useMemo(()=>{
        let answersEmptyDict1 = {};
        for (let i = 1; i < Questions.length+1; i++){
            answersEmptyDict1[i] = null;
        }
        return answersEmptyDict1
    },[])

    const currentQuestion = useMemo(() => {return Questions.filter((question)=>question.id===currentQuestionNumber)} , [moveLeft, moveRight]);
    // const currentQuestion = Questions.filter((question)=>question.id===currentQuestionNumber)
    const RoadSignQuestions = useMemo(()=>{ return Questions.filter((question)=>question.category==="Road Signs")}, [])
    const RoadRulesQuestions = useMemo(()=>{return Questions.filter((question)=>question.category==="Rules of the Road")}, [])
    const GDPQuestions = useMemo(()=>{ return Questions.filter((question)=>question.category==="General Driving Principles")},[]);

    async function resetAllProgress(){
        const user = auth.currentUser
        const docRef=doc(db,"Users", user.uid);

        const data = {
        LastSeenThisQuestion: 1,
        LastSeenCategory: "Category: All",
        rightAnswerCount: 0,
        wrongAnswerCount: 0,
        answers: answersEmptyDict
        }
        updateDoc(docRef,data);

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

    //detect if left or right arrow keys were pressed and then navigate questions accordingly. 
    //probably add a cooldown timer?
    function detectKeyDown(e){
        if (e.key === 'ArrowRight'){
            moveRight()
        }
        if (e.key === 'ArrowLeft'){
            moveLeft()
        }
    }

    // this function should run every time the question number or category changes. 
    async function storeLastSeenQuestionAndCategory(){
        if (!dataLoaded) return;
        const user = auth.currentUser;
        if (!user) return;
        const docRef=doc(db,"Users", user.uid);

        const data = {
        LastSeenThisQuestion: currentQuestionNumber,
        LastSeenCategory: refDropDownCategory.current
            }

        refCurrentQuestionNumber.current = currentQuestionNumber;
        updateDoc(docRef,data);
    };

    //when user comes back to the question bank module, this should reload. 
    async function ReloadDataInDB(){
        const user = auth.currentUser
        if (!user) return;
        const docRef = doc(db,'Users', user.uid);
        const docSnap = await getDoc(docRef)

        updateQuestionNumber(docSnap.data().LastSeenThisQuestion);
        refDropDownCategory.current = docSnap.data().LastSeenCategory;
        document.getElementById('DropDownForCategory').value = refDropDownCategory.current
        updateAnswers(docSnap.data().answers)
        updateRightAnswerCount(docSnap.data().rightAnswerCount)
        updateWrongAnswerCount(docSnap.data().wrongAnswerCount)
        setDataLoaded(true)
        
    }

    // everytime the user clicks an answer, this should change. 
    function storeAnswersAndRightWrongCount(){ 
            if (!dataLoaded) return;
            const user = auth.currentUser;
            if (!user) return;
            const docRef = doc(db,'Users', user.uid);
            const data = {
                answers: answers,
                wrongAnswerCount: wrongAnswerCount,
                rightAnswerCount: rightAnswerCount
            }
            updateDoc(docRef,data)
    }

    //when the user enters a question to jump to, this function enables displaying that question. 
    //itll happen only if the question the user entered is within the category of questions that they selected. 
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

    //change the set of questions displayed to the user when they select a different category. 
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
            //if question has already been answered do not take a new answer
            if (answers[question.id]!=null){
                return;
            }

            // If question hasn't been answered before, add user's selected answer to the answers dict. 
            updateAnswers({
                ...answers,
                [question.id]: index
            })

            //update right answer count if user answer was correct, otherwise update wrong answer count 
            if (question.correctAnswerIndex===index){
                updateRightAnswerCount(prev=>prev+1)
            } else {
                updateWrongAnswerCount(prev=>prev+1)
            }
        }

        const displayOptions = question.options.map((option, index)=>{
            return (
                <button id = {index} key = {option} onClick = {()=>handleClickingAnswer(question, index)} 
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
            )
        })
        
        return (
            <section key = {1}>
            <p key = {question.question} className = "Question">{question.question}</p>

            {question.image!==null && <img key = {question.image} className = "QuestionImage" src = {question.image} alt = "image, part of question" />}

            <div className = "AnswersBox">
                {displayOptions}
            </div>
            </section>
        )
    })

    return(
        <>
        <header className = "HomeScreenHeader">
            <Header 
                title = "Question Bank"
                imagePathOne = "../assets/images/icons/home.png"
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
                <img className = "refreshImage" src = "../assets/images/icons/refresh.png" alt = "refresh button" />
            </button>

            <div className = "currentQuestionNumberBox"><p className = "CurrentQuestionNumber">Question: {currentQuestionNumber} of {Questions.length}</p></div>

        </section>

        <section id ="QuestionBoxAndJumpQuestion">

            <section className = "QuestionBox">

                {displayCurrentQuestion}

                <div className = "NavigateQuestionsBox">
                
                    {currentQuestionNumber>1 && <button onClick = {moveLeft} id = "NavigateQuestionsLeft"><img className = "NavigateBetweenQuestionsSymbol" src = "../assets/images/icons/left-arrow.png" alt = "left arrow"/></button>}
                    
                    {currentQuestionNumber < Questions.length && <button onClick = {moveRight} id = "NavigateQuestionsRight"><img  className = "NavigateBetweenQuestionsSymbol" src = "../assets/images/icons/right-arrow.png" alt = "right arrow" /></button>}
                
                </div>
            </section>

            <section id = "jumpToQuestionBox">
                <p id = "jumpToQuestionText">Jump to Question: <input type = "number" max = {Questions.length} min = {1} id = "jumpToQuestionInput" onChange={jumpToQuestion}></input></p>
                {displayCategoryError && <p id = "outOfBoundsErrorMessage">Out of Bounds of Category.</p>}
            </section>

        </section>

        <section id = "displayRightAndWrongCount">

            <img id = "checkMark" src = "../assets/images/icons/check.png" alt = "check mark " />
            <p id = "rightCount">{rightAnswerCount}</p>
            <img id = "xMark" src = "../assets/images/icons/remove.png" alt = "x mark" />
            <p id = "wrongCount">{wrongAnswerCount}</p>

        </section>
        </>
    )
}