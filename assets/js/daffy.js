/* ============================================================
   DAFFODILS AFRICA — Daffy.js  v2
   Cookie Banner + Chatbot Widget (Groq via /api/chat)
   Neo-brutalism · #faba16 / #7fb432
============================================================ */
(function(){
'use strict';

// ── COOKIE BANNER ─────────────────────────────────────────
function initCookieBanner(){
  if(sessionStorage.getItem('da_cookie_choice')) return;
  const banner=document.createElement('div');
  banner.id='da-cookie';
  banner.setAttribute('role','dialog');
  banner.setAttribute('aria-label','Cookie consent');
  banner.innerHTML=`<div id="da-cookie-inner">
    <div id="da-cookie-text">
      <strong>🍪 We use cookies</strong>
      <span>We use cookies to improve your experience. No personal data is sold. <a href="/cookie-policy">Cookie Policy</a> &nbsp;·&nbsp; <a href="/terms">Terms</a></span>
    </div>
    <div id="da-cookie-btns">
      <button id="da-accept">Accept All</button>
      <button id="da-reject">Reject</button>
    </div>
  </div>`;
  const style=document.createElement('style');
  style.textContent=`
    #da-cookie{position:fixed;bottom:0;left:0;right:0;z-index:9998;background:#111;border-top:4px solid #faba16;box-shadow:0 -8px 0 0 #000;animation:da-up .4s ease}
    @keyframes da-up{from{transform:translateY(100%)}to{transform:translateY(0)}}
    #da-cookie-inner{max-width:1200px;margin:0 auto;padding:16px clamp(16px,4vw,32px);display:flex;align-items:center;gap:20px;flex-wrap:wrap}
    #da-cookie-text{flex:1;min-width:220px;display:flex;flex-direction:column;gap:3px}
    #da-cookie-text strong{font-family:'Space Grotesk',sans-serif;font-weight:900;font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;color:#faba16}
    #da-cookie-text span{font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:.8rem;color:rgba(255,255,255,.55);line-height:1.5}
    #da-cookie-text a{color:#faba16;font-weight:700;text-decoration:none}
    #da-cookie-btns{display:flex;gap:10px;flex-shrink:0}
    #da-accept,#da-reject{font-family:'Space Grotesk',sans-serif;font-weight:900;font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;border:3px solid #000;padding:10px 20px;cursor:pointer;transition:transform .1s,box-shadow .1s}
    #da-accept{background:#7fb432;color:#fff;box-shadow:4px 4px 0 #000}
    #da-accept:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #000}
    #da-reject{background:transparent;color:rgba(255,255,255,.55);border-color:rgba(255,255,255,.3)}
    #da-reject:hover{color:#fff;border-color:#fff}
    @media(max-width:560px){#da-cookie-inner{flex-direction:column;align-items:flex-start}#da-cookie-btns{width:100%}#da-accept,#da-reject{flex:1;text-align:center}}
  `;
  document.head.appendChild(style);
  document.body.appendChild(banner);
  function dismiss(v){sessionStorage.setItem('da_cookie_choice',v);banner.style.animation='da-up .3s ease reverse';setTimeout(()=>banner.remove(),320);}
  document.getElementById('da-accept').onclick=()=>dismiss('accepted');
  document.getElementById('da-reject').onclick=()=>dismiss('rejected');
}

// ── CHATBOT WIDGET ─────────────────────────────────────────
function initChatbot(){
  const root=document.createElement('div');
  root.id='da-chat-root';
  root.innerHTML=`
    <button id="da-toggle" aria-label="Chat with Daffy">
      <span id="da-ico-open">💬</span>
      <span id="da-ico-close" style="display:none">✕</span>
      <span id="da-lbl">Ask Daffy</span>
    </button>
    <div id="da-win" style="display:none" role="dialog" aria-label="Daffy chat">
      <div id="da-head">
        <div id="da-avatar">D</div>
        <div><strong>Daffy</strong><span>Daffodils Africa Assistant</span></div>
        <button id="da-x" aria-label="Close">✕</button>
      </div>
      <div id="da-msgs" aria-live="polite">
        <div class="da-m da-m--bot"><div class="da-b">Hi! I'm Daffy 👋 Ask me anything about Daffodils Africa — our programs, impact, Academy, or how to get involved!</div></div>
      </div>
      <div id="da-form">
        <textarea id="da-inp" rows="1" placeholder="Type your question..." aria-label="Message"></textarea>
        <button id="da-send" aria-label="Send">→</button>
      </div>
      <div id="da-foot"><a href="/contact">Contact us directly</a> · <a href="/terms">Terms</a></div>
    </div>`;

  const style=document.createElement('style');
  style.textContent=`
    #da-chat-root{position:fixed;bottom:24px;right:24px;z-index:9997;font-family:'Space Grotesk',sans-serif}
    #da-toggle{display:flex;align-items:center;gap:8px;background:#000;color:#faba16;border:4px solid #000;box-shadow:6px 6px 0 0 #faba16;padding:14px 20px;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-weight:900;font-size:.82rem;text-transform:uppercase;letter-spacing:.08em;transition:transform .1s,box-shadow .1s}
    #da-toggle:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 0 #faba16}
    #da-toggle:active{transform:translate(2px,2px);box-shadow:3px 3px 0 0 #faba16}
    #da-win{position:absolute;bottom:calc(100% + 12px);right:0;width:min(380px,calc(100vw - 32px));background:#fff;border:4px solid #000;box-shadow:8px 8px 0 0 #000;display:flex;flex-direction:column;overflow:hidden;animation:da-in .25s ease}
    @keyframes da-in{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
    #da-head{background:#000;color:#fff;padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:4px solid #faba16}
    #da-avatar{width:40px;height:40px;background:#faba16;color:#000;font-weight:900;font-size:1.2rem;display:flex;align-items:center;justify-content:center;border:3px solid #000;flex-shrink:0}
    #da-head strong{display:block;font-weight:900;font-size:.9rem;text-transform:uppercase}
    #da-head span{font-size:.65rem;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.1em}
    #da-x{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.45);font-size:1rem;cursor:pointer;padding:4px 8px;font-family:'Space Grotesk',sans-serif}
    #da-x:hover{color:#faba16}
    #da-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;max-height:320px;scroll-behavior:smooth}
    .da-m{display:flex}
    .da-m--user{justify-content:flex-end}
    .da-b{max-width:82%;padding:10px 14px;font-size:.875rem;font-weight:500;line-height:1.6;border:2px solid #000}
    .da-m--bot  .da-b{background:#f7f5ee;border-left:4px solid #faba16}
    .da-m--user .da-b{background:#000;color:#faba16}
    .da-m--typing .da-b{background:#f7f5ee;border-left:4px solid #faba16;color:#aaa;font-style:italic}
    #da-form{display:flex;border-top:3px solid #000;background:#fff}
    #da-inp{flex:1;padding:12px 14px;border:none;outline:none;resize:none;font-family:'Space Grotesk',sans-serif;font-weight:500;font-size:.875rem;background:#fff;min-height:44px;max-height:100px;line-height:1.5}
    #da-send{width:52px;background:#faba16;color:#000;border:none;border-left:3px solid #000;font-size:1.2rem;font-weight:900;cursor:pointer;transition:background .1s}
    #da-send:hover{background:#7fb432;color:#fff}
    #da-foot{background:#f7f5ee;border-top:2px solid #eee;padding:8px 14px;font-size:.65rem;text-align:center;color:rgba(0,0,0,.35);text-transform:uppercase;letter-spacing:.08em}
    #da-foot a{color:#7fb432;font-weight:700}
    @media(max-width:480px){#da-chat-root{bottom:16px;right:16px}#da-lbl{display:none}#da-toggle{padding:14px}}
  `;
  document.head.appendChild(style);
  document.body.appendChild(root);

  const toggle=document.getElementById('da-toggle');
  const win=document.getElementById('da-win');
  const icoOpen=document.getElementById('da-ico-open');
  const icoClose=document.getElementById('da-ico-close');
  const msgs=document.getElementById('da-msgs');
  const inp=document.getElementById('da-inp');
  const sendBtn=document.getElementById('da-send');
  const closeBtn=document.getElementById('da-x');
  let history=[],isOpen=false;

  function toggleChat(){
    isOpen=!isOpen;
    win.style.display=isOpen?'flex':'none';
    icoOpen.style.display=isOpen?'none':'inline';
    icoClose.style.display=isOpen?'inline':'none';
    if(isOpen) setTimeout(()=>inp.focus(),100);
  }
  toggle.addEventListener('click',toggleChat);
  closeBtn.addEventListener('click',toggleChat);

  function addMsg(role,text){
    const d=document.createElement('div');
    d.className='da-m da-m--'+role;
    d.innerHTML=`<div class="da-b">${text.replace(/\n/g,'<br>')}</div>`;
    msgs.appendChild(d);
    msgs.scrollTop=msgs.scrollHeight;
    return d;
  }

  async function send(){
    const text=inp.value.trim();
    if(!text) return;
    inp.value=''; inp.style.height='auto';
    addMsg('user',text);
    history.push({role:'user',content:text});
    const typing=addMsg('typing','Daffy is thinking…');
    try{
      const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,history:history.slice(-6)})});
      const data=await r.json();
      typing.remove();
      const reply=data.reply||"Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛";
      addMsg('bot',reply);
      history.push({role:'assistant',content:reply});
    }catch{
      typing.remove();
      addMsg('bot',"Connection issue! Please email daffodilsafrica@gmail.com 💛");
    }
  }

  sendBtn.addEventListener('click',send);
  inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
  inp.addEventListener('input',()=>{inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight,100)+'px';});
}

// ── INIT ──────────────────────────────────────────────────
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>{initCookieBanner();initChatbot();});
}else{
  initCookieBanner(); initChatbot();
}
})();
