import Anthropic from "@anthropic-ai/sdk"

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


export async function getFeedbackFromClaude(userQuestionAnswerData) {
    const anthropic = new Anthropic({
        apiKey:import.meta.env.VITE_ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true,
    })

    const results = JSON.stringify(userQuestionAnswerData);

    const msg = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
            { role: "user", content: `Here are my exam results: ${results}. Please give me feedback.`},
        ],
    });
    return msg.content[0].text
}

