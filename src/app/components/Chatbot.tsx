import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Copy, 
  RotateCcw, 
  StopCircle,
  Check,
  Edit2,
  ThumbsUp,
  ThumbsDown,
  Menu,
  Plus,
  Search,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Pin,
  PinOff,
  Shield,
  Trash2,
  MoreHorizontal,
  ExternalLink,
  FileText,
  Eye
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Sheet, SheetContent } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import {
  SUGGESTED_QUESTIONS,
  type ChatConversation as Conversation,
  type ChatEvidenceItem,
  type ChatMessage as Message,
} from "../data/chatbot";
import {
  createChatbotSession,
  deleteChatbotSession,
  getChatbotSessionDetail,
  getChatbotSessions,
  streamChatbotMessage,
  type ChatbotMessageRecord,
  type ChatbotSession,
  type ChatbotSessionDetail,
  type ChatbotSource,
} from "../lib/chatbot-api";
import { buildApiUrl } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { getDisplayErrorMessage } from "../lib/error-message";

const CHATBOT_SIDEBAR_WIDTH = 320;

const evidenceTypeLabel: Record<ChatEvidenceItem["type"], string> = {
  guide: "가이드",
  policy: "정책",
  registry: "등기",
  insurance: "보증",
};

function getDocumentUrlFromTitle(title: string) {
  const filename = title.split(/[\\/]/).pop()?.trim();
  if (!filename || !filename.toLowerCase().endsWith(".pdf")) {
    return undefined;
  }

  return `/documents/${encodeURIComponent(filename)}`;
}

function sourcesToEvidence(sources: ChatbotSource[]): ChatEvidenceItem[] {
  return sources.map((source, index) => ({
    id: `${source.title}-${source.page}-${index}`,
    title: source.title,
    summary: `${source.page}쪽${source.date ? ` · ${source.date}` : ""}`,
    type: "policy",
    page: source.page,
    url: source.url || getDocumentUrlFromTitle(source.title),
    excerpt: source.excerpt,
    content: source.content,
  }));
}

function recordsToMessages(records: ChatbotMessageRecord[]): Message[] {
  return records.map((record) => ({
    id: record.message_id,
    role: record.role,
    content: record.content,
    timestamp: new Date(record.sent_at),
    evidence: record.sources && record.sources.length > 0 ? sourcesToEvidence(record.sources) : undefined,
  }));
}

function sessionToConversation(session: ChatbotSession, detail?: ChatbotSessionDetail): Conversation {
  const messages = detail ? recordsToMessages(detail.messages) : [];
  const firstUserMessage = messages.find((message) => message.role === "user");
  const lastMessage = messages[messages.length - 1];
  const fallbackTitle = firstUserMessage
    ? firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "")
    : "이전 대화";

  return {
    id: session.session_id,
    title: session.title || detail?.title || fallbackTitle,
    lastMessage: lastMessage?.content || firstUserMessage?.content || "",
    timestamp: new Date(session.last_active_at || session.created_at),
    messages,
  };
}

export function Chatbot() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [previewEvidence, setPreviewEvidence] = useState<ChatEvidenceItem | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const getConversationSummary = (conversationMessages: Message[]) => {
    const firstUserMessage = conversationMessages.find((message) => message.role === "user");
    const lastMessage = conversationMessages[conversationMessages.length - 1];

    return {
      title: firstUserMessage
        ? firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "")
        : "새 대화",
      lastMessage: lastMessage?.content || "",
      timestamp: lastMessage?.timestamp || new Date(),
    };
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isAuthenticated) {
      setConversations([]);
      setCurrentConversationId(null);
      setMessages([]);
      return;
    }

    let isMounted = true;

    getChatbotSessions()
      .then(async (sessions) => {
        const details = await Promise.all(
          sessions.map(async (session) => {
            try {
              return await getChatbotSessionDetail(session.session_id);
            } catch {
              return undefined;
            }
          }),
        );

        if (!isMounted) {
          return;
        }

        const restoredConversations = sessions.map((session, index) =>
          sessionToConversation(session, details[index]),
        );
        setConversations(restoredConversations);
      })
      .catch((error) => {
        if (isMounted) {
          toast.error(getDisplayErrorMessage(error, "이전 대화를 불러오지 못했습니다"));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!currentConversationId || messages.length === 0) {
      return;
    }

    const summary = getConversationSummary(messages);
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === currentConversationId
          ? {
              ...conversation,
              title: summary.title,
              lastMessage: summary.lastMessage,
              timestamp: summary.timestamp,
              messages,
            }
          : conversation
      )
    );
  }, [currentConversationId, messages]);

  const stopStreaming = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsStreaming(false);
    setIsTyping(false);
    setMessages(prev => prev.map(msg => ({ ...msg, isStreaming: false })));
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isTyping || isStreaming) return;

    if (!isAuthenticated) {
      toast.error("챗봇을 사용하려면 로그인이 필요합니다");
      navigate("/login");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      let sessionId = currentConversationId;

      if (!sessionId) {
        const session = await createChatbotSession();
        sessionId = session.session_id;
        const newConv: Conversation = {
          id: sessionId,
          title: text.substring(0, 30) + (text.length > 30 ? "..." : ""),
          lastMessage: text,
          timestamp: new Date(),
          messages: [userMessage, assistantMessage],
        };
        setConversations(prev => [newConv, ...prev]);
        setCurrentConversationId(sessionId);
      }

      setIsTyping(false);
      setIsStreaming(true);

      await streamChatbotMessage(
        sessionId,
        text,
        (event) => {
          if (event.type === "token") {
            setMessages(prev => prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, content: `${msg.content}${event.content}`, isStreaming: true }
                : msg
            ));
            return;
          }

          if (event.type === "sources") {
            setMessages(prev => prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, evidence: sourcesToEvidence(event.content), isStreaming: false }
                : msg
            ));
            return;
          }

          if (event.type === "error") {
            throw new Error(getDisplayErrorMessage(event.content, "챗봇 응답 생성에 실패했습니다"));
          }
        },
        controller.signal,
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      const errorMessage = getDisplayErrorMessage(error, "챗봇 응답 생성에 실패했습니다");
      toast.error(errorMessage);
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? { ...msg, content: errorMessage, isStreaming: false }
          : msg
      ));
    } finally {
      abortControllerRef.current = null;
      setIsTyping(false);
      setIsStreaming(false);
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
      ));
    }
  };

  const handleRegenerate = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    const previousUserMessage = messages[messageIndex - 1];
    if (previousUserMessage.role !== "user") return;

    setMessages(prev => prev.filter(m => m.id !== messageId));
    await handleSendMessage(previousUserMessage.content);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("클립보드에 복사되었습니다");
  };

  const handleAssistantFeedback = (messageId: string, feedback: "like" | "dislike") => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId
          ? {
              ...message,
              feedback: message.feedback === feedback ? undefined : feedback,
            }
          : message
      )
    );
  };

  const handleEdit = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditText(content);
  };

  const handleSaveEdit = async () => {
    if (!editingMessageId || !editText.trim()) return;

    const messageIndex = messages.findIndex(m => m.id === editingMessageId);
    if (messageIndex === -1) return;

    setMessages(prev => prev.map(m => 
      m.id === editingMessageId 
        ? { ...m, content: editText.trim() }
        : m
    ));

    const nextMessage = messages[messageIndex + 1];
    if (nextMessage && nextMessage.role === "assistant") {
      setMessages(prev => prev.filter(m => m.id !== nextMessage.id));
    }

    setEditingMessageId(null);
    setEditText("");

    await handleSendMessage(editText.trim());
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setCurrentConversationId(conversation.id);
    setIsSidebarOpen(false);

    if (conversation.messages.length > 0) {
      setMessages(conversation.messages);
      return;
    }

    try {
      const detail = await getChatbotSessionDetail(conversation.id);
      const restoredMessages = recordsToMessages(detail.messages);
      setMessages(restoredMessages);
      setConversations((prev) =>
        prev.map((item) =>
          item.id === conversation.id
            ? {
                ...item,
                title: detail.title || item.title,
                lastMessage: restoredMessages[restoredMessages.length - 1]?.content || item.lastMessage,
                messages: restoredMessages,
              }
            : item,
        ),
      );
    } catch (error) {
      toast.error(getDisplayErrorMessage(error, "대화 내역을 불러오지 못했습니다"));
    }
  };

  const handleGoHome = () => {
    setIsSidebarOpen(false);
    navigate("/");
  };

  const handleTogglePin = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? { ...conv, isPinned: !conv.isPinned }
        : conv
    ));
    toast.success(
      conversations.find(c => c.id === conversationId)?.isPinned
        ? "대화 고정이 해제되었습니다"
        : "대화가 고정되었습니다"
    );
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteChatbotSession(conversationId);
    } catch (error) {
      toast.error(getDisplayErrorMessage(error, "대화 삭제에 실패했습니다"));
      return;
    }

    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
      setMessages([]);
    }
    toast.success("대화가 삭제되었습니다");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedConversations = {
    pinned: filteredConversations.filter(c => c.isPinned),
    today: filteredConversations.filter(c => !c.isPinned && isToday(c.timestamp)),
    yesterday: filteredConversations.filter(c => !c.isPinned && isYesterday(c.timestamp)),
    older: filteredConversations.filter(c => !c.isPinned && !isToday(c.timestamp) && !isYesterday(c.timestamp))
  };
  const currentConversation = conversations.find((conversation) => conversation.id === currentConversationId) ?? null;

  function isToday(date: Date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  function isYesterday(date: Date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  }

  const isEmpty = messages.length === 0;

  const renderChatComposer = (className = "") => (
    <div
      className={`relative flex items-end gap-3 rounded-[26px] border border-blue-100/80 bg-white/85 px-3 py-3 shadow-lg shadow-blue-100/40 backdrop-blur-sm transition-colors focus-within:border-indigo-300 dark:border-indigo-900/60 dark:bg-gray-900/80 dark:shadow-none dark:focus-within:border-indigo-500 ${className}`}
    >
      <Textarea
        placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={isTyping || isStreaming}
        className="flex-1 min-h-[24px] max-h-[200px] resize-none border-0 bg-transparent px-2 py-2 text-[15px] leading-6 focus-visible:ring-0 focus-visible:ring-offset-0"
        rows={1}
      />

      <Button
        onClick={() => isStreaming ? stopStreaming() : handleSendMessage()}
        disabled={!isStreaming && (!input.trim() || isTyping)}
        size="icon"
        className={`h-10 w-10 flex-shrink-0 rounded-full ${
          isStreaming
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-600"
        }`}
      >
        {isStreaming ? (
          <StopCircle className="w-4 h-4" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </div>
  );

  const getSourceUrl = (item: ChatEvidenceItem) => {
    const url = item.url || getDocumentUrlFromTitle(item.title);
    if (!url) {
      return undefined;
    }

    const baseUrl = url.startsWith("http") ? url : buildApiUrl(url);
    return item.page ? `${baseUrl}#page=${item.page}` : baseUrl;
  };

  const openSource = (item: ChatEvidenceItem) => {
    // "관련 문서 열기"는 로컬 PDF 다운로드 우선 — 외부 URL 대신 /documents/ 경로 사용
    const localPath = getDocumentUrlFromTitle(item.title);
    if (localPath) {
      const downloadUrl = buildApiUrl(localPath);
      const filename = item.title.split(/[\\/]/).pop() || "document.pdf";
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    const sourceUrl = getSourceUrl(item);
    if (!sourceUrl) {
      toast.error("열 수 있는 문서 링크가 없습니다");
      return;
    }

    window.open(sourceUrl, "_blank", "noopener,noreferrer");
  };

  const renderEvidenceItem = (item: ChatEvidenceItem) => {
    const sourceUrl = getSourceUrl(item);
    const sourceContent = item.content || item.excerpt;

    return (
      <div
        key={item.id}
        className="rounded-2xl border border-blue-100/80 bg-gradient-to-br from-white to-blue-50/60 p-4 dark:border-indigo-900/60 dark:from-gray-900 dark:to-indigo-950/20"
      >
        <div className="mb-2 flex items-start justify-between gap-3">
          <div className="min-w-0 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
            {item.title}
          </div>
          <span className="shrink-0 whitespace-nowrap rounded-full bg-blue-100 px-3 py-1 text-[11px] font-medium leading-4 text-blue-700 dark:bg-indigo-950/60 dark:text-blue-200">
            {evidenceTypeLabel[item.type]}
          </span>
        </div>
        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
          {item.summary}
        </p>
        {item.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
            {item.excerpt}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => openSource(item)}
            disabled={!sourceUrl}
            className="h-8 gap-1.5 rounded-full px-3 text-xs"
          >
            <FileText className="h-3.5 w-3.5" />
            관련 문서 열기
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => openSource(item)}
            disabled={!sourceUrl}
            className="h-8 gap-1.5 rounded-full px-3 text-xs"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            링크 열기
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setPreviewEvidence(item)}
            disabled={!sourceContent}
            className="h-8 gap-1.5 rounded-full px-3 text-xs"
          >
            <Eye className="h-3.5 w-3.5" />
            원문 보기
          </Button>
        </div>
      </div>
    );
  };

  const renderEvidenceCard = (evidence: ChatEvidenceItem[]) => (
    <div className="mt-4 rounded-2xl border border-blue-100/80 bg-white/85 p-4 shadow-sm shadow-blue-100/30 backdrop-blur-sm dark:border-indigo-900/60 dark:bg-gray-900/70 dark:shadow-none">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
            참고 근거
          </div>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            답변과 함께 확인하면 좋은 문서와 점검 포인트입니다.
          </div>
        </div>
        <div className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-blue-200">
          {evidence.length}건
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {evidence.map(renderEvidenceItem)}
      </div>
    </div>
  );

  // Sidebar Component
  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white/80 text-gray-900 backdrop-blur-xl dark:bg-gray-900/85 dark:text-white">
      <div className="border-b border-blue-100/70 px-4 pt-4 pb-4 dark:border-indigo-900/60">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleGoHome}
            className="group flex min-w-0 items-center gap-3 rounded-2xl px-1 py-1 text-left transition-transform hover:scale-[1.01]"
            aria-label="홈으로 이동"
          >
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 shadow-lg shadow-blue-200/60 transition-shadow group-hover:shadow-blue-300/70 dark:shadow-none">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="truncate bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-lg font-bold text-transparent dark:from-blue-400 dark:to-indigo-400">
              방가드
            </span>
          </button>

          <div className="hidden md:flex shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDesktopSidebarOpen(false)}
              className="h-9 w-9 rounded-full border border-blue-100/80 bg-white/80 text-gray-600 shadow-sm hover:bg-blue-50 dark:border-indigo-900/60 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-800"
              title="사이드바 닫기"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleNewChat}
          className="w-full justify-start gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200/50 hover:from-blue-600 hover:to-indigo-700 dark:shadow-none"
          variant="default"
        >
          <Plus className="w-4 h-4" />
          새 채팅
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-blue-100/70 dark:border-indigo-900/60">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="대화 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-xl border-blue-100/80 bg-white/80 pl-9 text-sm shadow-sm focus-visible:ring-indigo-200 dark:border-indigo-900/60 dark:bg-gray-800/80 dark:focus-visible:ring-indigo-900"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {groupedConversations.pinned.length > 0 && (
          <div className="space-y-1.5">
            <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">고정됨</div>
            {groupedConversations.pinned.map(conv => (
              <ConversationItem key={conv.id} conversation={conv} />
            ))}
          </div>
        )}

        {groupedConversations.today.length > 0 && (
          <div className="mt-4 space-y-1.5">
            <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">오늘</div>
            {groupedConversations.today.map(conv => (
              <ConversationItem key={conv.id} conversation={conv} />
            ))}
          </div>
        )}

        {groupedConversations.yesterday.length > 0 && (
          <div className="mt-4 space-y-1.5">
            <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">어제</div>
            {groupedConversations.yesterday.map(conv => (
              <ConversationItem key={conv.id} conversation={conv} />
            ))}
          </div>
        )}

        {groupedConversations.older.length > 0 && (
          <div className="mt-4 space-y-1.5">
            <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">이전 대화</div>
            {groupedConversations.older.map(conv => (
              <ConversationItem key={conv.id} conversation={conv} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-blue-100/70 dark:border-indigo-900/60">
        <div className="text-[10px] text-center text-gray-400 dark:text-gray-500">
          방가드 AI © 2026
        </div>
      </div>
    </div>
  );

  const ConversationItem = ({ conversation }: { conversation: Conversation }) => (
    <div className="group/item relative">
      <button
        onClick={() => handleSelectConversation(conversation)}
        className={`w-full rounded-xl border border-transparent p-3 pr-12 text-left transition-all hover:border-blue-100 hover:bg-blue-50/70 dark:hover:border-indigo-900/60 dark:hover:bg-gray-800/80 ${
          currentConversationId === conversation.id 
            ? "border-blue-100 bg-white shadow-sm shadow-blue-100/40 dark:border-indigo-900/60 dark:bg-gray-800/90 dark:shadow-none" 
            : ""
        }`}
      >
        <div className="flex items-start gap-2">
          <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
          <div className="flex-1 min-w-0 pr-6">
            <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
              {conversation.title}
            </div>
            <div className="truncate text-xs text-gray-500 dark:text-gray-400">
              {conversation.lastMessage}
            </div>
          </div>
        </div>
      </button>
      
      {/* More Menu Button */}
      <div className="absolute right-2 top-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full bg-white/80 text-gray-500 shadow-sm hover:bg-white dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePin(conversation.id);
              }}
              className="gap-2 cursor-pointer"
            >
              {conversation.isPinned ? (
                <>
                  <PinOff className="w-4 h-4" />
                  <span>고정 해제</span>
                </>
              ) : (
                <>
                  <Pin className="w-4 h-4" />
                  <span>고정</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                void handleDeleteConversation(conversation.id);
              }}
              className="gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
              <span>삭제</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 text-gray-900 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30 dark:text-white">
      {/* Desktop Sidebar */}
      <motion.div 
        initial={false}
        animate={{ 
          width: isDesktopSidebarOpen ? CHATBOT_SIDEBAR_WIDTH : 0,
          opacity: isDesktopSidebarOpen ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
        className="hidden shrink-0 overflow-hidden border-r border-blue-100/70 dark:border-indigo-900/60 md:block"
      >
        <div
          className="h-full shrink-0"
          style={{ width: `${CHATBOT_SIDEBAR_WIDTH}px` }}
        >
          <SidebarContent />
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[320px] max-w-[calc(100%_-_1rem)] border-r border-blue-100/70 bg-white/90 p-0 backdrop-blur-xl [&>button]:hidden dark:border-indigo-900/60 dark:bg-gray-900/95"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Chat Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-blue-100/70 bg-white/55 px-4 backdrop-blur-md md:px-6 dark:border-indigo-900/60 dark:bg-gray-900/45">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full border border-blue-100/80 bg-white/80 text-gray-700 shadow-sm hover:bg-blue-50 md:hidden dark:border-indigo-900/60 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            {/* Desktop Sidebar Toggle Button - Shows when sidebar is closed */}
            {!isDesktopSidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-10 w-10 rounded-full border border-blue-100/80 bg-white/80 text-gray-700 shadow-sm hover:bg-blue-50 md:flex dark:border-indigo-900/60 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={() => setIsDesktopSidebarOpen(true)}
                title="사이드바 열기"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
            
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {currentConversation?.title || "방가드 AI"}
              </div>
              <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                {isEmpty ? "부동산 상담 도우미" : "전세 계약과 주거 안전을 함께 점검해요"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              className="rounded-full px-4 text-xs font-medium text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-gray-800"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              새 채팅
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {isEmpty ? (
            // Empty State
            <div className="flex min-h-full flex-col items-center justify-center px-4 py-10">
              <div className="mx-auto w-full max-w-4xl space-y-8">
                <div className="flex flex-col items-center text-center">
                  <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                    무엇을 도와드릴까요?
                  </h2>
                  
                  <p className="mb-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400 md:text-base">
                    부동산 계약과 전세 사기 예방에 대해 궁금한 점을 물어보세요
                  </p>
                </div>

                {/* Suggested Questions Grid */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => handleSendMessage(question)}
                      className="group rounded-2xl border border-blue-100/80 bg-white/80 p-5 text-left shadow-sm shadow-blue-100/30 backdrop-blur-sm transition-all hover:border-indigo-200 hover:bg-white hover:shadow-lg dark:border-indigo-900/60 dark:bg-gray-800/80 dark:shadow-none dark:hover:border-indigo-700 dark:hover:bg-gray-800"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="text-xs font-medium uppercase tracking-[0.18em] text-blue-500 dark:text-blue-300">
                          추천 질문
                        </div>
                        <ChevronRight className="h-4 w-4 text-blue-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-indigo-800 dark:group-hover:text-indigo-300" />
                      </div>
                      <div className="text-sm leading-6 text-gray-700 transition-colors group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
                        {question}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Input Area - Integrated with Empty State */}
                <div className="pt-2">
                  {renderChatComposer("max-w-3xl mx-auto")}
                  <div className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
                    방가드 AI는 참고용 가이드를 제공합니다. 계약 직전에는 공식 서류를 다시 확인하세요.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Messages
            <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-8 md:px-8">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`group mb-8 ${message.role === "user" ? "self-end w-full max-w-3xl" : "self-start w-full max-w-4xl"}`}
                >
                  <div className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
                    {message.role === "assistant" && (
                      <div className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white shadow-lg shadow-blue-200/60 md:flex dark:shadow-none">
                        AI
                      </div>
                    )}

                    <div className={`min-w-0 ${message.role === "user" ? "max-w-[85%]" : "flex-1"}`}>
                      {editingMessageId === message.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[100px] rounded-lg"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit} className="gap-2">
                              <Check className="w-4 h-4" />
                              저장
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingMessageId(null);
                                setEditText("");
                              }}
                            >
                              취소
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className={`whitespace-pre-wrap break-words text-[15px] leading-7 text-gray-900 dark:text-gray-100 ${
                            message.role === "user"
                              ? "rounded-[26px] bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-4 text-white shadow-lg shadow-blue-200/60 dark:shadow-none"
                              : ""
                          }`}>
                            {message.content}
                            {message.isStreaming && (
                              <span className="inline-block w-1.5 h-4 bg-current ml-1 animate-pulse" />
                            )}
                          </div>

                          {message.role === "assistant" && message.evidence && message.evidence.length > 0 && (
                            renderEvidenceCard(message.evidence)
                          )}

                          {/* Action Buttons */}
                          {!message.isStreaming && (
                            <div className="mt-3 flex flex-wrap gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopy(message.content)}
                                className="h-9 gap-1.5 rounded-full px-3 text-xs"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                복사
                              </Button>
                              
                              {message.role === "assistant" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRegenerate(message.id)}
                                    className="h-9 gap-1.5 rounded-full px-3 text-xs"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    재생성
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant={message.feedback === "like" ? "default" : "ghost"}
                                    aria-pressed={message.feedback === "like"}
                                    aria-label="좋아요"
                                    title="좋아요"
                                    onClick={() => handleAssistantFeedback(message.id, "like")}
                                    className={`h-9 min-w-9 rounded-full px-3 ${
                                      message.feedback === "like"
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-indigo-950/50 dark:hover:text-blue-300"
                                    }`}
                                  >
                                    <ThumbsUp className={`h-4 w-4 ${message.feedback === "like" ? "fill-current" : ""}`} />
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant={message.feedback === "dislike" ? "default" : "ghost"}
                                    aria-pressed={message.feedback === "dislike"}
                                    aria-label="싫어요"
                                    title="싫어요"
                                    onClick={() => handleAssistantFeedback(message.id, "dislike")}
                                    className={`h-9 min-w-9 rounded-full px-3 ${
                                      message.feedback === "dislike"
                                        ? "bg-red-600 text-white hover:bg-red-700"
                                        : "text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                                    }`}
                                  >
                                    <ThumbsDown className={`h-4 w-4 ${message.feedback === "dislike" ? "fill-current" : ""}`} />
                                  </Button>
                                </>
                              )}

                              {message.role === "user" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(message.id, message.content)}
                                  className="h-9 gap-1.5 rounded-full px-3 text-xs"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  수정
                                </Button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-4">
                  <div className="hidden h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white shadow-lg shadow-blue-200/60 md:flex dark:shadow-none">
                    AI
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!isEmpty && (
          <div className="border-t border-blue-100/70 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-indigo-900/60 dark:bg-gray-900/80">
            <div className="mx-auto w-full max-w-4xl">
              {renderChatComposer()}
              <div className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
                방가드 AI는 참고용 가이드를 제공합니다. 계약 직전에는 공식 서류를 다시 확인하세요.
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={Boolean(previewEvidence)} onOpenChange={(open) => !open && setPreviewEvidence(null)}>
        <DialogContent className="flex h-[85vh] max-h-[760px] flex-col overflow-hidden p-0 sm:max-w-3xl">
          <DialogHeader className="shrink-0">
            <div className="space-y-2 border-b border-blue-100 px-6 py-5 dark:border-indigo-900/60">
              <DialogTitle>{previewEvidence?.title || "원문 보기"}</DialogTitle>
              <DialogDescription>
                {previewEvidence?.summary || "답변 생성에 참고된 문서 원문입니다."}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="min-h-full whitespace-pre-wrap break-words rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm leading-7 text-gray-700 dark:border-indigo-900/60 dark:bg-indigo-950/20 dark:text-gray-200">
              {previewEvidence?.content || previewEvidence?.excerpt || "표시할 원문이 없습니다."}
            </div>
          </div>

          {previewEvidence && getSourceUrl(previewEvidence) && (
            <div className="flex shrink-0 justify-end border-t border-blue-100 px-6 py-4 dark:border-indigo-900/60">
              <Button
                type="button"
                onClick={() => openSource(previewEvidence)}
                className="gap-2 rounded-xl"
              >
                <ExternalLink className="h-4 w-4" />
                PDF에서 열기
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
