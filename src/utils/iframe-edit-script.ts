/**
 * Script injected into the web design iframe when in edit mode.
 * Handles: click-to-select, hover highlights, inline text editing,
 * and postMessage communication with the parent.
 *
 * This is returned as a string to be embedded in a <script> tag AFTER the body content.
 */
export function getIframeEditScript(): string {
  return `
(function() {
  // Add edit-mode CSS
  var style = document.createElement('style');
  style.textContent = '* { cursor: default !important; } a, button, input, select, textarea { pointer-events: auto !important; } [contenteditable="true"] { cursor: text !important; outline: 2px solid #0005EE !important; outline-offset: 1px; min-width: 20px; min-height: 1em; }';
  document.head.appendChild(style);

  var selected = null;
  var hovered = null;
  var overlay = null;
  var hoverOverlay = null;
  var toolbar = null;
  var editing = false;

  // ─── Overlay elements ──────────────────────────────────────────
  function createOverlay(id, color, w) {
    var el = document.createElement('div');
    el.id = id;
    el.style.cssText = 'position:absolute;pointer-events:none;z-index:99990;border:' + w + 'px solid ' + color + ';border-radius:3px;transition:top 60ms ease,left 60ms ease,width 60ms ease,height 60ms ease;display:none;box-sizing:border-box;';
    document.body.appendChild(el);
    return el;
  }

  overlay = createOverlay('__edit-sel', '#0005EE', 2);
  hoverOverlay = createOverlay('__edit-hov', 'rgba(0,5,238,0.35)', 1);

  // ─── Type label ──────────────────────────────────────────────
  var typeLabel = document.createElement('div');
  typeLabel.id = '__edit-label';
  typeLabel.style.cssText = 'position:absolute;z-index:99991;display:none;background:rgba(0,5,238,0.9);color:#fff;font-size:9px;font-weight:600;font-family:system-ui,sans-serif;padding:1px 5px;border-radius:3px 3px 0 0;line-height:1.4;pointer-events:none;white-space:nowrap;';
  document.body.appendChild(typeLabel);

  // ─── Toolbar ──────────────────────────────────────────────────
  toolbar = document.createElement('div');
  toolbar.id = '__edit-tb';
  toolbar.style.cssText = 'position:absolute;z-index:99992;display:none;background:#1C1B1F;border-radius:8px;padding:3px 6px;box-shadow:0 4px 12px rgba(0,0,0,0.3);white-space:nowrap;font-family:system-ui,sans-serif;align-items:center;gap:3px;';

  var tbTag = document.createElement('span');
  tbTag.id = '__tb-tag';
  tbTag.style.cssText = 'color:rgba(255,255,255,0.6);font-size:9px;font-weight:600;padding:0 4px;user-select:none;';
  toolbar.appendChild(tbTag);

  function makeSep() {
    var s = document.createElement('span');
    s.style.cssText = 'display:inline-block;width:1px;height:14px;background:rgba(255,255,255,0.15);vertical-align:middle;';
    return s;
  }

  function makeBtn(title, label, hoverBg, hoverColor) {
    var b = document.createElement('button');
    b.title = title;
    b.textContent = label;
    b.style.cssText = 'all:unset;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:4px;cursor:pointer !important;color:rgba(255,255,255,0.8);font-size:11px;font-family:system-ui,sans-serif;';
    b.addEventListener('mouseenter', function() { b.style.background = hoverBg; b.style.color = hoverColor; });
    b.addEventListener('mouseleave', function() { b.style.background = 'transparent'; b.style.color = 'rgba(255,255,255,0.8)'; });
    return b;
  }

  toolbar.appendChild(makeSep());
  var btnEdit = makeBtn('Edit text (click again)', 'T', 'rgba(255,255,255,0.12)', '#fff');
  toolbar.appendChild(btnEdit);
  var btnDel = makeBtn('Delete element', '✕', 'rgba(239,68,68,0.2)', '#ef4444');
  btnDel.style.color = 'rgba(255,255,255,0.6)';
  toolbar.appendChild(makeSep());
  toolbar.appendChild(btnDel);
  document.body.appendChild(toolbar);

  // ─── Helpers ──────────────────────────────────────────────────
  function isEditable(el) {
    if (!el || el === document.body || el === document.documentElement) return false;
    if (el.id === 'app') return false;
    if (el.id && el.id.startsWith('__edit')) return false;
    if (el.id && el.id.startsWith('__tb')) return false;
    // Skip our injected toolbar/overlays
    var cur = el;
    while (cur) {
      if (cur.id && cur.id.startsWith('__edit')) return false;
      cur = cur.parentElement;
    }
    return true;
  }

  function getPath(el) {
    var parts = [];
    var cur = el;
    while (cur && cur !== document.body) {
      var tag = cur.tagName.toLowerCase();
      if (cur.id && !cur.id.startsWith('__')) {
        parts.unshift(tag + '#' + cur.id);
        break;
      }
      var parent = cur.parentElement;
      if (parent) {
        var siblings = Array.from(parent.children);
        var idx = siblings.indexOf(cur);
        parts.unshift(tag + ':nth-child(' + (idx + 1) + ')');
      } else {
        parts.unshift(tag);
      }
      cur = parent;
    }
    return parts.join(' > ');
  }

  function getElementInfo(el) {
    if (!el) return null;
    var cs = window.getComputedStyle(el);
    var rect = el.getBoundingClientRect();
    return {
      path: getPath(el),
      tag: el.tagName.toLowerCase(),
      classes: el.className || '',
      text: (el.childNodes.length <= 1 && (!el.childNodes[0] || el.childNodes[0].nodeType === 3)) ? (el.textContent || '') : null,
      hasChildren: el.children.length > 0,
      rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
      styles: {
        color: cs.color,
        backgroundColor: cs.backgroundColor,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        padding: cs.padding,
        margin: cs.margin,
        borderRadius: cs.borderRadius,
        border: cs.border,
        boxShadow: cs.boxShadow,
        opacity: cs.opacity,
        display: cs.display,
        gap: cs.gap,
        textAlign: cs.textAlign,
        width: cs.width,
        height: cs.height,
      }
    };
  }

  function positionOverlayOn(ov, el) {
    if (!el) { ov.style.display = 'none'; return; }
    var r = el.getBoundingClientRect();
    var sx = window.scrollX || 0;
    var sy = window.scrollY || 0;
    ov.style.display = 'block';
    ov.style.left = (r.left + sx - 2) + 'px';
    ov.style.top = (r.top + sy - 2) + 'px';
    ov.style.width = (r.width + 4) + 'px';
    ov.style.height = (r.height + 4) + 'px';
  }

  function positionToolbar(el) {
    if (!el) { toolbar.style.display = 'none'; typeLabel.style.display = 'none'; return; }
    var r = el.getBoundingClientRect();
    var sx = window.scrollX || 0;
    var sy = window.scrollY || 0;

    // Type label - just above the element, left-aligned
    typeLabel.style.display = 'block';
    typeLabel.textContent = el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '');
    typeLabel.style.left = (r.left + sx) + 'px';
    typeLabel.style.top = (r.top + sy - 18) + 'px';

    // Toolbar - above the type label
    toolbar.style.display = 'flex';
    tbTag.textContent = el.tagName.toLowerCase();
    var tbW = toolbar.offsetWidth || 120;
    toolbar.style.left = Math.max(4, r.left + sx + r.width / 2 - tbW / 2) + 'px';
    toolbar.style.top = Math.max(4, r.top + sy - 50) + 'px';
  }

  function selectElement(el) {
    if (editing) stopEditing();
    selected = el;
    if (!el) {
      overlay.style.display = 'none';
      toolbar.style.display = 'none';
      typeLabel.style.display = 'none';
      sendMsg('select', null);
      return;
    }
    positionOverlayOn(overlay, el);
    positionToolbar(el);
    sendMsg('select', getElementInfo(el));
  }

  function startEditing() {
    if (!selected) return;
    // Only allow text editing on leaf elements (no child elements)
    if (selected.children.length > 0) return;
    editing = true;
    selected.setAttribute('contenteditable', 'true');
    selected.focus();
    // Select all text
    try {
      var range = document.createRange();
      range.selectNodeContents(selected);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch(e) {}
  }

  function stopEditing() {
    if (!editing || !selected) return;
    editing = false;
    selected.removeAttribute('contenteditable');
    selected.blur();
    sendMsg('textChanged', { path: getPath(selected), text: selected.textContent });
    sendCurrentHtml();
    // Re-send element info with updated text
    sendMsg('select', getElementInfo(selected));
  }

  function sendCurrentHtml() {
    var app = document.getElementById('app');
    if (!app) return;
    sendMsg('htmlUpdated', { html: app.innerHTML });
  }

  function sendMsg(type, data) {
    try {
      window.parent.postMessage({ source: 'pencil-edit', type: type, data: data }, '*');
    } catch(e) {
      // postMessage might fail in some sandbox configurations
    }
  }

  // ─── Event handlers ───────────────────────────────────────────
  document.addEventListener('click', function(e) {
    // Skip our own UI elements
    var t = e.target;
    if (t.id && (t.id.startsWith('__edit') || t.id.startsWith('__tb'))) return;
    var p = t;
    while (p) { if (p.id && (p.id.startsWith('__edit') || p === toolbar)) return; p = p.parentElement; }

    e.preventDefault();
    e.stopPropagation();

    if (!isEditable(t)) {
      selectElement(null);
      return;
    }
    if (selected === t && !editing) {
      // Second click on same element: start inline editing
      startEditing();
      return;
    }
    selectElement(t);
  }, true);

  document.addEventListener('mousemove', function(e) {
    if (editing) return;
    var t = e.target;
    if (!isEditable(t) || t === selected) {
      if (hovered) { hoverOverlay.style.display = 'none'; hovered = null; }
      return;
    }
    if (t !== hovered) {
      hovered = t;
      positionOverlayOn(hoverOverlay, t);
    }
  }, true);

  document.addEventListener('keydown', function(e) {
    if (editing) {
      if (e.key === 'Escape') { stopEditing(); e.preventDefault(); }
      if (e.key === 'Enter' && !e.shiftKey) { stopEditing(); e.preventDefault(); }
      return;
    }
    if (e.key === 'Escape' && selected) { selectElement(null); e.preventDefault(); }
    if ((e.key === 'Delete' || e.key === 'Backspace') && selected && !editing) {
      e.preventDefault();
      var toRemove = selected;
      selectElement(null);
      toRemove.remove();
      sendCurrentHtml();
    }
  }, true);

  // Prevent default navigation on links/forms
  document.addEventListener('submit', function(e) { e.preventDefault(); }, true);

  // Toolbar button handlers
  btnEdit.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (selected) startEditing();
  });
  btnDel.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (selected) {
      var toRemove = selected;
      selectElement(null);
      toRemove.remove();
      sendCurrentHtml();
    }
  });

  // ─── Listen for commands from parent ──────────────────────────
  window.addEventListener('message', function(e) {
    if (!e.data || e.data.source !== 'pencil-host') return;
    var cmd = e.data;

    if (cmd.type === 'updateStyle') {
      if (!selected) return;
      selected.style[cmd.data.property] = cmd.data.value;
      positionOverlayOn(overlay, selected);
      positionToolbar(selected);
      sendMsg('select', getElementInfo(selected));
      sendCurrentHtml();
    }

    if (cmd.type === 'updateText') {
      if (!selected) return;
      selected.textContent = cmd.data.text;
      positionOverlayOn(overlay, selected);
      positionToolbar(selected);
      sendMsg('select', getElementInfo(selected));
      sendCurrentHtml();
    }

    if (cmd.type === 'deselect') {
      selectElement(null);
    }

    if (cmd.type === 'getHtml') {
      sendCurrentHtml();
    }
  });

  // Reposition overlays on scroll
  var appEl = document.getElementById('app');
  if (appEl) {
    appEl.addEventListener('scroll', function() {
      if (selected) { positionOverlayOn(overlay, selected); positionToolbar(selected); }
      if (hovered) positionOverlayOn(hoverOverlay, hovered);
    });
  }
  window.addEventListener('scroll', function() {
    if (selected) { positionOverlayOn(overlay, selected); positionToolbar(selected); }
    if (hovered) positionOverlayOn(hoverOverlay, hovered);
  });

  // Signal ready
  sendMsg('ready', {});
})();
`;
}
