figma.showUI(__html__, { width: 460, height: 580 });

// ── Color helpers ──
function hexToRgb(hex) {
  if (!hex || hex.charAt(0) !== "#") return null;
  hex = hex.slice(1);
  if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  if (hex.length === 8) hex = hex.slice(0, 6);
  return {
    r: parseInt(hex.slice(0,2),16)/255,
    g: parseInt(hex.slice(2,4),16)/255,
    b: parseInt(hex.slice(4,6),16)/255
  };
}

function parseColor(str) {
  if (!str) return null;
  str = str.trim();
  if (str === "transparent" || str === "none") return null;
  if (str.charAt(0) === "#") {
    var c = hexToRgb(str);
    return c ? { color: c, opacity: 1 } : null;
  }
  var m = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/);
  if (m) {
    var r = parseFloat(m[1]), g = parseFloat(m[2]), b = parseFloat(m[3]);
    if (r > 1) r /= 255;
    if (g > 1) g /= 255;
    if (b > 1) b /= 255;
    return { color: { r: r, g: g, b: b }, opacity: m[4] !== undefined ? parseFloat(m[4]) : 1 };
  }
  return null;
}

function rgbToHex(r, g, b) {
  function ch(v) { var h = Math.round(v * 255).toString(16); return h.length === 1 ? "0" + h : h; }
  return "#" + ch(r) + ch(g) + ch(b);
}

function colorStrToHex(str) {
  if (!str) return null;
  var p = parseColor(str);
  if (!p) return null;
  return rgbToHex(p.color.r, p.color.g, p.color.b).toLowerCase();
}

// ── Design system style lookup ──
var textStyleByKey = {};
var textStyleBySize = {};
var paintStyleByHex = {};

function styleWeightClass(fontStyle) {
  var s = (fontStyle || "").toLowerCase();
  if (s.indexOf("bold") > -1 || s.indexOf("heavy") > -1 || s.indexOf("black") > -1) return 700;
  if (s.indexOf("semibold") > -1 || s.indexOf("medium") > -1 || s.indexOf("demi") > -1) return 500;
  return 400;
}

function loadDesignSystem() {
  try {
    var ts = figma.getLocalTextStyles();
    for (var i = 0; i < ts.length; i++) {
      var s = ts[i];
      var sz = s.fontSize;
      var wc = styleWeightClass(s.fontName ? s.fontName.style : "");
      var key = sz + "_" + wc;
      if (!textStyleByKey[key]) textStyleByKey[key] = s;
      if (!textStyleBySize[sz]) textStyleBySize[sz] = s;
    }
  } catch(e) {}
  try {
    var ps = figma.getLocalPaintStyles();
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      if (p.paints && p.paints.length === 1 && p.paints[0].type === "SOLID") {
        var c = p.paints[0].color;
        var h = rgbToHex(c.r, c.g, c.b).toLowerCase();
        if (!paintStyleByHex[h]) paintStyleByHex[h] = p;
      }
    }
  } catch(e) {}
}

function findTextStyle(fontSize, fontWeight) {
  var w = parseInt(String(fontWeight)) || 400;
  if (String(fontWeight) === "bold") w = 700;
  var wc = w >= 600 ? 700 : w >= 450 ? 500 : 400;
  var exact = textStyleByKey[fontSize + "_" + wc];
  if (exact) return exact;
  if (wc === 700) exact = textStyleByKey[fontSize + "_500"] || textStyleByKey[fontSize + "_400"];
  if (wc === 500) exact = textStyleByKey[fontSize + "_400"] || textStyleByKey[fontSize + "_700"];
  if (exact) return exact;
  return textStyleBySize[fontSize] || null;
}

function findPaintStyle(hexColor) {
  if (!hexColor) return null;
  var key = hexColor.toLowerCase();
  if (paintStyleByHex[key]) return paintStyleByHex[key];
  var r1 = parseInt(key.slice(1,3), 16);
  var g1 = parseInt(key.slice(3,5), 16);
  var b1 = parseInt(key.slice(5,7), 16);
  var bestStyle = null;
  var bestDist = 25;
  for (var h in paintStyleByHex) {
    var r2 = parseInt(h.slice(1,3), 16);
    var g2 = parseInt(h.slice(3,5), 16);
    var b2 = parseInt(h.slice(5,7), 16);
    var dist = Math.sqrt((r1-r2)*(r1-r2) + (g1-g2)*(g1-g2) + (b1-b2)*(b1-b2));
    if (dist < bestDist) { bestDist = dist; bestStyle = paintStyleByHex[h]; }
  }
  return bestStyle;
}

// ── Font loading ──
var loadedFonts = {};

async function loadFont(family, style) {
  var key = family + ":" + style;
  if (loadedFonts[key]) return true;
  try {
    await figma.loadFontAsync({ family: family, style: style });
    loadedFonts[key] = true;
    return true;
  } catch (e) {
    return false;
  }
}

async function ensureFont(weight) {
  var w = parseInt(weight) || 400;
  if (weight === "bold") w = 700;
  var style = w >= 700 ? "Bold" : w >= 500 ? "Medium" : "Regular";
  if (await loadFont("Switzer", style)) return { family: "Switzer", style: style };
  if (await loadFont("Inter", style)) return { family: "Inter", style: style };
  if (await loadFont("Inter", "Regular")) return { family: "Inter", style: "Regular" };
  await loadFont("Roboto", "Regular");
  return { family: "Roboto", style: "Regular" };
}

// ── Lucide Icon Library ──
var ICONS = {
  "home": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  "user": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  "file-text": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  "scan-barcode": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="8" x2="7" y2="16"/><line x1="11" y1="8" x2="11" y2="16"/><line x1="15" y1="8" x2="15" y2="12"/><line x1="19" y1="8" x2="19" y2="16"/></svg>',
  "settings": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  "menu": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  "chevron-right": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B5B5B5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  "chevron-left": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
  "x": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  "check": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  "plus": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  "minus": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  "alert-circle": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E64059" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  "wifi": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>',
  "signal": '<svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="3" width="3" height="9" rx="1" fill="#1A1B1E"/><rect x="4.5" y="2" width="3" height="10" rx="1" fill="#1A1B1E"/><rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="#1A1B1E"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#1A1B1E"/></svg>',
  "battery": '<svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0" y="0.5" width="22" height="11" rx="2" stroke="#1A1B1E"/><rect x="1.5" y="2" width="18" height="8" rx="1" fill="#1A1B1E"/><rect x="23" y="3.5" width="2" height="5" rx="1" fill="#1A1B1E"/></svg>',
  "log-out": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E64059" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  "sun": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  "eye": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#878787" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  "eye-off": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#878787" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
  "lock": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  "search": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  "arrow-left": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  "camera": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  "microsoft": '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="1" y="1" width="8.5" height="8.5" fill="#F25022"/><rect x="10.5" y="1" width="8.5" height="8.5" fill="#7FBA00"/><rect x="1" y="10.5" width="8.5" height="8.5" fill="#00A4EF"/><rect x="10.5" y="10.5" width="8.5" height="8.5" fill="#FFB900"/></svg>',
  "face-id": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="9" cy="10" r="0.5" fill="#202020"/><circle cx="15" cy="10" r="0.5" fill="#202020"/><path d="M9.5 15a3.5 3.5 0 0 0 5 0"/></svg>',
  "cloud-off": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E64059" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
  "clipboard-list": '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><line x1="12" y1="11" x2="16" y2="11"/><line x1="12" y1="16" x2="16" y2="16"/><line x1="8" y1="11" x2="8.01" y2="11"/><line x1="8" y1="16" x2="8.01" y2="16"/></svg>'
};

// Material Symbols to Lucide icon mapping
var MATERIAL_TO_LUCIDE = {
  "arrow_back": "arrow-left", "close": "x", "check": "check", "more_vert": "menu",
  "more_horiz": "menu", "menu": "menu", "search": "search", "chevron_right": "chevron-right",
  "chevron_left": "chevron-left", "notifications": "alert-circle", "account_circle": "user",
  "person": "user", "person_outline": "user", "settings": "settings", "home": "home",
  "visibility": "eye", "visibility_off": "eye-off", "lock": "lock", "lock_open": "lock",
  "wifi": "wifi", "wifi_off": "cloud-off", "edit": "file-text", "delete": "x",
  "add": "plus", "remove": "minus", "done": "check", "clear": "x",
  "navigate_next": "chevron-right", "navigate_before": "chevron-left",
  "qr_code": "scan-barcode", "barcode": "scan-barcode", "local_shipping": "clipboard-list",
  "inventory_2": "clipboard-list", "assignment": "file-text", "schedule": "settings",
  "calendar_today": "settings", "check_circle": "check", "cancel": "x",
  "warning": "alert-circle", "error": "alert-circle", "info": "alert-circle",
  "sync": "settings", "refresh": "settings", "camera": "camera",
  "arrow_forward": "chevron-right", "expand_more": "chevron-right", "expand_less": "chevron-left",
  "star": "check", "star_border": "check",
};

function findIcon(name) {
  if (!name) return null;
  var n = name.toLowerCase().replace(/[^a-z0-9_]/g, " ").trim();

  // Check Material Symbols mapping first
  var mapped = MATERIAL_TO_LUCIDE[n] || MATERIAL_TO_LUCIDE[n.replace(/ /g, "_")];
  if (mapped && ICONS[mapped]) return mapped;

  // Direct match in Lucide library
  for (var key in ICONS) {
    if (n.indexOf(key.replace(/-/g, " ")) > -1 || n.indexOf(key) > -1) return key;
  }
  // Keyword matching
  if (n.indexOf("home") > -1) return "home";
  if (n.indexOf("person") > -1 || n.indexOf("user") > -1 || n.indexOf("profile") > -1) return "user";
  if (n.indexOf("form") > -1 || n.indexOf("document") > -1 || n.indexOf("file") > -1) return "file-text";
  if (n.indexOf("barcode") > -1 || n.indexOf("scan") > -1 || n.indexOf("qr") > -1) return "scan-barcode";
  if (n.indexOf("setting") > -1 || n.indexOf("gear") > -1 || n.indexOf("cog") > -1) return "settings";
  if (n.indexOf("menu") > -1 || n.indexOf("hamburger") > -1) return "menu";
  if (n.indexOf("close") > -1 || n.indexOf("dismiss") > -1 || n.indexOf("cancel") > -1) return "x";
  if (n.indexOf("check") > -1 || n.indexOf("confirm") > -1 || n.indexOf("done") > -1) return "check";
  if (n.indexOf("error") > -1 || n.indexOf("alert") > -1 || n.indexOf("warning") > -1) return "alert-circle";
  if (n.indexOf("search") > -1 || n.indexOf("find") > -1) return "search";
  if (n.indexOf("back") > -1 || n.indexOf("arrow left") > -1) return "arrow-left";
  if (n.indexOf("next") > -1 || n.indexOf("forward") > -1 || n.indexOf("chevron right") > -1) return "chevron-right";
  if (n.indexOf("eye") > -1 || n.indexOf("visible") > -1 || n.indexOf("password") > -1) return "eye";
  if (n.indexOf("lock") > -1 || n.indexOf("secure") > -1) return "lock";
  if (n.indexOf("camera") > -1 || n.indexOf("photo") > -1) return "camera";
  if (n.indexOf("wifi") > -1 || n.indexOf("wireless") > -1) return "wifi";
  if (n.indexOf("signal") > -1 || n.indexOf("cellular") > -1) return "signal";
  if (n.indexOf("battery") > -1) return "battery";
  if (n.indexOf("logout") > -1 || n.indexOf("sign out") > -1) return "log-out";
  if (n.indexOf("sun") > -1 || n.indexOf("bright") > -1) return "sun";
  if (n.indexOf("offline") > -1 || n.indexOf("cloud") > -1 || n.indexOf("disconnect") > -1) return "cloud-off";
  if (n.indexOf("clipboard") > -1 || n.indexOf("list") > -1 || n.indexOf("task") > -1) return "clipboard-list";
  return null;
}

// ══════════════════════════════════════════════
// CSS → Figma AUTO-LAYOUT Mapping
// ══════════════════════════════════════════════

function mapJustifyToFigma(val) {
  if (!val) return "MIN";
  if (val === "center") return "CENTER";
  if (val === "end" || val === "flex-end") return "MAX";
  if (val === "space-between") return "SPACE_BETWEEN";
  return "MIN";
}

function mapAlignToFigma(val) {
  if (!val) return "MIN";
  if (val === "center") return "CENTER";
  if (val === "end" || val === "flex-end") return "MAX";
  return "MIN";
}

function applyFillColor(frame, colorStr) {
  if (!colorStr) { frame.fills = []; return; }
  var hexColor = colorStrToHex(colorStr);
  var ps = hexColor ? findPaintStyle(hexColor) : null;
  if (ps) {
    try { frame.fillStyleId = ps.id; return; } catch(e) {}
  }
  var fill = parseColor(colorStr);
  if (fill) {
    frame.fills = [{ type: "SOLID", color: fill.color, opacity: fill.opacity }];
  } else {
    frame.fills = [];
  }
}

function applyBorder(frame, node) {
  if (!node.border) return;
  var bc = parseColor(node.border.color);
  if (!bc) return;
  var hexColor = colorStrToHex(node.border.color);
  var ps = hexColor ? findPaintStyle(hexColor) : null;
  if (ps) {
    try { frame.strokeStyleId = ps.id; } catch(e) {
      frame.strokes = [{ type: "SOLID", color: bc.color, opacity: bc.opacity }];
    }
  } else {
    frame.strokes = [{ type: "SOLID", color: bc.color, opacity: bc.opacity }];
  }
  frame.strokeWeight = node.border.width || 1;
  frame.strokeAlign = "INSIDE";
}

function applyAutoLayout(frame, node) {
  frame.layoutMode = node.layout === "column" ? "VERTICAL" : "HORIZONTAL";
  frame.itemSpacing = node.gap || 0;

  // Padding
  var p = node.padding;
  if (p) {
    if (Array.isArray(p)) {
      frame.paddingTop = p[0] || 0;
      frame.paddingRight = p[1] || 0;
      frame.paddingBottom = p[2] || 0;
      frame.paddingLeft = p[3] || 0;
    } else if (typeof p === "number") {
      frame.paddingTop = frame.paddingRight = frame.paddingBottom = frame.paddingLeft = p;
    }
  }

  // Alignment
  frame.primaryAxisAlignItems = mapJustifyToFigma(node.justifyContent);
  frame.counterAxisAlignItems = mapAlignToFigma(node.alignItems);

  // HUG children by default — auto-layout sizes to fit content.
  // Only the root frame overrides this to FIXED after calling applyAutoLayout.
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";

  // Wrap
  if (node.wrap) {
    try { frame.layoutWrap = "WRAP"; } catch(e) {}
  }
}

function isAutoLayoutParent(parent) {
  return !!parent && (parent.layoutMode === "HORIZONTAL" || parent.layoutMode === "VERTICAL");
}

function isAbsolutePositioning(node) {
  return !!node && (node.positioning === "absolute" || node.positioning === "fixed");
}

function appendNode(parent, child, node) {
  parent.appendChild(child);
  var absoluteInAutoLayout = false;

  if (isAutoLayoutParent(parent) && isAbsolutePositioning(node)) {
    try {
      child.layoutPositioning = "ABSOLUTE";
      absoluteInAutoLayout = true;
    } catch(e) {}
  }

  if (!isAutoLayoutParent(parent) || absoluteInAutoLayout) {
    child.x = node && typeof node.x === "number" ? node.x : 0;
    child.y = node && typeof node.y === "number" ? node.y : 0;
  }

  return absoluteInAutoLayout;
}

function applyChildSizing(frame, node, parent) {
  if (!isAutoLayoutParent(parent) || isAbsolutePositioning(node)) return;
  try {
    // Standard flex child behavior: FILL cross-axis, HUG main-axis
    if (parent.layoutMode === "VERTICAL") {
      // Column parent -> children fill width, hug height
      frame.layoutSizingHorizontal = node.preserveWidth ? "FIXED" : "FILL";
      frame.layoutSizingVertical = node.preserveHeight ? "FIXED" : "HUG";
    } else {
      // Row parent -> children hug width, fill height
      frame.layoutSizingHorizontal = node.preserveWidth ? "FIXED" : "HUG";
      frame.layoutSizingVertical = node.preserveHeight ? "FIXED" : "FILL";
    }

    if (node.flexGrow >= 1) {
      frame.layoutGrow = 1;
      if (parent.layoutMode === "VERTICAL") frame.layoutSizingVertical = "FILL";
      else frame.layoutSizingHorizontal = "FILL";
    }
  } catch(e) {}
}

function applyTextLayoutSizing(text, node, parent) {
  var autoLayoutParent = isAutoLayoutParent(parent) && !isAbsolutePositioning(node);

  if (!autoLayoutParent) {
    // No auto-layout parent: use measured dimensions
    text.textAutoResize = "WIDTH_AND_HEIGHT";
    return;
  }

  try {
    if (parent.layoutMode === "VERTICAL") {
      // Column parent -> text fills width (wraps to container), hugs height
      text.textAutoResize = "HEIGHT";
      text.layoutSizingHorizontal = "FILL";
      text.layoutSizingVertical = "HUG";
    } else {
      // Row parent -> text hugs both axes (natural inline size)
      text.textAutoResize = "WIDTH_AND_HEIGHT";
      text.layoutSizingHorizontal = "HUG";
      text.layoutSizingVertical = "HUG";
    }

    if (node.flexGrow >= 1) {
      text.layoutGrow = 1;
      if (parent.layoutMode === "HORIZONTAL") {
        text.layoutSizingHorizontal = "FILL";
        text.textAutoResize = "HEIGHT";
      } else {
        text.layoutSizingVertical = "FILL";
      }
    }
  } catch(e) {}
}

// ══════════════════════════════════════════════
// RECURSIVE TREE BUILDER (auto-layout aware)
// ══════════════════════════════════════════════

async function buildFromTree(data) {
  loadDesignSystem();

  var tree = data.tree;
  if (!tree) {
    figma.ui.postMessage({ type: "error", message: "No tree data received" });
    return null;
  }

  // Pre-load common fonts
  await ensureFont("400");
  await ensureFont("500");
  await ensureFont("700");

  // Create root frame from tree root
  var root = figma.createFrame();
  root.name = tree.name || "Imported Screen";
  root.resize(data.width || tree.w || 390, data.height || tree.h || 844);
  root.clipsContent = true;

  // Root fill
  if (tree.fill) {
    applyFillColor(root, tree.fill);
  } else {
    var bg = parseColor(data.background || "#FFFFFF");
    root.fills = [{ type: "SOLID", color: bg ? bg.color : { r: 1, g: 1, b: 1 }, opacity: bg ? bg.opacity : 1 }];
  }

  // Root border
  if (tree.border) applyBorder(root, tree);
  if (tree.radius) root.cornerRadius = tree.radius;

  // Root auto-layout
  if (tree.layout) {
    applyAutoLayout(root, tree);
    // Override: root frame stays FIXED at screen dimensions (not HUG)
    root.primaryAxisSizingMode = "FIXED";
    root.counterAxisSizingMode = "FIXED";
  }

  // Process children
  if (tree.children && tree.children.length > 0) {
    for (var i = 0; i < tree.children.length; i++) {
      await processNode(tree.children[i], root);
    }
  }

  return root;
}

async function processNode(node, parent) {
  if (!node) return null;

  var type = node.nodeType || "frame";

  switch (type) {
    case "text":
      return await createTextNode(node, parent);
    case "icon":
      return createIconNode(node, parent);
    case "divider":
      return createDividerNode(node, parent);
    case "image":
      return createImageNode(node, parent);
    case "svg":
      return createSvgNode(node, parent);
    default:
      return await createFrameNode(node, parent);
  }
}

async function createFrameNode(node, parent) {
  var frame = figma.createFrame();
  frame.name = node.name || "Frame";
  frame.resize(Math.max(node.w || 1, 1), Math.max(node.h || 1, 1));

  // Fill
  if (node.fill) {
    applyFillColor(frame, node.fill);
  } else {
    frame.fills = [];
  }

  // Border
  if (node.border) applyBorder(frame, node);

  // Corner radius
  if (node.radius) frame.cornerRadius = node.radius;

  // Opacity
  if (node.opacity !== undefined && node.opacity !== null && node.opacity < 1) {
    frame.opacity = node.opacity;
  }

  // Clips content
  frame.clipsContent = !!node.clipsContent;

  // Auto-layout
  if (node.layout === "row" || node.layout === "column") {
    applyAutoLayout(frame, node);
  }

  appendNode(parent, frame, node);
  applyChildSizing(frame, node, parent);

  // Process children
  if (node.children && node.children.length > 0) {
    for (var i = 0; i < node.children.length; i++) {
      await processNode(node.children[i], frame);
    }
  }

  return frame;
}

async function createTextNode(node, parent) {
  var fontSize = node.fontSize || 14;
  var fontWeight = node.fontWeight || "400";
  var content = node.content || "";
  if (!content) return null;

  var fontInfo;
  fontInfo = await ensureFont(String(fontWeight));

  var text = figma.createText();
  text.fontName = fontInfo;
  text.characters = content;
  text.fontSize = fontSize;

  if (node.lineHeight && !isNaN(node.lineHeight) && node.lineHeight > 0) {
    text.lineHeight = { value: node.lineHeight, unit: "PIXELS" };
  }

  // Letter spacing — DOM walker returns computed pixels (e.g. -0.32px from -0.02em)
  if (node.letterSpacing && Math.abs(node.letterSpacing) > 0.001) {
    text.letterSpacing = { value: node.letterSpacing, unit: "PIXELS" };
  }

  // Color
  var col = parseColor(node.color);
  if (col) {
    text.fills = [{ type: "SOLID", color: col.color, opacity: col.opacity }];
  }

  // Alignment
  var align = node.textAlign || "left";
  if (align === "center") text.textAlignHorizontal = "CENTER";
  else if (align === "right" || align === "end") text.textAlignHorizontal = "RIGHT";

  // Opacity
  if (node.opacity !== undefined && node.opacity !== null && node.opacity < 1) {
    text.opacity = node.opacity;
  }

  // Name
  text.name = content.slice(0, 40);

  appendNode(parent, text, node);
  applyTextLayoutSizing(text, node, parent);

  return text;
}

function createIconNode(node, parent) {
  var iconName = node.icon || node.name || "";
  var iconKey = findIcon(iconName);
  var svgStr = iconKey ? ICONS[iconKey] : null;
  var size = node.iconSize || node.w || 24;
  var color = node.iconColor || node.color || "#202020";

  if (svgStr) {
    // Replace stroke color
    if (color) {
      svgStr = svgStr.replace(/stroke="[^"]*"/g, 'stroke="' + color + '"');
    }
    if (size !== 24) {
      svgStr = svgStr.replace(/width="\d+"/, 'width="' + size + '"').replace(/height="\d+"/, 'height="' + size + '"');
    }
    try {
      var svgNode = figma.createNodeFromSvg(svgStr);
      svgNode.name = iconName || iconKey || "Icon";
      if (size !== 24) svgNode.resize(size, size);
      appendNode(parent, svgNode, node);
      if (isAutoLayoutParent(parent) && !isAbsolutePositioning(node)) {
        try {
          svgNode.layoutSizingHorizontal = "FIXED";
          svgNode.layoutSizingVertical = "FIXED";
        } catch(e) {}
      }
      return svgNode;
    } catch (e) {}
  }

  // Fallback: gray placeholder
  var frame = figma.createFrame();
  frame.resize(size, size);
  frame.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 }, opacity: 1 }];
  frame.name = iconName || "Icon";
  appendNode(parent, frame, node);
  if (isAutoLayoutParent(parent) && !isAbsolutePositioning(node)) {
    try {
      frame.layoutSizingHorizontal = "FIXED";
      frame.layoutSizingVertical = "FIXED";
    } catch(e) {}
  }
  return frame;
}

function createDividerNode(node, parent) {
  var line = figma.createFrame();
  var w = Math.max(node.w || 1, 1);
  var h = Math.max(node.h || 1, 1);
  line.resize(w, h);

  var colorStr = node.fill || node.color || "#E2E2E2";
  applyFillColor(line, colorStr);
  line.name = node.name || "Divider";
  appendNode(parent, line, node);

  // In auto-layout, divider should fill cross-axis
  if (isAutoLayoutParent(parent) && !isAbsolutePositioning(node)) {
    try {
      if (parent.layoutMode === "VERTICAL") {
        line.layoutSizingHorizontal = "FILL";
        line.layoutSizingVertical = "FIXED";
      } else {
        line.layoutSizingHorizontal = "FIXED";
        line.layoutSizingVertical = "FILL";
      }
    } catch(e) {}
  }

  return line;
}

function createImageNode(node, parent) {
  var frame = figma.createFrame();
  frame.resize(Math.max(node.w || 100, 1), Math.max(node.h || 80, 1));
  frame.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.96 }, opacity: 1 }];
  frame.name = (node.name || "Image").slice(0, 40);
  appendNode(parent, frame, node);
  if (isAutoLayoutParent(parent) && !isAbsolutePositioning(node)) {
    try {
      frame.layoutSizingHorizontal = "FIXED";
      frame.layoutSizingVertical = "FIXED";
    } catch(e) {}
  }
  return frame;
}

function createSvgNode(node, parent) {
  // Always delegate to Lucide icon library — never render raw SVG
  return createIconNode({
    name: node.name || "icon",
    icon: node.name || node.icon || "icon",
    iconSize: node.w || 24,
    iconColor: node.iconColor || node.color || "#202020",
    w: node.w || 24,
    h: node.h || 24,
    x: node.x,
    y: node.y,
    flexGrow: node.flexGrow,
    positioning: node.positioning,
    cssOrder: node.cssOrder
  }, parent);
}

// ══════════════════════════════════════════════
// LEGACY: Flat JSON builder (backward compat)
// ══════════════════════════════════════════════

async function buildFromJson(data) {
  loadDesignSystem();
  var root = figma.createFrame();
  root.name = "Imported Screen";
  root.resize(data.width || 390, data.height || 844);
  root.clipsContent = true;
  var bg = parseColor(data.background);
  if (bg) {
    root.fills = [{ type: "SOLID", color: bg.color, opacity: bg.opacity }];
  } else {
    root.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 1 }];
  }
  var elements = data.elements || [];
  for (var i = 0; i < elements.length; i++) {
    var el = elements[i];
    if (!el || !el.type) continue;
    try {
      if (el.type === "text") await createLegacyText(el, root);
      else if (el.type === "rect") createLegacyRect(el, root);
      else if (el.type === "circle") createLegacyCircle(el, root);
      else if (el.type === "line") createLegacyLine(el, root);
      else if (el.type === "icon") createLegacyIcon(el, root);
    } catch (e) {}
  }
  return root;
}

async function createLegacyText(el, parent) {
  var fontSize = el.fontSize || 14;
  var fontWeight = el.fontWeight || 400;
  var ts = findTextStyle(fontSize, fontWeight);
  var fontInfo;
  if (ts && ts.fontName) {
    await loadFont(ts.fontName.family, ts.fontName.style);
    fontInfo = ts.fontName;
  } else {
    fontInfo = await ensureFont(String(fontWeight));
  }
  var text = figma.createText();
  text.fontName = fontInfo;
  text.characters = el.content || "";
  text.fontSize = fontSize;
  if (ts) { try { text.textStyleId = ts.id; } catch(e) {} }
  if (!ts && el.lineHeight) { text.lineHeight = { value: el.lineHeight, unit: "PIXELS" }; }
  if (!ts && el.letterSpacing && Math.abs(el.letterSpacing) > 0.001) {
    text.letterSpacing = { value: el.letterSpacing, unit: "PIXELS" };
  }
  var col = parseColor(el.color);
  if (col) text.fills = [{ type: "SOLID", color: col.color, opacity: col.opacity }];
  if (el.align === "center") text.textAlignHorizontal = "CENTER";
  else if (el.align === "right") text.textAlignHorizontal = "RIGHT";
  text.textAutoResize = "WIDTH_AND_HEIGHT";
  if (el.opacity !== undefined && el.opacity !== 1) text.opacity = el.opacity;
  text.name = (el.content || "Text").slice(0, 40);
  text.x = el.x || 0;
  text.y = el.y || 0;
  parent.appendChild(text);
  var colorHex = colorStrToHex(el.color);
  var ps = colorHex ? findPaintStyle(colorHex) : null;
  if (ps) { try { text.fillStyleId = ps.id; } catch(e) {} }
  return text;
}

function createLegacyRect(el, parent) {
  var frame = figma.createFrame();
  frame.resize(Math.max(el.w || 1, 1), Math.max(el.h || 1, 1));
  var fillHex = colorStrToHex(el.fill);
  var fillPs = fillHex ? findPaintStyle(fillHex) : null;
  if (fillPs) { try { frame.fillStyleId = fillPs.id; } catch(e) { var fill = parseColor(el.fill); if (fill) frame.fills = [{ type: "SOLID", color: fill.color, opacity: fill.opacity }]; } }
  else { var fill = parseColor(el.fill); if (fill) frame.fills = [{ type: "SOLID", color: fill.color, opacity: fill.opacity }]; else frame.fills = []; }
  if (el.radius !== undefined) frame.cornerRadius = el.radius;
  if (el.border) {
    var bc = parseColor(el.borderColor || el.border);
    if (bc) { frame.strokes = [{ type: "SOLID", color: bc.color, opacity: bc.opacity }]; }
    frame.strokeWeight = el.borderWidth || 1;
    frame.strokeAlign = "INSIDE";
  }
  if (el.opacity !== undefined && el.opacity !== 1) frame.opacity = el.opacity;
  frame.name = el.name || "Rectangle";
  frame.x = el.x || 0;
  frame.y = el.y || 0;
  parent.appendChild(frame);
  return frame;
}

function createLegacyCircle(el, parent) {
  var ellipse = figma.createEllipse();
  var d = el.diameter || el.d || 10;
  ellipse.resize(d, d);
  var fill = parseColor(el.fill);
  if (fill) ellipse.fills = [{ type: "SOLID", color: fill.color, opacity: fill.opacity }];
  ellipse.name = el.name || "Circle";
  ellipse.x = el.x || 0;
  ellipse.y = el.y || 0;
  parent.appendChild(ellipse);
  return ellipse;
}

function createLegacyLine(el, parent) {
  var line = figma.createFrame();
  line.resize(Math.max(el.w || 1, 1), Math.max(el.h || 1, 1));
  var fill = parseColor(el.color || "#E2E2E2");
  if (fill) line.fills = [{ type: "SOLID", color: fill.color, opacity: fill.opacity }];
  line.name = el.name || "Divider";
  line.x = el.x || 0;
  line.y = el.y || 0;
  parent.appendChild(line);
  return line;
}

function createLegacyIcon(el, parent) {
  var iconKey = findIcon(el.icon || el.name || "");
  var svgStr = iconKey ? ICONS[iconKey] : null;
  if (svgStr) {
    if (el.color) svgStr = svgStr.replace(/stroke="[^"]*"/g, 'stroke="' + el.color + '"');
    var size = el.size || 24;
    if (size !== 24) { svgStr = svgStr.replace(/width="\d+"/, 'width="' + size + '"').replace(/height="\d+"/, 'height="' + size + '"'); }
    try {
      var node = figma.createNodeFromSvg(svgStr);
      node.x = el.x || 0;
      node.y = el.y || 0;
      node.name = el.name || iconKey || "Icon";
      if (size !== 24) node.resize(size, size);
      parent.appendChild(node);
      return node;
    } catch (e) {}
  }
  var frame = figma.createFrame();
  frame.resize(el.size || 24, el.size || 24);
  frame.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 }, opacity: 1 }];
  frame.name = el.name || "Icon";
  frame.x = el.x || 0;
  frame.y = el.y || 0;
  parent.appendChild(frame);
  return frame;
}

// ── Layer counter ──
function countNodes(n) {
  var count = 1;
  if ("children" in n) {
    for (var i = 0; i < n.children.length; i++) count += countNodes(n.children[i]);
  }
  return count;
}

// ══════════════════════════════════════════════
// MESSAGE HANDLER
// ══════════════════════════════════════════════

figma.ui.onmessage = async function(msg) {
  // New: hierarchical tree with auto-layout
  if (msg.type === "convert-tree") {
    try {
      figma.ui.postMessage({ type: "progress", message: "Loading fonts..." });

      await ensureFont("400");
      await ensureFont("500");
      await ensureFont("700");

      figma.ui.postMessage({ type: "progress", message: "Building auto-layout frames..." });

      var root = await buildFromTree(msg.data);
      if (!root) {
        figma.ui.postMessage({ type: "error", message: "Failed to build tree" });
        return;
      }

      figma.currentPage.appendChild(root);
      figma.currentPage.selection = [root];
      figma.viewport.scrollAndZoomIntoView([root]);

      var count = countNodes(root);
      figma.ui.postMessage({ type: "done", count: count });
      figma.notify("Created " + count + " layers with auto-layout");
    } catch (e) {
      figma.ui.postMessage({ type: "error", message: e.message || "Unknown error" });
    }
  }

  // Legacy: flat JSON (backward compatibility for screenshot mode)
  if (msg.type === "convert-json") {
    try {
      figma.ui.postMessage({ type: "progress", message: "Loading fonts..." });

      await ensureFont("400");
      await ensureFont("500");
      await ensureFont("700");

      figma.ui.postMessage({ type: "progress", message: "Creating layers..." });

      var root = await buildFromJson(msg.data);

      figma.currentPage.appendChild(root);
      figma.currentPage.selection = [root];
      figma.viewport.scrollAndZoomIntoView([root]);

      var count = countNodes(root);
      figma.ui.postMessage({ type: "done", count: count });
      figma.notify("Created " + count + " layers");
    } catch (e) {
      figma.ui.postMessage({ type: "error", message: e.message || "Unknown error" });
    }
  }
};
