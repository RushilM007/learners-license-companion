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
    const navigate = useNavigate();

    const refCurrentQuestionNumber = useRef(null)
    const refDropDownCategory = useRef(null)
    const [currentQuestionNumber, updateQuestionNumber] = useState();
    const [category, setCategory] = useState()
    const [displayCategoryError, updateDisplayCategoryError] = useState(false)
    const [answers, updateAnswers] = useState({})
    const [bookmarkData, updateBookmarkData] = useState({})
    const [rightAnswerCount, updateRightAnswerCount] = useState()
    const [wrongAnswerCount, updateWrongAnswerCount] = useState()
    const [dataLoaded, setDataLoaded] = useState(false)

    const answersEmptyDict = useMemo(()=>{
        let answersEmptyDict1 = {};
        for (let i = 1; i < Questions.length+1; i++){
            answersEmptyDict1[i] = null;
        }
        return answersEmptyDict1
    },[])

    const currentQuestion = useMemo(() => {return Questions.filter((question)=>question.id===currentQuestionNumber)} , [moveLeft, moveRight]);
    const RoadSignQuestions = useMemo(()=>{ return Questions.filter((question)=>question.category==="Road Signs")}, [])
    const RoadRulesQuestions = useMemo(()=>{return Questions.filter((question)=>question.category==="Rules of the Road")}, [])
    const GDPQuestions = useMemo(()=>{ return Questions.filter((question)=>question.category==="General Driving Principles")},[]);
    const bookmarkedQuestions = useMemo(()=>{ return Questions.filter((question)=>bookmarkData[question.id]===true)}, [bookmarkData])

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
        //everytime question number changes, store the user's latest question number and selected category in DB. 
        storeLastSeenQuestionAndCategory();
    },[currentQuestionNumber])

    useEffect(()=>{
        document.addEventListener('keydown', detectKeyDown, true);
        return () => document.removeEventListener('keydown', detectKeyDown, true);
    },[currentQuestionNumber, bookmarkedQuestions])

    useEffect(()=>{
        //everytime the user selects an answer, store the answer and calculated right/wrong counts in DB. 
        storeAnswersAndRightWrongCount()
    }, [answers])

    useEffect(()=>{
        // everytime a bookmark is removed or added, log that in the DB. 
        logBookmarkChanges()
    },[bookmarkData])
    
    async function logBookmarkChanges(){
        if (!dataLoaded) return;

        const user = auth.currentUser;
        const docRef=doc(db,"Users", user.uid);
        const data = {
            bookmarkData:bookmarkData
        }
        await updateDoc(docRef, data)
    }

    async function resetAllProgress(){
        const confirmed = window.confirm("Are you sure you want to reset all progress? This can't be undone.");
        if (!confirmed) return;

        const user = auth.currentUser

        const docRef=doc(db,"Users", user.uid);
        const docSnap = await getDoc(docRef)

        const data = {
        LastSeenThisQuestion: 1,
        LastSeenCategory: "Category: All",
        rightAnswerCount: 0,
        wrongAnswerCount: 0,
        answers: answersEmptyDict
        }
        await updateDoc(docRef,data);

        window.location.reload()
    }

    async function storeLastSeenQuestionAndCategory(){
        if (!dataLoaded) return;
        const user = auth.currentUser;
        const docRef=doc(db,"Users", user.uid);

        const data = {
        LastSeenThisQuestion: currentQuestionNumber,
        LastSeenCategory: refDropDownCategory.current
        }

        refCurrentQuestionNumber.current = currentQuestionNumber;
        await updateDoc(docRef,data);
    };

    async function ReloadDataInDB(){
        const user = auth.currentUser
        const docRef = doc(db,'Users', user.uid);
        const docSnap = await getDoc(docRef)

        updateQuestionNumber(docSnap.data().LastSeenThisQuestion);
        refDropDownCategory.current = docSnap.data().LastSeenCategory;
        document.getElementById('DropDownForCategory').value = refDropDownCategory.current
        updateAnswers(docSnap.data().answers)
        updateRightAnswerCount(docSnap.data().rightAnswerCount)
        updateWrongAnswerCount(docSnap.data().wrongAnswerCount)
        setDataLoaded(true)
        updateBookmarkData(docSnap.data().bookmarkData)
    }

    async function storeAnswersAndRightWrongCount(){ 
            if (!dataLoaded) return;
            const user = auth.currentUser;
            const docRef = doc(db,'Users', user.uid);
            const data = {
                answers: answers,
                wrongAnswerCount: wrongAnswerCount,
                rightAnswerCount: rightAnswerCount
            }
            await updateDoc(docRef,data)
    }

    function moveRight(){
        updateDisplayCategoryError(false)
        if (refDropDownCategory.current==="Category: Road Signs"){
            if (refCurrentQuestionNumber.current>= RoadSignQuestions[0].id && refCurrentQuestionNumber.current < RoadSignQuestions[RoadSignQuestions.length-1].id){
                updateQuestionNumber(prev=>prev+1)
            }
        } else if (refDropDownCategory.current==="Category: Rules of the Road"){
            if (refCurrentQuestionNumber.current >= RoadRulesQuestions[0].id && refCurrentQuestionNumber.current < RoadRulesQuestions[RoadRulesQuestions.length-1].id){
                updateQuestionNumber(prev=>prev+1)
            }
        } else if (refDropDownCategory.current==="Category: General Driving Principles"){
            if (refCurrentQuestionNumber.current >= GDPQuestions[0].id && refCurrentQuestionNumber.current < GDPQuestions[GDPQuestions.length-1].id){
                updateQuestionNumber(prev=>prev+1)
            }
        } else if (refDropDownCategory.current==="Category: Bookmarks"){
            const index = bookmarkedQuestions.findIndex(q=>q.id === refCurrentQuestionNumber.current)
            if (index!=-1 && index < bookmarkedQuestions.length-1){
                updateQuestionNumber(bookmarkedQuestions[index+1].id)
            }
        } else {
            if (refCurrentQuestionNumber.current < Questions[Questions.length-1].id){
            updateQuestionNumber(prev=>prev+1)
            }
        }
    }

    function moveLeft(){
        updateDisplayCategoryError(false)
        if (refDropDownCategory.current==="Category: Road Signs"){
            if (refCurrentQuestionNumber.current> RoadSignQuestions[0].id && refCurrentQuestionNumber.current <= RoadSignQuestions[RoadSignQuestions.length-1].id){
                updateQuestionNumber(prev=>prev-1)
            }
        } else if (refDropDownCategory.current==="Category: Rules of the Road"){
            if (refCurrentQuestionNumber.current > RoadRulesQuestions[0].id && refCurrentQuestionNumber.current <= RoadRulesQuestions[RoadRulesQuestions.length-1].id)
            updateQuestionNumber(prev=>prev-1)
        } else if (refDropDownCategory.current==="Category: General Driving Principles"){
            if (refCurrentQuestionNumber.current > GDPQuestions[0].id && refCurrentQuestionNumber.current <= GDPQuestions[GDPQuestions.length-1].id){
                updateQuestionNumber(prev=>prev-1)
            } 
        } else if (refDropDownCategory.current ==="Category: Bookmarks"){
            const index = bookmarkedQuestions.findIndex(q=>q.id===refCurrentQuestionNumber.current)
            if (index>0){
                updateQuestionNumber(bookmarkedQuestions[index-1].id)
            }
        } else {
            if (refCurrentQuestionNumber.current> Questions[0].id && refCurrentQuestionNumber.current <= Questions[Questions.length-1].id){
            updateQuestionNumber(prev=>prev-1)
            }
        }
    }

    function detectKeyDown(e){
        if (e.key === 'ArrowRight'){
            moveRight()
        }
        if (e.key === 'ArrowLeft'){
            moveLeft()
        }
    }

    function jumpToQuestion(){
        if (refDropDownCategory.current === "Category: Road Signs"){
            let targetNumber = window.prompt(`Enter a valid question number between ${RoadSignQuestions[0].id} and ${ RoadSignQuestions[RoadSignQuestions.length-1].id}` )
            if (Number(targetNumber) >= RoadSignQuestions[0].id && Number(targetNumber) <= RoadSignQuestions[RoadSignQuestions.length-1].id){
                updateDisplayCategoryError(false)
                updateQuestionNumber(Number(targetNumber))
            } else {
                updateDisplayCategoryError(true)
            }
        }  

        if (refDropDownCategory.current === "Category: Rules of the Road"){
            let targetNumber = window.prompt(`Enter a valid question number between ${RoadRulesQuestions[0].id-94} and ${ RoadRulesQuestions[RoadRulesQuestions.length-1].id-94}` )
            if (Number(targetNumber) >= RoadRulesQuestions[0].id-94 && Number(targetNumber) <= RoadRulesQuestions[RoadRulesQuestions.length-1].id-94){
                updateDisplayCategoryError(false)
                updateQuestionNumber(Number(targetNumber)+94)
            } else {
                updateDisplayCategoryError(true)
            }
        }

        if (refDropDownCategory.current === "Category: General Driving Principles"){
            let targetNumber = window.prompt(`Enter a valid question number between ${GDPQuestions[0].id} and ${ GDPQuestions[GDPQuestions.length-1].id}` )
            if (Number(targetNumber) >= GDPQuestions[0].id-253 && Number(targetNumber) <= GDPQuestions[GDPQuestions.length-1].id-253){
                updateDisplayCategoryError(false)
                updateQuestionNumber(Number(targetNumber)+253)
            } else {
                updateDisplayCategoryError(true)
            }
        } 
        
        if (refDropDownCategory.current === "Category: All"){
            let targetNumber = window.prompt(`Enter a valid question number between ${Questions[0].id} and ${ Questions[Questions.length-1].id}` )
            if (Number(targetNumber) >= Questions[0].id && Number(targetNumber) <= Questions[Questions.length-1].id){
                updateDisplayCategoryError(false) // maybe remove 
                updateQuestionNumber(Number(targetNumber))
            } else {
                updateDisplayCategoryError(true)
            }
        } 

        if (refDropDownCategory.current === "Category: Bookmarks"){
            let targetNumber = window.prompt(`Enter a valid question number between 1 and ${bookmarkedQuestions.length}` )
            if (Number(targetNumber) >= 1 && Number(targetNumber) <= bookmarkedQuestions.length){
                updateDisplayCategoryError(false)
                updateQuestionNumber(Number(bookmarkedQuestions[Number(targetNumber)-1].id))
            }else{
                updateDisplayCategoryError(true)
            }
        }
    }

    function changeCategory(e){
        const value = e.target.value
        refDropDownCategory.current = value
        setCategory(value)
        if (value === "Category: Road Signs"){
            updateQuestionNumber(RoadSignQuestions[0].id)
            document.getElementById('DropDownForCategory').blur()
        } else if (value === "Category: Rules of the Road"){
            updateQuestionNumber(RoadRulesQuestions[0].id)
            document.getElementById('DropDownForCategory').blur()
        } else if (value === "Category: General Driving Principles"){
            updateQuestionNumber(GDPQuestions[0].id)
            document.getElementById('DropDownForCategory').blur()
        } else if (value === "Category: All"){
            updateQuestionNumber(Questions[0].id)
            document.getElementById('DropDownForCategory').blur()
        } else if (value === "Category: Bookmarks"){
            updateQuestionNumber(bookmarkedQuestions[0].id)
            document.getElementById('DropDownForCategory').blur()
        }
    }

    const displayCurrentQuestion = currentQuestion.map(question=>{

        function toggleBookmark(){
            let newData;
            if (bookmarkData[question.id]===null){
                newData = true
            } else if (bookmarkData[question.id]===true){
                newData = false
            } else if (bookmarkData[question.id]===false){
                newData = true
            }
            if (newData === false && refDropDownCategory.current === "Category: Bookmarks"){
                const idx = bookmarkedQuestions.findIndex(q=>q.id===question.id)
                const remaining = bookmarkedQuestions.filter(q=>q.id!=question.id)

                if (remaining.length===0){
                    refDropDownCategory.current = "Category: All"
                    setCategory("Category: All")
                    document.getElementById('DropDownForCategory').value = "Category: All"
                    updateQuestionNumber(Questions[0].id)
                } else{
                    const nextIdx = Math.min(idx, remaining.length -1)
                    updateQuestionNumber(remaining[nextIdx].id)
                }
            }
            updateBookmarkData({
                    ...bookmarkData,
                    [question.id]:  newData
                })    
        } 
        
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
                <button id = {index} key = {option} onClick = {()=>handleClickingAnswer(question, index)} 
                className = {
                    clsx({
                        "Answer":answers[question.id]===null || (answers[question.id]!=null && index!=question.correctAnswerIndex || index!=answers[question.id]) ,
                        "RightAnswer":(answers[question.id]!=null && index===question.correctAnswerIndex),
                        "WrongAnswer": (answers[question.id]!= question.correctAnswerIndex && index===answers[question.id])
                    })
                }
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
                {bookmarkedQuestions.length > 0 && <option>Category: Bookmarks</option>}
            </select>
            <button onClick = {resetAllProgress} className = "RefreshButton">
                <img className = "RefreshImage" src = "../assets/images/icons/refresh.png" alt = "refresh button" />
            </button>
            <div className = "CurrentQuestionNumberContainer">
                <p className = "CurrentQuestionNumberText">
                    Question: {(refDropDownCategory.current === "Category: All"|| refDropDownCategory.current === "Category: Road Signs")?currentQuestionNumber:
                    refDropDownCategory.current === "Category: Rules of the Road"?currentQuestionNumber-94:
                    refDropDownCategory.current === "Category: General Driving Principles"?currentQuestionNumber-253:
                    refDropDownCategory.current === "Category: Bookmarks"?bookmarkedQuestions.findIndex(q=>q.id===currentQuestionNumber)+1:null } of {refDropDownCategory.current==="Category: All"?Questions.length:
                        refDropDownCategory.current==="Category: Road Signs"?RoadSignQuestions.length:
                        refDropDownCategory.current==="Category: Rules of the Road"?RoadRulesQuestions.length:
                        refDropDownCategory.current==="Category: General Driving Principles"?GDPQuestions.length:
                        refDropDownCategory.current === "Category: Bookmarks"?bookmarkedQuestions.length:null}</p>
            </div>
            <button onClick = {jumpToQuestion} id = "JumpToQuestionContainer">
                <p>Jump to Question</p>
                {displayCategoryError && <p id = "outOfBoundsErrorMessage">Out of Bounds of Category.</p>}
            </button>
        </section>
      
        <section className = "QuestionBox">
            {displayCurrentQuestion}
            <div className = "NavigateButtonsContainer">
                {currentQuestionNumber>1 && <button onClick = {moveLeft} className = "NavigateButton"><img className = "NavigateBetweenQuestionsSymbol" src = "../assets/images/icons/left-arrow.png" alt = "left arrow"/></button>}  
                {currentQuestionNumber < Questions.length && <button onClick = {moveRight} className = "NavigateButton"><img  className = "NavigateBetweenQuestionsSymbol" src = "../assets/images/icons/right-arrow.png" alt = "right arrow" /></button>}
            </div>

        </section>

        <section id = "RightAndWrongCountContainer">
            <img id = "CheckMark" src = "../assets/images/icons/check.png" alt = "check mark " />
            <p>{rightAnswerCount}</p>
            <img id = "XMark" src = "../assets/images/icons/remove.png" alt = "x mark" />
            <p>{wrongAnswerCount}</p>
        </section>
        </>
    )
}
