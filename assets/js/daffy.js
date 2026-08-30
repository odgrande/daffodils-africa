/* ============================================================
   DAFFODILS AFRICA — Daffy.js v3
   Calls Groq API directly from browser — no server needed
   Cookie Banner + Chatbot
============================================================ */
(function(){
'use strict';

// ── YOUR GROQ API KEY ──────────────────────────────────────
// Get a free key at console.groq.com → API Keys → Create
var GROQ_KEY = window.DAFFY_KEY || '';

// ── COOKIE BANNER ─────────────────────────────────────────
function initCookieBanner(){
  if(sessionStorage.getItem('da_cookie_choice')) return;
  var b=document.createElement('div');
  b.id='da-cookie';
  b.innerHTML='<div id="da-ci"><div id="da-ct"><strong>🍪 We use cookies</strong><span>We use cookies to improve your experience. No personal data is sold. <a href="/cookie-policy">Cookie Policy</a> · <a href="/terms">Terms</a></span></div><div id="da-cb"><button id="da-acc">Accept All</button><button id="da-rej">Reject</button></div></div>';
  var s=document.createElement('style');
  s.textContent='#da-cookie{position:fixed;bottom:0;left:0;right:0;z-index:9998;background:#111;border-top:4px solid #faba16;box-shadow:0 -8px 0 0 #000;animation:da-up .4s ease}@keyframes da-up{from{transform:translateY(100%)}to{transform:translateY(0)}}#da-ci{max-width:1200px;margin:0 auto;padding:14px clamp(16px,4vw,32px);display:flex;align-items:center;gap:18px;flex-wrap:wrap}#da-ct{flex:1;min-width:220px;display:flex;flex-direction:column;gap:3px}#da-ct strong{font-family:"Space Grotesk",sans-serif;font-weight:900;font-size:.82rem;text-transform:uppercase;letter-spacing:.06em;color:#faba16}#da-ct span{font-family:"Space Grotesk",sans-serif;font-weight:500;font-size:.78rem;color:rgba(255,255,255,.5);line-height:1.5}#da-ct a{color:#faba16;font-weight:700;text-decoration:none}#da-cb{display:flex;gap:10px;flex-shrink:0}#da-acc,#da-rej{font-family:"Space Grotesk",sans-serif;font-weight:900;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;border:3px solid #000;padding:10px 18px;cursor:pointer;transition:transform .1s,box-shadow .1s}#da-acc{background:#7fb432;color:#fff;box-shadow:4px 4px 0 #000}#da-acc:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #000}#da-rej{background:transparent;color:rgba(255,255,255,.5);border-color:rgba(255,255,255,.25)}#da-rej:hover{color:#fff;border-color:#fff}@media(max-width:560px){#da-ci{flex-direction:column;align-items:flex-start}#da-cb{width:100%}#da-acc,#da-rej{flex:1;text-align:center}}';
  document.head.appendChild(s);
  document.body.appendChild(b);
  function dismiss(v){sessionStorage.setItem('da_cookie_choice',v);b.style.animation='da-up .3s ease reverse';setTimeout(function(){b.remove();},320);}
  document.getElementById('da-acc').onclick=function(){dismiss('accepted');};
  document.getElementById('da-rej').onclick=function(){dismiss('rejected');};
}

// ── CHATBOT ────────────────────────────────────────────────
var SYSTEM = 'You are Daffy, the friendly assistant for Daffodils Africa — a Nigerian social enterprise implementing social impact projects across Africa.\n\nSTRICT RULE: ONLY answer questions about Daffodils Africa. For anything unrelated say: "I can only help with Daffodils Africa questions! Email daffodilsafrica@gmail.com or call +234 816 787 3722 💛"\n\nABOUT DAFFODILS AFRICA:\n- Social enterprise: high-impact projects for individuals, organisations and government\n- Services: Project Design, Community Development, Impact Campaigns, Monitoring & Evaluation\n- Special: CSR Made Easy, Celebrate with Impact, Tourist with a Difference\n- Academy: Launching Q4 2026 with 6 courses on social impact topics\n- Impact: 3,000+ lives, 10 projects across Lagos, Taraba and Jos\n- Projects: Digital Literacy STEAM Club, IWD Women Empowerment, Education Support, Food Support, JOS Maternity, Business Support, Vision Eyecare\n- Contact: +234 816 787 3722 | daffodilsafrica@gmail.com | Lagos Nigeria\n- Founder: Ifeoluwa Oyebisi | Social: @daffodils_africa on all platforms\n\nKeep replies warm, under 120 words. Always end with a clear action step.';

function initChatbot(){
  var root=document.createElement('div');
  root.id='da-chat-root';
  root.innerHTML='<button id="da-toggle" aria-label="Chat with Daffy"><span id="da-io">💬</span><span id="da-ic" style="display:none">✕</span><span id="da-lbl">Ask Daffy</span></button><div id="da-win" style="display:none" role="dialog" aria-label="Daffy chat"><div id="da-head"><div id="da-av">D</div><div><strong>Daffy</strong><span>Daffodils Africa Assistant</span></div><button id="da-x">✕</button></div><div id="da-msgs" aria-live="polite"><div class="da-m da-m--bot"><div class="da-b">Hi! I\'m Daffy 👋 Ask me anything about Daffodils Africa — our programs, impact, Academy, or how to get involved!</div></div></div><div id="da-form"><textarea id="da-inp" rows="1" placeholder="Type your question..." aria-label="Message"></textarea><button id="da-send">→</button></div><div id="da-foot"><a href="/contact">Contact us directly</a> · <a href="/terms">Terms</a></div></div>';

  var s=document.createElement('style');
  s.textContent='#da-chat-root{position:fixed;bottom:24px;right:24px;z-index:9997;font-family:"Space Grotesk",sans-serif}#da-toggle{display:flex;align-items:center;gap:8px;background:#000;color:#faba16;border:4px solid #000;box-shadow:6px 6px 0 0 #faba16;padding:14px 20px;cursor:pointer;font-family:"Space Grotesk",sans-serif;font-weight:900;font-size:.82rem;text-transform:uppercase;letter-spacing:.08em;transition:transform .1s,box-shadow .1s}#da-toggle:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 0 #faba16}#da-toggle:active{transform:translate(2px,2px);box-shadow:3px 3px 0 0 #faba16}#da-win{position:absolute;bottom:calc(100% + 12px);right:0;width:min(380px,calc(100vw - 32px));background:#fff;border:4px solid #000;box-shadow:8px 8px 0 0 #000;display:flex;flex-direction:column;overflow:hidden;animation:da-in .25s ease}@keyframes da-in{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}#da-head{background:#000;color:#fff;padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:4px solid #faba16}#da-av{width:40px;height:40px;background:#faba16;color:#000;font-weight:900;font-size:1.2rem;display:flex;align-items:center;justify-content:center;border:3px solid #000;flex-shrink:0}#da-head strong{display:block;font-weight:900;font-size:.9rem;text-transform:uppercase}#da-head span{font-size:.62rem;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.1em}#da-x{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.45);font-size:1rem;cursor:pointer;padding:4px 8px;font-family:"Space Grotesk",sans-serif}#da-x:hover{color:#faba16}#da-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;max-height:320px;scroll-behavior:smooth}.da-m{display:flex}.da-m--user{justify-content:flex-end}.da-b{max-width:82%;padding:10px 14px;font-size:.875rem;font-weight:500;line-height:1.6;border:2px solid #000}.da-m--bot .da-b{background:#f7f5ee;border-left:4px solid #faba16}.da-m--user .da-b{background:#000;color:#faba16}.da-m--typing .da-b{background:#f7f5ee;border-left:4px solid #faba16;color:#aaa;font-style:italic}#da-form{display:flex;border-top:3px solid #000;background:#fff}#da-inp{flex:1;padding:12px 14px;border:none;outline:none;resize:none;font-family:"Space Grotesk",sans-serif;font-weight:500;font-size:.875rem;background:#fff;min-height:44px;max-height:100px;line-height:1.5}#da-send{width:52px;background:#faba16;color:#000;border:none;border-left:3px solid #000;font-size:1.2rem;font-weight:900;cursor:pointer;transition:background .1s}#da-send:hover{background:#7fb432;color:#fff}#da-foot{background:#f7f5ee;border-top:2px solid #eee;padding:8px 14px;font-size:.65rem;text-align:center;color:rgba(0,0,0,.35);text-transform:uppercase;letter-spacing:.08em}#da-foot a{color:#7fb432;font-weight:700}@media(max-width:480px){#da-chat-root{bottom:16px;right:16px}#da-lbl{display:none}#da-toggle{padding:14px}}';
  document.head.appendChild(s);
  document.body.appendChild(root);

  var toggle=document.getElementById('da-toggle'),
      win=document.getElementById('da-win'),
      io=document.getElementById('da-io'),
      ic=document.getElementById('da-ic'),
      msgs=document.getElementById('da-msgs'),
      inp=document.getElementById('da-inp'),
      sendBtn=document.getElementById('da-send'),
      closeBtn=document.getElementById('da-x'),
      history=[],isOpen=false;

  function toggleChat(){
    isOpen=!isOpen;
    win.style.display=isOpen?'flex':'none';
    io.style.display=isOpen?'none':'inline';
    ic.style.display=isOpen?'inline':'none';
    if(isOpen) setTimeout(function(){inp.focus();},100);
  }
  toggle.addEventListener('click',toggleChat);
  closeBtn.addEventListener('click',toggleChat);

  function addMsg(role,text){
    var d=document.createElement('div');
    d.className='da-m da-m--'+role;
    d.innerHTML='<div class="da-b">'+text.replace(/\n/g,'<br>')+'</div>';
    msgs.appendChild(d);
    msgs.scrollTop=msgs.scrollHeight;
    return d;
  }

  async function send(){
    var text=inp.value.trim();
    if(!text) return;
    inp.value=''; inp.style.height='auto';
    addMsg('user',text);
    history.push({role:'user',content:text});
    var typing=addMsg('typing','Daffy is thinking…');

    if(!GROQ_KEY || GROQ_KEY==='PASTE_KEY_HERE'){
      typing.remove();
      addMsg('bot','Please email daffodilsafrica@gmail.com or call +234 816 787 3722 — the team responds quickly! 💛');
      return;
    }

    try{
      var r=await fetch('https://api.groq.com/openai/v1/chat/completions',{
        method:'POST',
        headers:{'Authorization':'Bearer '+GROQ_KEY,'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'llama-3.1-8b-instant',
          messages:[{role:'system',content:SYSTEM}].concat(history.slice(-6)),
          max_tokens:250,temperature:0.65
        })
      });
      var data=await r.json();
      typing.remove();
      if(!r.ok){
        addMsg('bot','Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛');
        return;
      }
      var reply=data.choices&&data.choices[0]&&data.choices[0].message&&data.choices[0].message.content;
      if(!reply) throw new Error('empty');
      addMsg('bot',reply.trim());
      history.push({role:'assistant',content:reply.trim()});
    }catch(e){
      typing.remove();
      addMsg('bot','Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛');
    }
  }

  sendBtn.addEventListener('click',send);
  inp.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
  inp.addEventListener('input',function(){inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight,100)+'px';});
}

// ── INIT ──────────────────────────────────────────────────
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){initCookieBanner();initChatbot();});
}else{
  initCookieBanner(); initChatbot();
}
})();
