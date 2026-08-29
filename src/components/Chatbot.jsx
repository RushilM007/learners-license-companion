import { useNavigate } from "react-router-dom"
import Header from "./Header"
import React, {useState} from "react"
import "./Chatbot.css"

const { openai, supabase } = await import('./RAGBotConfig.js')
const { default: podcasts } = await import('./RAGBotContent.js')

export default function Chatbot(){
    
    const [response, updateResponse] = useState("")
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    function handleSubmitQuery(){
        setLoading(true)
        main(query)
    }

    async function main(input){
        try {
            const res = await fetch("/api/chat",{
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({query: input})

            })
            const data = await res.json()
            updateResponse(data.response)
        } catch (e){
            updateResponse("Sorry something went wrong ")
        } finally {
            setLoading(false)
        }
    }


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
        
        <p className = "ChatBotDescription">Get your concept-related questions clarified! Ask questions about road signs, rules of the road and general driving principles.</p>
        <section className = "ChatBotUI">
            <textarea onChange = {(e)=>setQuery(e.target.value)} placeholder= "How can I help?" className = "ChatBotInput"></textarea>
            <button onClick = {handleSubmitQuery} className = "ChatBotSendButton"><img className = "ChatBotSendImage" src = "../assets/images/icons/paper-plane.png"></img></button>
        </section>

        <section className = "ChatBotResponse">
        {loading===true?"Loading...":response}
        </section>


        </>
    )
}