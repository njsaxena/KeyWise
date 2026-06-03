// app/dashboard/assistant/page.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type Conversation = {
  id: string; // real DB id or temporary "temp-..." before first send
  title: string;
  createdAt: string;
  messages: Message[];
};

export default function AssistantPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load existing conversations from the backend on mount
  React.useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/assistant/conversations", {
          method: "GET",
        });

        if (!res.ok) {
          console.error(
            "Failed to load assistant conversations:",
            await res.text(),
          );
          return;
        }

        const data: { conversations: Conversation[] } = await res.json();

        if (cancelled) return;

        setConversations(data.conversations || []);

        // Select the most recent conversation if any
        if (data.conversations && data.conversations.length > 0) {
          setSelectedId(data.conversations[0].id);
        } else {
          setSelectedId(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error loading assistant conversations:", err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadConversations();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedConversation =
    conversations.find((c) => c.id === selectedId) ?? null;

  function handleNewChat() {
    const tempId = `temp-${Date.now()}`;
    const now = new Date();
    const newConversation: Conversation = {
      id: tempId,
      title: "New chat",
      createdAt: now.toLocaleString(),
      messages: [],
    };

    setConversations((prev) => [newConversation, ...prev]);
    setSelectedId(tempId);
    setInput("");
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !selectedConversation || isSending) return;

    const userText = input.trim();
    setInput("");
    setIsSending(true);

    try {
      const conversationId = selectedConversation.id.startsWith("temp-")
        ? null
        : selectedConversation.id;

      const tempMessageId = `local-${Date.now()}`;
      const optimisticMessage: Message = {
        id: tempMessageId,
        role: "user",
        content: userText,
        createdAt: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversation.id
            ? {
                ...c,
                title:
                  c.messages.length === 0
                    ? userText.slice(0, 40) || "New chat"
                    : c.title,
                messages: [...c.messages, optimisticMessage],
              }
            : c,
        ),
      );

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          message: userText,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Assistant API error:", text);
         // Optionally parse and surface to UI later
        setIsSending(false);
        return;
      }

      const data: { conversation: Conversation } = await res.json();

      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (
            c.id === selectedConversation.id || // temp
            c.id === data.conversation.id // already real
          ) {
            return data.conversation;
          }
          return c;
        });

        if (!updated.find((c) => c.id === data.conversation.id)) {
          updated.unshift(data.conversation);
        }

        return updated;
      });

      setSelectedId(data.conversation.id);
    } catch (error) {
      console.error("Error calling /api/assistant:", error);
    } finally {
      setIsSending(false);
    }
  }

  async function handleRename() {
    if (!selectedConversation) return;
    if (selectedConversation.id.startsWith("temp-")) return;

    const newTitle = window.prompt(
      "Rename chat",
      selectedConversation.title || "New chat",
    );
    if (!newTitle || !newTitle.trim()) return;

    try {
      const res = await fetch(
        `/api/assistant/conversations/${selectedConversation.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle.trim() }),
        },
      );

      if (!res.ok) {
        console.error("Rename conversation error:", await res.text());
        return;
      }

      const data: { conversation: { id: string; title: string } } =
        await res.json();

      setConversations((prev) =>
        prev.map((c) =>
          c.id === data.conversation.id
            ? { ...c, title: data.conversation.title }
            : c,
        ),
      );
    } catch (err) {
      console.error("Rename conversation request error:", err);
    }
  }

  async function handleDelete() {
    if (!selectedConversation) return;
    if (selectedConversation.id.startsWith("temp-")) {
      // Just drop the local temp conversation
      setConversations((prev) =>
        prev.filter((c) => c.id !== selectedConversation.id),
      );
      setSelectedId((prevSelectedId) =>
        prevSelectedId === selectedConversation.id ? null : prevSelectedId,
      );
      return;
    }

    if (
      !window.confirm(
        "Delete this chat and all its messages? This cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `/api/assistant/conversations/${selectedConversation.id}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        console.error("Delete conversation error:", await res.text());
        return;
      }

      setConversations((prev) =>
        prev.filter((c) => c.id !== selectedConversation.id),
      );

      setSelectedId((prevSelectedId) => {
        if (prevSelectedId !== selectedConversation.id) {
          return prevSelectedId;
        }
        const remaining = conversations.filter(
          (c) => c.id !== selectedConversation.id,
        );
        return remaining[0]?.id ?? null;
      });
    } catch (err) {
      console.error("Delete conversation request error:", err);
    }
  }

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold kw-text">AI Assistant</h1>
        <p className="text-sm kw-muted mt-2">
          Ask KeyWise questions about your listings, pricing, and messaging.
        </p>
      </div>

      <div className="flex gap-6 min-h-[520px]">
        {/* Left: conversation list */}
        <Card className="w-64 flex-shrink-0 kw-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm font-medium kw-text">
                Chats
              </CardTitle>
              <Button size="sm" variant="outline" onClick={handleNewChat}>
                + New chat
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-1">
              {isLoading && conversations.length === 0 && (
                <p className="text-xs kw-muted">Loading chats...</p>
              )}
              {!isLoading && conversations.length === 0 && (
                <p className="text-xs kw-muted">
                  No chats yet, click &quot;New chat&quot; to start.
                </p>
              )}
              {conversations.map((conv) => {
                const isActive = conv.id === selectedId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={[
                      "w-full text-left rounded-lg px-3 py-2 text-xs transition-colors",
                      "border kw-border",
                      isActive
                        ? "bg-primary/5 border-primary/40"
                        : "bg-white hover:bg-gray-50",
                    ].join(" ")}
                  >
                    <div className="truncate font-medium kw-text">
                      {conv.title || "New chat"}
                    </div>
                    <div className="text-[11px] kw-muted-2 mt-0.5">
                      {new Date(conv.createdAt).toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Right: active conversation */}
        <Card className="flex-1 flex flex-col kw-card">
          <CardHeader className="pb-3 border-b kw-border">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-sm font-medium kw-text">
                {selectedConversation?.title || "New chat"}
              </CardTitle>
              {selectedConversation &&
                !selectedConversation.id.startsWith("temp-") && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRename}
                    >
                      Rename
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </div>
                )}
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col gap-4 pt-4">
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {selectedConversation && selectedConversation.messages.length > 0 ? (
                selectedConversation.messages.map((m) => (
                  <div
                    key={m.id}
                    className={
                      m.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className={[
                        "max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/40 text-foreground border kw-border",
                      ].join(" ")}
                    >
                      {m.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-sm">
                    <p className="text-sm kw-text font-medium">
                      {isLoading ? "Loading..." : "No chats yet"}
                    </p>
                    <p className="text-xs kw-muted mt-2">
                      {isLoading
                        ? "Fetching your conversations."
                        : 'No chats yet, click "New chat" to start.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSend}
              className="pt-2 border-t kw-border space-y-3"
            >
              <Textarea
                rows={2}
                placeholder={
                  selectedConversation
                    ? "Send a message to KeyWise..."
                    : "Start by creating a new chat."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!selectedConversation || isSending}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!input.trim() || !selectedConversation || isSending}
                >
                  {isSending ? "Thinking..." : "Send"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
