import { NextResponse } from "next/server";

export async function POST(request: Request){
    try {
        const {message, userName} = await request.json();
        const apiKey = process.env.GROQ_API_KEY;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{
                        role: "system",
                        content: `You are a helpful assistant. The user's name is ${userName}. You MUST address the user by their name, "${userName}", in every response to make the conversation feel personal.`
                    },
                    {role: "user", content: message}
                ],
                }),
            });
            const data = await response.json();

            if (!data.choices|| data.choices.length===0) {
                console.error("error response groq", data)
                return NextResponse.json({error: " no response from groq"}, {status: 500});
            }

            const aiText = data.choices[0].message.content;
            return NextResponse.json({ aiText});
    } catch (error) {
        console.error("error in chat route", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}