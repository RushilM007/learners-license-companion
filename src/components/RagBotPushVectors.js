// import { config } from 'dotenv'
// config({ path: '.env.local' })

// const { openai, supabase } = await import('./RAGBotConfig.js')
// const { default: examKnowledge } = await import('./RAGBotContent.js')

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

// main(examKnowledge)

