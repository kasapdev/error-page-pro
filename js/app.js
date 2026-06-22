/* =====================================================================
   Error Page Builder Pro — app.js
   Wires the editor controls to state, autosaves to localStorage, renders
   the live preview (debounced), and handles export / copy / reset.
   Classic script (no ES modules). Depends on window.WUS, EPB_TEMPLATES,
   EPB_RENDER.
   ===================================================================== */
(function () {
  'use strict';

  var T = window.EPB_TEMPLATES;
  var R = window.EPB_RENDER;
  var STORE_KEY = 'errpg.state'; // namespaced sub-prefix per spec

  /* ---------------------------- State ---------------------------- */
  var state = Object.assign({}, T.DEFAULT);

  /* Map of DOM control id -> state key + type. */
  var FIELDS = [
    ['codeInp', 'code', 'text'],
    ['emojiInp', 'emoji', 'text'],
    ['titleInp', 'title', 'text'],
    ['msgInp', 'message', 'text'],
    ['footerInp', 'footer', 'text'],
    ['btnLabelInp', 'btnLabel', 'text'],
    ['btnUrlInp', 'btnUrl', 'text'],
    ['secLabelInp', 'secLabel', 'text'],
    ['secUrlInp', 'secUrl', 'text'],
    ['secToggle', 'secEnabled', 'bool'],
    ['searchToggle', 'search', 'bool'],
    ['illusSel', 'illustration', 'text'],
    ['bgSel', 'background', 'text'],
    ['accentInp', 'accent', 'text'],
    ['bg1Inp', 'bg1', 'text'],
    ['bg2Inp', 'bg2', 'text'],
    ['darkToggle', 'dark', 'bool']
  ];

  var $ = function (id) { return document.getElementById(id); };
  var frame = $('previewFrame');

  /* ------------------------ Persistence ------------------------- */
  function save() {
    try { WUS.store.set(STORE_KEY, state); } catch (e) { /* ignore quota */ }
  }
  function load() {
    var saved = WUS.store.get(STORE_KEY, null);
    if (saved && typeof saved === 'object') {
      state = Object.assign({}, T.DEFAULT, saved);
    }
  }

  /* --------------------- Sync DOM <-> state --------------------- */
  /* Push state into all controls (used on load / preset / example / reset). */
  function controlsFromState() {
    FIELDS.forEach(function (f) {
      var node = $(f[0]);
      if (!node) return;
      if (f[2] === 'bool') node.checked = !!state[f[1]];
      else node.value = state[f[1]] != null ? state[f[1]] : '';
    });
    var sel = $('presetSel');
    if (sel) sel.value = state.preset || '404';
    syncConditionalUi();
  }

  /* Pull a single control's value into state. */
  function stateFromControl(node, key, type) {
    if (type === 'bool') state[key] = node.checked;
    else state[key] = node.value;
  }

  /* Show/hide secondary-link fields, update badge + URL bar. */
  function syncConditionalUi() {
    var secFields = $('secFields');
    if (secFields) secFields.hidden = !state.secEnabled;
    var badge = $('presetBadge');
    if (badge) badge.textContent = state.code || '—';
    var urlBar = $('urlBar');
    if (urlBar) urlBar.textContent = state.url || 'example.com';
  }

  /* ------------------------- Rendering -------------------------- */
  function doRender() {
    try {
      var html = R.buildHtml(state);
      frame.srcdoc = html;
    } catch (e) {
      WUS.toast('Preview failed to render', 'error');
      /* eslint-disable no-console */
      if (window.console) console.error(e);
    }
  }
  var renderDebounced = WUS.debounce(doRender, 300);

  /* Called on every edit: update state, persist, refresh preview. */
  function onEdit() {
    save();
    syncConditionalUi();
    renderDebounced();
  }

  /* ------------------------ Preset apply ------------------------ */
  function applyPreset(key) {
    var p = T.PRESETS[key];
    if (!p) return;
    state.preset = key;
    /* Only overwrite content-ish fields; keep the user's visual style. */
    state.code = p.code;
    state.title = p.title;
    state.message = p.message;
    state.btnLabel = p.btnLabel;
    state.btnUrl = p.btnUrl;
    state.emoji = p.emoji;
    state.url = p.url;
    if (p.illustration) state.illustration = p.illustration;
    controlsFromState();
    save();
    doRender();
    WUS.toast('Loaded ' + (key === 'maintenance' ? 'maintenance' : key) + ' preset');
  }

  function loadExample() {
    state = Object.assign({}, T.EXAMPLE);
    controlsFromState();
    save();
    doRender();
    WUS.toast('Example loaded');
  }

  function resetAll() {
    state = Object.assign({}, T.DEFAULT);
    controlsFromState();
    save();
    doRender();
    WUS.toast('Reset to default 404');
  }

  /* ----------------------- Export / copy ------------------------ */
  function exportHtml() {
    try {
      var html = R.buildHtml(state);
      WUS.download(R.fileName(state), html, 'text/html;charset=utf-8');
      WUS.toast('Exported ' + R.fileName(state));
    } catch (e) {
      WUS.toast('Export failed', 'error');
    }
  }
  function copyHtml() {
    try {
      var html = R.buildHtml(state);
      WUS.copy(html, 'HTML copied to clipboard');
    } catch (e) {
      WUS.toast('Copy failed', 'error');
    }
  }

  /* -------------------------- Modals ---------------------------- */
  function openModal(el) { el.hidden = false; }
  function closeModal(el) { el.hidden = true; }

  function wireModal(modal, opener) {
    if (opener) opener.addEventListener('click', function () { openModal(modal); });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal(modal);
    });
  }

  /* Build the shortcuts table from registered shortcuts. */
  function fillShortcuts() {
    var rows = $('shortcutRows');
    if (!rows) return;
    var isMac = /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);
    function pretty(combo) {
      return combo.split('+').map(function (k) {
        k = k.trim().toLowerCase();
        if (k === 'mod') return isMac ? '⌘' : 'Ctrl';
        if (k === 'shift') return isMac ? '⇧' : 'Shift';
        if (k === 'alt') return isMac ? '⌥' : 'Alt';
        return k.length === 1 ? k.toUpperCase() : k.charAt(0).toUpperCase() + k.slice(1);
      }).map(function (k) { return '<kbd>' + WUS.escapeHtml(k) + '</kbd>'; }).join('');
    }
    var html = WUS.shortcuts.map(function (s) {
      return '<tr><td>' + WUS.escapeHtml(s.desc) + '</td><td>' + pretty(s.combo) + '</td></tr>';
    }).join('');
    rows.innerHTML = html;
  }

  /* ----------------------- Mobile view toggle ------------------- */
  function setView(view) {
    var ws = $('workspace');
    if (!ws) return;
    ws.setAttribute('data-view', view);
    var btns = document.querySelectorAll('.view-toggle button');
    btns.forEach(function (b) {
      b.setAttribute('aria-selected', b.getAttribute('data-view') === view ? 'true' : 'false');
    });
  }

  /* ------------------------- Init / wire ------------------------ */
  function init() {
    load();
    controlsFromState();
    doRender();

    /* Live editing for all mapped controls. */
    FIELDS.forEach(function (f) {
      var node = $(f[0]);
      if (!node) return;
      var ev = (f[2] === 'bool') ? 'change' : 'input';
      node.addEventListener(ev, function () {
        stateFromControl(node, f[1], f[2]);
        onEdit();
      });
    });

    /* Preset selector + quick presets. */
    $('presetSel').addEventListener('change', function () { applyPreset(this.value); });
    document.querySelectorAll('[data-quick]').forEach(function (b) {
      b.addEventListener('click', function () { applyPreset(this.getAttribute('data-quick')); });
    });

    /* Tool buttons. */
    $('exportBtn').addEventListener('click', exportHtml);
    $('copyBtn').addEventListener('click', copyHtml);
    $('exampleBtn').addEventListener('click', loadExample);
    $('refreshBtn').addEventListener('click', doRender);

    /* Reset (with confirm modal). */
    var resetModal = $('resetModal');
    $('resetBtn').addEventListener('click', function () { openModal(resetModal); });
    $('resetCancel').addEventListener('click', function () { closeModal(resetModal); });
    $('resetConfirm').addEventListener('click', function () {
      closeModal(resetModal); resetAll();
    });
    resetModal.addEventListener('click', function (e) { if (e.target === resetModal) closeModal(resetModal); });

    /* Help modal. */
    var helpModal = $('helpModal');
    fillShortcuts();
    document.querySelectorAll('[data-shortcut-help]').forEach(function (b) {
      wireModal(helpModal, b);
    });
    $('helpClose').addEventListener('click', function () { closeModal(helpModal); });

    /* ESC closes any open modal. */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (!helpModal.hidden) closeModal(helpModal);
        if (!resetModal.hidden) closeModal(resetModal);
      }
    });

    /* Mobile Edit/Preview toggle. */
    document.querySelectorAll('.view-toggle button').forEach(function (b) {
      b.addEventListener('click', function () { setView(this.getAttribute('data-view')); });
    });
    setView('edit');

    /* Keyboard shortcuts. */
    WUS.registerShortcut('mod+e', function () { exportHtml(); }, 'Export standalone HTML');
    WUS.registerShortcut('mod+shift+c', function () { copyHtml(); }, 'Copy HTML to clipboard');
    WUS.registerShortcut('?', function () { openModal(helpModal); }, 'Show this help dialog');
    fillShortcuts(); // refresh now that shortcuts are registered
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
