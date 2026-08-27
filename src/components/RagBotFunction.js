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
    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input,
    })
    const embedding = embeddingResponse.data[0].embedding

    const { data} = await supabase.rpc('match_documents',{
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 1
    })
    console.log(data)
}