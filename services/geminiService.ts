import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL_NAME } from "../constants";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error(
    "API_KEY is not set in environment variables. Gemini API calls will fail."
  );
  // Note: The application will still try to run, but API calls will fail.
  // UI should handle this gracefully.
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Add ! to assert API_KEY is non-null, errors handled if not.

export const reviewCodeWithGemini = async (
  code: string,
  language: string
): Promise<string> => {
  if (!API_KEY) {
    throw new Error(
      "Gemini API Key is not configured. Please set the API_KEY environment variable."
    );
  }

  const model = ai.models;

  const prompt = `
You are an expert code reviewer. Please analyze the following ${language} code.
Provide a comprehensive review covering:
1.  **Bugs and Potential Issues**: Identify any logical errors, runtime errors, or edge cases not handled.
2.  **Best Practices**: Check for adherence to language-specific best practices and common coding standards.
3.  **Readability and Maintainability**: Assess code clarity, use of comments, naming conventions, and overall structure.
4.  **Performance**: Point out any potential performance bottlenecks or areas for optimization.
5.  **Security**: Highlight any basic security vulnerabilities (e.g., SQL injection, XSS, if applicable to the code context, but focus on general code security if language is not web-specific).
6.  **Suggestions for Improvement**: Offer concrete suggestions on how the code can be improved.
7.  **Code Style**: Comment on adherence to common style guides for ${language}.

Format your feedback clearly. Use markdown-like formatting (e.g., **bold for titles**, *italics for emphasis*, \`inline code\`, and bullet points or numbered lists for different aspects of the review).
Ensure your response is well-structured and easy to read.

Here is the code:
\`\`\`${language}
${code}
\`\`\`
`;

  try {
    const response = await model.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.3, // Lower temperature for more factual/deterministic review
        topP: 0.9,
        topK: 40,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Received an empty response from Gemini API.");
    }
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      // Check for specific error messages if needed, e.g. related to API key
      if (error.message.includes("API key not valid")) {
        throw new Error(
          "Invalid Gemini API Key. Please check your configuration."
        );
      }
      throw new Error(`Gemini API request failed: ${error.message}`);
    }
    throw new Error(
      "An unknown error occurred while communicating with Gemini API."
    );
  }
};
