// // server/services/aiService.js
// const Groq = require('groq-sdk');

// const groq = new Groq({
//     apiKey: process.env.GROQ_API_KEY,
// });

// const generateSummary = async (content) => {
//     console.log('🔥🔥🔥 AI SUMMARIZE FUNCTION WAS CALLED! 🔥🔥🔥');
//     console.log('📝 Content length:', content.length, 'characters');
    
//     try {
//         console.log('🔍 AI: Sending request to Groq for summarization...');
        
//         const response = await groq.chat.completions.create({
//             model: "openai/gpt-oss-120b",  // ← REPLACED with supported model
//             messages: [
//                 {
//                     role: "system",
//                     content: "You are a helpful assistant that summarizes blog posts. Keep the summary under 100 words. Be concise and capture the main points. Return only the summary, no extra text."
//                 },
//                 {
//                     role: "user",
//                     content: `Please summarize this blog post: ${content}`
//                 }
//             ],
//             temperature: 0.5,
//             max_tokens: 150,
//         });

//         console.log('✅ AI: Summary generated successfully!');
//         return response.choices[0].message.content.trim();
//     } catch (error) {
//         console.error('❌ AI Summarization Error DETAILS:', {
//             message: error.message,
//             status: error.status,
//             response: error.response?.data || 'No response data'
//         });
//         return null;
//     }
// };

// const generateTags = async (content) => {
//     console.log('🏷️🏷️🏷️ AI TAGS FUNCTION WAS CALLED! 🏷️🏷️🏷️');
//     console.log('📝 Content length:', content.length, 'characters');
    
//     try {
//         console.log('🔍 AI: Sending request to Groq for tag generation...');
        
//         const response = await groq.chat.completions.create({
//             model: "openai/gpt-oss-120b",  // ← REPLACED with supported model
//             messages: [
//                 {
//                     role: "system",
//                     content: "You are a helpful assistant that generates 3-5 relevant tags for blog posts. Return only the tags separated by commas. Do not add any other text."
//                 },
//                 {
//                     role: "user",
//                     content: `Generate 3-5 tags for this blog post: ${content}`
//                 }
//             ],
//             temperature: 0.3,
//             max_tokens: 50,
//         });

//         console.log('✅ AI: Tags generated successfully!');
//         return response.choices[0].message.content.trim();
//     } catch (error) {
//         console.error('❌ AI Tag Generation Error DETAILS:', {
//             message: error.message,
//             status: error.status,
//             response: error.response?.data || 'No response data'
//         });
//         return null;
//     }
// };

// module.exports = { generateSummary, generateTags };