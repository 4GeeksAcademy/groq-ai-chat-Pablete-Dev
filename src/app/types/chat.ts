export type ChatRole = "user" | "assistant" | "system";

export type Message = {
  role: ChatRole;
  content: string;
};

export type Metrics = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  requests: number;
  totalTime: number;
  lastModel: string | null;
  lastTotalTime: number | null;
};

export type ChatApiResponse = {
  message?: Message;
  model?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    prompt_time?: number;
    completion_time?: number;
    total_time?: number;
  };
  error?: string;
  details?: string;
};

export const INITIAL_METRICS: Metrics = {
  promptTokens: 0,
  completionTokens: 0,
  totalTokens: 0,
  requests: 0,
  totalTime: 0,
  lastModel: null,
  lastTotalTime: null,
};
