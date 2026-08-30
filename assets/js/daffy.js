/* ============================================================
   DAFFODILS AFRICA — Daffy.js
   Cookie Banner + AI Chatbot (Groq via /api/chat)
   Neo-brutalism design — brand colours #faba16 / #7fb432
============================================================ */

(function () {
  'use strict';

  // ── COOKIE BANNER ─────────────────────────────────────────
  function initCookieBanner() {
    if (sessionStorage.getItem('da_cookie_choice')) return;

    const banner = document.createElement('div');
    banner.id = 'da-cookie';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = `
      <div id="da-cookie-inner">
        <div id="da-cookie-text">
          <strong>🍪 We use cookies</strong>
          <span>We use cookies to improve your experience and understand how our site is used. No personal data is sold.</span>
          <span id="da-cookie-links">
            <a href="/cookie-policy">Cookie Policy</a> &nbsp;·&nbsp;
            <a href="/terms">Terms &amp; Conditions</a>
          </span>
        </div>
        <div id="da-cookie-btns">
          <button id="da-cookie-accept">Accept All</button>
          <button id="da-cookie-reject">Reject</button>
        </div>
      </div>`;

    const style = document.createElement('style');
    style.textContent = `
      #da-cookie {
        position: fixed; bottom: 0; left: 0; right: 0; z-index: 9998;
        background: #111; border-top: 4px solid #faba16;
        box-shadow: 0 -8px 0 0 #000;
        padding: 0; animation: da-slide-up 0.4s ease;
      }
      @keyframes da-slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
      #da-cookie-inner {
        max-width: 1200px; margin: 0 auto; padding: 18px clamp(16px,4vw,32px);
        display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
      }
      #da-cookie-text {
        flex: 1; min-width: 240px;
        display: flex; flex-direction: column; gap: 4px;
      }
      #da-cookie-text strong {
        font-family: 'Space Grotesk', sans-serif; font-weight: 900;
        font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.06em; color: #faba16;
      }
      #da-cookie-text span {
        font-family: 'Space Grotesk', sans-serif; font-weight: 500;
        font-size: 0.82rem; color: rgba(255,255,255,0.6); line-height: 1.5;
      }
      #da-cookie-links a {
        color: #faba16; font-weight: 700; font-size: 0.78rem;
        text-decoration: none; text-transform: uppercase; letter-spacing: 0.08em;
      }
      #da-cookie-links a:hover { text-decoration: underline; }
      #da-cookie-btns { display: flex; gap: 10px; flex-shrink: 0; }
      #da-cookie-accept, #da-cookie-reject {
        font-family: 'Space Grotesk', sans-serif; font-weight: 900;
        font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em;
        border: 3px solid #000; padding: 10px 20px; cursor: pointer;
        transition: transform 0.1s, box-shadow 0.1s;
      }
      #da-cookie-accept { background: #7fb432; color: #fff; box-shadow: 4px 4px 0 #000; }
      #da-cookie-accept:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #000; }
      #da-cookie-reject { background: transparent; color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.3); box-shadow: none; }
      #da-cookie-reject:hover { color: #fff; border-color: #fff; }
      @media (max-width: 600px) {
        #da-cookie-inner { flex-direction: column; align-items: flex-start; }
        #da-cookie-btns { width: 100%; }
        #da-cookie-accept, #da-cookie-reject { flex: 1; text-align: center; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(banner);

    function dismiss(choice) {
      sessionStorage.setItem('da_cookie_choice', choice);
      banner.style.animation = 'da-slide-up 0.3s ease reverse';
      setTimeout(() => banner.remove(), 320);
    }
    document.getElementById('da-cookie-accept').onclick = () => dismiss('accepted');
    document.getElementById('da-cookie-reject').onclick  = () => dismiss('rejected');
  }

  // ── AI CHATBOT WIDGET ──────────────────────────────────────
  function initChatbot() {
    const el = document.createElement('div');
    el.id = 'da-chat-root';
    el.innerHTML = `
      <!-- Toggle Button -->
      <button id="da-chat-toggle" aria-label="Open Daffy AI chat">
        <span id="da-chat-icon-open">💬</span>
        <span id="da-chat-icon-close" style="display:none">✕</span>
        <span id="da-chat-label">Ask Daffy</span>
      </button>
      <!-- Chat Window -->
      <div id="da-chat-win" style="display:none" role="dialog" aria-label="Daffy AI chat">
        <div id="da-chat-head">
          <div id="da-chat-avatar">D</div>
          <div>
            <strong>Daffy</strong>
            <span>Daffodils Africa AI · Powered by Groq</span>
          </div>
          <button id="da-chat-close-btn" aria-label="Close chat">✕</button>
        </div>
        <div id="da-chat-msgs" aria-live="polite">
          <div class="da-msg da-msg--bot">
            <div class="da-msg-bubble">
              Hi! I'm Daffy 👋 I'm here to answer your questions about Daffodils Africa, our programs, and how you can get involved. What can I help you with?
            </div>
          </div>
        </div>
        <div id="da-chat-form">
          <textarea id="da-chat-input" rows="1" placeholder="Type your question..." aria-label="Message"></textarea>
          <button id="da-chat-send" aria-label="Send message">→</button>
        </div>
        <div id="da-chat-footer">
          <a href="/contact">Contact us directly</a> · <a href="/terms">Terms</a>
        </div>
      </div>`;

    const style = document.createElement('style');
    style.textContent = `
      #da-chat-root {
        position: fixed; bottom: 24px; right: 24px; z-index: 9997;
        font-family: 'Space Grotesk', sans-serif;
      }
      #da-chat-toggle {
        display: flex; align-items: center; gap: 8px;
        background: #000; color: #faba16;
        border: 4px solid #000; box-shadow: 6px 6px 0 0 #faba16;
        padding: 14px 20px; cursor: pointer;
        font-family: 'Space Grotesk', sans-serif; font-weight: 900;
        font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.08em;
        transition: transform 0.1s, box-shadow 0.1s;
      }
      #da-chat-toggle:hover { transform: translate(-2px,-2px); box-shadow: 8px 8px 0 0 #faba16; }
      #da-chat-toggle:active { transform: translate(2px,2px); box-shadow: 3px 3px 0 0 #faba16; }
      #da-chat-win {
        position: absolute; bottom: calc(100% + 12px); right: 0;
        width: min(380px, calc(100vw - 32px));
        background: #fff; border: 4px solid #000; box-shadow: 8px 8px 0 0 #000;
        display: flex; flex-direction: column; overflow: hidden;
        animation: da-chat-in 0.25s ease;
      }
      @keyframes da-chat-in { from { opacity:0; transform: translateY(12px) scale(0.97); } to { opacity:1; transform: none; } }
      #da-chat-head {
        background: #000; color: #fff; padding: 14px 16px;
        display: flex; align-items: center; gap: 12px;
        border-bottom: 4px solid #faba16;
      }
      #da-chat-avatar {
        width: 40px; height: 40px; background: #faba16; color: #000;
        font-weight: 900; font-size: 1.2rem;
        display: flex; align-items: center; justify-content: center;
        border: 3px solid #000; flex-shrink: 0;
      }
      #da-chat-head strong { display: block; font-weight: 900; font-size: 0.9rem; text-transform: uppercase; }
      #da-chat-head span { font-size: 0.68rem; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.1em; }
      #da-chat-close-btn {
        margin-left: auto; background: none; border: none; color: rgba(255,255,255,0.5);
        font-size: 1rem; cursor: pointer; padding: 4px 8px;
        font-family: 'Space Grotesk', sans-serif;
      }
      #da-chat-close-btn:hover { color: #faba16; }
      #da-chat-msgs {
        flex: 1; overflow-y: auto; padding: 16px; display: flex;
        flex-direction: column; gap: 12px; max-height: 320px;
        scroll-behavior: smooth;
      }
      .da-msg { display: flex; }
      .da-msg--user { justify-content: flex-end; }
      .da-msg-bubble {
        max-width: 82%; padding: 10px 14px;
        font-size: 0.875rem; font-weight: 500; line-height: 1.6;
        border: 2px solid #000;
      }
      .da-msg--bot .da-msg-bubble { background: #f7f5ee; border-left: 4px solid #faba16; }
      .da-msg--user .da-msg-bubble { background: #000; color: #faba16; }
      .da-msg--typing .da-msg-bubble { background: #f7f5ee; border-left: 4px solid #faba16; color: #aaa; font-style: italic; }
      #da-chat-form {
        display: flex; border-top: 3px solid #000; background: #fff;
      }
      #da-chat-input {
        flex: 1; padding: 12px 14px; border: none; outline: none; resize: none;
        font-family: 'Space Grotesk', sans-serif; font-weight: 500; font-size: 0.875rem;
        background: #fff; min-height: 44px; max-height: 100px;
        line-height: 1.5;
      }
      #da-chat-send {
        width: 52px; background: #faba16; color: #000; border: none;
        border-left: 3px solid #000; font-size: 1.2rem; font-weight: 900;
        cursor: pointer; transition: background 0.1s;
      }
      #da-chat-send:hover { background: #7fb432; color: #fff; }
      #da-chat-footer {
        background: #f7f5ee; border-top: 2px solid #eee; padding: 8px 14px;
        font-size: 0.68rem; text-align: center; color: rgba(0,0,0,0.35);
        text-transform: uppercase; letter-spacing: 0.08em;
      }
      #da-chat-footer a { color: #7fb432; font-weight: 700; }
      @media (max-width: 480px) {
        #da-chat-root { bottom: 16px; right: 16px; }
        #da-chat-label { display: none; }
        #da-chat-toggle { padding: 14px; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(el);

    const toggle   = document.getElementById('da-chat-toggle');
    const win      = document.getElementById('da-chat-win');
    const iconOpen = document.getElementById('da-chat-icon-open');
    const iconClose= document.getElementById('da-chat-icon-close');
    const msgs     = document.getElementById('da-chat-msgs');
    const input    = document.getElementById('da-chat-input');
    const sendBtn  = document.getElementById('da-chat-send');
    const closeBtn = document.getElementById('da-chat-close-btn');
    let history = [];
    let open = false;

    function toggleChat() {
      open = !open;
      win.style.display = open ? 'flex' : 'none';
      iconOpen.style.display  = open ? 'none' : 'inline';
      iconClose.style.display = open ? 'inline' : 'none';
      if (open) setTimeout(() => input.focus(), 100);
    }
    toggle.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    function addMsg(role, text) {
      const div = document.createElement('div');
      div.className = 'da-msg da-msg--' + role;
      div.innerHTML = `<div class="da-msg-bubble">${text.replace(/\n/g,'<br>')}</div>`;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      return div;
    }

    async function send() {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      input.style.height = 'auto';
      addMsg('user', text);
      history.push({ role: 'user', content: text });
      const typing = addMsg('typing', 'Daffy is thinking…');

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: history.slice(-6) })
        });
        const data = await res.json();
        typing.remove();
        const reply = data.reply || "I'm having a moment — please email daffodilsafrica@gmail.com 💛";
        addMsg('bot', reply);
        history.push({ role: 'assistant', content: reply });
      } catch {
        typing.remove();
        addMsg('bot', "Connection issue! Please email us at daffodilsafrica@gmail.com 💛");
      }
    }

    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });
    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });
  }

  // ── INIT ──────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initCookieBanner(); initChatbot(); });
  } else {
    initCookieBanner(); initChatbot();
  }

})();
