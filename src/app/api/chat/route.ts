type ChatMessage = {
  role: string;
  content: string;
};

type GroqResponse = {
  choices?: Array<{
    message?: ChatMessage;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    prompt_time?: number;
    completion_time?: number;
    total_time?: number;
  };
  model?: string;
  error?: {
    message?: string;
  };
};

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "qwen/qwen3.8-27b";

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "La variable de entorno GROQ_API_KEY no está configurada." },
      { status: 500 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "El cuerpo debe ser JSON válido." }, { status: 400 });
  }

  const messages =
    typeof body === "object" && body !== null && "messages" in body
      ? body.messages
      : undefined;

  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    !messages.every(
      (message): message is ChatMessage =>
        typeof message === "object" &&
        message !== null &&
        "role" in message &&
        typeof message.role === "string" &&
        "content" in message &&
        typeof message.content === "string",
    )
  ) {
    return Response.json(
      { error: "messages debe ser un array no vacío de objetos con role y content." },
      { status: 400 },
    );
  }

  try {
    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
      }),
    });

    const data = (await groqResponse.json().catch(() => ({}))) as GroqResponse;

    if (!groqResponse.ok) {
      return Response.json(
        {
          error: "Groq no pudo completar la solicitud.",
          details: data.error?.message ?? `Error HTTP ${groqResponse.status}`,
        },
        { status: groqResponse.status },
      );
    }

    const message = data.choices?.[0]?.message;
    const usage = data.usage;

    if (!message || !usage || !data.model) {
      return Response.json(
        { error: "Groq devolvió una respuesta incompleta." },
        { status: 502 },
      );
    }

    return Response.json({
      message: {
        role: message.role,
        content: message.content,
      },
      usage: {
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens,
        prompt_time: usage.prompt_time,
        completion_time: usage.completion_time,
        total_time: usage.total_time,
      },
      model: data.model,
    });
  } catch {
    return Response.json(
      { error: "No se pudo conectar con Groq." },
      { status: 502 },
    );
  }
}