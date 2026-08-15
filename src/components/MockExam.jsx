import "./MockExam.css"
import Header from "./Header"
import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { chooseTwentyQuestions } from "./Questions"
import {clsx} from 'clsx'

export default function MockExam(){
    //first do not worry about database and just create the basic interface 
    const navigate = useNavigate();

    const [inExam, updateInExam] = useState(false)
    const [questions, updateQuestions] = useState(chooseTwentyQuestions())
    const [currentQuestionNumber, updateQuestionNumber] = useState(1)
    const [timer, setTimer] = useState(30)
    const [isTimerRunning, setIsTimerRunning] = useState(false)

    useEffect(()=>{
        if ( timer > 0 && inExam){
            setTimeout(()=>{
                setTimer(prev=>prev-1)
            }, 1000)
        } else if ( inExam && timer === 0){
            setTimer(30)
            updateQuestionNumber(prev=>prev+1)

        }
    },[timer, inExam])

    function exitExam(){
        updateQuestionNumber(1)
        updateQuestions(chooseTwentyQuestions())
        updateInExam(false)
        setTimer(30)
    }

    function toggleExam(){
        updateInExam(true)
    }

    const currentQuestion = [questions[currentQuestionNumber]]
    console.log(currentQuestion)

    const displayCurrentQuestion = currentQuestion.map(question=>{
       
            const displayOptions = question.options.map((option, index)=>{
                return (
                    <button id = {index} key = {option} onClick = {()=>handleClickingAnswer(question, index)} 
                    className = "Answer" 
                    >{option}</button>
                )
            })
            
            return (
                <section key = {1}>
                <p key = {question.question} className = "Question">{question.question}</p>
                {question.image!==null && <div id = "QuestionImageContainer"><img key = {question.image} className = "QuestionImage" src = {question.image} alt = "image, part of question" /></div>}
                <div className = "AnswersBox">
                    {displayOptions}
                </div>
                </section>
            )
        })

    return (
        <>
        <header className = "HomeScreenHeader">
                    {!inExam && <Header 
                        title = "Mock Exam"
                        imagePathOne = "../assets/images/icons/home.png"
                        altOne = "go to home screen image"
                        functionOne = {()=>navigate("/HomeScreen")}
                    />}
                    {inExam && <Header 
                        title = "Mock Exam"
                        imagePathOne = "../assets/images/icons/back.png"
                        altOne = "back image"
                        functionOne = {()=>exitExam()}
                        imagePathTwo = "../assets/images/icons/home.png"
                        altTwo = "go to home screen image"
                        functionTwo = {()=>navigate("/HomeScreen")}
                    />}

        </header>

        {!inExam && <div className = "ExamPreStartScreen">
            <p>There will be 20 questions. You get 30 seconds to answer each question. You need atleast a 12/20 to pass.</p>
            <button className = "StartExamButton" onClick = {toggleExam}>Start Exam</button>
        </div>}

        {inExam && 
        <>
        <section className = "TimerAndQuestionContainer">
            <section className = "TimerImageAndTimer">
                <img className = "TimerImage" src = "../assets/images/icons/stopwatch.png" alt = "timer" /><p>{timer}</p>
            </section>
            <section className = "QuestionBoxMockExam">
                    {displayCurrentQuestion}
            </section>
        </section>
        </>}
        </>
    )
}