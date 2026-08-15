import "./MockExam.css"
import Header from "./Header"
import React, {useState, useEffect, useRef, useMemo} from "react"
import { useNavigate } from "react-router-dom"
import { chooseTwentyQuestions } from "./Questions"
import {clsx} from 'clsx'

export default function MockExam(){
    //first do not worry about database and just create the basic interface 
    const navigate = useNavigate(); 

    const [inExam, updateInExam] = useState(false);
    const [questions, updateQuestions] = useState(chooseTwentyQuestions());
    const [currentQuestionNumber, updateQuestionNumber] = useState(1);
    const [answers, setAnswers] = useState({});
    const [secondsLeft, setSecondsLeft] = useState(30);
    const [isRunning, setIsRunning] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
    const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
    const intervalRef = useRef(null);

    const answerKey = useMemo(()=>{
        let answerkey1 = {};
        for (let i = 0; i < 20; i++){
            answerkey1[i] = questions[i].options[questions[i].correctAnswerIndex]
        }
        return answerkey1

    }, [])

    useEffect(()=>{
        if (isRunning && secondsLeft > 0){
            intervalRef.current = setInterval(()=>{
                setSecondsLeft((prev)=>prev-1);
            }, 1000)
        }
        if (secondsLeft === 0){
            clearInterval(intervalRef.current);
            updateQuestionNumber(prev=>prev+1);
            setSecondsLeft(30);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, secondsLeft, currentQuestionNumber])


    function exitExam(){
        updateQuestionNumber(1);
        updateQuestions(chooseTwentyQuestions());
        updateInExam(false);
    }

    function nextQuestion(index){
        setAnswers({
            ...answers,
            [currentQuestionNumber]: index
        })
        updateQuestionNumber(prev=>prev+1);
        setSecondsLeft(30);
    }

    function toggleExam(){
        updateInExam(true);
        setHasStarted(true);
        setIsRunning(true);
        setSecondsLeft(30);
    }

    const currentQuestion = [questions[currentQuestionNumber]];

    const displayCurrentQuestion = currentQuestion.map(question=>{
       
            const displayOptions = question.options.map((option, index)=>{
                return (
                    <button id = {index} key = {option} onClick = {()=>nextQuestion(index)}
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
                <img className = "TimerImage" src = "../assets/images/icons/stopwatch.png" alt = "timer" /><p className = {secondsLeft <=5?"LessThanFiveSecsLeft":"SecondsLeft"}>{secondsLeft}</p>
            </section>
            <section className = "QuestionBoxMockExam">
                    {displayCurrentQuestion}
            </section>
        </section>
        </>}
        </>
    )
}