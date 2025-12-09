import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { WaterQualityLog, Batch, Expense } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = "gemini-2.5-flash";

export const getAquacultureAdvice = async (
  query: string,
  context?: { batches: Batch[], waterLogs: WaterQualityLog[], expenses: Expense[] }
): Promise<string> => {
  try {
    let contextStr = "";
    if (context) {
      const totalExpense = context.expenses.reduce((sum, e) => sum + e.amount, 0);
      const feedExpense = context.expenses.filter(e => e.category === 'Feed').reduce((sum, e) => sum + e.amount, 0);
      
      contextStr = `
      Contexto del proyecto actual:
      Lotes activos: ${JSON.stringify(context.batches)}
      Últimos registros de agua: ${JSON.stringify(context.waterLogs.slice(0, 5))}
      Resumen Financiero: Gasto Total: $${totalExpense}, Gasto en Alimento: $${feedExpense}.
      Lista de gastos recientes: ${JSON.stringify(context.expenses.slice(0, 5))}
      `;
    }

    const systemInstruction = `Eres un experto ingeniero en acuicultura especializado en el cultivo de Tilapia (Oreochromis niloticus).
    Tu objetivo es ayudar al usuario a optimizar su producción, diagnosticar problemas de calidad del agua, calcular raciones alimenticias y mejorar la rentabilidad financiera.
    
    Cuando te pregunten sobre finanzas:
    1. Analiza si el gasto en alimento es desproporcionado (idealmente 60-70% del costo total).
    2. Sugiere formas de reducir costos sin afectar el crecimiento.
    
    Responde de manera técnica pero accesible. Usa unidades métricas.
    Si detectas parámetros de agua peligrosos (pH < 6 o > 9, Oxígeno < 3mg/L, Amonio > 0.05mg/L), da alertas urgentes.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\n${contextStr}\n\nPregunta del usuario: ${query}` }] }
      ],
      config: {
        temperature: 0.4,
      }
    });

    return response.text || "No se pudo generar una respuesta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error al consultar al experto IA. Por favor verifica tu conexión o clave API.";
  }
};

export const analyzeWaterHealth = async (log: WaterQualityLog): Promise<string> => {
  try {
    const prompt = `Analiza este registro de calidad de agua para Tilapia:
    pH: ${log.ph}
    Temperatura: ${log.temperature}°C
    Oxígeno Disuelto: ${log.oxygen} mg/L
    Amonio: ${log.ammonia} mg/L
    
    Provee un diagnóstico breve (2 frases) y una recomendación si algo está mal.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Análisis no disponible.";
  } catch (error) {
    return "Error analizando datos.";
  }
};