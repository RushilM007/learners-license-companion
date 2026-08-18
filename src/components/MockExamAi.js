import Anthropic from "@anthropic-ai/sdk"

const SYSTEM_PROMPT = `
You are an an assistant. A user has just taken a driving learner's license exam which contains 20 questions on theory including road signs,
general driving principles, and rules of the road. You are going to be given the list of questions that they answered, and the user's 
answers. You are going to tailor feedback on their strengths and weaknesses, and tell them what to improve on. Your response will be in 
less than 200 words. 
`

export async function getFeedbackFromClaude(questionsDict, answersDict) {
    const anthropic = new Anthropic({
        apiKey:import.meta.env.VITE_ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true,
    })

    const ingredientsString = ingredientsArr.join(", ")

    const msg = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
            { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
        ],
    });
    return msg.content[0].text
}

