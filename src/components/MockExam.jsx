import "./MockExam.css"
import Header from "./Header"
import React, {useState, useEffect, useRef, useMemo} from "react"
import { useNavigate } from "react-router-dom"
import { chooseTwentyQuestions } from "./Questions"
import {clsx} from 'clsx'
import { getFeedbackFromClaude } from "./MockExamAi"
import ReactMarkdown from "react-markdown"
import { auth, db } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"

export default function MockExam(){
    const navigate = useNavigate(); 

    // being "outside start screen" refers to answering all the questions and then viewing performance report. 
    const [outsideStartScreen, setOutsideStartScreen] = useState(false);
    
    // starting from index 0, it goes from 0 to 19. each element in the array is a question from questions.js 
    const [questions, updateQuestions] = useState(chooseTwentyQuestions());

    //goes from 0 to 19, corresponds to index in questions state 
    const [currentQuestionIndex, updateCurrentQuestionIndex] = useState(0);

    //goes from 0 to 19, each key corresponds to question in questions. This stores all the user's answers
    const [answers, setAnswers] = useState({});

    //for rendering the selected option in peach
    const [currentQuestionSelectedOption, setCurrentQuestionSelectedOption] = useState({})

    //for knowing if the "move to next question" button should be rendered or not. 
    const [isAnswerSelected, setIsAnswerSelected] = useState(false)

    // user has finished all 20( 0 to 19 indexes) questions. 
    const [questionsFinished, setQuestionsFinished] = useState(false)

    // all these correspond to the timer 
    const [secondsLeft, setSecondsLeft] = useState(30);
    const [isRunning, setIsRunning] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const intervalRef = useRef(null);

    //keep track of right and wrong count 
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [wrongAnswerCount, setWrongAnswerCount] = useState(0);

    // to store feedback 
    const [feedback, setFeedback] = useState("")

    const [bookmarkData, updateBookmarkData] = useState({})
    const [dataLoaded, setDataLoaded] = useState(false)


    useEffect(()=>{
            const unsub = onAuthStateChanged(auth, (user)=>{
                if (user){
                    setDataLoaded(false)
                    ReloadDataInDB()
                }
            })
            //once react unmounts unsub 
            return () => unsub()
        },[])

    useEffect(()=>{
        // everytime a bookmark is removed or added, log that in the DB. 
        logBookmarkChanges()
    },[bookmarkData])
    
    
    useEffect(()=>{
        if (isRunning && secondsLeft > 0){
            intervalRef.current = setInterval(()=>{
                setSecondsLeft((prev)=>prev-1);
            }, 1000)
        }
        if (secondsLeft === 0){
            clearInterval(intervalRef.current);
            updateCurrentQuestionIndex(prev=>prev+1);
            setWrongAnswerCount(prev=>prev+1)
            setSecondsLeft(30);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, secondsLeft, currentQuestionIndex])

    useEffect(()=>{
        async function checkIfEightAreWrong(){
                if (wrongAnswerCount === 8 ){
                setQuestionsFinished(true)
                setIsRunning(false)
                await getFeedback()
            }
        }
        checkIfEightAreWrong()
    },[wrongAnswerCount])

    async function ReloadDataInDB(){
        const user = auth.currentUser
        const docRef = doc(db,'Users', user.uid);
        const docSnap = await getDoc(docRef)

        updateBookmarkData(docSnap.data().bookmarkData)
        setDataLoaded(true)
    }

    async function logBookmarkChanges(){
        if (!dataLoaded){return}
        const user = auth.currentUser;
        const docRef=doc(db,"Users", user.uid);
        const data = {
            bookmarkData:bookmarkData
        }
        await updateDoc(docRef, data)
    }
    

    async function getFeedback(){
        //this array is structured in a way that it is simpler for claude to analyze results. 
        let ArrayForClaude = []

        for (let i = 0; i <= Object.keys(answers).length-1; i ++){
            ArrayForClaude.push({
                category: questions[i].category,
                question: questions[i].question,
                isCorrect: answers[i]===questions[i].correctAnswerIndex
            })
        }
        const feedback = await getFeedbackFromClaude(ArrayForClaude)
        setFeedback(feedback)
    }

    function returnToMockExamStartScreen(){

        const confirmed = window.confirm("Confirm that you would like to return to the start screen");
        if (!confirmed){
            return;
        }

        updateCurrentQuestionIndex(0);
        updateQuestions(chooseTwentyQuestions());
        setOutsideStartScreen(false);
        setAnswers({})
        setHasStarted(false);
        setCorrectAnswerCount(0)
        setWrongAnswerCount(0)
        setQuestionsFinished(false)
        setCurrentQuestionSelectedOption({})
        setFeedback("")
    }


    function handleClickingAnswer(index){
        setIsAnswerSelected(true)
        //once an answer is clicked, check if it is right or wrong then add the answers dict and then change the question 
        setAnswers({
            ...answers,
            [currentQuestionIndex]: index
        })
        setCurrentQuestionSelectedOption({
            [index]: true
        })

    }

    async function nextQuestion(){
       
        //reset IsAnswerSelected and currentQuestionSelectedOption for next question. 
        setIsAnswerSelected(false)
        setCurrentQuestionSelectedOption({})

        if (questions[currentQuestionIndex].correctAnswerIndex === answers[currentQuestionIndex]){
            setCorrectAnswerCount(prev=>prev+1)
        } else {
            setWrongAnswerCount(prev=>prev+1)
        }
        if (currentQuestionIndex <= 18){
            updateCurrentQuestionIndex(prev=>prev+1)
        }
        setSecondsLeft(30)
        console.log(wrongAnswerCount)

        if (currentQuestionIndex === 19){
            setQuestionsFinished(true)
            await getFeedback()
        }

    }

    
    function toggleExam(){
        setOutsideStartScreen(true);
        setHasStarted(true);
        setIsRunning(true);
        setSecondsLeft(30);
        setQuestionsFinished(false)
    }

    const currentQuestion = currentQuestionIndex <= 19 ? [questions[currentQuestionIndex]]: null;

    const displayCurrentQuestion = currentQuestionIndex <= 19 ? currentQuestion.map(question=>{
                function toggleBookmark(){
            let newData;
            if (bookmarkData[question.id]===null){
                newData = true
            } else if (bookmarkData[question.id]===true){
                newData = false
            } else if (bookmarkData[question.id]===false){
                newData = true
            }
            updateBookmarkData({
                    ...bookmarkData,
                    [question.id]:  newData
                })   
                } 

       
            const displayOptions = question.options.map((option, index)=>{
                return (
                    <button id = {index} key = {option} onClick = {()=>handleClickingAnswer(index)}
                    className = {clsx("Answer", currentQuestionSelectedOption[index]===true&&"AnswerSelectedMockExam")}
                    >{option}</button>
                )
            })
            
            return (
                <section key = {1}>
                <button key = {2} onClick = {toggleBookmark} className = "BookmarkButton"><img className = "Bookmark" src = {(bookmarkData[question.id]===false|| bookmarkData[question.id]===null)?"../assets/images/icons/bookmark-white.png":"../assets/images/icons/bookmark.png"} alt = "bookmark unchecked"></img></button>
                <p key = {question.question} className = "Question">{question.question}</p>
                {question.image!==null && <div id = "QuestionImageContainer"><img key = {question.image} className = "QuestionImage" src = {question.image} alt = "image, part of question" /></div>}
                <div className = "AnswersBox">
                    {displayOptions}
                </div>
                {isAnswerSelected && <button key = {5} className = "NextButton" onClick = {()=>nextQuestion()}><img className = "NavigateMockExamImage" src = "../assets/images/icons/right-arrow.png" alt = "next button" /></button>}
                </section>
            )
        }): null
    

    return (
        <>
        <header className = "HomeScreenHeader">
                    {!outsideStartScreen && <Header 
                        title = "Mock Exam"
                        imagePathOne = "../assets/images/icons/home.png"
                        altOne = "go to home screen image"
                        functionOne = {()=>navigate("/HomeScreen")}
                    />}
                    {(outsideStartScreen && !questionsFinished) && <Header 
                        title = "Mock Exam"
                        imagePathOne = "../assets/images/icons/back.png"
                        altOne = "back image"
                        functionOne = {()=>returnToMockExamStartScreen()}
                        imagePathTwo = "../assets/images/icons/home.png"
                        altTwo = "go to home screen image"
                        functionTwo = {()=>navigate("/HomeScreen")}
                    />}

        </header>

        {!outsideStartScreen && <div className = "ExamPreStartScreen">
            <p>There will be 20 questions. You get 30 seconds to answer each question. You need atleast a 12/20 to pass. You 
                automatically fail if you get 8 wrong. 
            </p>
            <button className = "StartExamButton" onClick = {toggleExam}>Start Exam</button>
        </div>}

        {(outsideStartScreen && !questionsFinished) &&
        <>
        <section className = "TimerAndQuestionAndRightWrongContainer">
            <section className = "TimerImageAndTimerAndRightWrong">
                <img className = "TimerImage" src = "../assets/images/icons/stopwatch.png" alt = "timer" />
                <p className = {secondsLeft <=5?"LessThanFiveSecsLeft":"SecondsLeft"}>{secondsLeft}</p>
                <img id = "CheckMarkMockExam" src = "../assets/images/icons/check.png" alt = "check mark " />
                <p className = "CorrectAnswerCountMockExam">{correctAnswerCount}</p>
                <img id = "XMarkMockExam" src = "../assets/images/icons/remove.png" alt = "x mark" />
                <p className = "WrongAnswerCountMockExam">{wrongAnswerCount}</p>
            </section>
        
            <section className = "QuestionBoxMockExam">
                    {displayCurrentQuestion}
            </section>

        </section>
        </>}
        {(questionsFinished &&  outsideStartScreen) &&
            <>
            <section className = "PerformanceReport">
            <h1>Performance Report</h1>
            <p>You got {correctAnswerCount} right. You got {wrongAnswerCount} wrong. {wrongAnswerCount <8 ? "You passed": "You failed"}</p>
            <h5>Claude's Feedback: </h5>
            <p><ReactMarkdown>{feedback===""?"Claude is generating your feedback...":feedback}</ReactMarkdown></p>
            {feedback && <button className = "ReturnToStartScreen" onClick = {()=>returnToMockExamStartScreen()}>Return to Start Screen</button>}
            </section>
            </>
        }
        </>
    )
}