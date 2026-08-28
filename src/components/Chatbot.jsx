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
        const embedding = await createEmbedding(input);
        const match = await findNearestMatch(embedding)
        console.log(match)
        await getChatCompletion(match, input)
    }

    async function createEmbedding(input){
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input,
        })
        return embeddingResponse.data[0].embedding;
    }

    async function findNearestMatch(embedding){
        const { data} = await supabase.rpc('match_documents',{
            query_embedding: embedding,
            match_threshold: 0.5,
            match_count: 1
        })
        return data[0].content
    }

    const chatMessages = [{
        role: 'system',
        content: `You are an enthusiastic podcast expert who loves recommending podcasts to people. You will
        be given two pieces of information - some context about podcasts episodes and a question. Your main job is to 
        formulate a short answer to the question using the provided context. If you are unsure and cannot find the answer 
        in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.`
    }]

    async function getChatCompletion(text,query){
        chatMessages.push({
            role: 'user',
            content: `Conntext: ${text} Question: ${query}`
        })
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: chatMessages,
            temperature:0.5,
            frequency_penalty: 0.5
        })
        console.log(response.choices[0].message.content)
        setLoading(false)
        updateResponse(response.choices[0].message.content)

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
        
        <p className = "ChatBotDescription">Get your concept-related questions clarified!</p>
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