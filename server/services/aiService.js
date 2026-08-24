// server/services/aiService.js
// ⭐ BACKEND: Handles all AI operations using Groq (FREE) ⭐

const Groq = require('groq-sdk');

// Initialize Groq with your API key from .env
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Generate a summary of the content
const generateSummary = async (content) => {
    try {
        const response = await groq.chat.completions.create({
            model: "llama3-70b-8192", // Free Meta Llama model
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that summarizes blog posts. Keep the summary under 100 words. Be concise and capture the main points. Return only the summary, no extra text."
                },
                {
                    role: "user",
                    content: `Please summarize this blog post: ${content}`
                }
            ],
            temperature: 0.5,
            max_tokens: 150,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('AI Summarization Error:', error.message);
        return null;
    }
};

// Generate tags for the content
const generateTags = async (content) => {
    try {
        const response = await groq.chat.completions.create({
            model: "llama3-70b-8192",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that generates 3-5 relevant tags for blog posts. Return only the tags separated by commas. Do not add any other text."
                },
                {
                    role: "user",
                    content: `Generate 3-5 tags for this blog post: ${content}`
                }
            ],
            temperature: 0.3,
            max_tokens: 50,
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('AI Tag Generation Error:', error.message);
        return null;
    }
};

module.exports = { generateSummary, generateTags };