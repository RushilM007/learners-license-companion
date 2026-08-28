//express creates a web server using node.js
import express from "express"
//CORS allows the react front end to communicate with the backend. this is needed because front end and back end 
//are on different ports. 
import cors from "cors"


import Anthropic from "@anthropic-ai/sdk"

dotenv.config({path: ".env.local"})

//now we create the express server
const app = express();

//letting the express server use cors to connect frontend and backend
app.use(cors())

//this is needed to allow the server to read JSON files. 
app.use(express.json())

//now here we create the anthropic client 

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

// this is the system prompt that will be given to claude: 

const SYSTEM_PROMPT = `

You are an Indian learner's license exam coach. A user has just taken a 20 question mock quiz on driving theory. But, if 
they fail early by getting 8 questions wrong, they would have attempted less questions. The questions 
covered various topics such as road signs, general driving principles and rules of the road. 

The user has already been given their score but they need some specific feedback too. 

You will be given an array of 20 elements. Each element contains a dictionary which contains:
1) The question 
2) The category of the question 
3) Whether the user has answered it correctly or not. 

Your job is to respond exactly in this structure and do nothing else:
1) Provide a short summary of the user's strengths. Talk about questions and categories they answered correctly
2) Provide a short summary of the user's weaknessess. Talk about questions and categories they answered incorrectly. 
3) Provide a one liner on an action plan for what to revise. 

IMPORTANT: Do not tally anything, or count anything. do not do any arithmetic operations like this. 

Your entire response should be around 40 words.No more than that please.
`
// now an "api endpoint" will be created. 
//it would be something like http://localhost:3001/api/feedback
//react will send the user's quiz results to this endpoint
//req is the request coming from react
//res is the response we send back to react
//async is used because the function takes time to happen 

app.post("/api/feedback", async (req, res)=>{
    try {
        const userQuestionAnswerData = req.body

        const message = await anthropic.messages.create({
            model:"claude-haiku-4-5-20251001",
            max_tokens: 150,
            system: SYSTEM_PROMPT,
            messages: [
                {
                    role: "user",
                    content: `Here are my exam results: ${JSON.stringify(userQuestionAnswerData)}. Please give me feedback`
                }
            ]
        })
        res.json({
            feedback: message.content[0].text
        })
    } catch (e){
        console.error("Error:", e)
        res.status(500).json({
            error: "Failed to generate feedback",
        })
    }
})

export default app