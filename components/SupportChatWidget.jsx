"use client";

import { useState, useRef, useEffect } from "react";
import { DB_URL } from "@config/config";
import styles from "./SupportChatWidget.module.css";

const API_BASE = (DB_URL || "").replace(/\/api\/?$/, "") || "https://yookatale-server.onrender.com";
const SUPPORT_CHAT_URL = `${API_BASE}/api/support/chat`;

const INITIAL_BOT_MESSAGE = "👋 Hi there! I'm Yookatale support. How can I help you today? You can ask about orders, subscriptions, the app, or anything Yookatale. 🌱";

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: INITIAL_BOT_MESSAGE, time: formatTime() },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleOpen = () => setOpen((o) => !o);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMessage = { role: "user", content: text, time: formatTime() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    setSending(true);

    const historyForApi = [
      ...messages
        .filter((m) => m.role === "assistant" || m.role === "user")
        .map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: text },
    ];

    try {
      const res = await fetch(SUPPORT_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyForApi }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      const reply = data.reply || (res.ok ? "" : "Something went wrong. Please try again.");
      if (!res.ok) throw new Error(reply);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply || "Sorry, I couldn't generate a reply.",
          time: formatTime(),
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again in a moment.",
          time: formatTime(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const addEmoji = () => {
    const emojis = ["😊", "🔥", "✅", "🍃", "💚", "🧡"];
    const random = emojis[Math.floor(Math.random() * emojis.length)];
    setInput((prev) => prev + random);
    inputRef.current?.focus();
  };

  const addFileChip = () => {
    setAttachments((prev) => [
      ...prev,
      { id: Date.now(), type: "file", label: `document_${Math.floor(Math.random() * 100)}.pdf` },
    ]);
  };

  const addVoiceChip = () => {
    setAttachments((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "voice",
        label: `voice note (0:${String(Math.floor(Math.random() * 60)).padStart(2, "0")})`,
      },
    ]);
  };

  const removeAttachment = (id) => setAttachments((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className={styles.widget}>
      <button type="button" className={styles.button} onClick={toggleOpen} aria-label="Open support chat">
        <i className={`fas fa-comment-dots ${styles.buttonIcon}`} />
      </button>

      <div className={`${styles.container} ${open ? styles.containerOpen : ""}`}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              <i className="fas fa-leaf" style={{ color: "#006b4f" }} />
            </div>
            <div className={styles.title}>
              <h2>Yookatale</h2>
              <p>
                <i className="fa-solid fa-circle" /> online · support
              </p>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close chat">
            <i className="fas fa-xmark" />
          </button>
        </div>

        <div className={styles.messages}>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`${styles.message} ${m.role === "user" ? styles.messageUser : styles.messageBot}`}
            >
              <div className={styles.bubble}>{m.content}</div>
              <span className={styles.timestamp}>{m.time}</span>
            </div>
          ))}
          {sending && (
            <div className={`${styles.message} ${styles.messageBot}`}>
              <div className={styles.bubble}>...</div>
              <span className={styles.timestamp}>{formatTime()}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.footer}>
          {attachments.length > 0 && (
            <div className={styles.attachedRow}>
              {attachments.map((a) => (
                <span key={a.id} className={styles.chip}>
                  <i className={a.type === "voice" ? "fa-solid fa-microphone-lines" : "fa-solid fa-file-lines"} />
                  {a.label}
                  <i
                    className={`fa-regular fa-circle-xmark ${styles.chipRemove}`}
                    onClick={() => removeAttachment(a.id)}
                    onKeyDown={(e) => e.key === "Enter" && removeAttachment(a.id)}
                    role="button"
                    tabIndex={0}
                    aria-label="Remove"
                  />
                </span>
              ))}
            </div>
          )}
          <div className={styles.inputTools}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              disabled={sending}
            />
            <button type="button" className={styles.actionBtn} onClick={addEmoji} title="Add emoji">
              <i className="fa-regular fa-face-smile" />
            </button>
            <button type="button" className={styles.actionBtn} onClick={addFileChip} title="Attach file">
              <i className="fa-solid fa-paperclip" />
            </button>
            <button type="button" className={styles.actionBtn} onClick={addVoiceChip} title="Voice note">
              <i className="fa-solid fa-microphone" />
            </button>
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.actionBtnOrange}`}
              onClick={sendMessage}
              disabled={sending}
              title="Send"
            >
              <i className="fa-regular fa-paper-plane" />
            </button>
          </div>
          <div className={styles.note}>
            <i className="fa-solid fa-lock" style={{ color: "#006b4f" }} /> end-to-end encrypted
          </div>
        </div>
      </div>
    </div>
  );
}
