// Builds a complete HTML document for rendering inside an artboard iframe.
// Hardcoded to Quantify/Probe brand tokens. Includes the full design system CSS
// and icon auto-fix script — extracted from PreviewPanel.tsx.

const DESIGN_SYSTEM_CSS = `
*{box-sizing:border-box}
img{max-width:100%;display:block}
img:not([src]),img[src=""],img[src^="http"]{min-height:80px;background:#F4F4F4}
.screen{display:flex;flex-direction:column;min-height:100%;background:#FFFFFF;font-family:"Switzer","Helvetica Neue",Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#202020;letter-spacing:-0.02em}
.app-bar{position:sticky;top:0;z-index:10;height:56px;display:flex;align-items:center;padding:0 4px;background:#FFFFFF;border-bottom:1px solid #E2E2E2;gap:4px;flex-shrink:0}
.app-bar-title{flex:1;font-size:20px;font-weight:500;letter-spacing:-0.02em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 8px}
.content{flex:1;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:12px}
.card{background:#fff;border-radius:0;border:1px solid #E2E2E2;padding:16px;display:flex;flex-direction:column;gap:8px}
.card-elevated{background:#F8F8F8;border-radius:0;border:1px solid #E2E2E2;padding:16px;display:flex;flex-direction:column;gap:8px}
.card-filled{background:#F4F4F4;border-radius:0;border:none;padding:16px;display:flex;flex-direction:column;gap:8px}
.stat-group{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.stat-card{background:#fff;border-radius:0;border:1px solid #E2E2E2;padding:16px;display:flex;flex-direction:column;gap:4px}
.stat-value{font-size:32px;font-weight:500;letter-spacing:-0.04em;line-height:1.1;color:#0A3EFF}
.stat-value.success{color:#22C55E}.stat-value.dark{color:#10296E}.stat-value.error{color:#E64059}
.stat-label{font-size:13px;font-weight:400;letter-spacing:-0.01em;color:#878787}
.stat-delta{font-size:12px;font-weight:500;display:inline-flex;align-items:center;gap:3px}
.stat-delta.up{color:#22C55E}.stat-delta.down{color:#E64059}
.section-header{font-size:13px;font-weight:500;letter-spacing:-0.01em;color:#878787;margin:4px 0 0}
.row{display:flex;align-items:center;gap:12px}
.row-between{display:flex;align-items:center;justify-content:space-between}
.col{display:flex;flex-direction:column;gap:4px}
.label-sm{font-size:11px;letter-spacing:-0.01em;color:#878787;font-weight:400}
.body-sm{font-size:13px;color:#878787;line-height:1.3;letter-spacing:-0.01em}
.body-md{font-size:16px;color:#202020;line-height:1.4;letter-spacing:-0.02em}
.title-md{font-size:16px;font-weight:500;color:#202020;letter-spacing:-0.02em}
.title-lg{font-size:25px;font-weight:500;color:#202020;letter-spacing:-0.02em}
.headline{font-size:31px;font-weight:500;color:#202020;letter-spacing:-0.02em}
.display{font-size:39px;font-weight:500;color:#202020;letter-spacing:-0.02em;line-height:1.1}
.title-sm{font-size:14px;font-weight:500;color:#202020;letter-spacing:-0.02em}
.body-lg{font-size:16px;color:#202020;line-height:1.4;letter-spacing:-0.02em}
.label-md{font-size:13px;letter-spacing:-0.01em;color:#878787;font-weight:400}
.label-lg{font-size:16px;letter-spacing:-0.02em;color:#5F5F5F;font-weight:500}
.link{color:#0A3EFF;text-decoration:underline;cursor:pointer}
.code{font-size:11px;font-family:monospace;background:#F4F4F4;color:#202020;padding:2px 6px;border-radius:0;font-weight:500}
.fab{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:0;background:#0A3EFF;color:#fff;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:5}
.fab-extended{position:fixed;bottom:24px;right:24px;height:56px;padding:0 20px;border-radius:0;background:#0A3EFF;color:#fff;border:none;display:flex;align-items:center;gap:8px;font-size:16px;font-weight:500;cursor:pointer;z-index:5}
.tab-bar{display:flex;border-bottom:1px solid #E2E2E2;gap:0}
.tab{flex:1;padding:12px 16px;font-size:16px;font-weight:400;color:#878787;text-align:center;border:none;background:transparent;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;letter-spacing:-0.02em}
.tab.active{color:#0A3EFF;border-bottom-color:#0A3EFF;font-weight:500}
.surface-container{background:#F8F8F8;border-radius:0;padding:16px}
.text-primary{color:#202020}.text-secondary{color:#878787}.text-disabled{color:#B5B5B5}.text-on-primary{color:#FFFFFF}.text-error{color:#E64059}.text-success{color:#22C55E}.text-accent{color:#0A3EFF}
button:focus-visible,.field:focus-within{outline:2px solid #0A3EFF;outline-offset:2px}
.btn-filled:focus-visible,.btn-outlined:focus-visible,.btn-tonal:focus-visible,.btn-text:focus-visible{outline:2px solid #0A3EFF;outline-offset:2px}
.icon-btn:focus-visible{outline:2px solid #0A3EFF;outline-offset:2px;border-radius:0}
.chip:focus-visible{outline:2px solid #0A3EFF;outline-offset:2px}
.btn-filled:active{opacity:0.88}.btn-outlined:active{background:rgba(10,62,255,0.08)}.btn-tonal:active{background:rgba(10,62,255,0.12)}.btn-text:active{background:rgba(10,62,255,0.08)}
.badge{display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:9999px;font-size:11px;font-weight:500;letter-spacing:-0.01em}
.badge-blue{background:#E8EEFF;color:#0A3EFF}
.badge-success{background:#DCFCE7;color:#14532D}
.badge-error{background:#FFE5E9;color:#5F1422}
.badge-warning{background:#FFF3CD;color:#5D4300}
.badge-gray{background:#F4F4F4;color:#5F5F5F}
.list-item{display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid #E2E2E2}
.list-item:last-child{border-bottom:none}
.list-icon{width:40px;height:40px;border-radius:0;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#F4F4F4;color:#0A3EFF}
.avatar{width:40px;height:40px;border-radius:9999px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:#0A3EFF;color:#fff;font-size:14px;font-weight:500}
.bottom-actions{padding:16px;background:#FFFFFF;border-top:1px solid #E2E2E2;display:flex;gap:10px;flex-shrink:0}
.filter-bar{display:flex;align-items:center;gap:8px;padding:8px 0;overflow-x:auto}
.chip{display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:0;font-size:13px;font-weight:400;border:1px solid #E2E2E2;background:#fff;color:#5F5F5F;cursor:pointer;white-space:nowrap;letter-spacing:-0.01em}
.chip.active{background:#E8EEFF;border-color:#0A3EFF;color:#0A3EFF}
button{font-family:inherit;cursor:pointer;transition:opacity .15s;letter-spacing:-0.02em}button:hover{opacity:.85}
.btn-filled{background:#0A3EFF;color:#fff;border:none;border-radius:0;height:40px;padding:0 16px;font-size:16px;font-weight:400;display:inline-flex;align-items:center;gap:8px}
.btn-outlined{background:transparent;color:#0A3EFF;border:1px solid #0A3EFF;border-radius:0;height:40px;padding:0 16px;font-size:16px;font-weight:400;display:inline-flex;align-items:center;gap:8px}
.btn-text{background:transparent;color:#0A3EFF;border:none;border-radius:0;height:40px;padding:0 12px;font-size:16px;font-weight:400;display:inline-flex;align-items:center;gap:8px}
.btn-tonal{background:rgba(10,62,255,0.08);color:#0A3EFF;border:none;border-radius:0;height:40px;padding:0 16px;font-size:16px;font-weight:400;display:inline-flex;align-items:center;gap:8px}
.btn-sm{height:32px;font-size:13px;padding:0 12px}
.icon-btn{background:transparent;border:none;border-radius:0;width:40px;height:40px;min-width:40px;display:flex;align-items:center;justify-content:center;color:#5F5F5F}
.msi{font-family:'Material Symbols Outlined';font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;font-size:24px;font-weight:400;line-height:24px;height:24px;width:24px;letter-spacing:normal;text-transform:none;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-feature-settings:'liga' 1;font-feature-settings:'liga' 1;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;user-select:none;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;flex-shrink:0;text-align:center;overflow:hidden}
.msi.sm{font-size:18px;line-height:18px;height:18px;width:18px}.msi.lg{font-size:32px;line-height:32px;height:32px;width:32px}
.list-icon .msi{font-size:24px;line-height:24px;height:24px;width:24px}
p .msi,h1 .msi,h2 .msi,h3 .msi,h4 .msi,h5 .msi,h6 .msi,li .msi,label .msi,td .msi,th .msi,blockquote .msi,a .msi,figcaption .msi{display:none}
.switch{display:inline-flex;align-items:center;cursor:pointer}.switch input{display:none}
.sw-track{position:relative;width:52px;height:32px;border-radius:16px;background:#B5B5B5;border:none;transition:.2s;flex-shrink:0}
.switch input:checked+.sw-track{background:#0A3EFF}
.sw-thumb{position:absolute;top:4px;left:4px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,0.2);transition:left .2s}
.switch input:checked+.sw-track .sw-thumb{left:24px}
.field{position:relative;border:1px solid #E2E2E2;border-radius:0;height:56px;padding:0 16px;background:#fff;display:flex;align-items:center;transition:border-color .15s;box-sizing:border-box;overflow:visible}
.field.field-error{border-color:#E64059;border-width:2px}
.field.field-warning{border-color:#F9A825;border-width:2px}
.field.field-info{border-color:#0A3EFF;border-width:2px}
.field.field-error .field-label{color:#E64059}
.field.field-warning .field-label{color:#F9A825}
.field.field-info .field-label{color:#0A3EFF}
.field-label{position:absolute;top:0;left:12px;transform:translateY(-50%);font-size:12px;font-weight:400;color:#0A3EFF;background:#fff;padding:0 4px;pointer-events:none;z-index:1;letter-spacing:-0.01em}
.field-input{width:100%;border:none;outline:none;background:transparent;font-size:16px;font-family:inherit;color:#202020;display:block;letter-spacing:-0.02em}
select.field-input{-webkit-appearance:none;appearance:none;cursor:pointer;padding-right:20px}
textarea.field-input{min-height:80px;resize:vertical;line-height:1.4;padding-top:4px}
.field:focus-within{border-color:#0A3EFF}
.search-bar{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #E2E2E2;border-radius:0;padding:0 16px;height:48px}
.search-bar .field-input{font-size:16px}
hr.divider{border:none;border-top:1px solid #E2E2E2;margin:0}
.progress{height:4px;background:#F4F4F4;border-radius:0;overflow:hidden}
.progress-fill{height:100%;background:#0A3EFF;border-radius:0}
.info-bar{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:0;font-size:13px;line-height:1.3;letter-spacing:-0.01em}
.info-bar.error{background:#FFE5E9;color:#5F1422;border:1px solid #E64059}
.info-bar.warning{background:#FFF3CD;color:#5D4300;border:1px solid #F9A825}
.info-bar.info{background:#E8EEFF;color:#10296E;border:1px solid #0A3EFF}
.info-bar.success{background:#DCFCE7;color:#14532D;border:1px solid #22C55E}
`.trim()

const ICON_SCRIPT = `
(function(){
  var ICONS='arrow_back arrow_forward arrow_upward arrow_downward close check more_vert more_horiz more menu add remove search chevron_right chevron_left expand_more expand_less notifications notification_add account_circle person person_outline group business local_shipping inventory_2 assignment schedule calendar_today check_circle cancel warning error info report_problem sync refresh tune filter_list sort edit delete visibility visibility_off upload download place location_on location_off map call phone mail email done done_all clear star star_border home settings dashboard list_alt add_business fitness_center bolt verified flag push_pin help manage_accounts format_list_bulleted navigate_next navigate_before shopping_cart store warehouse layers category label receipt bar_chart pie_chart show_chart trending_up trending_down timeline table_chart grid_view view_list add_task task_alt pending_actions route local_fire_department construction engineering agriculture work_history attach_money payments account_balance description folder_open drive_file_rename_outline swap_horiz swap_vert content_copy print share bookmark favorite thumb_up lock lock_open security admin_panel_settings qr_code barcode battery_charging_full signal_cellular_alt wifi'.split(' ');
  var ICON_SET=new Set(ICONS);
  var ICON_CONTAINERS='.icon-btn, .list-icon, .nav-icon, .action-icon, .leading-icon, .trailing-icon, .chip-icon, [data-icon]';
  var TEXT_TAGS=new Set(['P','H1','H2','H3','H4','H5','H6','LI','LABEL','TD','TH','CAPTION','FIGCAPTION','BLOCKQUOTE','A','SPAN','BUTTON']);
  function fixContainers(root){
    root.querySelectorAll(ICON_CONTAINERS).forEach(function(el){
      if(el.classList.contains('msi'))return;
      if(el.querySelector('.msi'))return;
      if(el.childElementCount>0)return;
      var t=el.textContent.trim();
      if(t&&ICON_SET.has(t)){
        var sp=document.createElement('span');sp.className='msi';sp.textContent=t;
        el.textContent='';el.appendChild(sp);
      }
    });
    root.querySelectorAll('div,span').forEach(function(el){
      if(el.classList.contains('msi'))return;
      if(el.querySelector('.msi'))return;
      if(el.childElementCount>0)return;
      if(TEXT_TAGS.has(el.tagName))return;
      if(el.parentElement&&TEXT_TAGS.has(el.parentElement.tagName))return;
      var t=el.textContent.trim();
      if(t&&ICON_SET.has(t)&&t===el.textContent.trim()){
        var sp=document.createElement('span');sp.className='msi';sp.textContent=t;
        el.textContent='';el.appendChild(sp);
      }
    });
  }
  document.addEventListener('DOMContentLoaded',function(){
    fixContainers(document.getElementById('app')||document.body);
    document.fonts.ready.then(function(){
      document.querySelectorAll('.msi').forEach(function(el){
        el.style.visibility='hidden';el.offsetHeight;el.style.visibility='';
      });
    });
  });
})();
`.trim()

export function buildArtboardDoc(html: string, css: string = '', editMode: boolean = false): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
<style>
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #FFFFFF;
  color: #202020;
  font-family: "Switzer", "Segoe UI", Roboto, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#app {
  width: 100%;
  height: 100%;
  overflow: auto;
}
${DESIGN_SYSTEM_CSS}
${css}
</style>
</head>
<body>
<div id="app">${html}</div>
<script>${ICON_SCRIPT}</script>
${editMode ? `<script>${EDIT_SCRIPT}</script>` : ''}
</body>
</html>`
}

const EDIT_SCRIPT = `
(function() {
  var style = document.createElement('style');
  style.textContent = '* { cursor: default !important; } [contenteditable="true"] { cursor: text !important; outline: 2px solid #0A3EFF !important; outline-offset: 1px; min-width: 20px; min-height: 1em; }';
  document.head.appendChild(style);

  var selected = null;
  var hovered = null;
  var overlay = null;
  var hoverOverlay = null;
  var editing = false;

  function createOverlay(id, color, w) {
    var el = document.createElement('div');
    el.id = id;
    el.style.cssText = 'position:absolute;pointer-events:none;z-index:99990;border:' + w + 'px solid ' + color + ';transition:top 60ms ease,left 60ms ease,width 60ms ease,height 60ms ease;display:none;box-sizing:border-box;';
    document.body.appendChild(el);
    return el;
  }
  overlay = createOverlay('__edit-sel', '#0A3EFF', 2);
  hoverOverlay = createOverlay('__edit-hov', 'rgba(10,62,255,0.25)', 1);

  var typeLabel = document.createElement('div');
  typeLabel.id = '__edit-label';
  typeLabel.style.cssText = 'position:absolute;z-index:99991;display:none;background:#0A3EFF;color:#fff;font-size:9px;font-weight:600;font-family:system-ui,sans-serif;padding:1px 5px;line-height:1.4;pointer-events:none;white-space:nowrap;';
  document.body.appendChild(typeLabel);

  function isEditable(el) {
    if (!el || el === document.body || el === document.documentElement) return false;
    if (el.id === 'app') return false;
    if (el.id && el.id.startsWith('__edit')) return false;
    var cur = el;
    while (cur) { if (cur.id && cur.id.startsWith('__edit')) return false; cur = cur.parentElement; }
    return true;
  }

  function getPath(el) {
    var parts = [];
    var cur = el;
    while (cur && cur !== document.body) {
      var tag = cur.tagName.toLowerCase();
      if (cur.id && !cur.id.startsWith('__')) { parts.unshift(tag + '#' + cur.id); break; }
      var parent = cur.parentElement;
      if (parent) { var idx = Array.from(parent.children).indexOf(cur); parts.unshift(tag + ':nth-child(' + (idx + 1) + ')'); }
      else parts.unshift(tag);
      cur = parent;
    }
    return parts.join(' > ');
  }

  function getElementInfo(el) {
    if (!el) return null;
    var cs = window.getComputedStyle(el);
    var rect = el.getBoundingClientRect();
    return {
      path: getPath(el), tag: el.tagName.toLowerCase(), classes: el.className || '',
      text: (el.childNodes.length <= 1 && (!el.childNodes[0] || el.childNodes[0].nodeType === 3)) ? (el.textContent || '') : null,
      hasChildren: el.children.length > 0,
      rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
      styles: { color: cs.color, backgroundColor: cs.backgroundColor, fontSize: cs.fontSize, fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, padding: cs.padding, margin: cs.margin,
        borderRadius: cs.borderRadius, gap: cs.gap, textAlign: cs.textAlign, display: cs.display,
        width: cs.width, height: cs.height, opacity: cs.opacity, border: cs.border }
    };
  }

  function posOverlay(ov, el) {
    if (!el) { ov.style.display = 'none'; return; }
    var r = el.getBoundingClientRect();
    var sx = window.scrollX || 0, sy = window.scrollY || 0;
    ov.style.display = 'block';
    ov.style.left = (r.left + sx - 2) + 'px'; ov.style.top = (r.top + sy - 2) + 'px';
    ov.style.width = (r.width + 4) + 'px'; ov.style.height = (r.height + 4) + 'px';
  }

  function selectElement(el) {
    if (editing) stopEditing();
    selected = el;
    if (!el) { overlay.style.display = 'none'; typeLabel.style.display = 'none'; sendMsg('select', null); return; }
    posOverlay(overlay, el);
    var r = el.getBoundingClientRect();
    typeLabel.style.display = 'block';
    typeLabel.textContent = el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '');
    typeLabel.style.left = (r.left + (window.scrollX||0)) + 'px';
    typeLabel.style.top = (r.top + (window.scrollY||0) - 18) + 'px';
    sendMsg('select', getElementInfo(el));
  }

  function startEditing() {
    if (!selected || selected.children.length > 0) return;
    editing = true;
    selected.setAttribute('contenteditable', 'true');
    selected.focus();
    try { var range = document.createRange(); range.selectNodeContents(selected); var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range); } catch(e){}
  }

  function stopEditing() {
    if (!editing || !selected) return;
    editing = false;
    selected.removeAttribute('contenteditable');
    selected.blur();
    sendMsg('textChanged', { path: getPath(selected), text: selected.textContent });
    sendCurrentHtml();
    sendMsg('select', getElementInfo(selected));
  }

  function sendCurrentHtml() {
    var app = document.getElementById('app');
    if (app) sendMsg('htmlUpdated', { html: app.innerHTML });
  }

  function sendMsg(type, data) {
    try { window.parent.postMessage({ source: 'designer-edit', type: type, data: data }, '*'); } catch(e){}
  }

  document.addEventListener('click', function(e) {
    var t = e.target;
    if (t.id && t.id.startsWith('__edit')) return;
    var p = t; while (p) { if (p.id && p.id.startsWith('__edit')) return; p = p.parentElement; }
    e.preventDefault(); e.stopPropagation();
    if (!isEditable(t)) { selectElement(null); return; }
    if (selected === t && !editing) { startEditing(); return; }
    selectElement(t);
  }, true);

  document.addEventListener('mousemove', function(e) {
    if (editing) return;
    var t = e.target;
    if (!isEditable(t) || t === selected) { if (hovered) { hoverOverlay.style.display = 'none'; hovered = null; } return; }
    if (t !== hovered) { hovered = t; posOverlay(hoverOverlay, t); }
  }, true);

  document.addEventListener('keydown', function(e) {
    if (editing) { if (e.key === 'Escape') { stopEditing(); e.preventDefault(); } if (e.key === 'Enter' && !e.shiftKey) { stopEditing(); e.preventDefault(); } return; }
    if (e.key === 'Escape' && selected) { selectElement(null); e.preventDefault(); }
    if ((e.key === 'Delete' || e.key === 'Backspace') && selected && !editing) { e.preventDefault(); var rm = selected; selectElement(null); rm.remove(); sendCurrentHtml(); }
  }, true);

  document.addEventListener('submit', function(e) { e.preventDefault(); }, true);

  window.addEventListener('message', function(e) {
    if (!e.data || e.data.source !== 'designer-host') return;
    var cmd = e.data;
    if (cmd.type === 'updateStyle' && selected) { selected.style[cmd.data.property] = cmd.data.value; posOverlay(overlay, selected); sendMsg('select', getElementInfo(selected)); sendCurrentHtml(); }
    if (cmd.type === 'updateText' && selected) { selected.textContent = cmd.data.text; posOverlay(overlay, selected); sendMsg('select', getElementInfo(selected)); sendCurrentHtml(); }
    if (cmd.type === 'deselect') selectElement(null);
    if (cmd.type === 'getHtml') sendCurrentHtml();
  });

  var appEl = document.getElementById('app');
  if (appEl) appEl.addEventListener('scroll', function() { if (selected) { posOverlay(overlay, selected); } if (hovered) posOverlay(hoverOverlay, hovered); });
  window.addEventListener('scroll', function() { if (selected) { posOverlay(overlay, selected); } if (hovered) posOverlay(hoverOverlay, hovered); });

  sendMsg('ready', {});
})();
`.trim()
