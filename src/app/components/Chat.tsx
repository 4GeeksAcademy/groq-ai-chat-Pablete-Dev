"use client";

import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import MetricsPanel from "./MetricsPanel";
import {
  INITIAL_METRICS,
  type ChatApiResponse,
  type Message,
  type Metrics,
} from "../types/chat";

const MESSAGES_KEY = "groq-chat:messages";
const METRICS_KEY = "groq-chat:metrics";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics>(INITIAL_METRICS);
  const [isHydrated, setIsHydrated] = useState(false);
  const skipPersistRef = useRef({ messages: false, metrics: false });

  // Rehidratación desde localStorage: sólo puede leerse tras el montaje en cliente.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(MESSAGES_KEY);
      const parsedMessages: unknown = storedMessages
        ? JSON.parse(storedMessages)
        : null;
      if (Array.isArray(parsedMessages)) {
        setMessages(parsedMessages as Message[]);
      }

      const storedMetrics = localStorage.getItem(METRICS_KEY);
      const parsedMetrics: unknown = storedMetrics
        ? JSON.parse(storedMetrics)
        : null;
      if (parsedMetrics && typeof parsedMetrics === "object") {
        setMetrics({ ...INITIAL_METRICS, ...(parsedMetrics as Partial<Metrics>) });
      }
    } catch {
      setError("No se pudo recuperar la conversación guardada.");
    } finally {
      setIsHydrated(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!isHydrated) return;
    if (skipPersistRef.current.messages) {
      skipPersistRef.current.messages = false;
      return;
    }
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }, [messages, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (skipPersistRef.current.metrics) {
      skipPersistRef.current.metrics = false;
      return;
    }
    localStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
  }, [metrics, isHydrated]);

  async function sendMessage() {
    const content = input.trim();
    if (!content || isLoading) return;

    const history: Message[] = [...messages, { role: "user", content }];

    setMessages(history);
    setInput("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = (await response.json().catch(() => ({}))) as ChatApiResponse;

      if (!response.ok || !data.message) {
        throw new Error(
          data.details ?? data.error ?? `Error HTTP ${response.status}`,
        );
      }

      setMessages([...history, data.message]);

      const usage = data.usage;
      setMetrics((previous) => ({
        promptTokens: previous.promptTokens + (usage?.prompt_tokens ?? 0),
        completionTokens:
          previous.completionTokens + (usage?.completion_tokens ?? 0),
        totalTokens: previous.totalTokens + (usage?.total_tokens ?? 0),
        requests: previous.requests + 1,
        totalTime: previous.totalTime + (usage?.total_time ?? 0),
        lastModel: data.model ?? previous.lastModel,
        lastTotalTime: usage?.total_time ?? null,
      }));
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Ocurrió un error inesperado al contactar con la IA.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function clearConversation() {
    // Sólo se omite la persistencia si el estado cambia y el efecto va a dispararse.
    skipPersistRef.current.messages = messages.length > 0;
    skipPersistRef.current.metrics = metrics !== INITIAL_METRICS;

    setMessages([]);
    setMetrics(INITIAL_METRICS);
    setError(null);
    setInput("");
    localStorage.removeItem(MESSAGES_KEY);
    localStorage.removeItem(METRICS_KEY);
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-4 lg:flex-row">
      <section className="flex min-h-0 flex-1 flex-col gap-3">
        <MessageList messages={messages} isLoading={isLoading} />

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          >
            {error}
          </p>
        ) : null}

        <ChatInput
          input={input}
          isLoading={isLoading}
          onChange={setInput}
          onSubmit={sendMessage}
        />
      </section>

      <MetricsPanel metrics={metrics} onClear={clearConversation} />
    </div>
  );
}
