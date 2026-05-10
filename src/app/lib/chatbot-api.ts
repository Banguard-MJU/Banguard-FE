import { apiRequest, buildApiUrl, getAccessToken } from "./api";
import { normalizeErrorMessage } from "./error-message";

export interface ChatbotSession {
  session_id: string;
  result_id?: string | null;
  title?: string | null;
  created_at: string;
  last_active_at?: string;
}

export interface ChatbotSource {
  title: string;
  page: number;
  date?: string;
  url?: string;
  excerpt?: string;
}

export type ChatbotStreamEvent =
  | { type: "token"; content: string }
  | { type: "sources"; content: ChatbotSource[]; is_grounded?: boolean }
  | { type: "error"; content: string };

export interface ChatbotMessageRecord {
  message_id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatbotSource[] | null;
  is_grounded: boolean;
  sent_at: string;
}

export interface ChatbotSessionDetail {
  session_id: string;
  title?: string | null;
  messages: ChatbotMessageRecord[];
}

export async function createChatbotSession() {
  return apiRequest<ChatbotSession>("/chatbot/sessions", {
    method: "POST",
    auth: true,
  });
}

export async function getChatbotSessions() {
  return apiRequest<ChatbotSession[]>("/chatbot/sessions", {
    method: "GET",
    auth: true,
  });
}

export async function getChatbotSessionDetail(sessionId: string) {
  return apiRequest<ChatbotSessionDetail>(`/chatbot/sessions/${sessionId}`, {
    method: "GET",
    auth: true,
  });
}

export async function deleteChatbotSession(sessionId: string) {
  await apiRequest<null>(`/chatbot/sessions/${sessionId}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function streamChatbotMessage(
  sessionId: string,
  question: string,
  onEvent: (event: ChatbotStreamEvent) => void,
  signal?: AbortSignal,
) {
  const token = getAccessToken();
  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  let response: Response;
  try {
    response = await fetch(buildApiUrl(`/chatbot/sessions/${sessionId}/messages`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
      signal,
    });
  } catch (error) {
    throw new Error(normalizeErrorMessage(error instanceof Error ? error.message : undefined));
  }

  if (!response.ok) {
    const text = await response.text();
    let message: unknown = text;
    try {
      const data = JSON.parse(text);
      message = data.detail || data.message;
    } catch {
      message = text;
    }
    throw new Error(normalizeErrorMessage(message, "챗봇 응답 생성에 실패했습니다."));
  }

  if (!response.body) {
    throw new Error("스트리밍 응답을 읽을 수 없습니다.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() || "";

    for (const chunk of chunks) {
      const dataLine = chunk
        .split("\n")
        .find((line) => line.startsWith("data:"));

      if (!dataLine) {
        continue;
      }

      const data = dataLine.replace(/^data:\s*/, "");
      if (!data.trim()) {
        continue;
      }

      try {
        onEvent(JSON.parse(data) as ChatbotStreamEvent);
      } catch {
        onEvent({ type: "error", content: "챗봇 응답을 읽는 중 문제가 발생했습니다." });
      }
    }
  }

  const remaining = buffer.trim();
  if (remaining.startsWith("data:")) {
    try {
      onEvent(JSON.parse(remaining.replace(/^data:\s*/, "")) as ChatbotStreamEvent);
    } catch {
      onEvent({ type: "error", content: "챗봇 응답을 읽는 중 문제가 발생했습니다." });
    }
  }
}
