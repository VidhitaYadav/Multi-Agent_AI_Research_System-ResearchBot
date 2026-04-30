import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./components/ChatMessage";
import TypingIndicator from "./components/TypingIndicator";
import SendIcon from "./components/SendIcon";

// ──────────────────────────────────────────────
// API base URL — change this if your backend runs elsewhere
// ──────────────────────────────────────────────
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Welcome message shown when the chat is empty
const WELCOME = {
  id: 0,
  role: "bot",
  text:
    "👋 Welcome to the **Multi-Agent Research System**!\n\nType any research topic and I'll run a full pipeline:\n\n1. 🔍 **Search Agent** — finds recent information\n2. 📄 **Reader Agent** — scrapes top resources\n3. ✍️  **Writer** — drafts a structured report\n4. 🧠 **Critic** — reviews and refines the output\n\nJust type a topic below to begin!",
};

export default function App() {
  const [messages, setMessages]   = useState([WELCOME]);
  const [input, setInput]         = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);
  const bottomRef                 = useRef(null);
  const inputRef                  = useRef(null);

  // Auto-scroll to the latest message whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Keep focus in the input box after sending
  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  // ── Send message ──────────────────────────────
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setError(null);
    setInput("");

    // Add the user bubble immediately
    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Server error");
      }

      const data = await res.json();
      const botMsg = { id: Date.now() + 1, role: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setError(err.message);
      const errMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: `❌ **Error:** ${err.message}\n\nMake sure the FastAPI backend is running on \`localhost:8000\`.`,
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Send on Enter (Shift+Enter = newline)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app-shell">
      {/* ── Header ── */}
      <header className="chat-header">
        <div className="header-inner">
          <div className="header-logo">
            <span className="logo-icon">⚗️</span>
            <div>
              <h1 className="header-title">ResearchBot</h1>
              <p className="header-subtitle">Multi-Agent AI Research System</p>
            </div>
          </div>
          <div className="header-status">
            <span className="status-dot" />
            <span className="status-text">Online</span>
          </div>
        </div>
      </header>

      {/* ── Chat window ── */}
      <main className="chat-window">
        <div className="messages-list">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* ── Input bar ── */}
      <footer className="input-bar">
        <div className="input-inner">
          <textarea
            ref={inputRef}
            className="chat-input"
            rows={1}
            placeholder="Enter a research topic…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className={`send-btn ${isLoading || !input.trim() ? "send-btn--disabled" : ""}`}
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <SendIcon />
            )}
          </button>
        </div>
        <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
      </footer>
    </div>
  );
}