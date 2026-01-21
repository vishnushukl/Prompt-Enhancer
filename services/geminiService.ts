
import { GoogleGenAI } from "@google/genai";

// IMPORTANT: Do NOT expose your API key in client-side code in a real application.
// This is for demonstration purposes only. In a production environment,
// this call should be made from a backend server.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // This will be handled by the execution environment.
    // In a local setup, you would need a .env file.
    console.warn("API_KEY is not set. The application will not work without it.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = 'gemini-3-flash-preview';

export const enhancePrompt = async (userInput: string): Promise<string> => {
    const metaPrompt = `
You are an expert prompt engineer. Your task is to take a user's raw, unstructured, or incomplete prompt and rewrite it into a professional, structured, and optimized prompt suitable for high-quality AI generation.

The enhanced prompt MUST be clear, concise, and well-organized. It should include the following sections if the user's input provides enough information to infer them. If a section is not applicable, omit it.

- **Task:** A clear and concise definition of the primary goal.
- **Context:** Relevant background information the AI needs to understand the request.
- **Role:** The persona the AI should adopt (e.g., "Act as a senior marketing copywriter...").
- **Constraints:** Specific limitations or rules to follow (e.g., word count, tone, what to avoid).
- **Format:** Instructions on how the output should be structured (e.g., "Use Markdown for headings," "Provide the output as a JSON object...").
- **Example:** (If helpful) A brief example to clarify the desired output.

Your final output must ONLY be the enhanced prompt text, professionally formatted using Markdown. Do not include any conversational introductions, explanations, or text like "Here is the enhanced prompt:". Start directly with the enhanced prompt.

**User's Raw Prompt:**
---
${userInput}
---
`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: metaPrompt,
        });

        const text = response.text;
        if (!text) {
            throw new Error("The AI returned an empty response. Please try refining your prompt.");
        }
        return text.trim();

    } catch (error) {
        console.error("Error enhancing prompt:", error);
        // Provide a more user-friendly error message
        if (error instanceof Error && error.message.includes('API key')) {
             throw new Error("API key is invalid or missing. Please ensure it is configured correctly.");
        }
        throw new Error("Failed to generate enhanced prompt. The AI service may be temporarily unavailable.");
    }
};
