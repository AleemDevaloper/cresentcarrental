import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { FiMessageCircle, FiX, FiSend, FiCpu, FiCalendar, FiArrowRight } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const QUICK = [
  "Services",
  "Custom software",
  "AI automation",
  "Pricing",
  "How you work",
];

const KB = [
  {
    keys: ["price", "cost", "quote", "pricing", "budget", "how much"],
    reply:
      "Our engagements start around $3k for an MVP sprint and $8k for a growth system, scaled to need. Final pricing is confirmed after we review modules, users, branches, integrations and support — no surprise invoices.",
  },
  {
    keys: ["ai", "automation", "agent", "copilot", "chat"],
    reply:
      "We build practical AI — agents, copilots, document intelligence and workflow automation — only where your data, privacy and scope truly support it. Want to see how AI fits your business?",
  },
  {
    keys: ["service", "offer", "what do you", "solutions", "build"],
    reply:
      "We’re a software house: custom software, ERP/CRM/HRMS, business intelligence, web & mobile apps, cloud & security, APIs, UI/UX design and digital growth — with real-time data at the core.",
  },
  {
    keys: ["custom", "software", "develop", "dev"],
    reply:
      "Custom software is our core craft — purpose-built workflows, dashboards, approvals and reports mapped to your exact operations. Starting right requires a short discovery.",
  },
  {
    keys: ["work", "process", "how", "start", "step"],
    reply:
      "A structured path: Discover, Architect, Design, Build, go-live, then ongoing support. We confirm scope, milestones and acceptance criteria before any build commitment.",
  },
  {
    keys: ["hello", "hi", "hey", "help", "contact", "email", "demo", "demo?"],
    reply:
      "Hello! Happy to help. You can browse our work under Products & Portfolio, or book a short call to discuss your problem. Want me to point you anywhere specifically?",
  },
];

function matchReply(input) {
  const q = input.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const item of KB) {
    const score = item.keys.reduce((n, k) => (q.includes(k) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = item.reply;
    }
  }
  return (
    best ||
    "I’m a quick helper for this site. Ask about services, pricing, our process or AI — or book a short demo and the team will take it from there."
  );
}

function BotAvatar() {
  return (
    <div className="mc-bot-avatar">
      <FiCpu />
    </div>
  );
}

function Bubble({ role, text }) {
  return <div className={`mc-chat-bubble ${role}`}>{text}</div>;
}

function bubbleY(role, text) {
  return { role, text };
}

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(() => [
    bubbleY("bot", "Hi — I’m the Manage Core assistant. Ask me about services, pricing or how we work, or pick a quick question below."),
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, typing, open]);

  function respond(text) {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, bubbleY("bot", matchReply(text))]);
    }, 650);
  }

  function send(text) {
    const t = (text ?? input).trim();
    if (!t) return;
    setMsgs((m) => [...m, bubbleY("user", t)]);
    setInput("");
    respond(t);
  }

  return (
    <>
      {!open && (
        <>
          {/* WhatsApp Direct Chat Launcher */}
          <a
            href="https://wa.me/10000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mc-whatsapp-launcher"
            aria-label="Chat on WhatsApp"
            style={{ color: "#ffffff" }}
          >
            <FaWhatsapp style={{ fontSize: "32px", color: "#ffffff" }} />
            <span className="mc-chat-pulse" />
          </a>

          {/* AI Chatbot Panel Launcher */}
          <button type="button" className="mc-chat-launcher" onClick={() => setOpen(true)} aria-label="Open AI chat">
            <FiMessageCircle style={{ fontSize: "32px" }} />
            <span className="mc-chat-pulse" />
          </button>
        </>
      )}

      {open && (
        <div className="mc-chat-panel">
          <div className="mc-chat-header">
            <BotAvatar />
            <div>
              <b>Manage Core — chat</b>
              <span>Typically replies instantly</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <FiX />
            </button>
          </div>

          <div className="mc-chat-body" ref={bodyRef}>
            {msgs.map((m, i) => (
              <Bubble key={i} role={m.role} text={m.text} />
            ))}
            {typing && (
              <div className="mc-chat-row bot">
                <BotAvatar />
                <div className="mc-typing"><i /><i /><i /></div>
              </div>
            )}
          </div>

          <div className="mc-chat-actions">
            <Link to="/contact" className="mc-chat-book">
              <FiCalendar /> Book a demo <FiArrowRight />
            </Link>
            <div className="mc-chat-quick">
              {QUICK.map((q) => (
                <button key={q} type="button" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          </div>

          <form
            className="mc-chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              aria-label="Type a message"
            />
            <button type="submit" aria-label="Send" disabled={!input.trim()}>
              <FiSend />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChatBot;