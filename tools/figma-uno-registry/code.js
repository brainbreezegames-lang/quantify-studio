// Uno Component Registry Scanner
// Scans the current Figma file and catalogs every component set:
//   - ID, name, page location
//   - Exact variant property names + allowed values
//   - Named text node slots (with font size + existing content)
//   - Category guess (input, action, navigation, display, layout, icon)
//   - Component dimensions
//
// Outputs a JSON catalog that the strict assembler uses.
// No fuzzy matching. No guessing. Just facts from the file.

figma.showUI(__html__, { width: 520, height: 700 });

function post(msg) { figma.ui.postMessage(msg); }
function step(text) { post({ type: 'step', text: text }); }
function yieldThread() { return new Promise(function(r) { setTimeout(r, 0); }); }

// ── CATEGORY HEURISTICS ──
// Based on component name, guess its category for the AI
var CATEGORY_RULES = [
  { pattern: /button/i, cat: 'action' },
  { pattern: /fab/i, cat: 'action' },
  { pattern: /icon.?button/i, cat: 'action' },
  { pattern: /text.?box|text.?field|input/i, cat: 'input' },
  { pattern: /password/i, cat: 'input' },
  { pattern: /search.?bar/i, cat: 'input' },
  { pattern: /combo.?box|drop.?down|select/i, cat: 'input' },
  { pattern: /slider/i, cat: 'input' },
  { pattern: /date.?picker|time.?picker/i, cat: 'input' },
  { pattern: /toggle|switch|check.?box|radio/i, cat: 'input' },
  { pattern: /chip/i, cat: 'input' },
  { pattern: /navigation.?bar|app.?bar|top.?bar/i, cat: 'navigation' },
  { pattern: /tab.?bar|bottom.?bar|navigation.?view/i, cat: 'navigation' },
  { pattern: /menu.?item|list.?item/i, cat: 'navigation' },
  { pattern: /breadcrumb/i, cat: 'navigation' },
  { pattern: /card/i, cat: 'display' },
  { pattern: /badge/i, cat: 'display' },
  { pattern: /avatar/i, cat: 'display' },
  { pattern: /progress|loading/i, cat: 'display' },
  { pattern: /snack.?bar|toast/i, cat: 'display' },
  { pattern: /dialog|modal|sheet|flyout/i, cat: 'display' },
  { pattern: /tooltip/i, cat: 'display' },
  { pattern: /divider|separator/i, cat: 'layout' },
  { pattern: /spacer/i, cat: 'layout' },
  { pattern: /icon/i, cat: 'icon' },
];

function guessCategory(name) {
  for (var i = 0; i < CATEGORY_RULES.length; i++) {
    if (CATEGORY_RULES[i].pattern.test(name)) return CATEGORY_RULES[i].cat;
  }
  return 'other';
}

// ── SCAN TEXT SLOTS ──
// Finds all text nodes inside a component variant and records their slot info
function scanTextSlots(component) {
  var slots = [];
  var seen = {};
  var texts = component.findAllWithCriteria({ types: ['TEXT'] });

  for (var t = 0; t < texts.length; t++) {
    var node = texts[t];
    var name = node.name;

    // Deduplicate by name
    if (seen[name]) continue;
    seen[name] = true;

    var fontSize = 0;
    try {
      fontSize = node.fontSize !== figma.mixed ? node.fontSize : 0;
    } catch (e) {}

    var content = '';
    try { content = node.characters || ''; } catch (e) {}

    // Check if it uses a text style (semantic)
    var textStyleName = '';
    try {
      if (node.textStyleId && node.textStyleId !== '' && node.textStyleId !== figma.mixed) {
        var style = figma.getStyleById(node.textStyleId);
        if (style) textStyleName = style.name;
      }
    } catch (e) {}

    slots.push({
      name: name,
      fontSize: fontSize,
      defaultContent: content.substring(0, 50), // truncate long text
      textStyle: textStyleName,
      visible: node.visible,
    });
  }

  return slots;
}

// ── SCAN ICON SLOTS ──
// Finds named icon containers (frames/groups containing vectors)
function scanIconSlots(component) {
  var slots = [];
  var children = component.findAll(function(n) {
    return (n.type === 'INSTANCE' || n.type === 'FRAME' || n.type === 'GROUP') &&
           (n.name.toLowerCase().indexOf('icon') !== -1 ||
            n.name.toLowerCase().indexOf('leading') !== -1 ||
            n.name.toLowerCase().indexOf('trailing') !== -1);
  });

  var seen = {};
  for (var i = 0; i < children.length; i++) {
    var name = children[i].name;
    if (seen[name]) continue;
    seen[name] = true;
    slots.push({
      name: name,
      type: children[i].type,
      width: Math.round(children[i].width),
      height: Math.round(children[i].height),
    });
  }
  return slots;
}

// ── SCAN BOOLEAN/VISIBILITY OVERRIDES ──
// Checks which direct children can be toggled
function scanToggleableChildren(component) {
  var toggleable = [];
  for (var i = 0; i < component.children.length; i++) {
    var child = component.children[i];
    // Component properties that are boolean
    if (child.type === 'INSTANCE' || child.type === 'FRAME') {
      toggleable.push({
        name: child.name,
        visible: child.visible,
        type: child.type,
      });
    }
  }
  return toggleable;
}

// ── MAIN SCAN ──
async function scanFile() {
  var startTime = Date.now();
  var catalog = {};
  var iconCatalog = [];
  var stats = { sets: 0, variants: 0, textSlots: 0, iconComponents: 0, standaloneIcons: 0 };

  // Phase 1: Component Sets
  step('Phase 1 — Scanning component sets...');
  var sets = figma.root.findAllWithCriteria({ types: ['COMPONENT_SET'] });
  stats.sets = sets.length;
  step('  Found ' + sets.length + ' component sets');

  for (var s = 0; s < sets.length; s++) {
    var set = sets[s];
    var setName = set.name;

    // Which page is it on?
    var pageName = '';
    var parent = set.parent;
    while (parent && parent.type !== 'PAGE') parent = parent.parent;
    if (parent) pageName = parent.name;

    // Collect variant properties
    var variantProps = {};
    var kids = set.children;
    var sampleVariant = null;

    for (var c = 0; c < kids.length; c++) {
      if (kids[c].type !== 'COMPONENT') continue;
      stats.variants++;
      if (!sampleVariant) sampleVariant = kids[c];

      var vp = kids[c].variantProperties || {};
      for (var key in vp) {
        if (!variantProps[key]) variantProps[key] = [];
        var val = vp[key];
        if (variantProps[key].indexOf(val) === -1) {
          variantProps[key].push(val);
        }
      }
    }

    // Sort variant values for readability
    for (var key in variantProps) {
      variantProps[key].sort();
    }

    // Scan text slots from first variant (they're usually consistent)
    var textSlots = [];
    var iconSlots = [];
    if (sampleVariant) {
      textSlots = scanTextSlots(sampleVariant);
      iconSlots = scanIconSlots(sampleVariant);
      stats.textSlots += textSlots.length;
    }

    catalog[setName] = {
      id: set.id,
      page: pageName,
      category: guessCategory(setName),
      variantCount: kids.length,
      variants: variantProps,
      textSlots: textSlots,
      iconSlots: iconSlots,
      width: Math.round(set.width),
      height: Math.round(set.height),
    };

    // Progress
    if (s % 10 === 0 && s > 0) {
      step('  ' + s + '/' + sets.length + ' sets scanned...');
      await yieldThread();
    }
  }
  step('  ✓ ' + sets.length + ' component sets cataloged');

  // Phase 2: Standalone components (especially icons)
  step('Phase 2 — Scanning standalone components (icons)...');
  var allComps = figma.root.findAllWithCriteria({ types: ['COMPONENT'] });
  var standaloneCount = 0;

  for (var i = 0; i < allComps.length; i++) {
    var comp = allComps[i];

    // Skip variants (children of component sets)
    if (comp.parent && comp.parent.type === 'COMPONENT_SET') continue;
    standaloneCount++;

    // Check if it's an icon (small, square-ish)
    var isIcon = (comp.width <= 48 && comp.height <= 48) ||
                 comp.name.toLowerCase().indexOf('icon') !== -1 ||
                 comp.name.toLowerCase().indexOf('ic/') !== -1 ||
                 comp.name.toLowerCase().indexOf('ic_') !== -1;

    if (isIcon) {
      var iconPage = '';
      var p = comp.parent;
      while (p && p.type !== 'PAGE') p = p.parent;
      if (p) iconPage = p.name;

      iconCatalog.push({
        id: comp.id,
        name: comp.name,
        page: iconPage,
        width: Math.round(comp.width),
        height: Math.round(comp.height),
      });
      stats.iconComponents++;
    }
  }
  stats.standaloneIcons = standaloneCount;
  step('  Found ' + standaloneCount + ' standalone components, ' + stats.iconComponents + ' icons');

  // Phase 3: Text styles (semantic)
  step('Phase 3 — Scanning text styles...');
  var textStyles = [];
  var localStyles;
  try { localStyles = await figma.getLocalTextStylesAsync(); } catch (e) { localStyles = figma.getLocalTextStyles(); }

  for (var ts = 0; ts < localStyles.length; ts++) {
    var style = localStyles[ts];
    textStyles.push({
      id: style.id,
      name: style.name,
      fontSize: style.fontSize,
      fontFamily: style.fontName ? style.fontName.family : '',
      fontStyle: style.fontName ? style.fontName.style : '',
    });
  }
  step('  Found ' + textStyles.length + ' text styles');

  // Phase 4: Paint styles
  step('Phase 4 — Scanning paint styles...');
  var paintStyles = [];
  var localPaints;
  try { localPaints = await figma.getLocalPaintStylesAsync(); } catch (e) { localPaints = figma.getLocalPaintStyles(); }

  for (var ps = 0; ps < localPaints.length; ps++) {
    var pStyle = localPaints[ps];
    var colorHex = '';
    if (pStyle.paints && pStyle.paints.length > 0 && pStyle.paints[0].type === 'SOLID') {
      var pc = pStyle.paints[0].color;
      var rr = Math.round(pc.r * 255).toString(16).padStart(2, '0');
      var gg = Math.round(pc.g * 255).toString(16).padStart(2, '0');
      var bb = Math.round(pc.b * 255).toString(16).padStart(2, '0');
      colorHex = '#' + rr + gg + bb;
    }
    paintStyles.push({
      id: pStyle.id,
      name: pStyle.name,
      color: colorHex,
    });
  }
  step('  Found ' + paintStyles.length + ' paint styles');

  // Phase 5: Variable collections
  step('Phase 5 — Scanning variables...');
  var variableInfo = [];
  try {
    var collections = await figma.variables.getLocalVariableCollectionsAsync();
    for (var ci = 0; ci < collections.length; ci++) {
      variableInfo.push({
        name: collections[ci].name,
        variableCount: collections[ci].variableIds.length,
        modes: collections[ci].modes.map(function(m) { return m.name; }),
      });
    }
    step('  Found ' + collections.length + ' variable collections');
  } catch (e) {
    step('  Variables API not available');
  }

  // Compile full registry
  var registry = {
    _meta: {
      fileName: figma.root.name,
      scanDate: new Date().toISOString(),
      scanDuration: ((Date.now() - startTime) / 1000).toFixed(1) + 's',
      stats: stats,
    },
    components: catalog,
    icons: iconCatalog.slice(0, 200), // cap for UI display
    iconCount: iconCatalog.length,
    textStyles: textStyles,
    paintStyles: paintStyles,
    variables: variableInfo,
  };

  var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  step('');
  step('✅ Registry scan complete in ' + elapsed + 's');
  step('  ' + stats.sets + ' component sets');
  step('  ' + stats.variants + ' total variants');
  step('  ' + stats.textSlots + ' text slots discovered');
  step('  ' + stats.iconComponents + ' icon components');
  step('  ' + textStyles.length + ' text styles');
  step('  ' + paintStyles.length + ' paint styles');

  // Send full registry to UI
  post({ type: 'registry', data: registry });
  post({ type: 'done' });
}

figma.ui.onmessage = function(msg) {
  if (msg.type === 'scan') scanFile();
  if (msg.type === 'close') figma.closePlugin();
};
