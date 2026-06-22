/* =====================================================================
   Error Page Builder Pro — render.js
   Builds the complete, standalone error-page HTML document from a state
   object. The output inlines all CSS + JS so it works on file:// and any
   static host with zero dependencies and no network calls.
   Exposes window.EPB_RENDER.buildHtml(state).
   ===================================================================== */
(function () {
  'use strict';

  var esc = (window.WUS && WUS.escapeHtml) || function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* Escape a value for safe use inside a double-quoted HTML attribute. */
  function attr(s) { return esc(s == null ? '' : s); }

  /* Lighten/darken a hex color by a percentage (-100..100). */
  function shade(hex, pct) {
    try {
      var h = hex.replace('#', '');
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      var r = parseInt(h.substring(0, 2), 16);
      var g = parseInt(h.substring(2, 4), 16);
      var b = parseInt(h.substring(4, 6), 16);
      var t = pct < 0 ? 0 : 255;
      var p = Math.abs(pct) / 100;
      r = Math.round((t - r) * p) + r;
      g = Math.round((t - g) * p) + g;
      b = Math.round((t - b) * p) + b;
      return '#' + [r, g, b].map(function (v) {
        var s = Math.max(0, Math.min(255, v)).toString(16);
        return s.length === 1 ? '0' + s : s;
      }).join('');
    } catch (e) { return hex; }
  }

  /* ---- Background CSS for each style ---- */
  function backgroundCss(state) {
    var b1 = state.bg1, b2 = state.bg2, ac = state.accent;
    switch (state.background) {
      case 'solid':
        return 'background:' + b1 + ';';
      case 'mesh':
        return 'background-color:' + b1 + ';' +
          'background-image:' +
          'radial-gradient(at 18% 22%, ' + ac + '55 0px, transparent 50%),' +
          'radial-gradient(at 82% 12%, ' + b2 + 'aa 0px, transparent 50%),' +
          'radial-gradient(at 75% 82%, ' + ac + '40 0px, transparent 50%),' +
          'radial-gradient(at 22% 78%, ' + b2 + 'cc 0px, transparent 50%);';
      case 'starfield':
        return 'background:radial-gradient(ellipse at 50% 30%, ' + shade(b2, 8) + ', ' + b1 + ' 70%);';
      case 'gradient':
      default:
        return 'background:linear-gradient(135deg, ' + b1 + ' 0%, ' + b2 + ' 55%, ' + shade(ac, -30) + ' 130%);';
    }
  }

  /* ---- Illustration markup per style ---- */
  function illustrationHtml(state) {
    var code = esc(state.code);
    switch (state.illustration) {
      case 'number':
        return '<div class="ep-illus ep-number" aria-hidden="true">' + code + '</div>';
      case 'emoji':
        return '<div class="ep-illus ep-emoji" aria-hidden="true">' + esc(state.emoji || '🛰️') + '</div>';
      case 'glitch':
        return '<div class="ep-illus ep-glitch" data-text="' + attr(state.code) + '" aria-hidden="true">' + code + '</div>';
      case 'svg':
      default:
        /* Floating orbit glyph with the emoji at its core. */
        return '' +
          '<div class="ep-illus ep-svg" aria-hidden="true">' +
            '<svg viewBox="0 0 200 200" width="200" height="200">' +
              '<defs><radialGradient id="epg" cx="50%" cy="40%" r="60%">' +
                '<stop offset="0%" stop-color="var(--ep-accent)" stop-opacity=".9"/>' +
                '<stop offset="100%" stop-color="var(--ep-accent)" stop-opacity="0"/>' +
              '</radialGradient></defs>' +
              '<circle class="ep-orbit" cx="100" cy="100" r="78" fill="none" stroke="var(--ep-accent)" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="4 8"/>' +
              '<circle cx="100" cy="100" r="56" fill="url(#epg)"/>' +
              '<circle class="ep-moon" cx="178" cy="100" r="6" fill="var(--ep-accent)"/>' +
            '</svg>' +
            '<span class="ep-glyph">' + esc(state.emoji || '🛰️') + '</span>' +
          '</div>';
    }
  }

  /* ---- Starfield <script> (only injected when needed) ---- */
  function starfieldScript() {
    return '' +
'<script>(function(){' +
'var c=document.getElementById("ep-stars");if(!c)return;var x=c.getContext("2d");' +
'var stars=[],n=0;function size(){c.width=innerWidth;c.height=innerHeight;' +
'n=Math.min(220,Math.floor(innerWidth*innerHeight/9000));stars=[];' +
'for(var i=0;i<n;i++){stars.push({x:Math.random()*c.width,y:Math.random()*c.height,' +
'z:Math.random()*1.6+0.4,p:Math.random()*Math.PI*2});}}' +
'size();addEventListener("resize",size);' +
'var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;var t=0;' +
'function frame(){t+=0.02;x.clearRect(0,0,c.width,c.height);' +
'for(var i=0;i<stars.length;i++){var s=stars[i];' +
'var a=reduce?0.7:(0.4+0.6*Math.abs(Math.sin(t*s.z+s.p)));' +
'x.globalAlpha=a;x.fillStyle="#fff";x.beginPath();' +
'x.arc(s.x,s.y,s.z*0.9,0,7);x.fill();' +
'if(!reduce){s.y+=s.z*0.12;if(s.y>c.height)s.y=0;}}' +
'if(!reduce)requestAnimationFrame(frame);}' +
'if(reduce){frame();}else{requestAnimationFrame(frame);}})();<\/script>';
  }

  /* ---- Decorative search box (no real action) ---- */
  function searchHtml(state) {
    if (!state.search) return '';
    return '' +
      '<form class="ep-search" role="search" onsubmit="return false">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
        '<input type="search" placeholder="Search this site…" aria-label="Search">' +
      '</form>';
  }

  /* ---- Buttons ---- */
  function buttonsHtml(state) {
    var html = '<div class="ep-actions">';
    if (state.btnLabel) {
      html += '<a class="ep-btn ep-btn-primary" href="' + attr(state.btnUrl || '/') + '">' + esc(state.btnLabel) + '</a>';
    }
    if (state.secEnabled && state.secLabel) {
      html += '<a class="ep-btn ep-btn-ghost" href="' + attr(state.secUrl || '/') + '">' + esc(state.secLabel) + '</a>';
    }
    html += '</div>';
    return html;
  }

  /* ===================================================================
     Build the full standalone document.
     =================================================================== */
  function buildHtml(state) {
    var dark = !!state.dark;
    var text = dark ? '#f4f6ff' : '#0c0e1a';
    var textMuted = dark ? 'rgba(244,246,255,.66)' : 'rgba(12,14,26,.62)';
    var cardBg = dark ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.72)';
    var cardBorder = dark ? 'rgba(255,255,255,.12)' : 'rgba(12,14,26,.1)';
    var ghostBg = dark ? 'rgba(255,255,255,.06)' : 'rgba(12,14,26,.04)';
    var ac = state.accent || '#6366f1';
    var acText = '#fff';

    var isStar = state.background === 'starfield';
    var titleText = esc(state.code) + ' — ' + esc(state.title || 'Error');

    /* Inline stylesheet for the exported page. */
    var css = '' +
':root{--ep-accent:' + ac + ';--ep-accent-d:' + shade(ac, -22) + ';}' +
'*{box-sizing:border-box;}' +
'html,body{height:100%;}' +
'body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
'color:' + text + ';' + backgroundCss(state) +
'min-height:100vh;display:flex;align-items:center;justify-content:center;' +
'padding:48px 24px;position:relative;overflow-x:hidden;-webkit-font-smoothing:antialiased;}' +
'#ep-stars{position:fixed;inset:0;z-index:0;pointer-events:none;}' +
'.ep-wrap{position:relative;z-index:1;width:100%;max-width:560px;text-align:center;' +
'animation:ep-rise .7s cubic-bezier(.16,1,.3,1) both;}' +
'@keyframes ep-rise{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:none;}}' +

/* Illustration shared */
'.ep-illus{margin:0 auto 8px;}' +
/* Animated SVG glyph */
'.ep-svg{position:relative;width:200px;height:200px;}' +
'.ep-svg svg{display:block;filter:drop-shadow(0 12px 40px ' + ac + '66);animation:ep-float 6s ease-in-out infinite;}' +
'.ep-orbit{transform-origin:100px 100px;animation:ep-spin 18s linear infinite;}' +
'.ep-moon{transform-origin:100px 100px;animation:ep-spin 8s linear infinite;}' +
'@keyframes ep-spin{to{transform:rotate(360deg);}}' +
'@keyframes ep-float{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}' +
'.ep-glyph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:62px;animation:ep-float 6s ease-in-out infinite;}' +
/* Big gradient number */
'.ep-number{font-size:clamp(96px,26vw,200px);font-weight:900;line-height:.9;letter-spacing:-.04em;' +
'background:linear-gradient(135deg,var(--ep-accent),' + shade(ac, 35) + ');-webkit-background-clip:text;background-clip:text;' +
'-webkit-text-fill-color:transparent;color:transparent;filter:drop-shadow(0 10px 30px ' + ac + '55);' +
'animation:ep-shimmer 5s ease-in-out infinite;background-size:200% 200%;}' +
'@keyframes ep-shimmer{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}' +
/* Emoji */
'.ep-emoji{font-size:clamp(72px,18vw,120px);line-height:1;animation:ep-float 5s ease-in-out infinite;}' +
/* Glitch */
'.ep-glitch{position:relative;font-size:clamp(80px,22vw,170px);font-weight:900;letter-spacing:-.03em;line-height:1;' +
'color:' + text + ';}' +
'.ep-glitch::before,.ep-glitch::after{content:attr(data-text);position:absolute;left:0;top:0;width:100%;}' +
'.ep-glitch::before{color:var(--ep-accent);animation:ep-gl1 2.4s infinite steps(2);clip-path:inset(0 0 55% 0);}' +
'.ep-glitch::after{color:' + shade(ac, 30) + ';animation:ep-gl2 3s infinite steps(2);clip-path:inset(55% 0 0 0);}' +
'@keyframes ep-gl1{0%,100%{transform:translate(0,0);}20%{transform:translate(-3px,2px);}40%{transform:translate(3px,-2px);}}' +
'@keyframes ep-gl2{0%,100%{transform:translate(0,0);}25%{transform:translate(3px,1px);}55%{transform:translate(-3px,-1px);}}' +

/* Text */
'.ep-title{font-size:clamp(26px,5vw,40px);font-weight:800;letter-spacing:-.02em;margin:18px 0 10px;line-height:1.1;}' +
'.ep-code-badge{display:inline-block;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;' +
'color:var(--ep-accent);background:' + ac + '1f;border:1px solid ' + ac + '44;border-radius:999px;padding:5px 14px;}' +
'.ep-msg{font-size:clamp(15px,2.2vw,18px);color:' + textMuted + ';margin:0 auto 28px;max-width:460px;line-height:1.6;}' +

/* Search */
'.ep-search{display:flex;align-items:center;gap:10px;max-width:380px;margin:0 auto 26px;' +
'background:' + cardBg + ';border:1px solid ' + cardBorder + ';border-radius:14px;padding:10px 16px;' +
'-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);}' +
'.ep-search svg{width:18px;height:18px;color:' + textMuted + ';flex:none;}' +
'.ep-search input{flex:1;border:0;background:transparent;color:' + text + ';font-size:15px;outline:none;}' +
'.ep-search input::placeholder{color:' + textMuted + ';}' +

/* Buttons */
'.ep-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}' +
'.ep-btn{display:inline-flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;' +
'padding:12px 22px;border-radius:12px;text-decoration:none;cursor:pointer;' +
'transition:transform .15s ease,box-shadow .25s ease,background .2s ease;}' +
'.ep-btn:hover{transform:translateY(-2px);}' +
'.ep-btn-primary{color:' + acText + ';background:linear-gradient(135deg,var(--ep-accent),var(--ep-accent-d));' +
'box-shadow:0 10px 28px -8px ' + ac + 'cc;}' +
'.ep-btn-primary:hover{box-shadow:0 16px 36px -8px ' + ac + 'ee;}' +
'.ep-btn-ghost{color:' + text + ';background:' + ghostBg + ';border:1px solid ' + cardBorder + ';}' +
'.ep-btn-ghost:hover{background:' + (dark ? 'rgba(255,255,255,.12)' : 'rgba(12,14,26,.08)') + ';}' +

/* Footer */
'.ep-footer{margin-top:40px;font-size:13px;color:' + textMuted + ';}' +

'@media (prefers-reduced-motion: reduce){*{animation:none!important;}}' +
'@media (max-width:480px){.ep-actions{flex-direction:column;}.ep-btn{width:100%;}}';

    var parts = [];
    parts.push('<!DOCTYPE html>');
    parts.push('<html lang="en">');
    parts.push('<head>');
    parts.push('<meta charset="UTF-8">');
    parts.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    parts.push('<meta name="robots" content="noindex">');
    parts.push('<title>' + titleText + '</title>');
    parts.push('<style>' + css + '</style>');
    parts.push('</head>');
    parts.push('<body>');
    if (isStar) parts.push('<canvas id="ep-stars"></canvas>');
    parts.push('<main class="ep-wrap">');
    parts.push(illustrationHtml(state));
    if (state.illustration !== 'number' && state.illustration !== 'glitch') {
      parts.push('<span class="ep-code-badge">Error ' + esc(state.code) + '</span>');
    }
    parts.push('<h1 class="ep-title">' + esc(state.title || 'Something went wrong') + '</h1>');
    if (state.message) parts.push('<p class="ep-msg">' + esc(state.message) + '</p>');
    parts.push(searchHtml(state));
    parts.push(buttonsHtml(state));
    if (state.footer) parts.push('<footer class="ep-footer">' + esc(state.footer) + '</footer>');
    parts.push('</main>');
    if (isStar) parts.push(starfieldScript());
    parts.push('</body>');
    parts.push('</html>');

    return parts.join('\n');
  }

  /* Suggested download filename based on preset/code. */
  function fileName(state) {
    var p = state.preset;
    if (p === 'maintenance') return 'maintenance.html';
    if (p === 'custom' || !p) {
      var c = String(state.code || 'error').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      return (c || 'error') + '.html';
    }
    return p + '.html';
  }

  window.EPB_RENDER = { buildHtml: buildHtml, fileName: fileName };
})();
