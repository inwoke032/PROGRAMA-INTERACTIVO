import { GoogleGenAI } from "@google/genai";

// Integration with Gemini AI for hints and assistance
// Using the javascript_gemini blueprint
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getHint(
  exercisePrompt: string,
  userCode: string,
  errorMessage: string | undefined,
  hintLevel: 1 | 2 | 3
): Promise<string> {
  let systemPrompt = `Eres un tutor de Python experto y amigable. Tu trabajo es ayudar a estudiantes a aprender Python proporcionando pistas útiles sin dar la solución completa.

Nivel de pista ${hintLevel}:
${hintLevel === 1 ? '- Da una pista muy sutil que oriente al estudiante en la dirección correcta sin revelar la solución' : ''}
${hintLevel === 2 ? '- Proporciona una pista más específica que señale exactamente qué concepto o función de Python necesitan usar' : ''}
${hintLevel === 3 ? '- Da una pista muy detallada que casi muestre la solución, pero aún requiera que el estudiante escriba el código' : ''}

Ejercicio: ${exercisePrompt}
Código actual del estudiante: ${userCode || 'No ha escrito código aún'}
${errorMessage ? `Error que encontró: ${errorMessage}` : ''}

Proporciona una pista breve y clara en español. Sé alentador y positivo.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
    });

    return response.text || "Intenta pensar en cómo Python maneja este tipo de operación.";
  } catch (error) {
    console.error("Error getting hint from Gemini:", error);
    return "Lo siento, no pude generar una pista en este momento. ¡Pero sé que puedes lograrlo!";
  }
}

export async function chatWithAI(
  message: string,
  context: {
    exercise?: string;
    code?: string;
    error?: string;
  }
): Promise<string> {
  const systemPrompt = `Eres un tutor de Python experto y amigable. Estás ayudando a un estudiante con ejercicios de Python.

${context.exercise ? `Ejercicio actual: ${context.exercise}` : ''}
${context.code ? `Código del estudiante: ${context.code}` : ''}
${context.error ? `Error encontrado: ${context.error}` : ''}

Responde de manera clara, educativa y alentadora en español. Si el estudiante pregunta por la solución directa, anímalos a pensar por sí mismos dando pistas en su lugar.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${systemPrompt}\n\nPregunta del estudiante: ${message}`,
    });

    return response.text || "Entiendo tu pregunta. Intentemos abordar esto paso a paso.";
  } catch (error) {
    console.error("Error chatting with Gemini:", error);
    return "Lo siento, estoy teniendo problemas para responder ahora. Por favor intenta de nuevo.";
  }
}
