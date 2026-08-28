import React from "react"
import { useNavigate } from "react-router-dom"
import Header from "./Header"

export default function Credits(){

    const navigate = useNavigate()

    return (
        <>

        <header className = "HomeScreenHeader">
        <Header 
            title = "Credits"
            imagePathTwo = "../assets/images/icons/back.png"
            altTwo = "go to home screen image"
            functionTwo = {()=>navigate("/Settings")}
        />
        </header>

        <div className = "IconCredits">
            <a href="https://www.flaticon.com/free-icons/chatbot" title="chatbot icons">Chatbot icons created by Magnific - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/back-arrow" title="back arrow icons">Back arrow icons created by Ilham Fitrotul Hayat - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/bookmark" title="bookmark icons">Bookmark icons created by hazhio - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/bookmark" title="bookmark icons">Bookmark icons created by Magnific - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/success" title="success icons">Success icons created by hqrloveq - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/exam" title="exam icons">Exam icons created by kliwir art - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/home-button" title="home button icons">Home button icons created by Magnific - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/back" title="back icons">Back icons created by Roundicons - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/logout" title="logout icons">Logout icons created by Afian Rochmah Afif - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/refresh" title="refresh icons">Refresh icons created by Arkinasi - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/delete" title="delete icons">Delete icons created by Pixel perfect - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/next" title="next icons">Next icons created by Roundicons - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/settings" title="settings icons">Settings icons created by logisstudio - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/timer" title="timer icons">Timer icons created by Magnific - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/pencil" title="pencil icons">Pencil icons created by Magnific - Flaticon</a>
            <a href="https://www.flaticon.com/free-icons/send" title="send icons">Send icons created by Pixel perfect - Flaticon</a>
        </div>

        </>
    )
}