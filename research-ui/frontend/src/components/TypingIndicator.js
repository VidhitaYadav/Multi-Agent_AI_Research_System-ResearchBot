/**
 * TypingIndicator — animated "Bot is typing…" indicator
 * Shows three bouncing dots while waiting for the API response.
 */
export default function TypingIndicator() {
  return (
    <div className="msg-row msg-row--bot">
      <div className="avatar avatar--bot" aria-hidden="true">⚗️</div>
      <div className="bubble bubble--bot typing-bubble" aria-label="Bot is typing">
        <span className="bubble-sender">ResearchBot</span>
        <div className="typing-dots">
          <span className="dot dot--1" />
          <span className="dot dot--2" />
          <span className="dot dot--3" />
          <span className="typing-label">Researching…</span>
        </div>
      </div>
    </div>
  );
}