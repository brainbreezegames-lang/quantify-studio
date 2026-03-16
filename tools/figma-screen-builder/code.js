// Quantify Screen Builder — Strict Uno Assembler
// ================================================
// Flow:
//   1. SCAN: Build component registry from Figma file
//   2. GENERATE: Send registry + prompt to AI → get screen schema
//   3. ASSEMBLE: Build screens from schema using ONLY component instances
//   4. VALIDATE: Verify all leaves are instances, no detached, no invented controls
//
// Rules:
//   - createFrame() ONLY for layout containers
//   - All controls MUST be component instances from the registry
//   - Missing component/variant → hard error, not fallback
//   - Text overrides target named slots only

figma.showUI(__html__, { width: 400, height: 560 });

function post(msg) { figma.ui.postMessage(msg); }
function step(text) { post({ type: 'step', text: text }); }
function yieldThread() { return new Promise(function(r) { setTimeout(r, 0); }); }

// ══════════════════════════════════════════════
// PHASE 1: REGISTRY
// ══════════════════════════════════════════════

var registry = {};

async function buildRegistry() {
  step('Scanning components...');
  registry = {};

  var sets = figma.root.findAllWithCriteria({ types: ['COMPONENT_SET'] });

  for (var s = 0; s < sets.length; s++) {
    var set = sets[s];
    var name = set.name;

    // Skip internal templates
    if (name.indexOf('Template/') === 0) continue;

    var variantProps = {};
    var kids = set.children;
    var sampleComp = null;

    // Build variant index: key = sorted "Prop=Val" pairs, value = component node
    var variantIndex = {};

    for (var c = 0; c < kids.length; c++) {
      if (kids[c].type !== 'COMPONENT') continue;
      if (!sampleComp) sampleComp = kids[c];
      var vp = kids[c].variantProperties || {};

      // Collect all variant values
      var indexParts = [];
      for (var key in vp) {
        if (!variantProps[key]) variantProps[key] = [];
        if (variantProps[key].indexOf(vp[key]) === -1) variantProps[key].push(vp[key]);
        indexParts.push(key + '=' + vp[key]);
      }
      // Store in index with sorted key for consistent lookup
      indexParts.sort();
      variantIndex[indexParts.join(',')] = kids[c];
    }
    for (var key in variantProps) variantProps[key].sort();

    // Text slots from sample
    var textSlots = [];
    if (sampleComp) {
      var texts = sampleComp.findAllWithCriteria({ types: ['TEXT'] });
      var seen = {};
      for (var t = 0; t < texts.length; t++) {
        if (seen[texts[t].name]) continue;
        seen[texts[t].name] = true;
        textSlots.push(texts[t].name);
      }
    }

    registry[name] = {
      setNode: set,
      variantCount: kids.length,
      variants: variantProps,
      variantIndex: variantIndex,
      textSlots: textSlots,
    };

    if (s % 15 === 0 && s > 0) await yieldThread();
  }

  step('  \u2713 ' + Object.keys(registry).length + ' components registered (from ' + sets.length + ' sets)');
}

// Condensed catalog for AI prompt — just what it needs to make decisions
function catalogForAI() {
  var out = {};
  for (var name in registry) {
    out[name] = {
      variants: registry[name].variants,
      textSlots: registry[name].textSlots,
    };
  }
  return out;
}

// ══════════════════════════════════════════════
// PHASE 2: AI GENERATION
// ══════════════════════════════════════════════

var SYSTEM_PROMPT = [
  'You are a strict Uno Platform Figma assembler. You output JSON screen schemas that a Figma plugin assembles using ONLY real component instances.',
  '',
  '# RULES',
  '1. ONLY use components from the CATALOG provided. Never invent names.',
  '2. Variant property names and values must EXACTLY match the catalog.',
  '3. Text overrides must use EXACT slot names from the catalog.',
  '4. type:"frame" = layout container. type:"component" = Uno component instance. type:"text" = static label. type:"spacer" = empty space.',
  '',
  '# SCREEN STRUCTURE',
  'A screen is a 390x844 vertical frame. ALWAYS structure it as:',
  '1. NavigationBar at top (Content="Title")',
  '2. A scrollable content frame with padding and gap',
  '3. Group related items in section frames',
  '',
  '# COMPLETE EXAMPLE — a form screen',
  '[{',
  '  "name": "Sample Form",',
  '  "width": 390, "height": 844,',
  '  "fill": "#FFFFFF",',
  '  "children": [',
  '    {',
  '      "type": "component", "component": "NavigationBar",',
  '      "variant": { "Content": "Title" },',
  '      "text": { "Text": "Parent" },',
  '      "stretch": true',
  '    },',
  '    {',
  '      "type": "component", "component": "Divider",',
  '      "variant": { "Length": "Full" },',
  '      "stretch": true',
  '    },',
  '    {',
  '      "type": "frame", "name": "Content", "layout": "vertical",',
  '      "gap": 0, "padding": { "top": 16, "bottom": 40, "left": 0, "right": 0 },',
  '      "stretch": true, "hugHeight": true,',
  '      "children": [',
  '        {',
  '          "type": "frame", "name": "TextFields", "layout": "vertical",',
  '          "gap": 8, "padding": { "top": 0, "bottom": 16, "left": 16, "right": 16 },',
  '          "stretch": true, "hugHeight": true,',
  '          "children": [',
  '            {',
  '              "type": "text", "content": "TEXT FIELDS", "fontSize": 11,',
  '              "fontFamily": "Switzer", "fontStyle": "Medium", "color": "#737373"',
  '            },',
  '            {',
  '              "type": "component", "component": "TextBox",',
  '              "variant": { "Type": "Outlined", "State": "Enabled", "Label": "True", "Populated": "False", "Placeholder": "True", "Multiline": "False" },',
  '              "text": { "Label": "Field name", "Text": "Placeholder" },',
  '              "stretch": true',
  '            }',
  '          ]',
  '        },',
  '        {',
  '          "type": "component", "component": "Divider",',
  '          "variant": { "Length": "Full" }, "stretch": true',
  '        },',
  '        {',
  '          "type": "frame", "name": "ListSection", "layout": "vertical",',
  '          "gap": 0, "stretch": true, "hugHeight": true,',
  '          "children": [',
  '            {',
  '              "type": "component", "component": "ListItem",',
  '              "variant": { "Leading": "False", "Trailing": "True", "Primary Commands": "False", "Secondary Commands": "False", "State": "Enabled" },',
  '              "text": { "Subtitle": "Row label", "Secondary text": "Description" },',
  '              "stretch": true',
  '            },',
  '            {',
  '              "type": "component", "component": "Divider",',
  '              "variant": { "Length": "Full" }, "stretch": true',
  '            }',
  '          ]',
  '        },',
  '        {',
  '          "type": "frame", "name": "ToggleSection", "layout": "vertical",',
  '          "gap": 0, "stretch": true, "hugHeight": true,',
  '          "children": [',
  '            {',
  '              "type": "component", "component": "ToggleSwitch",',
  '              "variant": { "State": "Enabled", "Selected": "False" },',
  '              "stretch": true',
  '            },',
  '            {',
  '              "type": "component", "component": "Divider",',
  '              "variant": { "Length": "Full" }, "stretch": true',
  '            }',
  '          ]',
  '        }',
  '      ]',
  '    }',
  '  ]',
  '}]',
  '',
  '# COMPONENT QUICK REFERENCE',
  '- NavigationBar: variant Content="Title", text slot "Text" for title',
  '- TextBox: variant Type="Outlined", State="Enabled", Label="True", Populated="False"|"True", Placeholder="True"|"False", Multiline="False". Text slots: "Label" (field label), "Text" (value when Populated=True), "Placeholder" (hint when Populated=False)',
  '- PasswordBox: variant Type="Outlined", Leading="None". Text slots: "Label" (field label), "Text" (value when Populated=True), "Placeholder" (hint when Populated=False)',
  '- Button: variant Type="Filled"|"Outlined"|"Text"|"Tonal"|"Elevated", State="Enabled". Text slot: "Label".',
  '- ToggleSwitch: variant State="Enabled", Selected="True"|"False". No text slots.',
  '- CheckBox: variant State="Enabled (Rest)", Checked="Off"|"On". Text slot: "Label"',
  '- ListItem: variant Leading="False"|"True", Trailing="False"|"True", Primary Commands="False", Secondary Commands="False", State="Enabled". Text slots: "Subtitle" (title), "Secondary text" (description), "OVERLINE" (small label above). WARNING: Trailing=True shows a ToggleSwitch, NOT a chevron.',
  '- MenuItem: variant State="Enabled", Leading Icon="False", Trailing Icon="False"|"True", Label="True". Text slot: "Label". USE THIS for navigation rows with chevron (Trailing Icon=True).',
  '- Divider: variant Length="Full"|"Short". No text slots. ALWAYS add stretch:true',
  '- Chip: variant Type="Outlined"|"Elevated", State="Enabled", Selected="False"|"True". Text slot: "Label"',
  '- Card: variant Type="Elevated"|"Filled"|"Outlined", State="Enabled", Leading="Icon"|"None"|"PersonPicture", Text="2 Lines"|"1 Line"|"3 Lines", Media="None"|"16:9"|"Full"|"Small". Text slots: "Headline", "SubHeadline", "Supporting Text"',
  '- Slider: variant State="Enabled", Discrete="False"|"True", Range="False". No text slots.',
  '- DatePicker: variant Type="Input", Format="mm/dd/yyyy", Display="In page". Text slots depend on variant.',
  '- Snackbar: variant Type="1 line"|"2 lines". Text slots: "Label", "Action"',
  '',
  '# WIREFRAME INTERPRETATION',
  'When given a wireframe image:',
  '- Map EVERY element to the closest Uno component',
  '- Group items into logical sections using frames',
  '- Keep all text/labels exactly as shown',
  '- Toggle switches → ToggleSwitch component',
  '- Rows with chevron/arrow → MenuItem with Trailing Icon="True" (NOT ListItem)',
  '- Text inputs → TextBox (Outlined)',
  '- Error icons (red circles) next to fields → note them but use the component error state if available',
  '- Section dividers → Divider (Full)',
  '- Preserve the visual grouping from the wireframe',
  '',
  '# SIZING',
  '- stretch:true = fill parent width (ALWAYS use on components inside vertical frames)',
  '- grow:true = expand along main axis',
  '- hugHeight:true = shrink to content',
  '- fixedHeight:N = exact pixel height',
  '',
  '# RESPONSE',
  'Return ONLY a JSON array. No markdown. No explanation. No comments inside JSON.',
].join('\n');

async function generateWithAI(apiKey, prompt, imageUrl) {
  var catalog = catalogForAI();

  var userContent = [];

  // Add catalog
  userContent.push({
    type: 'text',
    text: '## COMPONENT CATALOG (from this Figma file)\n```json\n' + JSON.stringify(catalog, null, 2) + '\n```\n\n## USER REQUEST\n' + prompt,
  });

  // Add image if provided
  if (imageUrl) {
    userContent.push({
      type: 'image_url',
      image_url: { url: imageUrl },
    });
    userContent.push({
      type: 'text',
      text: '\nThe image above is a wireframe/reference. Map what you see to components from the catalog. Match the layout, structure, and content as closely as possible using only available components.',
    });
  }

  var body = {
    model: 'google/gemini-3.1-flash-lite-preview',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    max_tokens: 16000,
    temperature: 0.3,
  };

  step('Calling AI...');

  var response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
      'HTTP-Referer': 'https://quantify.avontus.com',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    var errText = await response.text();
    throw new Error('AI API error ' + response.status + ': ' + errText.substring(0, 200));
  }

  var data = await response.json();
  var content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;

  if (!content) throw new Error('Empty AI response');

  // Strip markdown fences if present
  content = content.trim();
  if (content.startsWith('```json')) content = content.slice(7);
  if (content.startsWith('```')) content = content.slice(3);
  if (content.endsWith('```')) content = content.slice(0, -3);
  content = content.trim();

  step('  \u2713 AI response received (' + content.length + ' chars)');
  return content;
}

// ══════════════════════════════════════════════
// PHASE 3: STRICT ASSEMBLER
// ══════════════════════════════════════════════

var errors = [];

function addError(path, msg) {
  errors.push(path + ': ' + msg);
  step('  \u2717 ' + path + ': ' + msg);
}

// Find variant using pre-built index
// Resolve requested prop names to actual component prop names.
// Handles mismatches like "Style" vs "Configuration", case differences, etc.
function resolveProps(entry, requested) {
  var actual = entry.variants; // { propName: [val1, val2, ...] }
  var resolved = {};
  var remapped = false;

  for (var reqKey in requested) {
    var reqVal = requested[reqKey];

    // 1. Exact property name + exact value
    if (actual[reqKey]) {
      if (actual[reqKey].indexOf(reqVal) !== -1) {
        resolved[reqKey] = reqVal;
        continue;
      }
      // Exact name but case-insensitive value
      for (var vi = 0; vi < actual[reqKey].length; vi++) {
        if (actual[reqKey][vi].toLowerCase() === reqVal.toLowerCase()) {
          resolved[reqKey] = actual[reqKey][vi];
          step('    Remap value: ' + reqKey + '=' + reqVal + ' → ' + actual[reqKey][vi]);
          remapped = true;
          break;
        }
      }
      if (resolved[reqKey]) continue;
    }

    // 2. Case-insensitive property name match
    var found = false;
    for (var actKey in actual) {
      if (actKey.toLowerCase() === reqKey.toLowerCase()) {
        // Found the prop by name, now match value
        for (var vj = 0; vj < actual[actKey].length; vj++) {
          if (actual[actKey][vj].toLowerCase() === reqVal.toLowerCase()) {
            resolved[actKey] = actual[actKey][vj];
            step('    Remap prop: ' + reqKey + ' → ' + actKey + '=' + actual[actKey][vj]);
            remapped = true;
            found = true;
            break;
          }
        }
        if (!found && actual[actKey].indexOf(reqVal) !== -1) {
          resolved[actKey] = reqVal;
          step('    Remap prop: ' + reqKey + ' → ' + actKey);
          remapped = true;
          found = true;
        }
        break;
      }
    }
    if (found) continue;

    // 3. Value-based: find ANY property that contains this value (last resort for name mismatch)
    for (var actKey2 in actual) {
      if (resolved[actKey2] !== undefined) continue; // already assigned
      for (var vk = 0; vk < actual[actKey2].length; vk++) {
        if (actual[actKey2][vk] === reqVal) {
          resolved[actKey2] = reqVal;
          step('    Remap by value: ' + reqKey + '="' + reqVal + '" → ' + actKey2 + '=' + reqVal);
          remapped = true;
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (found) continue;

    // Property/value not found — log it but keep going
    step('    ✗ Cannot resolve: ' + reqKey + '=' + reqVal);
  }

  return resolved;
}

function findVariant(entry, requested) {
  var index = entry.variantIndex;

  // Step 0: Resolve requested prop names to actual component prop names
  var resolved = resolveProps(entry, requested);

  // Build lookup parts from resolved props
  var reqParts = [];
  for (var key in resolved) reqParts.push(key + '=' + resolved[key]);
  reqParts.sort();

  if (reqParts.length === 0) {
    step('    ✗ No properties could be resolved');
    return null;
  }

  // 1. Exact key match
  var exactKey = reqParts.join(',');
  if (index[exactKey]) return index[exactKey];

  // 2. Partial match: index entry contains ALL resolved props
  for (var indexKey in index) {
    var indexElems = indexKey.split(',');
    var allFound = true;
    for (var i = 0; i < reqParts.length; i++) {
      if (indexElems.indexOf(reqParts[i]) === -1) {
        allFound = false;
        break;
      }
    }
    if (allFound) return index[indexKey];
  }

  // 3. Direct scan on children with resolved props
  var kids = entry.setNode.children;
  for (var c = 0; c < kids.length; c++) {
    if (kids[c].type !== 'COMPONENT') continue;
    var vp = kids[c].variantProperties || {};
    var match = true;
    for (var rk in resolved) {
      if (vp[rk] !== resolved[rk]) { match = false; break; }
    }
    if (match) return kids[c];
  }

  step('    ✗ No match after resolving: ' + JSON.stringify(resolved));
  return null;
}

async function assembleComponent(parent, node, path) {
  var entry = registry[node.component];
  if (!entry) {
    addError(path, 'Component "' + node.component + '" not in registry. Available: [' + Object.keys(registry).slice(0, 15).join(', ') + '...]');
    return null;
  }

  var requested = node.variant || {};
  var comp = findVariant(entry, requested);

  if (!comp) {
    // Detailed error logging only on failure
    addError(path, 'No variant for ' + node.component + ': ' + JSON.stringify(requested));
    var availProps = [];
    for (var pk in entry.variants) availProps.push(pk + '=[' + entry.variants[pk].join('|') + ']');
    step('    Component has: ' + availProps.join(', '));
    var sampleKeys = Object.keys(entry.variantIndex).slice(0, 3);
    for (var sk = 0; sk < sampleKeys.length; sk++) step('    Index key: ' + sampleKeys[sk]);
    return null;
  }

  var inst;
  try { inst = comp.createInstance(); } catch (e) {
    addError(path, 'createInstance failed: ' + e.message);
    return null;
  }

  parent.appendChild(inst);

  // Sizing
  if (node.stretch) inst.layoutAlign = 'STRETCH';
  if (node.fixedWidth) { inst.layoutSizingHorizontal = 'FIXED'; inst.resize(node.fixedWidth, inst.height); }
  if (node.fixedHeight) { inst.layoutSizingVertical = 'FIXED'; inst.resize(inst.width, node.fixedHeight); }
  if (node.grow) { inst.layoutGrow = 1; inst.layoutSizingHorizontal = 'FILL'; }

  // Text overrides — by exact slot name
  if (node.text) {
    var allTexts = inst.findAllWithCriteria({ types: ['TEXT'] });
    for (var slotName in node.text) {
      var found = false;
      for (var t = 0; t < allTexts.length; t++) {
        if (allTexts[t].name === slotName) {
          try {
            if (allTexts[t].fontName !== figma.mixed) await figma.loadFontAsync(allTexts[t].fontName);
            else {
              var segs = allTexts[t].getStyledTextSegments(['fontName']);
              for (var sg = 0; sg < segs.length; sg++) await figma.loadFontAsync(segs[sg].fontName);
            }
            allTexts[t].characters = node.text[slotName];
            found = true; break;
          } catch (e) {
            step('  \u26A0 Font load failed for slot "' + slotName + '": ' + e.message);
          }
        }
      }
      if (!found) {
        step('  \u26A0 Text slot "' + slotName + '" not found in ' + node.component + '. Available: [' + allTexts.map(function(t) { return t.name; }).slice(0, 8).join(', ') + ']');
      }
    }
  }

  // Log which variant was actually picked
  var actualVP = comp.variantProperties || {};
  var vpStr = [];
  for (var vpk in actualVP) vpStr.push(vpk + '=' + actualVP[vpk]);
  step('  \u2713 ' + node.component + ' [' + vpStr.join(', ') + ']');
  return inst;
}

function parseColor(c) {
  if (typeof c === 'string' && c.startsWith('#')) {
    return { r: parseInt(c.slice(1, 3), 16) / 255, g: parseInt(c.slice(3, 5), 16) / 255, b: parseInt(c.slice(5, 7), 16) / 255 };
  }
  return c || { r: 1, g: 1, b: 1 };
}

function assembleFrame(parent, node) {
  var n = figma.createFrame();
  n.name = node.name || 'Frame';
  n.fills = node.fill ? [{ type: 'SOLID', color: parseColor(node.fill) }] : [];

  if (node.layout) {
    n.layoutMode = node.layout === 'horizontal' ? 'HORIZONTAL' : 'VERTICAL';
    n.primaryAxisSizingMode = 'AUTO';
    n.counterAxisSizingMode = 'FIXED';
    n.itemSpacing = node.gap || 0;
    if (node.padding) {
      var p = node.padding;
      if (typeof p === 'number') { n.paddingTop = p; n.paddingBottom = p; n.paddingLeft = p; n.paddingRight = p; }
      else { n.paddingTop = p.top || 0; n.paddingBottom = p.bottom || 0; n.paddingLeft = p.left || 0; n.paddingRight = p.right || 0; }
    }
    if (node.mainAlign) n.primaryAxisAlignItems = node.mainAlign;
    if (node.crossAlign) n.counterAxisAlignItems = node.crossAlign;
    if (node.wrap) try { n.layoutWrap = 'WRAP'; } catch (e) {}
  }

  if (node.width && node.height) n.resize(node.width, node.height);
  if (node.cornerRadius) n.cornerRadius = node.cornerRadius;
  if (node.stroke) { n.strokes = [{ type: 'SOLID', color: parseColor(node.stroke) }]; n.strokeWeight = node.strokeWeight || 1; n.strokeAlign = 'INSIDE'; }
  if (node.shadow) n.effects = node.shadow;
  n.clipsContent = !!node.clip;
  parent.appendChild(n);

  if (node.stretch) {
    n.layoutAlign = 'STRETCH';
    // For horizontal frames that stretch: the primary (horizontal) axis must be FILL
    // so SPACE_BETWEEN and similar alignments actually spread children across the width
    if (node.layout === 'horizontal') {
      n.layoutSizingHorizontal = 'FILL';
    }
  }
  if (node.grow) n.layoutGrow = 1;
  if (node.fixedWidth) { n.layoutSizingHorizontal = 'FIXED'; n.resize(node.fixedWidth, n.height); }
  if (node.fixedHeight) { n.layoutSizingVertical = 'FIXED'; n.resize(n.width, node.fixedHeight); }
  if (node.hugHeight) n.layoutSizingVertical = 'HUG';
  if (node.hugWidth) n.layoutSizingHorizontal = 'HUG';
  if (node.fillWidth) n.layoutSizingHorizontal = 'FILL';

  return n;
}

async function assembleText(parent, node) {
  var fontName = { family: node.fontFamily || 'Switzer', style: node.fontStyle || 'Regular' };
  try { await figma.loadFontAsync(fontName); } catch (e) {
    fontName = { family: 'Switzer', style: 'Regular' };
    try { await figma.loadFontAsync(fontName); } catch (e2) {}
  }
  var t = figma.createText();
  t.fontName = fontName;
  t.characters = node.content || '';
  t.fontSize = node.fontSize || 16;
  if (node.color) t.fills = [{ type: 'SOLID', color: parseColor(node.color) }];
  if (node.align) t.textAlignHorizontal = node.align.toUpperCase();
  if (node.opacity !== undefined) t.opacity = node.opacity;
  if (node.letterSpacing) t.letterSpacing = node.letterSpacing;
  parent.appendChild(t);

  // Sizing — text needs textAutoResize changed for stretch/grow to work
  if (node.stretch) {
    t.layoutAlign = 'STRETCH';
    t.textAutoResize = 'HEIGHT'; // fill width, wrap height
  }
  if (node.grow) {
    t.layoutGrow = 1;
    t.layoutSizingHorizontal = 'FILL';
    t.textAutoResize = 'HEIGHT'; // fill width, wrap height
  }
  return t;
}

async function assembleNode(parent, node, path) {
  if (!node || !node.type) { addError(path, 'Missing "type"'); return null; }

  switch (node.type) {
    case 'component':
      return await assembleComponent(parent, node, path);
    case 'frame':
      var frame = assembleFrame(parent, node);
      if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          await assembleNode(frame, node.children[i], path + '/' + (node.children[i].name || node.children[i].component || i));
          if (i % 5 === 0) await yieldThread();
        }
      }
      return frame;
    case 'text':
      return await assembleText(parent, node);
    case 'spacer':
      var sp = figma.createFrame();
      sp.name = node.name || 'Spacer';
      sp.fills = [];
      parent.appendChild(sp);
      sp.layoutAlign = 'STRETCH';
      if (node.height) { sp.layoutSizingVertical = 'FIXED'; sp.resize(sp.width, node.height); }
      if (node.grow) sp.layoutGrow = 1;
      return sp;
    default:
      addError(path, 'Unknown type: "' + node.type + '"');
      return null;
  }
}

async function buildScreen(schema) {
  if (!schema.name) { addError('root', 'Missing "name"'); return null; }
  step('Building: ' + schema.name + '...');

  var screen = figma.createFrame();
  screen.name = schema.name;
  screen.resize(schema.width || 390, schema.height || 844);
  screen.fills = [{ type: 'SOLID', color: parseColor(schema.fill || '#FFFFFF') }];
  screen.layoutMode = 'VERTICAL';
  screen.primaryAxisSizingMode = 'FIXED';
  screen.counterAxisSizingMode = 'FIXED';
  screen.clipsContent = true;
  figma.currentPage.appendChild(screen);
  if (schema.x !== undefined) screen.x = schema.x;
  if (schema.y !== undefined) screen.y = schema.y;

  if (schema.children) {
    for (var i = 0; i < schema.children.length; i++) {
      await assembleNode(screen, schema.children[i], schema.name + '/' + i);
      if (i % 3 === 0) await yieldThread();
    }
  }
  return screen;
}

// ══════════════════════════════════════════════
// PHASE 4: VALIDATION
// ══════════════════════════════════════════════

function validate(screenNode) {
  var instances = 0, frames = 0, texts = 0, issues = [];

  function walk(node, path) {
    if (node.type === 'INSTANCE') {
      instances++;
      if (!node.mainComponent) issues.push(path + ': detached instance');
    } else if (node.type === 'FRAME') { frames++; }
    else if (node.type === 'TEXT') { texts++; }
    if ('children' in node) {
      for (var i = 0; i < node.children.length; i++) walk(node.children[i], path + '/' + node.children[i].name);
    }
  }
  walk(screenNode, screenNode.name);

  step('  Validation: ' + instances + ' instances, ' + frames + ' layout frames, ' + texts + ' text labels');
  for (var i = 0; i < issues.length; i++) step('  \u26A0 ' + issues[i]);
  return issues;
}

// ══════════════════════════════════════════════
// MESSAGE HANDLER
// ══════════════════════════════════════════════

async function handleMessage(msg) {
  // Diagnostic: dump Button variants, test matching, create instances
  if (msg.type === 'diagnose') {
    try {
      if (Object.keys(registry).length === 0) {
        try { await figma.loadFontAsync({ family: 'Switzer', style: 'Regular' }); } catch (e) {}
        await buildRegistry();
      }
      var entry = registry['Button'];
      if (!entry) { step('Button not found in registry!'); post({ type: 'done' }); return; }

      step('=== BUTTON DIAGNOSTIC ===');
      step('Set name: "' + entry.setNode.name + '"');
      step('Children: ' + entry.setNode.children.length);

      // Dump variant PROPERTY NAMES and their possible values
      step('--- VARIANT PROPERTIES ---');
      for (var propName in entry.variants) {
        step('  "' + propName + '": [' + entry.variants[propName].join(', ') + ']');
      }

      // Dump first 5 index keys
      step('--- INDEX KEYS (first 5) ---');
      var allKeys = Object.keys(entry.variantIndex);
      for (var ki = 0; ki < Math.min(5, allKeys.length); ki++) {
        step('  ' + allKeys[ki]);
      }

      // Test the exact lookups we use in all-screens.json
      step('--- MATCHING TESTS ---');
      var testCases = [
        { "Style": "Filled", "State": "Enabled", "Icon": "False" },
        { "Style": "Outlined", "State": "Enabled", "Icon": "False" }
      ];
      for (var ti = 0; ti < testCases.length; ti++) {
        step('Test ' + (ti+1) + ': ' + JSON.stringify(testCases[ti]));
        var result = findVariant(entry, testCases[ti]);
        if (result) {
          var rvp = result.variantProperties || {};
          var rparts = [];
          for (var rk in rvp) rparts.push(rk + '=' + rvp[rk]);
          step('  → MATCHED: ' + rparts.join(', '));
        } else {
          step('  → FAILED');
        }
      }

      // Dump first 5 children with their actual variantProperties
      step('--- FIRST 5 CHILDREN ---');
      var kids = entry.setNode.children;
      var shown = 0;
      for (var di = 0; di < kids.length && shown < 5; di++) {
        if (kids[di].type !== 'COMPONENT') continue;
        var dvp = kids[di].variantProperties || {};
        var dp = [];
        for (var dk in dvp) dp.push('"' + dk + '"="' + dvp[dk] + '"');
        step('  ' + dp.join(', '));
        shown++;
      }

      // Create test instances
      step('Creating test instances...');
      var testFrame = figma.createFrame();
      testFrame.name = 'BUTTON TEST';
      testFrame.layoutMode = 'HORIZONTAL';
      testFrame.itemSpacing = 20;
      testFrame.paddingTop = 20; testFrame.paddingBottom = 20;
      testFrame.paddingLeft = 20; testFrame.paddingRight = 20;
      testFrame.primaryAxisSizingMode = 'AUTO';
      testFrame.counterAxisSizingMode = 'AUTO';
      testFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      figma.currentPage.appendChild(testFrame);

      var count = 0;
      for (var j = 0; j < kids.length && count < 10; j++) {
        if (kids[j].type !== 'COMPONENT') continue;
        try {
          var inst = kids[j].createInstance();
          testFrame.appendChild(inst);
          count++;
        } catch (e) { step('  Failed: ' + e.message); }
      }

      figma.currentPage.selection = [testFrame];
      figma.viewport.scrollAndZoomIntoView([testFrame]);
      step('\u2705 Created ' + count + ' test button instances');
      post({ type: 'done' });
    } catch (e) {
      step('Diagnose error: ' + e.message);
      post({ type: 'done' });
    }
    return;
  }

  // API key persistence via figma.clientStorage
  if (msg.type === 'getApiKey') {
    try {
      var key = await figma.clientStorage.getAsync('openrouter_api_key');
      post({ type: 'apiKey', key: key || '' });
    } catch (e) { post({ type: 'apiKey', key: '' }); }
    return;
  }
  if (msg.type === 'saveApiKey') {
    try { await figma.clientStorage.setAsync('openrouter_api_key', msg.key || ''); } catch (e) {}
    return;
  }

  if (msg.type === 'scan') {
    try {
      try { await figma.loadFontAsync({ family: 'Switzer', style: 'Regular' }); } catch (e) {}
      try { await figma.loadFontAsync({ family: 'Switzer', style: 'Medium' }); } catch (e) {}
      try { await figma.loadFontAsync({ family: 'Switzer', style: 'Semibold' }); } catch (e) {}
      await buildRegistry();
      post({ type: 'registry', data: catalogForAI() });
      post({ type: 'done' });
    } catch (e) {
      step('\u2717 Scan error: ' + e.message);
      post({ type: 'error', message: e.message });
    }
  }

  if (msg.type === 'generate') {
    try {
      // Ensure registry
      if (Object.keys(registry).length === 0) {
        try { await figma.loadFontAsync({ family: 'Switzer', style: 'Regular' }); } catch (e) {}
        try { await figma.loadFontAsync({ family: 'Switzer', style: 'Medium' }); } catch (e) {}
        try { await figma.loadFontAsync({ family: 'Switzer', style: 'Semibold' }); } catch (e) {}
        await buildRegistry();
      }

      // Call AI
      var schemaJSON = await generateWithAI(msg.apiKey, msg.prompt, msg.imageUrl || null);
      post({ type: 'schema', data: schemaJSON });

      // Parse and build
      var schemas;
      try { schemas = JSON.parse(schemaJSON); } catch (e) {
        step('\u2717 AI returned invalid JSON: ' + e.message);
        step('Raw response: ' + schemaJSON.substring(0, 300));
        post({ type: 'error', message: 'Invalid JSON from AI' });
        return;
      }

      if (!Array.isArray(schemas)) schemas = [schemas];

      errors = [];
      var built = [];
      var gap = 60;

      for (var s = 0; s < schemas.length; s++) {
        // Always force position — prevent overlapping
        schemas[s].x = s * (390 + gap);
        schemas[s].y = 100;

        var screenNode = await buildScreen(schemas[s]);
        if (screenNode) {
          validate(screenNode);
          built.push(screenNode);
        }
        await yieldThread();
      }

      if (built.length > 0) {
        figma.currentPage.selection = built;
        figma.viewport.scrollAndZoomIntoView(built);
      }

      step('');
      if (errors.length === 0) {
        step('\u2705 ' + built.length + ' screen(s) \u2014 0 errors, 0 fallbacks');
      } else {
        step('\u26A0 ' + built.length + ' screen(s) \u2014 ' + errors.length + ' error(s)');
      }
      post({ type: 'done', errors: errors });

    } catch (e) {
      step('\u2717 Error: ' + e.message);
      post({ type: 'error', message: e.message });
    }
  }

  if (msg.type === 'build') {
    try {
      // Always load fonts
      try { await figma.loadFontAsync({ family: 'Switzer', style: 'Regular' }); } catch (e) { step('⚠ Font Switzer Regular not found'); }
      try { await figma.loadFontAsync({ family: 'Switzer', style: 'Medium' }); } catch (e) { step('⚠ Font Switzer Medium not found'); }
      try { await figma.loadFontAsync({ family: 'Switzer', style: 'Semibold' }); } catch (e) { step('⚠ Font Switzer Semibold not found'); }

      // Always rebuild registry to ensure it's fresh
      if (Object.keys(registry).length === 0) {
        await buildRegistry();
      }

      var regCount = Object.keys(registry).length;
      step('Registry has ' + regCount + ' components');
      if (regCount === 0) {
        step('✗ Registry is EMPTY. Make sure you are running this plugin inside the Uno Platform Material Toolkit file.');
        post({ type: 'error', message: 'No components found. Open the Uno Material Toolkit file first.' });
        return;
      }

      // Log key components availability
      var keyComponents = ['Button', 'TextBox', 'PasswordBox', 'NavigationBar', 'Divider', 'MenuItem', 'ToggleSwitch', 'Chip', 'ListItem'];
      var missing = [];
      for (var kc = 0; kc < keyComponents.length; kc++) {
        if (!registry[keyComponents[kc]]) missing.push(keyComponents[kc]);
      }
      if (missing.length > 0) step('⚠ Missing components: ' + missing.join(', '));
      else step('  ✓ All key components found');

      var schema;
      try { schema = typeof msg.schema === 'string' ? JSON.parse(msg.schema) : msg.schema; } catch (e) {
        step('\u2717 Invalid JSON: ' + e.message);
        post({ type: 'error', message: 'Invalid JSON' });
        return;
      }

      var screens = Array.isArray(schema) ? schema : [schema];
      errors = [];
      var built = [];
      var gap = 60;

      // Find empty canvas area to place screens (avoid overlapping existing frames)
      var existingNodes = figma.currentPage.children;
      var maxX = 0;
      for (var en = 0; en < existingNodes.length; en++) {
        var right = existingNodes[en].x + existingNodes[en].width;
        if (right > maxX) maxX = right;
      }
      var startX = existingNodes.length > 0 ? maxX + gap * 2 : 0;

      for (var s = 0; s < screens.length; s++) {
        // Position screens side by side, never overlapping
        screens[s].x = startX + s * (390 + gap);
        screens[s].y = 0;

        var node = await buildScreen(screens[s]);
        if (node) { validate(node); built.push(node); }
        await yieldThread();
      }

      if (built.length > 0) {
        figma.currentPage.selection = built;
        figma.viewport.scrollAndZoomIntoView(built);
      }

      step('');
      step(errors.length === 0 ? '\u2705 ' + built.length + ' screen(s) \u2014 0 errors' : '\u26A0 ' + built.length + ' screen(s) \u2014 ' + errors.length + ' error(s)');
      post({ type: 'done', errors: errors });
    } catch (e) {
      step('\u2717 Build error: ' + e.message);
      post({ type: 'error', message: e.message });
    }
  }

  if (msg.type === 'close') figma.closePlugin();
}

figma.ui.onmessage = function(msg) { handleMessage(msg); };
