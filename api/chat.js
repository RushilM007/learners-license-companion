import dotenv from "dotenv"
dotenv.config({path:".env.local"})
import express from "express"
import cors from "cors"
import OpenAI from "openai"
import {createClient} from "@supabase/supabase-js"

//express server 
const app = express()

//allow backend to connect to front end 
app.use(cors())

//allows the server to read json files. 
app.use(express.json())

// needed for rag bot 

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const supabase =createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICEROLE_KEY)

const SYSTEM_PROMPT = `You are an Indian learner's license exam prep expert who helps learner's license aspirants clear out doubts. You will be given some context and a question. Formulate 
a short answer using the provided context. Formulate the answer to the question using as much context as possible, and keep everything related to the Indian learner's license examination.
If they ask generic questions about the exam and its content, you can provide them with your own information. Remember, everything should be 
related to the Indian learner's license exam and try to use the context as much as possible. If there is a question not related to the learner's license exam and its content, no matter what, strictly say 
" I am a bot that can only help you about the learner's license exam. Please do not drift off topic" and do NOT answer the question. Always try to keep your response short and less than 70 words`;


//create an embedding from the user's question
async function createEmbedding(input){
    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input,
    })
    return embeddingResponse.data[0].embedding;
}

//find the nearest match for the embedding that was created out of the user's input
async function findNearestMatch(embedding){
    const {data, error} = await supabase.rpc('match_documents',{
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 5
    })
    if (error) throw error
    if (!data || data.length === 0) return ""
    return data[0].content
}

app.post("/api/chat", async (req, res )=>{
    try{
        //get the user's question from front end 
        const {query} = req.body

        //create an embedding out of the user's question 
        const embedding = await createEmbedding(query)

        //find the vectors in DB that are closely related to the user's query 
        const context = await findNearestMatch(embedding)

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            temperature: 0.5,
            frequency_penalty: 0.5,
            messages: [
                {role: "system", content: SYSTEM_PROMPT},
                {role: "user", content: `Context ${context} Question: ${query}`}
            ]
        })
        res.json({response: completion.choices[0].message.content})
    } catch (e){
        console.error("Error:", e)
        res.status(500).json({error: "Failed to generate chat response"})

    }
})

app.listen(3002, ()=>console.log("Chat server running"))

export default app