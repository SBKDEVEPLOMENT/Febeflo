import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key de Gemini no configurada" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Usamos gemini-1.5-flash como modelo más rápido y eficiente
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Eres un asistente virtual amable y servicial para la tienda de ropa Febeflo. La tienda está ubicada en Persa Teniente Cruz - Pudahuel, 2° Bandejón - 3er Pasillo, Puestos: 784 - 786 - 797 - 799. Vendemos ropa de mujer y hombre . Responde preguntas sobre ubicación, horarios (Sábados, Domingos y Festivos 09:00 - 18:00), y ayuda a los clientes a encontrar ropa. También puedes proporcionar los siguientes correos de contacto: Agcatalans@febeflo.com (CEO), Ccandiae@febeflo.com (CEO), y Fcandiac@febeflo.com (Ejecutivo De Ventas). Sé conciso y usa emojis." }],
        },
        {
          role: "model",
          parts: [{ text: "¡Hola! 👋 Soy el asistente virtual de Febeflo. Estoy aquí para ayudarte a encontrar la mejor ropa para ti y tu familia, o darte información sobre nuestra tienda en Pudahuel. ¿En qué puedo ayudarte hoy? 👗👕👖" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Error en Gemini API:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar la solicitud con Gemini" },
      { status: 500 }
    );
  }
}
