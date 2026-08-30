(function(){
'use strict';

// ── COOKIE BANNER ─────────────────────────────────────────
function initCookieBanner(){
  if(sessionStorage.getItem('da_cookie_choice')) return;
  var b=document.createElement('div');
  b.id='da-cookie';
  b.innerHTML='<div id="da-ci"><div id="da-ct"><strong>🍪 We use cookies</strong><span>To improve your experience. No data sold. <a href="/cookie-policy">Cookie Policy</a> · <a href="/terms">Terms</a></span></div><div id="da-cb"><button id="da-acc">Accept All</button><button id="da-rej">Reject</button></div></div>';
  var s=document.createElement('style');
  s.textContent='#da-cookie{position:fixed;bottom:0;left:0;right:0;z-index:9998;background:#111;border-top:4px solid #faba16;box-shadow:0 -8px 0 0 #000;animation:da-up .4s ease}@keyframes da-up{from{transform:translateY(100%)}to{transform:translateY(0)}}#da-ci{max-width:1200px;margin:0 auto;padding:14px clamp(16px,4vw,32px);display:flex;align-items:center;gap:18px;flex-wrap:wrap}#da-ct{flex:1;min-width:220px;display:flex;flex-direction:column;gap:3px}#da-ct strong{font-family:"Space Grotesk",sans-serif;font-weight:900;font-size:.82rem;text-transform:uppercase;letter-spacing:.06em;color:#faba16}#da-ct span,#da-ct a{font-family:"Space Grotesk",sans-serif;font-size:.78rem;color:rgba(255,255,255,.5);font-weight:500}#da-ct a{color:#faba16;font-weight:700;text-decoration:none}#da-cb{display:flex;gap:10px;flex-shrink:0}#da-acc,#da-rej{font-family:"Space Grotesk",sans-serif;font-weight:900;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;border:3px solid #000;padding:10px 18px;cursor:pointer}#da-acc{background:#7fb432;color:#fff;box-shadow:4px 4px 0 #000}#da-rej{background:transparent;color:rgba(255,255,255,.5);border-color:rgba(255,255,255,.25)}@media(max-width:560px){#da-ci{flex-direction:column;align-items:flex-start}#da-cb{width:100%}#da-acc,#da-rej{flex:1;text-align:center}}';
  document.head.appendChild(s);
  document.body.appendChild(b);
  function dim(v){sessionStorage.setItem('da_cookie_choice',v);b.style.animation='da-up .3s ease reverse';setTimeout(function(){b.remove();},320);}
  document.getElementById('da-acc').onclick=function(){dim('accepted');};
  document.getElementById('da-rej').onclick=function(){dim('rejected');};
}

// ── CHATBOT ────────────────────────────────────────────────
function initChatbot(){
  var STORE_MSGS='da_msgs',STORE_HIST='da_hist';
  var WELCOME='Hi! I\'m Daffy 👋 Ask me anything about Daffodils Africa — our programs, impact, Academy, or how to get involved!';
  var AVATAR='<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" width="36" height="36"><g transform="translate(20,20)"><ellipse cx="0" cy="-9" rx="3.5" ry="6" fill="#faba16"/><ellipse cx="0" cy="-9" rx="3.5" ry="6" fill="#faba16" transform="rotate(60)"/><ellipse cx="0" cy="-9" rx="3.5" ry="6" fill="#faba16" transform="rotate(120)"/><ellipse cx="0" cy="-9" rx="3.5" ry="6" fill="#faba16" transform="rotate(180)"/><ellipse cx="0" cy="-9" rx="3.5" ry="6" fill="#faba16" transform="rotate(240)"/><ellipse cx="0" cy="-9" rx="3.5" ry="6" fill="#faba16" transform="rotate(300)"/><circle cx="0" cy="0" r="6.5" fill="#7fb432"/><circle cx="-2" cy="-0.5" r="1.2" fill="#fff"/><circle cx="2" cy="-0.5" r="1.2" fill="#fff"/><path d="M-2.5 2.5 Q0 4.5 2.5 2.5" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round"/></g></svg>';

  var root=document.createElement('div');
  root.id='da-chat-root';
  root.innerHTML='<button id="da-toggle" aria-label="Chat with Daffy"><span id="da-io">💬</span><span id="da-ic" style="display:none">✕</span><span id="da-lbl">Ask Daffy</span></button><div id="da-win" style="display:none" role="dialog"><div id="da-head"><div id="da-av">'+AVATAR+'</div><div id="da-hinfo"><strong>Daffy</strong><span>Daffodils Africa Assistant</span></div><div id="da-hbtns"><button id="da-clear" title="Clear chat" aria-label="Clear chat">🗑</button><button id="da-x" aria-label="Close chat">✕</button></div></div><div id="da-msgs" aria-live="polite"></div><div id="da-form"><textarea id="da-inp" rows="1" placeholder="Type your question..."></textarea><button id="da-send">→</button></div><div id="da-foot"><a href="/contact">Contact us directly</a> · <a href="/terms">Terms</a></div></div>';

  var s=document.createElement('style');
  s.textContent='#da-chat-root{position:fixed;bottom:24px;right:24px;z-index:9997;font-family:"Space Grotesk",sans-serif}#da-toggle{display:flex;align-items:center;gap:8px;background:#000;color:#faba16;border:4px solid #000;box-shadow:6px 6px 0 0 #faba16;padding:14px 20px;cursor:pointer;font-family:"Space Grotesk",sans-serif;font-weight:900;font-size:.82rem;text-transform:uppercase;letter-spacing:.08em;transition:transform .1s,box-shadow .1s}#da-toggle:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 0 #faba16}#da-win{position:absolute;bottom:calc(100% + 12px);right:0;width:min(380px,calc(100vw - 32px));background:#fff;border:4px solid #000;box-shadow:8px 8px 0 0 #000;display:flex;flex-direction:column;overflow:hidden}#da-head{background:#000;color:#fff;padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:4px solid #faba16}#da-av{width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:2px solid #faba16;border-radius:50%;background:#111;flex-shrink:0;overflow:hidden}#da-hinfo{flex:1}#da-hinfo strong{display:block;font-weight:900;font-size:.9rem;text-transform:uppercase}#da-hinfo span{font-size:.62rem;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.1em}#da-hbtns{display:flex;gap:2px;margin-left:auto}#da-clear,#da-x{background:none;border:none;color:rgba(255,255,255,.4);font-size:.85rem;cursor:pointer;padding:5px 8px;line-height:1;border-radius:4px}#da-clear:hover,#da-x:hover{color:#faba16;background:rgba(255,255,255,.08)}#da-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;max-height:320px;scroll-behavior:smooth}.da-m{display:flex}.da-m--user{justify-content:flex-end}.da-b{max-width:82%;padding:10px 14px;font-size:.875rem;font-weight:500;line-height:1.6;border:2px solid #000}.da-m--bot .da-b{background:#f7f5ee;border-left:4px solid #faba16}.da-m--user .da-b{background:#000;color:#faba16}.da-m--typing .da-b{background:#f7f5ee;border-left:4px solid #faba16;color:#aaa;font-style:italic}#da-form{display:flex;border-top:3px solid #000}#da-inp{flex:1;padding:12px 14px;border:none;outline:none;resize:none;font-family:"Space Grotesk",sans-serif;font-weight:500;font-size:.875rem;min-height:44px;max-height:100px;line-height:1.5}#da-send{width:52px;background:#faba16;color:#000;border:none;border-left:3px solid #000;font-size:1.2rem;font-weight:900;cursor:pointer}#da-send:hover{background:#7fb432;color:#fff}#da-foot{background:#f7f5ee;border-top:2px solid #eee;padding:8px 14px;font-size:.65rem;text-align:center;color:rgba(0,0,0,.35);text-transform:uppercase;letter-spacing:.08em}#da-foot a{color:#7fb432;font-weight:700}@media(max-width:480px){#da-chat-root{bottom:16px;right:16px}#da-lbl{display:none}#da-toggle{padding:14px}}';
  document.head.appendChild(s);
  document.body.appendChild(root);

  var toggle=document.getElementById('da-toggle'),win=document.getElementById('da-win'),
      io=document.getElementById('da-io'),ic=document.getElementById('da-ic'),
      msgs=document.getElementById('da-msgs'),inp=document.getElementById('da-inp'),
      sendBtn=document.getElementById('da-send'),closeBtn=document.getElementById('da-x'),
      clearBtn=document.getElementById('da-clear'),
      history=[],isOpen=false;

  // ── localStorage ──────────────────────────────────────────
  function loadChat(){
    try{
      var sh=localStorage.getItem(STORE_HIST);
      var sm=localStorage.getItem(STORE_MSGS);
      if(sh) history=JSON.parse(sh);
      if(sm){ JSON.parse(sm).forEach(function(m){addMsg(m.r,m.t,true);}); }
      else { addMsg('bot',WELCOME,true); }
    }catch(e){ addMsg('bot',WELCOME,true); }
  }

  function persistMsg(role,text){
    try{
      var sm=localStorage.getItem(STORE_MSGS);
      var arr=sm?JSON.parse(sm):[];
      arr.push({r:role,t:text});
      if(arr.length>60) arr=arr.slice(-60);
      localStorage.setItem(STORE_MSGS,JSON.stringify(arr));
    }catch(e){}
  }

  function persistHist(){
    try{ localStorage.setItem(STORE_HIST,JSON.stringify(history)); }catch(e){}
  }

  function clearChat(){
    try{ localStorage.removeItem(STORE_MSGS); localStorage.removeItem(STORE_HIST); }catch(e){}
    history=[];
    msgs.innerHTML='';
    addMsg('bot',WELCOME,true);
  }

  // ── UI ────────────────────────────────────────────────────
  function toggleChat(){
    isOpen=!isOpen; win.style.display=isOpen?'flex':'none';
    io.style.display=isOpen?'none':'inline'; ic.style.display=isOpen?'inline':'none';
    if(isOpen) setTimeout(function(){inp.focus();},100);
  }

  function addMsg(role,text,skipSave){
    var d=document.createElement('div');
    d.className='da-m da-m--'+role;
    d.innerHTML='<div class="da-b">'+text.replace(/</g,'&lt;').replace(/\n/g,'<br>')+'</div>';
    msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight;
    if(!skipSave) persistMsg(role,text);
    return d;
  }

  // ── Events ────────────────────────────────────────────────
  toggle.addEventListener('click',toggleChat);
  closeBtn.addEventListener('click',toggleChat);
  clearBtn.addEventListener('click',function(){
    if(window.confirm('Clear chat history?')) clearChat();
  });

  // ── Send ─────────────────────────────────────────────────
  function send(){
    var text=inp.value.trim();
    if(!text) return;
    inp.value=''; inp.style.height='auto';
    addMsg('user',text);
    var prevHist=history.slice(-6);
    history.push({role:'user',content:text});
    persistHist();
    var typing=addMsg('typing','Daffy is typing…',true);

    fetch('/api/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({message:text,history:prevHist})
    })
    .then(function(r){return r.json();})
    .then(function(d){
      typing.remove();
      var reply=d.reply||'Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛';
      addMsg('bot',reply);
      history.push({role:'assistant',content:reply});
      persistHist();
    })
    .catch(function(){
      typing.remove();
      addMsg('bot','Please email daffodilsafrica@gmail.com or call +234 816 787 3722 💛');
    });
  }

  sendBtn.addEventListener('click',send);
  inp.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
  inp.addEventListener('input',function(){inp.style.height='auto';inp.style.height=Math.min(inp.scrollHeight,100)+'px';});

  // ── Init ──────────────────────────────────────────────────
  loadChat();
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){initCookieBanner();initChatbot();});
}else{initCookieBanner();initChatbot();}
})();
