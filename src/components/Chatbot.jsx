import { useNavigate } from "react-router-dom"
import Header from "./Header"
export default function Chatbot(){
    const navigate = useNavigate()
    return (
        <>
        <header className = "HomeScreenHeader">
                    <Header 
                        title = "Chatbot"
                        imagePathOne = "../assets/images/icons/home.png"
                        altOne = "go to home screen image"
                        functionOne = {()=>navigate("/HomeScreen")}
                    />
        </header>
        </>
    )
}