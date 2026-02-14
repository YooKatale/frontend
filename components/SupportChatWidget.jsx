"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { DB_URL } from "@config/config";
import styles from "./SupportChatWidget.module.css";

const API_BASE = (DB_URL || "").replace(/\/api\/?$/, "") || "https://yookatale-server.onrender.com";
const SUPPORT_CHAT_URL = `${API_BASE}/api/support/chat";

const INITIAL_BOT_MESSAGE = "👋 Hey! Need help with orders, meal plans, or delivery? I'm here to help 24/7. Ask me anything about Yookatale — subscriptions, tracking, or the app! 🌱";
const CHAT_PROMPT_LABEL = "Chat with us — we're here to help!";

function playNotificationSound() {
  try {
    if (typeof window === "undefined" || !window.AudioContext && !window.webkitAudioContext) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch (_) {}
}

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Parse **bold** and URLs into React nodes; do not use *** for bold
function formatBotMessage(content) {
  if (!content || typeof content !== "string") return content;

  function processSegment(seg) {
    const nodes = [];
    let lastIndex = 0;
    let m;
    const re = /\*\*(.+?)\*\*|(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;
    while ((m = re.exec(seg)) !== null) {
      if (m.index > lastIndex) {
        nodes.push(seg.slice(lastIndex, m.index));
      }
      if (m[1] !== undefined) {
        nodes.push(<strong key={`b-${m.index}`}>{m[1]}</strong>);
      } else if (m[2]) {
        const url = m[2];
        nodes.push(
          <a key={`a-${m.index}`} href={url} target="_blank" rel="noopener noreferrer" className={styles.chatLink}>
            {url}
          </a>
        );
      }
      lastIndex = m.index + m[0].length;
    }
    if (lastIndex < seg.length) nodes.push(seg.slice(lastIndex));
    return nodes;
  }

  return processSegment(content);
}

const CHAT_SIZE_KEY = "yookatale_support_chat_size";

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: INITIAL_BOT_MESSAGE, time: formatTime() },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [chatSize, setChatSize] = useState(() => {
    if (typeof window === "undefined") return "default";
    return window.localStorage.getItem(CHAT_SIZE_KEY) || "default";
  });
  const [userInfo, setUserInfo] = useState(() => {
    if (typeof window === "undefined") return { name: "", email: "", phone: "" };
    try {
      const s = window.localStorage.getItem("yookatale_support_user_info");
      if (s) {
        const parsed = JSON.parse(s);
        return { name: parsed.name || "", email: parsed.email || "", phone: parsed.phone || "" };
      }
    } catch {}
    return { name: "", email: "", phone: "" };
  });
  const [showUserInfoForm, setShowUserInfoForm] = useState(true);
  const [userInfoSubmitted, setUserInfoSubmitted] = useState(false);
  const [userForm, setUserForm] = useState({ name: "", email: "", phone: "" });
  const [conversationId, setConversationId] = useState(null);
  const [withAgent, setWithAgent] = useState(false);
  const [agentInfo, setAgentInfo] = useState({ name: "", avatar: "" });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const prevMessageCountRef = useRef(0);
  const hasPlayedOpenSoundRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CHAT_SIZE_KEY, chatSize);
    }
  }, [chatSize]);

  // Poll for agent messages when in handoff mode; update agent info; play sound on new agent message
  useEffect(() => {
    if (!withAgent || !conversationId || !open) return;
    const url = `${API_BASE}/api/support/conversations/${conversationId}/messages`;
    const fetchMessages = async () => {
      try {
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (data.messages && Array.isArray(data.messages)) {
          const prevCount = prevMessageCountRef.current;
          const lastFromAgent = data.messages.length > 0 && (data.messages[data.messages.length - 1].role === "agent" || data.messages[data.messages.length - 1].role === "assistant");
          if (data.messages.length > prevCount && lastFromAgent && prevCount > 0) {
            playNotificationSound();
          }
          prevMessageCountRef.current = data.messages.length;

          if (data.conversation) {
            setAgentInfo({
              name: data.conversation.agentName || "Support",
              avatar: data.conversation.agentAvatar || "",
            });
          }
          const mapped = data.messages.map((m) => ({
            role: m.role === "agent" ? "assistant" : m.role,
            content: m.content,
            time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : formatTime(),
          }));
          setMessages(mapped);
        }
      } catch {
        // ignore
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [withAgent, conversationId, open]);

  const cycleChatSize = () => {
    setChatSize((s) => (s === "default" ? "large" : "default"));
  };

  const saveUserInfo = () => {
    const info = { name: userForm.name.trim(), email: userForm.email.trim(), phone: userForm.phone.trim() };
    setUserInfo(info);
    setUserInfoSubmitted(true);
    setShowUserInfoForm(false);
    try {
      window.localStorage.setItem("yookatale_support_user_info", JSON.stringify(info));
    } catch {}
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleOpen = () => {
    setOpen((o) => {
      const next = !o;
      if (next && !hasPlayedOpenSoundRef.current) {
        hasPlayedOpenSoundRef.current = true;
        playNotificationSound();
      }
      return next;
    });
  };

  const requestAgent = async () => {
    if (sending || withAgent) return;
    setSending(true);
    const userInfoPayload = userInfoSubmitted && (userInfo.name || userInfo.email || userInfo.phone)
      ? { name: userInfo.name, email: userInfo.email, phone: userInfo.phone }
      : {};
    const messageHistory = messages
      .filter((m) => m.role === "assistant" || m.role === "user")
      .map((m) => ({ role: m.role, content: m.content }));
    try {
      const res = await fetch(`${API_BASE}/api/support/handoff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInfo: userInfoPayload, messageHistory }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (data.conversationId) {
        setConversationId(data.conversationId);
        setWithAgent(true);
        setMessages((prev) => [...prev, { role: "assistant", content: "You’re connected. An agent will reply here soon. You can keep sending messages.", time: formatTime() }]);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Could not connect to an agent. Please try again.", time: formatTime() }]);
    } finally {
      setSending(false);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMessage = { role: "user", content: text, time: formatTime() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    setSending(true);

    if (withAgent && conversationId) {
      try {
        const res = await fetch(`${API_BASE}/api/support/conversations/${conversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text }),
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Failed to send");
      } catch (e) {
        setMessages((prev) => [...prev, { role: "assistant", content: "Message could not be sent. Please try again.", time: formatTime() }]);
      }
      setSending(false);
      return;
    }

    const historyForApi = [
      ...messages
        .filter((m) => m.role === "assistant" || m.role === "user")
        .map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: text },
    ];

    const body = { messages: historyForApi };
    if (userInfoSubmitted && (userInfo.name || userInfo.email || userInfo.phone)) {
      body.userInfo = { name: userInfo.name || undefined, email: userInfo.email || undefined, phone: userInfo.phone || undefined };
    }

    try {
      const res = await fetch(SUPPORT_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
      <button type="button" className={styles.button} onClick={toggleOpen} aria-label={CHAT_PROMPT_LABEL} title={CHAT_PROMPT_LABEL}>
        <i className={`fas fa-comment-dots ${styles.buttonIcon}`} />
        <span className={styles.buttonLabel}>{CHAT_PROMPT_LABEL}</span>
      </button>

      <div className={`${styles.container} ${open ? styles.containerOpen : ""} ${chatSize === "large" ? styles.containerLarge : ""}`}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              {withAgent && agentInfo.avatar ? (
                <img src={agentInfo.avatar} alt={agentInfo.name} className={styles.avatarImg} />
              ) : withAgent && agentInfo.name ? (
                <span className={styles.avatarInitials}>{String(agentInfo.name).trim().slice(0, 2).toUpperCase()}</span>
              ) : (
                <Image src="/assets/icons/logo2.png" alt="Yookatale" width={40} height={40} className={styles.avatarLogo} />
              )}
            </div>
            <div className={styles.title}>
              <h2>{withAgent ? (agentInfo.name || "Support") : "Yookatale"}</h2>
              <p>
                <i className="fa-solid fa-circle" /> {withAgent ? "with you now" : "online · support"}
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button type="button" className={styles.actionBtn} onClick={cycleChatSize} title="Resize chat">
              <i className={chatSize === "large" ? "fa-solid fa-compress" : "fa-solid fa-expand"} />
            </button>
            <button type="button" className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close chat">
              <i className="fas fa-xmark" />
            </button>
          </div>
        </div>

        {showUserInfoForm && !userInfoSubmitted && (
          <div className={styles.userInfoForm}>
            <p className={styles.userInfoTitle}>Optional: add your details for follow-up</p>
            <input
              type="text"
              placeholder="Name"
              value={userForm.name}
              onChange={(e) => setUserForm((u) => ({ ...u, name: e.target.value }))}
              className={styles.userInfoInput}
            />
            <input
              type="email"
              placeholder="Email"
              value={userForm.email}
              onChange={(e) => setUserForm((u) => ({ ...u, email: e.target.value }))}
              className={styles.userInfoInput}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={userForm.phone}
              onChange={(e) => setUserForm((u) => ({ ...u, phone: e.target.value }))}
              className={styles.userInfoInput}
            />
            <div className={styles.userInfoBtns}>
              <button type="button" className={styles.userInfoSubmit} onClick={saveUserInfo}>Save</button>
              <button type="button" className={styles.userInfoSkip} onClick={() => setShowUserInfoForm(false)}>Skip</button>
            </div>
          </div>
        )}

        <div className={styles.messages}>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`${styles.message} ${m.role === "user" ? styles.messageUser : styles.messageBot}`}
            >
              <div className={styles.bubble}>
                {m.role === "assistant" ? formatBotMessage(m.content) : m.content}
              </div>
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
          {!withAgent && (
            <button type="button" className={styles.talkToAgentBtn} onClick={requestAgent} disabled={sending}>
              <i className="fa-solid fa-user-headset" /> Talk to an agent
            </button>
          )}
          <div className={styles.note}>
            <i className="fa-solid fa-lock" style={{ color: "#006b4f" }} /> end-to-end encrypted
          </div>
        </div>
      </div>
    </div>
  );
}
