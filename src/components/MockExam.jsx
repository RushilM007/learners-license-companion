import "./MockExam.css"
import Header from "./Header"
import React, {useState, useEffect, useRef, useMemo} from "react"
import { useNavigate } from "react-router-dom"
import { chooseTwentyQuestions } from "./Questions"
import {clsx} from 'clsx'

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

    useEffect(()=>{
        if (isRunning && secondsLeft > 0){
            intervalRef.current = setInterval(()=>{
                setSecondsLeft((prev)=>prev-1);
            }, 1000)
        }
        if (secondsLeft === 0){
            clearInterval(intervalRef.current);
            updateCurrentQuestionIndex(prev=>prev+1);
            setSecondsLeft(30);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, secondsLeft, currentQuestionIndex])

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

    function nextQuestion(){
       
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
        
        //end exam if on the 19th index (20th question)

        if (currentQuestionIndex === 19){
            setQuestionsFinished(true)
            return;
        }

    }

    function toggleExam(){
        setOutsideStartScreen(true);
        setHasStarted(true);
        setIsRunning(true);
        setSecondsLeft(30);
        setExamFinished(false)
    }

    const currentQuestion = currentQuestionIndex <= 19 ? [questions[currentQuestionIndex]]: null;

    const displayCurrentQuestion = currentQuestionIndex <= 19 ? currentQuestion.map(question=>{
       
            const displayOptions = question.options.map((option, index)=>{
                return (
                    <button id = {index} key = {option} onClick = {()=>handleClickingAnswer(index)}
                    className = {clsx("Answer", currentQuestionSelectedOption[index]===true&&"AnswerSelectedMockExam")}
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
                {isAnswerSelected && <button key = {2} className = "NextButton" onClick = {()=>nextQuestion()}><img className = "NavigateMockExamImage" src = "../assets/images/icons/right-arrow.png" alt = "next button" /></button>}
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
            <p>There will be 20 questions. You get 30 seconds to answer each question. You need atleast a 12/20 to pass.</p>
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
            <h4> You got {wrongAnswerCount} wrong. </h4>
            <h4> You got {correctAnswerCount} right. </h4>
            {wrongAnswerCount <8 ? "You passed": "You failed"}
            <button className = "ReturnToStartScreen" onClick = {()=>returnToMockExamStartScreen()}>Return to Start Screen</button>
            </section>
            </>

        }
        </>
    )
}