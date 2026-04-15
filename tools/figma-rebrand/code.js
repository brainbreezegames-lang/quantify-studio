// Quantify Rebrand — Uno Material Toolkit v2
// Recolors variables, paint/text/effect styles, then does batched node traversal.
// Preserves all naming, structure, variants, and auto-layout.

figma.showUI(__html__, { width: 420, height: 620 });

// ────────────────────────────────────────────
// COLOR MAP: Uno Material → Quantify
// ────────────────────────────────────────────

var COLOR_MAP = [
  // Primary purple → Blue Main
  { from: [89, 70, 210], to: [10, 62, 255] },
  // Primary Container → Blue Light
  { from: [229, 222, 255], to: [214, 224, 255] },
  // Secondary Container → Blue Light
  { from: [235, 221, 255], to: [214, 224, 255] },
  // On Primary Container → Blue Dark
  { from: [23, 0, 101], to: [16, 41, 110] },
  // Tertiary → Blue Main
  { from: [121, 68, 148], to: [10, 62, 255] },
  // Tertiary Container → Blue Light
  { from: [243, 218, 255], to: [214, 224, 255] },
  // On Surface → Light Black
  { from: [28, 27, 31], to: [32, 32, 32] },
  // On Surface Variant → Gray Dark
  { from: [139, 132, 148], to: [135, 135, 135] },
  // Surface Variant → Tinted White
  { from: [243, 239, 245], to: [248, 248, 248] },
  // Outline → Gray Medium
  { from: [124, 117, 135], to: [181, 181, 181] },
  // Outline Variant → Gray Light
  { from: [206, 197, 216], to: [226, 226, 226] },
  // Error → Quantify Red
  { from: [179, 38, 30], to: [211, 47, 47] },
  // Error Container → Light Red
  { from: [249, 222, 220], to: [253, 236, 234] },
  // On Error Container → Dark Red
  { from: [65, 14, 11], to: [211, 47, 47] },
  // Inverse Primary → Blue Medium
  { from: [200, 191, 255], to: [111, 157, 255] },
  // Inverse Surface → Light Black
  { from: [50, 47, 53], to: [32, 32, 32] },
  // Inverse On Surface → Tinted White
  { from: [245, 239, 247], to: [248, 248, 248] },
  // Secondary purple tones
  { from: [98, 91, 113], to: [95, 95, 95] },
  { from: [74, 68, 88], to: [32, 32, 32] },
  // Surface containers (MD3 extended)
  { from: [240, 237, 242], to: [248, 248, 248] },
  { from: [232, 225, 235], to: [244, 244, 244] },
  { from: [236, 230, 240], to: [244, 244, 244] },
  { from: [244, 240, 244], to: [248, 248, 248] },
  { from: [252, 248, 252], to: [255, 255, 255] },
];

var COLOR_TOLERANCE = 15;

// ────────────────────────────────────────────
// FONT MAP: Roboto → Switzer
// ────────────────────────────────────────────

var FONT_MAP = {
  'Thin': { family: 'Switzer', style: 'Light' },
  'Thin Italic': { family: 'Switzer', style: 'Light Italic' },
  'Light': { family: 'Switzer', style: 'Light' },
  'Light Italic': { family: 'Switzer', style: 'Light Italic' },
  'Regular': { family: 'Switzer', style: 'Regular' },
  'Italic': { family: 'Switzer', style: 'Italic' },
  'Medium': { family: 'Switzer', style: 'Medium' },
  'Medium Italic': { family: 'Switzer', style: 'Medium Italic' },
  'SemiBold': { family: 'Switzer', style: 'Semibold' },
  'SemiBold Italic': { family: 'Switzer', style: 'Semibold Italic' },
  'Bold': { family: 'Switzer', style: 'Bold' },
  'Bold Italic': { family: 'Switzer', style: 'Bold Italic' },
  'ExtraBold': { family: 'Switzer', style: 'Bold' },
  'Black': { family: 'Switzer', style: 'Bold' },
};

// Pages to skip (documentation, not actual design)
var SKIP_PAGES = ['Getting Started'];

// ────────────────────────────────────────────
// STATS + HELPERS
// ────────────────────────────────────────────

var stats = { colors: 0, fonts: 0, variables: 0, paintStyles: 0, textStyles: 0, effectStyles: 0, nodes: 0, textSizeBumps: 0, grayDarkened: 0 };

// ────────────────────────────────────────────
// FIELD-READY CONFIG
// ────────────────────────────────────────────

var MIN_TEXT_SIZE = 14;  // No readable text below this

// Gray floor: any neutral gray text lighter than this gets darkened
// Only affects grays (R≈G≈B) used as text fills, not backgrounds
var GRAY_FLOOR = [119, 119, 119];  // #777777

function isNeutralGray(r, g, b) {
  // A color is "neutral gray" if R, G, B are all within 15 of each other
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  return (max - min) <= 15;
}

function isLighterThanFloor(r, g, b) {
  // Lighter = higher values (closer to white)
  var avg = (r + g + b) / 3;
  var floorAvg = (GRAY_FLOOR[0] + GRAY_FLOOR[1] + GRAY_FLOOR[2]) / 3;
  return avg > floorAvg;
}

function shouldDarkenGray(r, g, b) {
  // Only darken neutral grays that are lighter than #777
  // Skip near-white (>230 avg = backgrounds/surfaces) and near-black (<50)
  var avg = (r + g + b) / 3;
  if (avg > 230 || avg < 50) return false;
  return isNeutralGray(r, g, b) && isLighterThanFloor(r, g, b);
}

function step(text) {
  figma.ui.postMessage({ type: 'step', text: text });
}

function colorDist(a, b) {
  var dr = a[0] - b[0];
  var dg = a[1] - b[1];
  var db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function to255(c) {
  return [Math.round(c.r * 255), Math.round(c.g * 255), Math.round(c.b * 255)];
}

function toFigma(c) {
  return { r: c[0] / 255, g: c[1] / 255, b: c[2] / 255 };
}

function findMapping(r, g, b) {
  var src = [r, g, b];
  var best = null;
  var bestDist = Infinity;
  for (var i = 0; i < COLOR_MAP.length; i++) {
    var d = colorDist(src, COLOR_MAP[i].from);
    if (d < bestDist) {
      bestDist = d;
      best = COLOR_MAP[i];
    }
  }
  if (bestDist <= COLOR_TOLERANCE && best) {
    if (best.from[0] === best.to[0] && best.from[1] === best.to[1] && best.from[2] === best.to[2]) return null;
    return best;
  }
  return null;
}

function remapSolid(color) {
  var rgb = to255(color);
  var m = findMapping(rgb[0], rgb[1], rgb[2]);
  if (m) return toFigma(m.to);
  return null;
}

// Yield control back to Figma to prevent timeout
function yieldThread() {
  return new Promise(function (resolve) { setTimeout(resolve, 0); });
}

// ────────────────────────────────────────────
// PHASE 1: VARIABLES (cascade to all bound nodes)
// ────────────────────────────────────────────

async function recolorVariables() {
  step('Phase 1 — Recoloring variables…');
  var collections;
  try {
    collections = await figma.variables.getLocalVariableCollectionsAsync();
  } catch (e) {
    step('  No variables API — skipping');
    return;
  }
  var count = 0;

  for (var ci = 0; ci < collections.length; ci++) {
    var col = collections[ci];
    step('  Collection: ' + col.name + ' (' + col.variableIds.length + ' vars)');

    for (var vi = 0; vi < col.variableIds.length; vi++) {
      var v;
      try { v = await figma.variables.getVariableByIdAsync(col.variableIds[vi]); } catch (e) { continue; }
      if (!v || v.resolvedType !== 'COLOR') continue;

      for (var mi = 0; mi < col.modes.length; mi++) {
        var modeId = col.modes[mi].modeId;
        var val = v.valuesByMode[modeId];
        if (!val || typeof val !== 'object') continue;
        if ('type' in val && val.type === 'VARIABLE_ALIAS') continue;
        if (!('r' in val)) continue;

        var nc = remapSolid(val);
        if (nc) {
          v.setValueForMode(modeId, { r: nc.r, g: nc.g, b: nc.b, a: val.a !== undefined ? val.a : 1 });
          count++;
        }
      }

      // Yield every 20 vars
      if (vi % 20 === 0) await yieldThread();
    }
  }

  stats.variables = count;
  step('  ✓ Recolored ' + count + ' variable values');
}

// ────────────────────────────────────────────
// PHASE 2: PAINT STYLES (cascade to all referencing nodes)
// ────────────────────────────────────────────

async function recolorPaintStyles() {
  step('Phase 2 — Recoloring paint styles…');
  var styles;
  try { styles = await figma.getLocalPaintStylesAsync(); } catch (e) { styles = figma.getLocalPaintStyles(); }
  var count = 0;

  for (var i = 0; i < styles.length; i++) {
    var style = styles[i];
    var paints = style.paints.slice();
    var changed = false;

    for (var p = 0; p < paints.length; p++) {
      if (paints[p].type === 'SOLID' && paints[p].color) {
        var nc = remapSolid(paints[p].color);
        if (nc) {
          paints[p] = Object.assign({}, paints[p], { color: nc });
          changed = true;
          count++;
        }
      }
    }
    if (changed) style.paints = paints;
  }

  stats.paintStyles = count;
  step('  ✓ Recolored ' + count + ' paint style fills');
}

// ────────────────────────────────────────────
// PHASE 3: TEXT STYLES (cascade to all referencing text)
// ────────────────────────────────────────────

async function refontTextStyles() {
  step('Phase 3 — Swapping fonts in text styles…');
  var styles;
  try { styles = await figma.getLocalTextStylesAsync(); } catch (e) { styles = figma.getLocalTextStyles(); }
  var count = 0;

  for (var i = 0; i < styles.length; i++) {
    var style = styles[i];
    if (!style.fontName || style.fontName.family !== 'Roboto') continue;

    var target = FONT_MAP[style.fontName.style] || { family: 'Switzer', style: 'Regular' };
    try {
      await figma.loadFontAsync(target);
      style.fontName = target;
      count++;
    } catch (e) {
      step('  ⚠ Cannot load: Switzer ' + target.style);
    }
  }

  stats.textStyles = count;
  step('  ✓ Swapped font on ' + count + ' text styles');
}

// ────────────────────────────────────────────
// PHASE 4: EFFECT STYLES
// ────────────────────────────────────────────

async function recolorEffectStyles() {
  step('Phase 4 — Recoloring effect styles…');
  var styles;
  try { styles = await figma.getLocalEffectStylesAsync(); } catch (e) { styles = figma.getLocalEffectStyles(); }
  var count = 0;

  for (var i = 0; i < styles.length; i++) {
    var effects = styles[i].effects.slice();
    var changed = false;

    for (var ef = 0; ef < effects.length; ef++) {
      if (!effects[ef].color) continue;
      var rgb = to255(effects[ef].color);
      var m = findMapping(rgb[0], rgb[1], rgb[2]);
      if (m) {
        var nc = toFigma(m.to);
        effects[ef] = Object.assign({}, effects[ef], {
          color: { r: nc.r, g: nc.g, b: nc.b, a: effects[ef].color.a }
        });
        changed = true;
        count++;
      }
    }
    if (changed) styles[i].effects = effects;
  }

  stats.effectStyles = count;
  step('  ✓ Recolored ' + count + ' effect style values');
}

// ────────────────────────────────────────────
// PHASE 5: NODE TRAVERSAL (batched, with yields)
// Only processes inline/hardcoded values that don't use styles.
// ────────────────────────────────────────────

var nodeQueue = [];
var processedCount = 0;
var totalEstimate = 0;

function collectNodes(node) {
  nodeQueue.push(node);
  if ('children' in node) {
    for (var i = 0; i < node.children.length; i++) {
      collectNodes(node.children[i]);
    }
  }
}

async function processNodeBatch(batchSize) {
  var end = Math.min(nodeQueue.length, processedCount + batchSize);

  for (var i = processedCount; i < end; i++) {
    var node = nodeQueue[i];
    stats.nodes++;

    // ── Skip nodes that use bound styles (already handled by phases 1-4) ──
    var hasFillStyle = false;
    var hasStrokeStyle = false;
    try { hasFillStyle = node.fillStyleId && node.fillStyleId !== ''; } catch (e) {}
    try { hasStrokeStyle = node.strokeStyleId && node.strokeStyleId !== ''; } catch (e) {}

    // ── Fills (only if no paint style bound) ──
    if (!hasFillStyle && 'fills' in node) {
      try {
        var fills = node.fills;
        if (fills !== figma.mixed && Array.isArray(fills)) {
          var newFills = fills.slice();
          var fChanged = false;
          for (var f = 0; f < newFills.length; f++) {
            if (newFills[f].type === 'SOLID' && newFills[f].color) {
              var nc = remapSolid(newFills[f].color);
              if (nc) {
                newFills[f] = Object.assign({}, newFills[f], { color: nc });
                fChanged = true;
                stats.colors++;
              }
            }
          }
          if (fChanged) node.fills = newFills;
        }
      } catch (e) { /* skip mixed/locked */ }
    }

    // ── Strokes (only if no stroke style bound) ──
    if (!hasStrokeStyle && 'strokes' in node) {
      try {
        var strokes = node.strokes;
        if (Array.isArray(strokes)) {
          var newStrokes = strokes.slice();
          var sChanged = false;
          for (var s = 0; s < newStrokes.length; s++) {
            if (newStrokes[s].type === 'SOLID' && newStrokes[s].color) {
              var ns = remapSolid(newStrokes[s].color);
              if (ns) {
                newStrokes[s] = Object.assign({}, newStrokes[s], { color: ns });
                sChanged = true;
                stats.colors++;
              }
            }
          }
          if (sChanged) node.strokes = newStrokes;
        }
      } catch (e) { /* skip */ }
    }

    // ── Effects (only inline, not from effect style) ──
    var hasEffectStyle = false;
    try { hasEffectStyle = node.effectStyleId && node.effectStyleId !== ''; } catch (e) {}

    if (!hasEffectStyle && 'effects' in node) {
      try {
        var effects = node.effects;
        if (Array.isArray(effects)) {
          var newEffects = effects.slice();
          var eChanged = false;
          for (var ef = 0; ef < newEffects.length; ef++) {
            if (newEffects[ef].color) {
              var rgb = to255(newEffects[ef].color);
              var m = findMapping(rgb[0], rgb[1], rgb[2]);
              if (m) {
                var eNew = toFigma(m.to);
                newEffects[ef] = Object.assign({}, newEffects[ef], {
                  color: { r: eNew.r, g: eNew.g, b: eNew.b, a: newEffects[ef].color.a }
                });
                eChanged = true;
                stats.colors++;
              }
            }
          }
          if (eChanged) node.effects = newEffects;
        }
      } catch (e) { /* skip */ }
    }

    // ── Text: font swap + size bump + gray darkening for inline text ──
    if (node.type === 'TEXT') {
      var hasTextStyle = false;
      try { hasTextStyle = node.textStyleId && node.textStyleId !== '' && node.textStyleId !== figma.mixed; } catch (e) {}

      // Bump inline text size (even if using a text style, check fontSize)
      if (!hasTextStyle) {
        try {
          var fs = node.fontSize;
          if (fs !== figma.mixed && typeof fs === 'number' && fs < MIN_TEXT_SIZE) {
            await figma.loadFontAsync(node.fontName !== figma.mixed ? node.fontName : { family: 'Switzer', style: 'Regular' });
            node.fontSize = MIN_TEXT_SIZE;
            stats.textSizeBumps++;
          }
        } catch (e) { /* mixed fonts, skip */ }
      }

      // Darken inline gray text fills
      if (!hasTextStyle) {
        try {
          var textFills = node.fills;
          if (textFills !== figma.mixed && Array.isArray(textFills)) {
            var newTF = textFills.slice();
            var tfChanged = false;
            for (var tfi = 0; tfi < newTF.length; tfi++) {
              if (newTF[tfi].type === 'SOLID' && newTF[tfi].color) {
                var tRgb = to255(newTF[tfi].color);
                if (shouldDarkenGray(tRgb[0], tRgb[1], tRgb[2])) {
                  newTF[tfi] = Object.assign({}, newTF[tfi], { color: toFigma(GRAY_FLOOR) });
                  tfChanged = true;
                  stats.grayDarkened++;
                }
              }
            }
            if (tfChanged) node.fills = newTF;
          }
        } catch (e) { /* skip */ }
      }

      if (!hasTextStyle) {
        try {
          var chars = node.characters;
          if (chars && chars.length > 0) {
            var segments = node.getStyledTextSegments(['fontName', 'fills']);

            for (var seg = 0; seg < segments.length; seg++) {
              var segment = segments[seg];

              // Font swap
              if (segment.fontName && segment.fontName.family === 'Roboto') {
                var target = FONT_MAP[segment.fontName.style] || { family: 'Switzer', style: 'Regular' };
                try {
                  await figma.loadFontAsync(target);
                  node.setRangeFontName(segment.start, segment.end, target);
                  stats.fonts++;
                } catch (e) { /* font unavailable */ }
              }

              // Inline text color
              if (segment.fills && Array.isArray(segment.fills)) {
                var sf = segment.fills.slice();
                var sfChanged = false;
                for (var sfi = 0; sfi < sf.length; sfi++) {
                  if (sf[sfi].type === 'SOLID' && sf[sfi].color) {
                    var snc = remapSolid(sf[sfi].color);
                    if (snc) {
                      sf[sfi] = Object.assign({}, sf[sfi], { color: snc });
                      sfChanged = true;
                      stats.colors++;
                    }
                  }
                }
                if (sfChanged) {
                  try { node.setRangeFills(segment.start, segment.end, sf); } catch (e) { /* skip */ }
                }
              }
            }
          }
        } catch (e) {
          // Fallback: whole-node font swap
          try {
            if (node.fontName && node.fontName !== figma.mixed && node.fontName.family === 'Roboto') {
              var fb = FONT_MAP[node.fontName.style] || { family: 'Switzer', style: 'Regular' };
              await figma.loadFontAsync(fb);
              node.fontName = fb;
              stats.fonts++;
            }
          } catch (e2) { /* skip */ }
        }
      }
    }
  }

  processedCount = end;
}

async function traversePages() {
  var pages = figma.root.children;
  step('Phase 5 — Traversing ' + pages.length + ' pages for inline overrides…');

  for (var p = 0; p < pages.length; p++) {
    var page = pages[p];

    // Skip documentation pages
    if (SKIP_PAGES.indexOf(page.name) !== -1) {
      step('  Skipping doc page: ' + page.name);
      continue;
    }

    step('  Collecting nodes: ' + page.name + ' (' + (p + 1) + '/' + pages.length + ')');

    // Collect all nodes into flat queue
    nodeQueue = [];
    processedCount = 0;
    for (var n = 0; n < page.children.length; n++) {
      collectNodes(page.children[n]);
    }

    totalEstimate = nodeQueue.length;
    step('  Found ' + totalEstimate + ' nodes — processing in batches…');

    // Process in batches of 100 with yields between
    var BATCH = 100;
    while (processedCount < nodeQueue.length) {
      await processNodeBatch(BATCH);
      await yieldThread();

      // Progress every 500 nodes
      if (processedCount % 500 === 0 && processedCount > 0) {
        step('    ' + processedCount + '/' + totalEstimate + ' nodes…');
      }
    }

    step('  ✓ ' + page.name + ': ' + totalEstimate + ' nodes done');
    await yieldThread();
  }
}

// ────────────────────────────────────────────
// PHASE 6: TEXT SIZE FLOOR (bump small text to minimum)
// ────────────────────────────────────────────

async function bumpTextSizeInStyles() {
  step('Phase 6 — Enforcing ' + MIN_TEXT_SIZE + 'px minimum text size…');
  var styles;
  try { styles = await figma.getLocalTextStylesAsync(); } catch (e) { styles = figma.getLocalTextStyles(); }
  var count = 0;

  for (var i = 0; i < styles.length; i++) {
    var style = styles[i];
    if (style.fontSize && style.fontSize < MIN_TEXT_SIZE) {
      var oldSize = style.fontSize;
      style.fontSize = MIN_TEXT_SIZE;
      count++;
      step('  ' + style.name + ': ' + oldSize + 'px → ' + MIN_TEXT_SIZE + 'px');
    }
  }

  step('  ✓ Bumped ' + count + ' text styles');

  // Also bump inline text nodes during traversal (handled in phase 5 node processing)
  stats.textSizeBumps = count;
}

// ────────────────────────────────────────────
// PHASE 7: GRAY FLOOR (darken light grays in text color variables)
// ────────────────────────────────────────────

async function darkenGrayVariables() {
  step('Phase 7 — Darkening light gray text colors…');
  var collections;
  try {
    collections = await figma.variables.getLocalVariableCollectionsAsync();
  } catch (e) {
    step('  No variables API — skipping');
    return;
  }
  var count = 0;
  var target = toFigma(GRAY_FLOOR);

  for (var ci = 0; ci < collections.length; ci++) {
    var col = collections[ci];

    for (var vi = 0; vi < col.variableIds.length; vi++) {
      var v;
      try { v = await figma.variables.getVariableByIdAsync(col.variableIds[vi]); } catch (e) { continue; }
      if (!v || v.resolvedType !== 'COLOR') continue;

      // Only target variables that look like text colors (by name)
      var nameLower = v.name.toLowerCase();
      var isTextColor = nameLower.indexOf('on') !== -1 ||
                        nameLower.indexOf('text') !== -1 ||
                        nameLower.indexOf('content') !== -1 ||
                        nameLower.indexOf('label') !== -1 ||
                        nameLower.indexOf('body') !== -1 ||
                        nameLower.indexOf('caption') !== -1 ||
                        nameLower.indexOf('subtitle') !== -1 ||
                        nameLower.indexOf('placeholder') !== -1 ||
                        nameLower.indexOf('hint') !== -1 ||
                        nameLower.indexOf('secondary') !== -1 ||
                        nameLower.indexOf('tertiary') !== -1 ||
                        nameLower.indexOf('disabled') !== -1;

      // Skip variables that are clearly backgrounds/surfaces
      var isSurface = nameLower.indexOf('surface') !== -1 ||
                      nameLower.indexOf('background') !== -1 ||
                      nameLower.indexOf('container') !== -1 ||
                      nameLower.indexOf('fill') !== -1 ||
                      nameLower.indexOf('divider') !== -1 ||
                      nameLower.indexOf('outline') !== -1;

      if (isSurface) continue;

      for (var mi = 0; mi < col.modes.length; mi++) {
        var modeId = col.modes[mi].modeId;
        var val = v.valuesByMode[modeId];
        if (!val || typeof val !== 'object') continue;
        if ('type' in val && val.type === 'VARIABLE_ALIAS') continue;
        if (!('r' in val)) continue;

        var rgb = to255(val);
        if (shouldDarkenGray(rgb[0], rgb[1], rgb[2])) {
          v.setValueForMode(modeId, { r: target.r, g: target.g, b: target.b, a: val.a !== undefined ? val.a : 1 });
          count++;
          step('  ' + v.name + ': #' + rgb.map(function(c) { return c.toString(16).padStart(2, '0'); }).join('') + ' → #777777');
        }
      }

      if (vi % 20 === 0) await yieldThread();
    }
  }

  stats.grayDarkened = count;
  step('  ✓ Darkened ' + count + ' gray variable values');
}

// ────────────────────────────────────────────
// PHASE 8: CUSTOM QUANTIFY TEXT STYLES
// Adds text styles that don't exist in the
// default Uno Material type scale.
// ────────────────────────────────────────────

var CUSTOM_TEXT_STYLES = [
  { name: 'Quantify/Body Large+',  fontSize: 18, fontStyle: 'Semibold', letterSpacing: { value: 0, unit: 'PIXELS' }, lineHeight: { value: 24, unit: 'PIXELS' } },
  { name: 'Quantify/Body Medium+', fontSize: 15, fontStyle: 'Medium',   letterSpacing: { value: 0, unit: 'PIXELS' }, lineHeight: { value: 20, unit: 'PIXELS' } }
];

async function createCustomTextStyles() {
  step('Phase 8 — Creating custom Quantify text styles…');
  var existing;
  try { existing = await figma.getLocalTextStylesAsync(); } catch (e) { existing = figma.getLocalTextStyles(); }

  // Index existing by name
  var existingNames = {};
  for (var i = 0; i < existing.length; i++) {
    existingNames[existing[i].name] = true;
  }

  var created = 0;
  for (var j = 0; j < CUSTOM_TEXT_STYLES.length; j++) {
    var def = CUSTOM_TEXT_STYLES[j];
    if (existingNames[def.name]) {
      step('  ✓ ' + def.name + ' already exists');
      continue;
    }

    var style = figma.createTextStyle();
    style.name = def.name;
    try {
      var font = { family: 'Switzer', style: def.fontStyle };
      await figma.loadFontAsync(font);
      style.fontName = font;
      style.fontSize = def.fontSize;
      style.letterSpacing = def.letterSpacing;
      style.lineHeight = def.lineHeight;
      created++;
      step('  + ' + def.name + ' → ' + def.fontSize + 'px Switzer ' + def.fontStyle);
    } catch (e) {
      step('  ⚠ Failed: ' + def.name + ' — ' + e.message);
    }
  }

  step('  ✓ ' + created + ' custom text style(s) created');
}

// ────────────────────────────────────────────
// MAIN
// ────────────────────────────────────────────

async function run() {
  var startTime = Date.now();

  try {
    // Pre-load all fonts
    step('Loading fonts…');
    var allFonts = [
      { family: 'Switzer', style: 'Regular' },
      { family: 'Switzer', style: 'Medium' },
      { family: 'Switzer', style: 'Semibold' },
      { family: 'Switzer', style: 'Bold' },
      { family: 'Switzer', style: 'Light' },
      { family: 'Roboto', style: 'Regular' },
      { family: 'Roboto', style: 'Medium' },
      { family: 'Roboto', style: 'Bold' },
      { family: 'Roboto', style: 'Light' },
      { family: 'Roboto', style: 'Thin' },
    ];

    var loadedFonts = [];
    for (var w = 0; w < allFonts.length; w++) {
      try {
        await figma.loadFontAsync(allFonts[w]);
        loadedFonts.push(allFonts[w].family + ' ' + allFonts[w].style);
      } catch (e) { /* ok */ }
    }
    step('  Loaded: ' + loadedFonts.join(', '));

    // Phase 1: Variables (cascade everywhere)
    await recolorVariables();
    await yieldThread();

    // Phase 2: Paint styles (cascade to all nodes using them)
    await recolorPaintStyles();
    await yieldThread();

    // Phase 3: Text styles (cascade to all text using them)
    await refontTextStyles();
    await yieldThread();

    // Phase 4: Effect styles
    await recolorEffectStyles();
    await yieldThread();

    // Phase 5: Inline node traversal (batched with yields)
    // This also handles inline text size bumps and gray darkening
    await traversePages();
    await yieldThread();

    // Phase 6: Text style size floor
    await bumpTextSizeInStyles();
    await yieldThread();

    // Phase 7: Gray floor on text color variables
    await darkenGrayVariables();
    await yieldThread();

    // Phase 8: Custom Quantify text styles
    await createCustomTextStyles();

    // Done
    var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    step('');
    step('✅ Rebranding complete in ' + elapsed + 's');
    step('  Variables: ' + stats.variables);
    step('  Paint styles: ' + stats.paintStyles);
    step('  Text styles: ' + stats.textStyles);
    step('  Effect styles: ' + stats.effectStyles);
    step('  Inline colors: ' + stats.colors);
    step('  Inline fonts: ' + stats.fonts);
    step('  Text size bumps: ' + stats.textSizeBumps);
    step('  Grays darkened: ' + stats.grayDarkened);
    step('  Nodes traversed: ' + stats.nodes);

    figma.ui.postMessage({
      type: 'done',
      stats: {
        colors: stats.colors + stats.paintStyles + stats.variables + stats.grayDarkened,
        fonts: stats.fonts + stats.textStyles,
        textBumps: stats.textSizeBumps,
        grayDarkened: stats.grayDarkened
      }
    });

  } catch (err) {
    step('');
    step('✕ Error: ' + (err.message || String(err)));
    figma.ui.postMessage({ type: 'error', message: err.message || String(err) });
  }
}

figma.ui.onmessage = function (msg) {
  if (msg.type === 'run') {
    stats = { colors: 0, fonts: 0, variables: 0, paintStyles: 0, textStyles: 0, effectStyles: 0, nodes: 0, textSizeBumps: 0, grayDarkened: 0 };
    run();
  }
  if (msg.type === 'close') {
    figma.closePlugin();
  }
};
