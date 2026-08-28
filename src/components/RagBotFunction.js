import { config } from 'dotenv'
config({ path: '.env.local' })

const { openai, supabase } = await import('./RAGBotConfig.js')
const { default: podcasts } = await import('./RAGBotContent.js')

// async function main(input){
//     const data = await Promise.all(
//         input.map( async (textChunk)=>{
//             const embeddingResponse = await openai.embeddings.create({
//                 model: "text-embedding-ada-002",
//                 input: textChunk
//             })
//             return {
//                 content: textChunk,
//                 embedding: embeddingResponse.data[0].embedding
//             }
//             console.log(data)

//         })
//     )

//     const { data: insertedData, error } = await supabase.from('documents').insert(data)
//     if (error) {
//         console.error("Insert failed:", error)
//     } else {
//         console.log("Inserted:", insertedData)
//     }
// }

// main(podcasts)


const query = "Jammin' in the Big Easy";
main(query);

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

}