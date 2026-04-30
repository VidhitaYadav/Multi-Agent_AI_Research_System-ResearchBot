import React from "react";

/**
 * ChatMessage — renders a single chat bubble.
 * User messages appear on the RIGHT (blue).
 * Bot messages appear on the LEFT (dark grey).
 *
 * Supports simple markdown:
 *   **bold**, *italic*, `code`, ---  (horizontal rule)
 */

// Very lightweight markdown renderer (no external lib needed)
function renderMarkdown(text) {
  return text
    .split("\n")
    .map((line, i) => {
      // Horizontal rule
      if (line.trim() === "---") return <hr key={i} className="msg-hr" />;

      // Process inline formatting
      const parts = [];
      let remaining = line;
      let key = 0;

      // Bold: **text**
      const boldRe = /\*\*(.+?)\*\*/g;
      let last = 0;
      let match;
      const segments = [];

      // We'll collect all matches first, then build parts
      const allMatches = [];
      const inlineRe = /\*\*(.+?)\*\*|`(.+?)`|\*(.+?)\*/g;
      let m;
      while ((m = inlineRe.exec(line)) !== null) {
        allMatches.push({ index: m.index, length: m[0].length, m });
      }

      let cursor = 0;
      for (const { index, length, m } of allMatches) {
        if (index > cursor) parts.push(line.slice(cursor, index));
        if (m[1] !== undefined) parts.push(<strong key={key++}>{m[1]}</strong>);
        else if (m[2] !== undefined) parts.push(<code key={key++} className="inline-code">{m[2]}</code>);
        else if (m[3] !== undefined) parts.push(<em key={key++}>{m[3]}</em>);
        cursor = index + length;
      }
      if (cursor < line.length) parts.push(line.slice(cursor));

      return (
        <React.Fragment key={i}>
          {parts.length > 0 ? parts : line}
          {"\n"}
        </React.Fragment>
      );
    });
}

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`msg-row ${isUser ? "msg-row--user" : "msg-row--bot"}`}>
      {/* Avatar (bot only) */}
      {!isUser && (
        <div className="avatar avatar--bot" aria-hidden="true">⚗️</div>
      )}

      <div className={`bubble ${isUser ? "bubble--user" : "bubble--bot"} ${message.isError ? "bubble--error" : ""}`}>
        {/* Sender label */}
        <span className="bubble-sender">{isUser ? "You" : "ResearchBot"}</span>

        {/* Message content */}
        <div className="bubble-text">
          {renderMarkdown(message.text)}
        </div>
      </div>

      {/* Avatar (user only) */}
      {isUser && (
        <div className="avatar avatar--user" aria-hidden="true">👤</div>
      )}
    </div>
  );
}