// ============================================================
// Quantify Design System → Figma Importer v2
// Foundations + 25 Component Sets
// ============================================================

figma.showUI(__html__, { width: 480, height: 600, title: 'Quantify DS → Figma' });

// ─── Utilities ──────────────────────────────────────────────

function hex(h) {
  return { r: parseInt(h.slice(1,3),16)/255, g: parseInt(h.slice(3,5),16)/255, b: parseInt(h.slice(5,7),16)/255 };
}
function hexA(h, a) { var c=hex(h); return { r:c.r, g:c.g, b:c.b, a:a }; }
function post(msg) { figma.ui.postMessage(msg); }
function step(text) { post({ type:'step', text:text }); }
function removeByName(arr, name) { arr.filter(function(x){return x.name===name;}).forEach(function(x){x.remove();}); }
function solidFill(h, op) { var f={type:'SOLID',color:hex(h)}; if(op!==undefined&&op!==1) f.opacity=op; return f; }
function addText(parent, opts) {
  var t = figma.createText();
  t.fontName = { family: opts.font, style: opts.style||'Regular' };
  t.characters = opts.text;
  t.fontSize = opts.size||14;
  t.fills = [solidFill(opts.color||'#202020')];
  t.x = opts.x||0; t.y = opts.y||0;
  if (opts.w) { t.resize(opts.w, t.height); t.textAutoResize='HEIGHT'; }
  parent.appendChild(t);
  return t;
}
function addRect(parent, opts) {
  var r = figma.createRectangle();
  r.resize(opts.w, opts.h);
  r.x = opts.x||0; r.y = opts.y||0;
  r.fills = [solidFill(opts.fill||'#FFFFFF', opts.fillOp)];
  if (opts.radius) r.cornerRadius = opts.radius;
  if (opts.stroke) {
    r.strokes = [{type:'SOLID',color:hex(opts.stroke)}];
    r.strokeWeight = opts.strokeW||1;
    r.strokeAlign = 'INSIDE';
  }
  parent.appendChild(r);
  return r;
}
function sectionLabel(page, font, text, x, y) {
  var label = figma.createText();
  label.fontName = { family:font, style:'Semibold' };
  label.characters = text;
  label.fontSize = 11;
  label.fills = [solidFill('#ABABAB')];
  label.letterSpacing = { unit:'PERCENT', value:6 };
  label.x = x; label.y = y;
  page.appendChild(label);
}

// ─── Token Data ─────────────────────────────────────────────

var PRIMITIVES = {
  'blue/lightest':'#E8EEFF','blue/light':'#6F9DFF','blue/main':'#0A3EFF',
  'blue/dark':'#10296E','blue/darkest':'#0A1A4A',
  'gray/white':'#FFFFFF','gray/50':'#F8F8F8','gray/100':'#EEEEEE',
  'gray/200':'#D4D4D4','gray/300':'#ABABAB','gray/400':'#787878',
  'gray/500':'#545454','gray/600':'#363636','gray/700':'#202020',
  'semantic/error':'#E64059','semantic/error-container':'#FFE5E9','semantic/on-error-cont':'#5F1422',
  'semantic/warning':'#F9A825','semantic/warning-container':'#FFF3CD','semantic/on-warning-cont':'#5D4300',
  'semantic/success':'#22C55E','semantic/success-container':'#DCFCE7','semantic/on-success-cont':'#14532D',
  'dark/bg':'#0A0A0E','dark/surface':'#101016','dark/surface-2':'#16161E','dark/surface-3':'#20202A',
};

var SEM_LIGHT = {
  'color/primary':'blue/main','color/on-primary':'gray/white',
  'color/primary-container':'blue/lightest','color/on-primary-container':'blue/dark',
  'color/background':'gray/white','color/surface':'gray/50',
  'color/surface-2':'gray/100','color/surface-3':'gray/200',
  'color/on-surface':'gray/700','color/on-surface-variant':'gray/500',
  'color/outline':'gray/300','color/outline-variant':'gray/200',
  'color/error':'semantic/error','color/error-container':'semantic/error-container',
  'color/on-error-container':'semantic/on-error-cont',
  'color/warning':'semantic/warning','color/warning-container':'semantic/warning-container',
  'color/on-warning-container':'semantic/on-warning-cont',
  'color/success':'semantic/success','color/success-container':'semantic/success-container',
  'color/on-success-container':'semantic/on-success-cont',
};

var SEM_DARK = {
  'color/primary':'blue/main','color/on-primary':'gray/white',
  'color/primary-container':'blue/dark','color/on-primary-container':'blue/light',
  'color/background':'dark/bg','color/surface':'dark/surface',
  'color/surface-2':'dark/surface-2','color/surface-3':'dark/surface-3',
  'color/on-surface':'gray/white','color/on-surface-variant':'gray/300',
  'color/outline':'gray/600','color/outline-variant':'gray/500',
  'color/error':'semantic/error','color/error-container':'semantic/on-error-cont',
  'color/on-error-container':'semantic/error-container',
  'color/warning':'semantic/warning','color/warning-container':'semantic/on-warning-cont',
  'color/on-warning-container':'semantic/warning-container',
  'color/success':'semantic/success','color/success-container':'semantic/on-success-cont',
  'color/on-success-container':'semantic/success-container',
};

var SPACING_VALS = [4,8,12,16,24,32,40,48,56,104];

var TYPE_STYLES = [
  // Quantify brand scale — Bold for hero, Semibold for headings, proper leading
  {name:'Quantify/H1',px:76,w:'Bold',lh:105,ls:-3},
  {name:'Quantify/H2',px:49,w:'Semibold',lh:110,ls:-2.5},
  {name:'Quantify/H3',px:39,w:'Semibold',lh:115,ls:-1.5},
  {name:'Quantify/H4',px:31,w:'Semibold',lh:120,ls:-1},
  {name:'Quantify/H5',px:25,w:'Medium',lh:128,ls:-0.5},
  {name:'Quantify/H6',px:20,w:'Medium',lh:135,ls:-0.3},
  {name:'Quantify/Body',px:16,w:'Regular',lh:160,ls:0},
  {name:'Quantify/Body Small',px:14,w:'Regular',lh:157,ls:0.1},
  {name:'Quantify/Caption',px:12,w:'Medium',lh:150,ls:0.3},
  {name:'Quantify/Small',px:13,w:'Regular',lh:150,ls:0.1},
  {name:'Quantify/Overline',px:11,w:'Semibold',lh:145,ls:5},
  // MD3 scale — adapted for Switzer with proper weight hierarchy
  {name:'MD3/Display Large',px:57,w:'Regular',lh:112,ls:-0.44},
  {name:'MD3/Display Medium',px:45,w:'Regular',lh:116,ls:0},
  {name:'MD3/Display Small',px:36,w:'Regular',lh:122,ls:0},
  {name:'MD3/Headline Large',px:32,w:'Semibold',lh:125,ls:-0.5},
  {name:'MD3/Headline Medium',px:28,w:'Semibold',lh:129,ls:-0.3},
  {name:'MD3/Headline Small',px:24,w:'Semibold',lh:133,ls:0},
  {name:'MD3/Title Large',px:22,w:'Medium',lh:127,ls:0},
  {name:'MD3/Title Medium',px:16,w:'Medium',lh:150,ls:0.94},
  {name:'MD3/Title Small',px:14,w:'Medium',lh:143,ls:0.71},
  {name:'MD3/Body Large',px:16,w:'Regular',lh:160,ls:0.5},
  {name:'MD3/Body Medium',px:14,w:'Regular',lh:157,ls:0.25},
  {name:'MD3/Body Small',px:12,w:'Regular',lh:150,ls:0.4},
  {name:'MD3/Label Large',px:14,w:'Medium',lh:143,ls:0.71},
  {name:'MD3/Label Medium',px:12,w:'Medium',lh:133,ls:4.17},
  {name:'MD3/Label Small',px:11,w:'Medium',lh:145,ls:4.55},
];

var ELEVATIONS = [
  {name:'Elevation/0 · Flat',shadows:[]},
  {name:'Elevation/1 · Card',shadows:[{c:hexA('#0A3EFF',0.06),y:1,r:3},{c:hexA('#000000',0.04),y:1,r:2}]},
  {name:'Elevation/2 · Raised',shadows:[{c:hexA('#0A3EFF',0.08),y:4,r:12},{c:hexA('#000000',0.04),y:2,r:4}]},
  {name:'Elevation/3 · Nav',shadows:[{c:hexA('#0A3EFF',0.10),y:8,r:24},{c:hexA('#000000',0.05),y:4,r:8}]},
  {name:'Elevation/4 · Modal',shadows:[{c:hexA('#0A3EFF',0.12),y:16,r:40},{c:hexA('#000000',0.06),y:8,r:16}]},
  {name:'Elevation/5 · Dialog',shadows:[{c:hexA('#0A3EFF',0.14),y:24,r:56},{c:hexA('#000000',0.08),y:12,r:24}]},
];

var PAINT_STYLES = [
  {name:'Brand/Blue Main',h:'#0A3EFF'},{name:'Brand/Blue Light',h:'#6F9DFF'},
  {name:'Brand/Blue Dark',h:'#10296E'},{name:'Brand/Blue Lightest',h:'#E8EEFF'},
  {name:'Brand/Blue Darkest',h:'#0A1A4A'},
  {name:'Neutral/White',h:'#FFFFFF'},{name:'Neutral/Gray 50',h:'#F8F8F8'},
  {name:'Neutral/Gray 100',h:'#EEEEEE'},{name:'Neutral/Gray 200',h:'#D4D4D4'},
  {name:'Neutral/Gray 300',h:'#ABABAB'},{name:'Neutral/Gray 400',h:'#787878'},
  {name:'Neutral/Gray 500',h:'#545454'},{name:'Neutral/Gray 600',h:'#363636'},
  {name:'Neutral/Gray 700',h:'#202020'},
  {name:'Semantic/Error',h:'#E64059'},{name:'Semantic/Error Bg',h:'#FFE5E9'},
  {name:'Semantic/Warning',h:'#F9A825'},{name:'Semantic/Warning Bg',h:'#FFF3CD'},
  {name:'Semantic/Success',h:'#22C55E'},{name:'Semantic/Success Bg',h:'#DCFCE7'},
  {name:'Surface/Background',h:'#FFFFFF'},{name:'Surface/Surface',h:'#F8F8F8'},
  {name:'Surface/Surface 2',h:'#EEEEEE'},{name:'Surface/Divider',h:'#E2E2E2'},
];

// ─── Entry Point ────────────────────────────────────────────

figma.ui.onmessage = async function(msg) {
  if (msg.type==='run') { run(); }
  if (msg.type==='close') { figma.closePlugin(); }
};

async function run() {
  try {
    step('Loading fonts...');
    // Inter Regular is required by Figma internally (text style default) — not used in DS
    await figma.loadFontAsync({family:'Inter',style:'Regular'});
    await figma.loadFontAsync({family:'Switzer',style:'Regular'});
    await figma.loadFontAsync({family:'Switzer',style:'Medium'});
    await figma.loadFontAsync({family:'Switzer',style:'Semibold'});
    await figma.loadFontAsync({family:'Switzer',style:'Bold'});
    var font = 'Switzer';
    step('Font: Switzer (Regular / Medium / Semibold / Bold) loaded');
    try { await figma.loadFontAsync({family:'JetBrains Mono',style:'Regular'}); } catch(e) {}

    step('Cleaning up previous imports...');
    // Remove ALL old DS pages first
    var dsPageNames = ['🎨 Foundations', '🧩 Components', '📱 Screens',
                       '🎨 Quantify Design System'];
    // Ensure at least one non-DS page exists so we can delete DS pages
    var hasUserPage = false;
    for (var pi = 0; pi < figma.root.children.length; pi++) {
      if (dsPageNames.indexOf(figma.root.children[pi].name) === -1) {
        hasUserPage = true;
        break;
      }
    }
    if (!hasUserPage) {
      var tempPage = figma.createPage();
      tempPage.name = 'Page 1';
      figma.currentPage = tempPage;
    }
    // Now remove all old DS pages
    var oldPages = [];
    for (var pi2 = 0; pi2 < figma.root.children.length; pi2++) {
      var pg = figma.root.children[pi2];
      if (dsPageNames.indexOf(pg.name) !== -1) {
        oldPages.push(pg);
      }
    }
    // Switch away from any page we're about to delete
    if (oldPages.length > 0) {
      for (var pi3 = 0; pi3 < figma.root.children.length; pi3++) {
        if (dsPageNames.indexOf(figma.root.children[pi3].name) === -1) {
          figma.currentPage = figma.root.children[pi3];
          break;
        }
      }
    }
    for (var ri = 0; ri < oldPages.length; ri++) {
      oldPages[ri].remove();
    }

    step('Setting up pages...');
    var foundationsPage = figma.createPage();
    foundationsPage.name = '🎨 Foundations';
    var componentsPage = figma.createPage();
    componentsPage.name = '🧩 Components';
    var screensPage = figma.createPage();
    screensPage.name = '📱 Screens';
    figma.currentPage = foundationsPage;

    step('Creating color variables...');
    var primMap = await makePrimitiveVars();
    await makeSemanticVars(primMap);
    await makeSpacingVars();

    step('Creating text styles...');
    await makeTextStyles(font);

    step('Creating effect + paint styles...');
    await makeEffectStyles();
    await makePaintStyles();

    step('Building Foundations page...');
    await buildFoundationsPage(foundationsPage, font);

    step('Building Components (1/4): Form elements...');
    figma.currentPage = componentsPage;
    Array.from(componentsPage.children).forEach(function(n){n.remove();});
    var cX = 80; var cY = 100;
    addText(componentsPage,{font:font,style:'Semibold',text:'Quantify Component Library',size:32,color:'#202020',x:80,y:40});

    var btnSet = await mkButtons(font);
    sectionLabel(componentsPage,font,'BUTTON',80,cY); cY+=20;
    btnSet.x=80; btnSet.y=cY; cY+=btnSet.height+80;

    var tfSet = await mkTextFields(font);
    sectionLabel(componentsPage,font,'TEXT FIELD',80,cY); cY+=20;
    tfSet.x=80; tfSet.y=cY; cY+=tfSet.height+80;

    var cbSet = await mkCheckboxes(font);
    sectionLabel(componentsPage,font,'CHECKBOX',80,cY); cY+=20;
    cbSet.x=80; cbSet.y=cY; cY+=cbSet.height+80;

    var rbSet = await mkRadioButtons(font);
    sectionLabel(componentsPage,font,'RADIO BUTTON',80,cY); cY+=20;
    rbSet.x=80; rbSet.y=cY; cY+=rbSet.height+80;

    var tgSet = await mkToggles(font);
    sectionLabel(componentsPage,font,'TOGGLE SWITCH',80,cY); cY+=20;
    tgSet.x=80; tgSet.y=cY; cY+=tgSet.height+80;

    var selSet = await mkSelect(font);
    sectionLabel(componentsPage,font,'SELECT / DROPDOWN',80,cY); cY+=20;
    selSet.x=80; selSet.y=cY; cY+=selSet.height+80;

    step('Building Components (2/4): Display elements...');

    var badgeSet = await mkBadges(font);
    sectionLabel(componentsPage,font,'BADGE',80,cY); cY+=20;
    badgeSet.x=80; badgeSet.y=cY; cY+=badgeSet.height+80;

    var chipSet = await mkChips(font);
    sectionLabel(componentsPage,font,'CHIP',80,cY); cY+=20;
    chipSet.x=80; chipSet.y=cY; cY+=chipSet.height+80;

    var cardSet = await mkCards(font);
    sectionLabel(componentsPage,font,'CARD',80,cY); cY+=20;
    cardSet.x=80; cardSet.y=cY; cY+=cardSet.height+80;

    var infoSet = await mkInfoBars(font);
    sectionLabel(componentsPage,font,'ALERT / INFO BAR',80,cY); cY+=20;
    infoSet.x=80; infoSet.y=cY; cY+=infoSet.height+80;

    step('Building Components (3/4): Navigation & layout...');

    var fabSet = await mkFABs(font);
    sectionLabel(componentsPage,font,'FAB',80,cY); cY+=20;
    fabSet.x=80; fabSet.y=cY; cY+=fabSet.height+80;

    var avatarSet = await mkAvatars(font);
    sectionLabel(componentsPage,font,'AVATAR',80,cY); cY+=20;
    avatarSet.x=80; avatarSet.y=cY; cY+=avatarSet.height+80;

    var tooltipSet = await mkTooltip(font);
    sectionLabel(componentsPage,font,'TOOLTIP',80,cY); cY+=20;
    tooltipSet.x=80; tooltipSet.y=cY; cY+=tooltipSet.height+80;

    var progSet = await mkProgressBars(font);
    sectionLabel(componentsPage,font,'PROGRESS BAR',80,cY); cY+=20;
    progSet.x=80; progSet.y=cY; cY+=progSet.height+80;

    var circProgSet = await mkCircularProgress(font);
    sectionLabel(componentsPage,font,'CIRCULAR PROGRESS',80,cY); cY+=20;
    circProgSet.x=80; circProgSet.y=cY; cY+=circProgSet.height+80;

    var listSet = await mkListItem(font);
    sectionLabel(componentsPage,font,'LIST ITEM',80,cY); cY+=20;
    listSet.x=80; listSet.y=cY; cY+=listSet.height+80;

    var navBarSet = await mkNavBarItem(font);
    sectionLabel(componentsPage,font,'NAVIGATION BAR ITEM',80,cY); cY+=20;
    navBarSet.x=80; navBarSet.y=cY; cY+=navBarSet.height+80;

    var tabSet = await mkTabItem(font);
    sectionLabel(componentsPage,font,'TAB ITEM',80,cY); cY+=20;
    tabSet.x=80; tabSet.y=cY; cY+=tabSet.height+80;

    var snackSet = await mkSnackbar(font);
    sectionLabel(componentsPage,font,'SNACKBAR',80,cY); cY+=20;
    snackSet.x=80; snackSet.y=cY; cY+=snackSet.height+80;

    var dlgSet = await mkDialog(font);
    sectionLabel(componentsPage,font,'MODAL / DIALOG',80,cY); cY+=20;
    dlgSet.x=80; dlgSet.y=cY; cY+=dlgSet.height+80;

    var divSet = await mkDividers(font);
    sectionLabel(componentsPage,font,'DIVIDER',80,cY); cY+=20;
    divSet.x=80; divSet.y=cY; cY+=divSet.height+80;

    step('Building Components (4/4): Data & misc...');

    var searchSet = await mkSearchBar(font);
    sectionLabel(componentsPage,font,'SEARCH BAR',80,cY); cY+=20;
    searchSet.x=80; searchSet.y=cY; cY+=searchSet.height+80;

    var dtSet = await mkDataTableRow(font);
    sectionLabel(componentsPage,font,'DATA TABLE ROW',80,cY); cY+=20;
    dtSet.x=80; dtSet.y=cY; cY+=dtSet.height+80;

    var statusDotSet = await mkStatusDot(font);
    sectionLabel(componentsPage,font,'STATUS DOT',80,cY); cY+=20;
    statusDotSet.x=80; statusDotSet.y=cY; cY+=statusDotSet.height+80;

    var skelSet = await mkSkeleton(font);
    sectionLabel(componentsPage,font,'SKELETON',80,cY); cY+=20;
    skelSet.x=80; skelSet.y=cY; cY+=skelSet.height+80;

    var appBarSet = await mkAppBar(font);
    sectionLabel(componentsPage,font,'TOP APP BAR',80,cY); cY+=20;
    appBarSet.x=80; appBarSet.y=cY; cY+=appBarSet.height+80;

    var navDrawerSet = await mkNavDrawer(font);
    sectionLabel(componentsPage,font,'NAVIGATION DRAWER',80,cY); cY+=20;
    navDrawerSet.x=80; navDrawerSet.y=cY; cY+=navDrawerSet.height+80;

    step('Building Screens (1/3): Auth & Dashboard...');
    figma.currentPage = screensPage;
    Array.from(screensPage.children).forEach(function(n){n.remove();});
    addText(screensPage,{font:font,style:'Semibold',text:'Quantify Mobile Screens',size:32,color:'#202020',x:80,y:40});

    var SCREEN_GAP = 60;
    var sX = 80; var sY = 100;
    var COLS = 4;
    var COL_W = 390 + SCREEN_GAP;

    var screenFns = [
      buildScreenSignIn, buildScreenDashboard, buildScreenReservationList,
      buildScreenReservationDetail, buildScreenShipReservation, buildScreenEquipmentScanner,
      buildScreenEquipmentDetail, buildScreenDeliveryTracking, buildScreenReturnInspection
    ];

    for (var si=0; si<screenFns.length; si++) {
      var col = si % COLS;
      var row = Math.floor(si / COLS);
      var sx = sX + col * COL_W;
      var sy = sY + row * (844 + SCREEN_GAP + 32);
      screenFns[si](screensPage, font, sx, sy);
    }

    step('Building Screens (2/3): More screens...');
    var screenFns2 = [
      buildScreenInventory, buildScreenSearch, buildScreenNotifications,
      buildScreenSettings, buildScreenConnectionSettings, buildScreenCrewSchedule,
      buildScreenQuoteBuilder, buildScreenReport, buildScreenAbout, buildScreenEmptyState
    ];
    for (var si2=0; si2<screenFns2.length; si2++) {
      var idx = screenFns.length + si2;
      var col2 = idx % COLS;
      var row2 = Math.floor(idx / COLS);
      var sx2 = sX + col2 * COL_W;
      var sy2 = sY + row2 * (844 + SCREEN_GAP + 32);
      screenFns2[si2](screensPage, font, sx2, sy2);
    }

    step('Building Screens (3/3): Finalizing...');
    // scroll back to foundations
    figma.currentPage = foundationsPage;

    step('Design system imported successfully!');
    figma.ui.postMessage({ type: 'done' });
  } catch(e) {
    figma.ui.postMessage({ type: 'error', message: String(e) });
  }
}

// ─── Variables ──────────────────────────────────────────────

async function makePrimitiveVars() {
  removeByName(figma.variables.getLocalVariableCollections(),'Quantify/Primitives');
  var col = figma.variables.createVariableCollection('Quantify/Primitives');
  var modeId = col.modes[0].modeId;
  col.renameMode(modeId,'Value');
  var map = {};
  for (var name in PRIMITIVES) {
    var v = figma.variables.createVariable(name,col,'COLOR');
    v.setValueForMode(modeId,hex(PRIMITIVES[name]));
    map[name]=v;
  }
  return map;
}

async function makeSemanticVars(primMap) {
  removeByName(figma.variables.getLocalVariableCollections(),'Quantify/Semantic');
  var col = figma.variables.createVariableCollection('Quantify/Semantic');
  var lightId = col.modes[0].modeId;
  col.renameMode(lightId,'Light');
  var darkId = col.addMode('Dark');
  for (var name in SEM_LIGHT) {
    var v = figma.variables.createVariable(name,col,'COLOR');
    var lp = primMap[SEM_LIGHT[name]];
    var dp = primMap[SEM_DARK[name]];
    if (lp) v.setValueForMode(lightId,figma.variables.createVariableAlias(lp));
    if (dp) v.setValueForMode(darkId,figma.variables.createVariableAlias(dp));
  }
}

async function makeSpacingVars() {
  removeByName(figma.variables.getLocalVariableCollections(),'Quantify/Spacing');
  var col = figma.variables.createVariableCollection('Quantify/Spacing');
  var modeId = col.modes[0].modeId;
  col.renameMode(modeId,'Value');
  for (var i=0; i<SPACING_VALS.length; i++) {
    var v = figma.variables.createVariable('spacing/'+SPACING_VALS[i],col,'FLOAT');
    v.setValueForMode(modeId,SPACING_VALS[i]);
  }
}

// ─── Styles ─────────────────────────────────────────────────

async function makeTextStyles(font) {
  figma.getLocalTextStyles().filter(function(s){return s.name.startsWith('Quantify/')||s.name.startsWith('MD3/');}).forEach(function(s){s.remove();});
  for (var i=0; i<TYPE_STYLES.length; i++) {
    var t = TYPE_STYLES[i];
    var s = figma.createTextStyle();
    s.name=t.name; s.fontSize=t.px;
    s.fontName={family:font,style:t.w};
    s.lineHeight={unit:'PERCENT',value:t.lh};
    s.letterSpacing={unit:'PERCENT',value:t.ls};
  }
}

async function makeEffectStyles() {
  figma.getLocalEffectStyles().filter(function(s){return s.name.startsWith('Elevation/');}).forEach(function(s){s.remove();});
  for (var i=0; i<ELEVATIONS.length; i++) {
    var e = ELEVATIONS[i];
    var s = figma.createEffectStyle();
    s.name=e.name;
    s.effects=e.shadows.map(function(sh){return{type:'DROP_SHADOW',color:sh.c,offset:{x:0,y:sh.y},radius:sh.r,spread:0,visible:true,blendMode:'NORMAL'};});
  }
}

async function makePaintStyles() {
  figma.getLocalPaintStyles().filter(function(s){return ['Brand/','Neutral/','Semantic/','Surface/'].some(function(p){return s.name.startsWith(p);});}).forEach(function(s){s.remove();});
  for (var i=0; i<PAINT_STYLES.length; i++) {
    var ps = PAINT_STYLES[i];
    var s = figma.createPaintStyle();
    s.name=ps.name; s.paints=[{type:'SOLID',color:hex(ps.h)}];
  }
}

// ─── Page Builder ────────────────────────────────────────────

async function buildFoundationsPage(page, font) {
  figma.currentPage = page;
  Array.from(page.children).forEach(function(n){n.remove();});

  var y = 0;
  var GAP = 80;
  var COMP_GAP = 64;

  // ── Page title ──
  addText(page,{font:font,style:'Semibold',text:'Quantify Design System',size:40,color:'#202020',x:0,y:0});
  addText(page,{font:font,text:'Component library for Avontus Quantify · Probe design language · Material Design 3',size:16,color:'#787878',x:0,y:52});
  y = 120;

  // ─────────────────────────────────────────────
  // FOUNDATIONS
  // ─────────────────────────────────────────────

  // ── Colors ──
  sectionLabel(page,font,'COLORS',0,y);
  y += 24;

  var colorGroups = [
    {label:'Brand',colors:[{n:'Blue Main',h:'#0A3EFF',t:'#FFFFFF'},{n:'Blue Medium',h:'#6F9DFF',t:'#FFFFFF'},{n:'Blue Dark',h:'#10296E',t:'#FFFFFF'},{n:'Light Black',h:'#202020',t:'#FFFFFF'},{n:'Tinted White',h:'#F8F8F8',t:'#202020'},{n:'White',h:'#FFFFFF',t:'#202020'}]},
    {label:'Blue Scale',colors:[{n:'Lightest',h:'#E8EEFF',t:'#10296E'},{n:'Light',h:'#6F9DFF',t:'#FFFFFF'},{n:'Main',h:'#0A3EFF',t:'#FFFFFF'},{n:'Dark',h:'#10296E',t:'#FFFFFF'},{n:'Darkest',h:'#0A1A4A',t:'#FFFFFF'}]},
    {label:'Grays',colors:[{n:'White',h:'#FFFFFF',t:'#202020'},{n:'50',h:'#F8F8F8',t:'#202020'},{n:'100',h:'#EEEEEE',t:'#202020'},{n:'200',h:'#D4D4D4',t:'#202020'},{n:'300',h:'#ABABAB',t:'#202020'},{n:'400',h:'#787878',t:'#FFFFFF'},{n:'500',h:'#545454',t:'#FFFFFF'},{n:'600',h:'#363636',t:'#FFFFFF'},{n:'700',h:'#202020',t:'#FFFFFF'}]},
    {label:'Semantic',colors:[{n:'Error',h:'#E64059',t:'#FFFFFF'},{n:'Error Bg',h:'#FFE5E9',t:'#5F1422'},{n:'Warning',h:'#F9A825',t:'#FFFFFF'},{n:'Warning Bg',h:'#FFF3CD',t:'#5D4300'},{n:'Success',h:'#22C55E',t:'#FFFFFF'},{n:'Success Bg',h:'#DCFCE7',t:'#14532D'}]},
  ];

  var cx = 0;
  for (var gi=0; gi<colorGroups.length; gi++) {
    var grp = colorGroups[gi];
    addText(page,{font:font,text:grp.label,size:11,color:'#ABABAB',x:cx,y:y});
    var chipY = y+20;
    for (var ci=0; ci<grp.colors.length; ci++) {
      var chip = grp.colors[ci];
      // Color chip: 72x80, colored top + white label strip
      var chipFrame = figma.createFrame();
      chipFrame.resize(72,80);
      chipFrame.x = cx + ci*80;
      chipFrame.y = chipY;
      chipFrame.fills = [{type:'SOLID',color:hex('#FFFFFF')}];
      chipFrame.strokes = [{type:'SOLID',color:hex('#EEEEEE')}];
      chipFrame.strokeWeight = 1;
      chipFrame.strokeAlign = 'INSIDE';
      chipFrame.clipsContent = true;
      page.appendChild(chipFrame);
      // Color swatch top
      addRect(chipFrame,{w:72,h:52,x:0,y:0,fill:chip.h});
      // Hex label
      addText(chipFrame,{font:font,text:chip.h,size:9,color:'#545454',x:6,y:55,w:60});
    }
    cx += grp.colors.length*80 + 48;
  }
  y += 140;

  // ── Typography ──
  sectionLabel(page,font,'TYPOGRAPHY',0,y);
  y += 24;

  var typeRows = [
    {label:'H1 · 76px Bold · -3% tracking',text:'Quantify Design System',size:76,style:'Bold',ls:-3},
    {label:'H2 · 49px Semibold · -2.5% tracking',text:'Scaffold Management',size:49,style:'Semibold',ls:-2.5},
    {label:'H3 · 39px Semibold · -1.5% tracking',text:'Equipment Tracking',size:39,style:'Semibold',ls:-1.5},
    {label:'H4 · 31px Semibold · -1% tracking',text:'Reservation Details',size:31,style:'Semibold',ls:-1},
    {label:'H5 · 25px Medium · -0.5% tracking',text:'Job Site Overview',size:25,style:'Medium',ls:-0.5},
    {label:'H6 · 20px Medium · -0.3% tracking',text:'Branch & Sub-Branch',size:20,style:'Medium',ls:-0.3},
    {label:'Body · 16px Regular · 160% line-height',text:'The complete component library for Avontus Quantify platform.',size:16,style:'Regular',ls:0},
    {label:'Body Small · 14px Regular',text:'Secondary content, descriptions, and supporting information.',size:14,style:'Regular',ls:0.1},
    {label:'Caption · 12px Medium · +0.3% tracking',text:'Metadata, timestamps, and auxiliary information',size:12,style:'Medium',ls:0.3},
    {label:'Overline · 11px Semibold · +5% tracking',text:'SECTION LABEL · CATEGORY · STATUS',size:11,style:'Semibold',ls:5},
  ];
  for (var ti=0; ti<typeRows.length; ti++) {
    var tr = typeRows[ti];
    addText(page,{font:font,text:tr.label,size:10,color:'#ABABAB',x:0,y:y,style:'Regular'});
    var specText = figma.createText();
    specText.fontName={family:font,style:tr.style};
    specText.characters=tr.text;
    specText.fontSize=tr.size;
    specText.fills=[solidFill('#202020')];
    specText.letterSpacing={unit:'PERCENT',value:tr.ls};
    specText.x=200; specText.y=y;
    page.appendChild(specText);
    y += Math.max(tr.size+8, 24);
  }
  y += 40;

  // ── Elevation ──
  sectionLabel(page,font,'ELEVATION',0,y);
  y += 24;
  for (var ei=0; ei<ELEVATIONS.length; ei++) {
    var elev = ELEVATIONS[ei];
    var card = figma.createFrame();
    card.resize(120,80);
    card.x = ei*140;
    card.y = y;
    card.fills = [{type:'SOLID',color:hex('#FFFFFF')}];
    card.effects = elev.shadows.map(function(sh){return{type:'DROP_SHADOW',color:sh.c,offset:{x:0,y:sh.y},radius:sh.r,spread:0,visible:true,blendMode:'NORMAL'};});
    page.appendChild(card);
    addText(card,{font:font,text:'Level '+ei,size:11,color:'#ABABAB',x:12,y:12});
    addText(card,{font:font,text:elev.name.split(' · ')[1]||'Flat',size:13,color:'#202020',x:12,y:30,style:'Medium'});
  }
  y += 140;

  // ── Spacing ──
  sectionLabel(page,font,'SPACING',0,y);
  y += 24;
  for (var si=0; si<SPACING_VALS.length; si++) {
    var sp = SPACING_VALS[si];
    addRect(page,{w:sp,h:sp,x:si*120,y:y,fill:'#E8EEFF',stroke:'#0A3EFF',strokeW:1});
    addText(page,{font:font,text:sp+'px',size:11,color:'#545454',x:si*120,y:y+sp+6});
  }
  y += 130;
}

// ─── Component: Button ───────────────────────────────────────

async function mkButtons(font) {
  var TYPES = ['Filled','Outlined','Text','Tonal','Elevated'];
  var STATES = ['Default','Hover','Disabled'];
  var nodes = [];
  for (var ti=0; ti<TYPES.length; ti++) {
    for (var si=0; si<STATES.length; si++) {
      var type=TYPES[ti], state=STATES[si];
      var sty = btnStyle(type,state);
      var c = figma.createComponent();
      c.name = 'Type='+type+', State='+state;
      c.resize(136,40);
      c.clipsContent=true;
      addRect(c,{w:136,h:40,fill:sty.bg,fillOp:sty.bgOp,stroke:sty.border,strokeW:1});
      addText(c,{font:font,text:type,size:14,color:sty.text,x:16,y:11});
      figma.currentPage.appendChild(c);
      nodes.push(c);
    }
  }
  var set = figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Button';
  return set;
}
function btnStyle(type,state) {
  var dis=state==='Disabled', hov=state==='Hover';
  if(type==='Filled')   return{bg:'#0A3EFF',bgOp:dis?0.12:hov?0.88:1,text:dis?'#ABABAB':'#FFFFFF'};
  if(type==='Outlined') return{bg:'#FFFFFF',bgOp:hov?0.08:0,border:dis?'#D4D4D4':'#0A3EFF',text:dis?'#ABABAB':'#0A3EFF'};
  if(type==='Text')     return{bg:'#FFFFFF',bgOp:hov?0.08:0,text:dis?'#ABABAB':'#0A3EFF'};
  if(type==='Tonal')    return{bg:'#E8EEFF',bgOp:dis?0.12:hov?0.88:1,text:dis?'#ABABAB':'#10296E'};
  if(type==='Elevated') return{bg:'#F8F8F8',bgOp:dis?0.12:hov?0.94:1,text:dis?'#ABABAB':'#0A3EFF'};
  return{bg:'#0A3EFF',bgOp:1,text:'#FFFFFF'};
}

// ─── Component: Icon Button ──────────────────────────────────

async function mkIconButtons(font) {
  var VARIANTS = ['Standard','Filled','Tonal','Outlined'];
  var nodes = [];
  for (var i=0; i<VARIANTS.length; i++) {
    var v=VARIANTS[i];
    var c = figma.createComponent();
    c.name='Variant='+v;
    c.resize(40,40);
    c.clipsContent=true;
    var bg='#FFFFFF', tc='#0A3EFF', stroke=null;
    if(v==='Filled'){bg='#0A3EFF';tc='#FFFFFF';}
    if(v==='Tonal'){bg='#E8EEFF';tc='#10296E';}
    if(v==='Outlined'){stroke='#D4D4D4';}
    addRect(c,{w:40,h:40,fill:bg,stroke:stroke,strokeW:1});
    addText(c,{font:font,text:'⊕',size:20,color:tc,x:10,y:10});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Icon Button';
  return set;
}

// ─── Component: FAB ─────────────────────────────────────────

async function mkFABs(font) {
  var VARIANTS = [
    {name:'Color=Primary, Size=Default',w:56,h:56,bg:'#0A3EFF',tc:'#FFFFFF'},
    {name:'Color=Primary, Size=Large',w:96,h:96,bg:'#0A3EFF',tc:'#FFFFFF'},
    {name:'Color=Surface, Size=Default',w:56,h:56,bg:'#FFFFFF',tc:'#0A3EFF',stroke:'#E2E2E2'},
    {name:'Color=Secondary, Size=Default',w:56,h:56,bg:'#10296E',tc:'#FFFFFF'},
  ];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var c=figma.createComponent();
    c.name=v.name;
    c.resize(v.w,v.h);
    c.clipsContent=true;
    addRect(c,{w:v.w,h:v.h,fill:v.bg,stroke:v.stroke,strokeW:1});
    addText(c,{font:font,text:'+',size:24,color:v.tc,x:Math.round(v.w/2)-8,y:Math.round(v.h/2)-14});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='FAB';
  return set;
}

// ─── Component: Segmented Button ────────────────────────────

async function mkSegmented(font) {
  var VARIANTS = [
    {name:'Items=2',labels:['List','Grid']},
    {name:'Items=3',labels:['Day','Week','Month']},
  ];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var totalW=v.labels.length*100;
    var c=figma.createComponent();
    c.name=v.name;
    c.resize(totalW,40);
    c.clipsContent=true;
    addRect(c,{w:totalW,h:40,fill:'#FFFFFF',stroke:'#D4D4D4',strokeW:1});
    for(var li=0;li<v.labels.length;li++){
      if(li===0){
        addRect(c,{w:100,h:40,x:0,y:0,fill:'#E8EEFF'});
        addText(c,{font:font,text:v.labels[li],size:14,color:'#0A3EFF',x:28,y:12});
      } else {
        if(li>0) addRect(c,{w:1,h:40,x:li*100,y:0,fill:'#D4D4D4'});
        addText(c,{font:font,text:v.labels[li],size:14,color:'#545454',x:li*100+28,y:12});
      }
    }
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Segmented Button';
  return set;
}

// ─── Component: Text Field ───────────────────────────────────

async function mkTextFields(font) {
  var STATES=[
    {n:'Default',border:'#D4D4D4',lc:'#787878',bg:'#FFFFFF'},
    {n:'Focused',border:'#0A3EFF',lc:'#0A3EFF',bg:'#FFFFFF'},
    {n:'Filled',border:'#D4D4D4',lc:'#787878',bg:'#FFFFFF'},
    {n:'Error',border:'#E64059',lc:'#E64059',bg:'#FFFFFF'},
    {n:'Disabled',border:'#EEEEEE',lc:'#ABABAB',bg:'#F8F8F8'},
  ];
  var nodes=[];
  for(var i=0;i<STATES.length;i++){
    var st=STATES[i];
    var isFloat=st.n!=='Default';
    var c=figma.createComponent();
    c.name='State='+st.n;
    c.resize(240,56);
    c.clipsContent=true;
    addRect(c,{w:240,h:56,fill:st.bg,stroke:st.border,strokeW:st.n==='Focused'?2:1});
    addText(c,{font:font,text:'Field Label',size:isFloat?11:16,color:st.lc,x:12,y:isFloat?7:18});
    if(isFloat) addText(c,{font:font,text:st.n==='Disabled'?'—':'Value text',size:16,color:st.n==='Disabled'?'#ABABAB':'#202020',x:12,y:28});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Text Field';
  return set;
}

// ─── Component: Select ──────────────────────────────────────

async function mkSelect(font) {
  var STATES=['Closed','Open','Disabled'];
  var nodes=[];
  for(var i=0;i<STATES.length;i++){
    var st=STATES[i];
    var c=figma.createComponent();
    c.name='State='+st;
    c.resize(200,48);
    c.clipsContent=true;
    var border=st==='Disabled'?'#EEEEEE':st==='Open'?'#0A3EFF':'#D4D4D4';
    addRect(c,{w:200,h:48,fill:st==='Disabled'?'#F8F8F8':'#FFFFFF',stroke:border,strokeW:1});
    addText(c,{font:font,text:st==='Open'?'Branch — Portland':'Select branch...',size:14,color:st==='Disabled'?'#ABABAB':st==='Open'?'#202020':'#ABABAB',x:12,y:16});
    addText(c,{font:font,text:st==='Open'?'▲':'▼',size:12,color:'#787878',x:178,y:18});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Select';
  return set;
}

// ─── Component: Slider ──────────────────────────────────────

async function mkSlider(font) {
  var VARIANTS=['Value=25%','Value=60%','Value=100%'];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var pct=parseInt(v.replace('Value=',''));
    var c=figma.createComponent();
    c.name=v;
    c.resize(200,40);
    c.clipsContent=false;
    // Track
    addRect(c,{w:200,h:4,x:0,y:18,fill:'#EEEEEE'});
    // Fill
    addRect(c,{w:pct*2,h:4,x:0,y:18,fill:'#0A3EFF'});
    // Thumb
    var thumb=figma.createEllipse();
    thumb.resize(20,20);
    thumb.x=pct*2-10; thumb.y=8;
    thumb.fills=[solidFill('#0A3EFF')];
    c.appendChild(thumb);
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Slider';
  return set;
}

// ─── Component: Stepper ─────────────────────────────────────

async function mkStepper(font) {
  var VARIANTS=['Value=0','Value=5','Value=12'];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var val=v.replace('Value=','');
    var c=figma.createComponent();
    c.name=v;
    c.resize(136,40);
    c.clipsContent=true;
    addRect(c,{w:136,h:40,fill:'#FFFFFF',stroke:'#D4D4D4',strokeW:1});
    // minus button
    addRect(c,{w:40,h:40,x:0,y:0,fill:'#F8F8F8',stroke:'#D4D4D4',strokeW:1});
    addText(c,{font:font,text:'−',size:18,color:'#202020',x:13,y:10});
    // value
    addText(c,{font:font,text:val,size:16,color:'#202020',x:56,y:12});
    // plus button
    addRect(c,{w:40,h:40,x:96,y:0,fill:'#F8F8F8',stroke:'#D4D4D4',strokeW:1});
    addText(c,{font:font,text:'+',size:18,color:'#0A3EFF',x:109,y:10});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Stepper';
  return set;
}

// ─── Component: Checkbox ────────────────────────────────────

async function mkCheckboxes(font) {
  var VARIANTS=[
    {state:'Unchecked',enabled:'true'},{state:'Checked',enabled:'true'},
    {state:'Indeterminate',enabled:'true'},{state:'Unchecked',enabled:'false'},
    {state:'Checked',enabled:'false'},
  ];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var isC=v.state==='Checked', isI=v.state==='Indeterminate', isOn=v.enabled==='true';
    var c=figma.createComponent();
    c.name='State='+v.state+', Enabled='+v.enabled;
    c.resize(152,24);
    c.clipsContent=false;
    var box=figma.createRectangle();
    box.resize(20,20); box.x=0; box.y=2;
    if(isC||isI){box.fills=[solidFill(isOn?'#0A3EFF':'#D4D4D4')];box.strokes=[];}
    else{box.fills=[solidFill('#FFFFFF')];box.strokes=[{type:'SOLID',color:hex(isOn?'#787878':'#D4D4D4')}];box.strokeWeight=1.5;box.strokeAlign='INSIDE';}
    c.appendChild(box);
    if(isC){var ck=figma.createRectangle();ck.resize(10,8);ck.x=5;ck.y=8;ck.fills=[solidFill('#FFFFFF')];c.appendChild(ck);}
    if(isI){var dk=figma.createRectangle();dk.resize(10,2);dk.x=5;dk.y=11;dk.fills=[solidFill('#FFFFFF')];c.appendChild(dk);}
    addText(c,{font:font,text:'Checkbox',size:14,color:isOn?'#202020':'#ABABAB',x:32,y:3});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Checkbox';
  return set;
}

// ─── Component: Radio Button ─────────────────────────────────

async function mkRadioButtons(font) {
  var VARIANTS=[
    {state:'Unselected',enabled:'true'},{state:'Selected',enabled:'true'},
    {state:'Unselected',enabled:'false'},{state:'Selected',enabled:'false'},
  ];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var isSel=v.state==='Selected', isOn=v.enabled==='true';
    var c=figma.createComponent();
    c.name='State='+v.state+', Enabled='+v.enabled;
    c.resize(152,24);
    c.clipsContent=false;
    var outer=figma.createEllipse();
    outer.resize(20,20); outer.x=0; outer.y=2;
    outer.fills=[solidFill('#FFFFFF')];
    outer.strokes=[{type:'SOLID',color:hex(isSel?(isOn?'#0A3EFF':'#D4D4D4'):(isOn?'#787878':'#D4D4D4'))}];
    outer.strokeWeight=2; outer.strokeAlign='INSIDE';
    c.appendChild(outer);
    if(isSel){var inner=figma.createEllipse();inner.resize(10,10);inner.x=5;inner.y=7;inner.fills=[solidFill(isOn?'#0A3EFF':'#D4D4D4')];inner.strokes=[];c.appendChild(inner);}
    addText(c,{font:font,text:'Radio option',size:14,color:isOn?'#202020':'#ABABAB',x:32,y:3});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Radio Button';
  return set;
}

// ─── Component: Toggle Switch ────────────────────────────────

async function mkToggles(font) {
  var VARIANTS=[
    {checked:'false',enabled:'true'},{checked:'true',enabled:'true'},
    {checked:'false',enabled:'false'},{checked:'true',enabled:'false'},
  ];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var isOn=v.checked==='true', isEn=v.enabled==='true';
    var c=figma.createComponent();
    c.name='Checked='+v.checked+', Enabled='+v.enabled;
    c.resize(52,32);
    c.clipsContent=false;
    var track=figma.createRectangle();
    track.resize(52,32); track.cornerRadius=16;
    track.fills=[solidFill(isOn?(isEn?'#0A3EFF':'#ABABAB'):(isEn?'#D4D4D4':'#EEEEEE'))];
    c.appendChild(track);
    var thumb=figma.createEllipse();
    thumb.resize(24,24); thumb.x=isOn?24:4; thumb.y=4;
    thumb.fills=[solidFill('#FFFFFF')];
    c.appendChild(thumb);
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Toggle Switch';
  return set;
}

// ─── Component: Chip ─────────────────────────────────────────

async function mkChips(font) {
  var TYPES=['Assist','Filter','Input','Suggestion'];
  var nodes=[];
  for(var ti=0;ti<TYPES.length;ti++){
    for(var si=0;si<2;si++){
      var isOn=si===1;
      var c=figma.createComponent();
      c.name='Type='+TYPES[ti]+', Selected='+(isOn?'true':'false');
      c.resize(96,32);
      c.clipsContent=true;
      addRect(c,{w:96,h:32,fill:isOn?'#E8EEFF':'#FFFFFF',stroke:isOn?'#0A3EFF':'#D4D4D4',strokeW:1});
      addText(c,{font:font,text:TYPES[ti],size:14,color:isOn?'#0A3EFF':'#202020',x:12,y:8});
      figma.currentPage.appendChild(c);
      nodes.push(c);
    }
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Chip';
  return set;
}

// ─── Component: Card ─────────────────────────────────────────

async function mkCards(font) {
  var STYLES=[
    {n:'Elevated',bg:'#FFFFFF',border:null},
    {n:'Filled',bg:'#F4F4F4',border:null},
    {n:'Outlined',bg:'#FFFFFF',border:'#E2E2E2'},
  ];
  var nodes=[];
  for(var i=0;i<STYLES.length;i++){
    var s=STYLES[i];
    var c=figma.createComponent();
    c.name='Style='+s.n;
    c.resize(280,160);
    c.clipsContent=true;
    addRect(c,{w:280,h:160,fill:s.bg,stroke:s.border,strokeW:1});
    addText(c,{font:font,text:'Riverside Tower — Scaffold A',size:16,color:'#202020',style:'Semibold',x:20,y:20,w:240});
    addText(c,{font:font,text:'Portland Branch · Job #4821',size:13,color:'#787878',x:20,y:44,w:240});
    addRect(c,{w:240,h:1,x:20,y:68,fill:'#E2E2E2'});
    addText(c,{font:font,text:'Active Reservation',size:12,color:'#14532D',x:20,y:80});
    addRect(c,{w:80,h:28,x:20,y:116,fill:'#0A3EFF',stroke:null});
    addText(c,{font:font,text:'View',size:13,color:'#FFFFFF',x:30,y:122});
    addRect(c,{w:80,h:28,x:108,y:116,fill:'#FFFFFF',stroke:'#D4D4D4',strokeW:1});
    addText(c,{font:font,text:'Edit',size:13,color:'#0A3EFF',x:118,y:122});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Card';
  return set;
}

// ─── Component: Dialog ───────────────────────────────────────

async function mkDialog(font) {
  var VARIANTS=['Confirm','Alert','Form'];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var c=figma.createComponent();
    c.name='Type='+v;
    c.resize(320,200);
    c.clipsContent=true;
    addRect(c,{w:320,h:200,fill:'#FFFFFF',stroke:'#E2E2E2',strokeW:1});
    addText(c,{font:font,text:v==='Alert'?'Delete reservation?':'Confirm action',size:18,color:'#202020',style:'Semibold',x:24,y:24,w:272});
    addText(c,{font:font,text:v==='Alert'?'This will permanently remove reservation #4821 and cannot be undone.':'Please confirm you want to proceed with this action.',size:14,color:'#545454',x:24,y:56,w:272});
    addRect(c,{w:320,h:1,x:0,y:148,fill:'#E2E2E2'});
    addRect(c,{w:88,h:36,x:204,y:156,fill:'#0A3EFF'});
    addText(c,{font:font,text:v==='Alert'?'Delete':'Confirm',size:14,color:'#FFFFFF',x:216,y:164});
    addText(c,{font:font,text:'Cancel',size:14,color:'#0A3EFF',x:148,y:164});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Dialog';
  return set;
}

// ─── Component: Bottom Sheet ────────────────────────────────

async function mkBottomSheet(font) {
  var VARIANTS=['Partial','Expanded'];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var h=v==='Expanded'?360:200;
    var c=figma.createComponent();
    c.name='State='+v;
    c.resize(390,h);
    c.clipsContent=true;
    addRect(c,{w:390,h:h,fill:'#FFFFFF',stroke:'#E2E2E2',strokeW:1});
    // Handle bar
    addRect(c,{w:32,h:4,x:179,y:12,fill:'#D4D4D4',radius:2});
    addText(c,{font:font,text:'Equipment Actions',size:18,color:'#202020',style:'Semibold',x:20,y:36,w:350});
    addRect(c,{w:390,h:1,x:0,y:68,fill:'#E2E2E2'});
    var actions=['Add to delivery','Schedule return','Transfer equipment','View history'];
    for(var ai=0;ai<(v==='Expanded'?4:2);ai++){
      addRect(c,{w:390,h:52,x:0,y:72+ai*52,fill:'#FFFFFF'});
      addText(c,{font:font,text:actions[ai],size:15,color:'#202020',x:20,y:88+ai*52});
      if(ai<(v==='Expanded'?3:1)) addRect(c,{w:350,h:1,x:20,y:124+ai*52,fill:'#EEEEEE'});
    }
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Bottom Sheet';
  return set;
}

// ─── Component: List Item ────────────────────────────────────

async function mkListItem(font) {
  var VARIANTS=[
    {n:'Single line',sub:null},{n:'Two line',sub:'Portland Branch · 24 units'},
    {n:'With badge',sub:null,badge:'Active'},{n:'With trailing',sub:'Jan 15, 2025'},
  ];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var c=figma.createComponent();
    c.name='Variant='+v.n;
    c.resize(320,v.sub?64:52);
    c.clipsContent=true;
    addRect(c,{w:320,h:v.sub?64:52,fill:'#FFFFFF'});
    addRect(c,{w:36,h:36,x:12,y:v.sub?14:8,fill:'#E8EEFF'});
    addText(c,{font:font,text:'■',size:16,color:'#0A3EFF',x:20,y:v.sub?22:17});
    addText(c,{font:font,text:'Scaffold Item #4821',size:15,color:'#202020',style:'Medium',x:60,y:v.sub?12:16,w:200});
    if(v.sub) addText(c,{font:font,text:v.sub,size:13,color:'#787878',x:60,y:34,w:200});
    if(v.badge){addRect(c,{w:48,h:20,x:260,y:16,fill:'#DCFCE7'});addText(c,{font:font,text:v.badge,size:11,color:'#14532D',x:266,y:19});}
    if(v.n==='With trailing') addText(c,{font:font,text:v.sub,size:13,color:'#787878',x:220,y:v.sub?20:18});
    addRect(c,{w:284,h:1,x:36,y:v.sub?63:51,fill:'#EEEEEE'});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='List Item';
  return set;
}

// ─── Component: Badge ────────────────────────────────────────

async function mkBadges(font) {
  var TYPES=[
    {n:'Error',bg:'#FFE5E9',tc:'#E64059'},{n:'Warning',bg:'#FFF3CD',tc:'#5D4300'},
    {n:'Success',bg:'#DCFCE7',tc:'#14532D'},{n:'Info',bg:'#E8EEFF',tc:'#10296E'},
    {n:'Neutral',bg:'#F8F8F8',tc:'#545454'},
  ];
  var nodes=[];
  for(var i=0;i<TYPES.length;i++){
    var t=TYPES[i];
    var c=figma.createComponent();
    c.name='Style='+t.n;
    c.resize(80,24);
    c.clipsContent=true;
    addRect(c,{w:80,h:24,fill:t.bg});
    addText(c,{font:font,text:t.n,size:12,color:t.tc,style:'Medium',x:8,y:5});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Badge';
  return set;
}

// ─── Component: Divider ──────────────────────────────────────

async function mkDividers(font) {
  var VARIANTS=[
    {n:'Full width',inset:0},{n:'Inset',inset:16},{n:'Middle inset',inset:72},
  ];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var c=figma.createComponent();
    c.name='Variant='+v.n;
    c.resize(300,24);
    c.clipsContent=false;
    addRect(c,{w:300-v.inset,h:1,x:v.inset,y:12,fill:'#E2E2E2'});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Divider';
  return set;
}

// ─── Component: Data Table Row ───────────────────────────────

async function mkDataTableRow(font) {
  var VARIANTS=['Header','Default','Selected','Hovered'];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var isHeader=v==='Header';
    var c=figma.createComponent();
    c.name='Type='+v;
    c.resize(600,48);
    c.clipsContent=true;
    var bg=v==='Selected'?'#F0F4FF':v==='Hovered'?'#F8F8F8':'#FFFFFF';
    addRect(c,{w:600,h:48,fill:isHeader?'#F8F8F8':bg});
    var cols=[{x:16,w:100,t:isHeader?'JOB #':'#4821'},{x:128,w:160,t:isHeader?'SITE NAME':'Riverside Tower'},{x:300,w:100,t:isHeader?'STATUS':'Active'},{x:412,w:100,t:isHeader?'UNITS':'24'},{x:512,w:88,t:isHeader?'DATE':'Jan 15'}];
    for(var ci=0;ci<cols.length;ci++){
      var col=cols[ci];
      addText(c,{font:font,text:col.t,size:isHeader?11:14,color:isHeader?'#787878':'#202020',style:isHeader?'Medium':'Regular',x:col.x,y:isHeader?18:16,w:col.w});
    }
    addRect(c,{w:600,h:1,x:0,y:47,fill:'#EEEEEE'});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Data Table Row';
  return set;
}

// ─── Component: App Bar ──────────────────────────────────────

async function mkAppBar(font) {
  var VARIANTS=[
    {n:'Default',title:'Equipment List',back:true},
    {n:'Home',title:'Quantify',back:false},
    {n:'Search Active',title:'Search reservations...',back:true},
  ];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var c=figma.createComponent();
    c.name='Variant='+v.n;
    c.resize(390,56);
    c.clipsContent=true;
    addRect(c,{w:390,h:56,fill:'#FFFFFF'});
    addRect(c,{w:390,h:1,x:0,y:55,fill:'#E2E2E2'});
    if(v.back){
      addRect(c,{w:40,h:40,x:8,y:8,fill:'#F8F8F8'});
      addText(c,{font:font,text:'←',size:18,color:'#202020',x:17,y:17});
    }
    addText(c,{font:font,text:v.title,size:18,color:'#202020',style:'Semibold',x:v.back?56:16,y:17,w:250});
    // Action icons
    addRect(c,{w:40,h:40,x:342,y:8,fill:'#F8F8F8'});
    addText(c,{font:font,text:'⋮',size:18,color:'#202020',x:351,y:15});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='App Bar';
  return set;
}

// ─── Component: Tab Bar ──────────────────────────────────────

async function mkTabBar(font) {
  var VARIANTS=[
    {n:'3 Tabs',tabs:['Overview','Reservations','Equipment']},
    {n:'4 Tabs',tabs:['Overview','Deliveries','Returns','Reports']},
  ];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var tabW=360/v.tabs.length;
    var c=figma.createComponent();
    c.name='Tabs='+v.n;
    c.resize(360,48);
    c.clipsContent=true;
    addRect(c,{w:360,h:48,fill:'#FFFFFF'});
    addRect(c,{w:360,h:1,x:0,y:47,fill:'#E2E2E2'});
    for(var ti=0;ti<v.tabs.length;ti++){
      var isActive=ti===0;
      addText(c,{font:font,text:v.tabs[ti],size:14,color:isActive?'#0A3EFF':'#787878',style:isActive?'Medium':'Regular',x:Math.round(ti*tabW+tabW/2)-30,y:15,w:60});
      if(isActive) addRect(c,{w:tabW,h:2,x:ti*tabW,y:46,fill:'#0A3EFF'});
    }
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Tab Bar';
  return set;
}

// ─── Component: Navigation Rail ──────────────────────────────

async function mkNavRail(font) {
  var ITEMS=['Home','Reservations','Equipment','Reports','Settings'];
  var c=figma.createComponent();
  c.name='Type=Default';
  c.resize(80,400);
  c.clipsContent=true;
  addRect(c,{w:80,h:400,fill:'#FFFFFF'});
  addRect(c,{w:1,h:400,x:79,y:0,fill:'#E2E2E2'});
  for(var i=0;i<ITEMS.length;i++){
    var isActive=i===0;
    if(isActive) addRect(c,{w:56,h:32,x:12,y:16+i*72,fill:'#E8EEFF',radius:16});
    addText(c,{font:font,text:'□',size:20,color:isActive?'#0A3EFF':'#787878',x:30,y:14+i*72});
    addText(c,{font:font,text:ITEMS[i],size:10,color:isActive?'#0A3EFF':'#787878',x:8,y:38+i*72,w:64});
  }
  figma.currentPage.appendChild(c);
  var c2=figma.createComponent();
  c2.name='Type=Rail with header';
  c2.resize(80,400);
  c2.clipsContent=true;
  addRect(c2,{w:80,h:400,fill:'#FFFFFF'});
  addRect(c2,{w:1,h:400,x:79,y:0,fill:'#E2E2E2'});
  addRect(c2,{w:40,h:40,x:20,y:12,fill:'#0A3EFF'});
  addText(c2,{font:font,text:'Q',size:18,color:'#FFFFFF',x:27,y:20});
  for(var i=0;i<4;i++){
    var isActive=i===0;
    if(isActive) addRect(c2,{w:56,h:32,x:12,y:68+i*72,fill:'#E8EEFF',radius:16});
    addText(c2,{font:font,text:'□',size:20,color:isActive?'#0A3EFF':'#787878',x:30,y:66+i*72});
    addText(c2,{font:font,text:ITEMS[i],size:10,color:isActive?'#0A3EFF':'#787878',x:8,y:90+i*72,w:64});
  }
  figma.currentPage.appendChild(c2);
  var set=figma.combineAsVariants([c,c2],figma.currentPage);
  set.name='Navigation Rail';
  return set;
}

// ─── Component: InfoBar ──────────────────────────────────────

async function mkInfoBars(font) {
  var TYPES=[
    {n:'Info',bg:'#E8EEFF',accent:'#0A3EFF',tc:'#10296E'},
    {n:'Success',bg:'#DCFCE7',accent:'#22C55E',tc:'#14532D'},
    {n:'Warning',bg:'#FFF3CD',accent:'#F9A825',tc:'#5D4300'},
    {n:'Error',bg:'#FFE5E9',accent:'#E64059',tc:'#5F1422'},
  ];
  var nodes=[];
  for(var i=0;i<TYPES.length;i++){
    var t=TYPES[i];
    var c=figma.createComponent();
    c.name='Type='+t.n;
    c.resize(360,56);
    c.clipsContent=true;
    addRect(c,{w:360,h:56,fill:t.bg});
    addRect(c,{w:4,h:56,x:0,y:0,fill:t.accent});
    addText(c,{font:font,text:t.n,size:13,color:t.tc,style:'Medium',x:18,y:10});
    addText(c,{font:font,text:'This is an '+t.n.toLowerCase()+' notification message.',size:12,color:t.tc,x:18,y:30,w:320});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='InfoBar';
  return set;
}

// ─── Component: Snackbar ────────────────────────────────────

async function mkSnackbar(font) {
  var VARIANTS=[
    {n:'Default',action:false},{n:'With action',action:true},{n:'Error',action:true,err:true},
  ];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var c=figma.createComponent();
    c.name='Variant='+v.n;
    c.resize(320,52);
    c.clipsContent=true;
    addRect(c,{w:320,h:52,fill:v.err?'#FFE5E9':'#202020'});
    addText(c,{font:font,text:v.err?'Failed to save changes.':'Reservation saved successfully.',size:14,color:v.err?'#E64059':'#FFFFFF',x:16,y:16,w:v.action?220:288});
    if(v.action) addText(c,{font:font,text:v.err?'Retry':'Undo',size:14,color:'#0A3EFF',style:'Medium',x:264,y:16});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Snackbar';
  return set;
}

// ─── Component: Progress ────────────────────────────────────

async function mkProgressBars(font) {
  var VARIANTS=[
    {n:'Linear 25%',pct:25},{n:'Linear 60%',pct:60},{n:'Linear 100%',pct:100},
    {n:'Linear Indeterminate',pct:-1},
  ];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var c=figma.createComponent();
    c.name=v.n;
    c.resize(240,32);
    c.clipsContent=false;
    addRect(c,{w:240,h:4,x:0,y:14,fill:'#EEEEEE'});
    if(v.pct>0) addRect(c,{w:Math.round(240*v.pct/100),h:4,x:0,y:14,fill:'#0A3EFF'});
    else addRect(c,{w:80,h:4,x:0,y:14,fill:'#0A3EFF'});
    addText(c,{font:font,text:v.n,size:11,color:'#787878',x:0,y:22});
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Progress Bar';
  return set;
}

// ─── Component: Tooltip ────────────────────────────────────

async function mkTooltip(font) {
  var VARIANTS=['Default','Rich','Error'];
  var nodes=[];
  for(var i=0;i<VARIANTS.length;i++){
    var v=VARIANTS[i];
    var isRich=v==='Rich', isErr=v==='Error';
    var c=figma.createComponent();
    c.name='Type='+v;
    c.resize(isRich?200:160,isRich?72:36);
    c.clipsContent=true;
    addRect(c,{w:isRich?200:160,h:isRich?72:36,fill:isErr?'#E64059':'#202020',radius:4});
    if(isRich){
      addText(c,{font:font,text:'Equipment Status',size:12,color:'#FFFFFF',style:'Medium',x:12,y:10,w:176});
      addText(c,{font:font,text:'24 units active · Last updated 2h ago',size:11,color:'#ABABAB',x:12,y:30,w:176});
    } else {
      addText(c,{font:font,text:isErr?'Required field':'Hover for more info',size:12,color:'#FFFFFF',x:10,y:11,w:140});
    }
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set=figma.combineAsVariants(nodes,figma.currentPage);
  set.name='Tooltip';
  return set;
}

// ─── Component: Avatar ───────────────────────────────────────

async function mkAvatars(font) {
  var sizes = [
    {n:'XS', s:24, fs:10},
    {n:'SM', s:32, fs:12},
    {n:'MD', s:40, fs:16},
    {n:'LG', s:56, fs:22},
    {n:'XL', s:80, fs:32}
  ];
  var variants = ['Initial','Icon'];
  var nodes = [];
  for (var vi=0; vi<variants.length; vi++) {
    for (var si=0; si<sizes.length; si++) {
      var sz = sizes[si];
      var vt = variants[vi];
      var c = figma.createComponent();
      c.name = 'Size=' + sz.n + ', Variant=' + vt;
      c.resize(sz.s, sz.s);
      c.clipsContent = true;
      // Blue circle bg
      var circle = figma.createEllipse();
      circle.resize(sz.s, sz.s);
      circle.x = 0; circle.y = 0;
      circle.fills = [{type:'SOLID',color:hex('#0A3EFF')}];
      c.appendChild(circle);
      if (vt === 'Initial') {
        var t = figma.createText();
        t.fontName = {family:font, style:'Medium'};
        t.characters = 'AB';
        t.fontSize = sz.fs;
        t.fills = [{type:'SOLID',color:hex('#FFFFFF')}];
        t.x = sz.s/2 - (sz.fs*0.6); t.y = sz.s/2 - sz.fs/2;
        c.appendChild(t);
      } else {
        // Simple person icon using rectangles
        var head = figma.createEllipse();
        head.resize(sz.s*0.35, sz.s*0.35);
        head.x = sz.s*0.325; head.y = sz.s*0.15;
        head.fills = [{type:'SOLID',color:hex('#FFFFFF')}];
        c.appendChild(head);
        var body = figma.createEllipse();
        body.resize(sz.s*0.6, sz.s*0.4);
        body.x = sz.s*0.2; body.y = sz.s*0.55;
        body.fills = [{type:'SOLID',color:hex('#FFFFFF')}];
        c.appendChild(body);
      }
      figma.currentPage.appendChild(c);
      nodes.push(c);
    }
  }
  var set = figma.combineAsVariants(nodes, figma.currentPage);
  set.name = 'Avatar';
  return set;
}

// ─── Component: Circular Progress ───────────────────────────

async function mkCircularProgress(font) {
  var VARIANTS = [
    {n:'Size=SM, State=Determinate', s:24, pct:65},
    {n:'Size=SM, State=Indeterminate', s:24, pct:-1},
    {n:'Size=MD, State=Determinate', s:40, pct:40},
    {n:'Size=MD, State=Indeterminate', s:40, pct:-1},
    {n:'Size=LG, State=Determinate', s:64, pct:80},
    {n:'Size=LG, State=Indeterminate', s:64, pct:-1}
  ];
  var nodes = [];
  for (var i=0; i<VARIANTS.length; i++) {
    var v = VARIANTS[i];
    var c = figma.createComponent();
    c.name = v.n;
    c.resize(v.s + 8, v.s + 24);
    c.clipsContent = false;
    c.fills = [];
    // Track ring
    var track = figma.createEllipse();
    track.resize(v.s, v.s);
    track.x = 4; track.y = 0;
    track.fills = [];
    track.strokes = [{type:'SOLID',color:hex('#EEEEEE')}];
    track.strokeWeight = Math.max(2, v.s * 0.1);
    track.strokeAlign = 'INSIDE';
    c.appendChild(track);
    // Progress arc (represented as another ellipse with blue stroke)
    var prog = figma.createEllipse();
    prog.resize(v.s, v.s);
    prog.x = 4; prog.y = 0;
    prog.fills = [];
    prog.strokes = [{type:'SOLID',color:hex('#0A3EFF')}];
    prog.strokeWeight = Math.max(2, v.s * 0.1);
    prog.strokeAlign = 'INSIDE';
    if (v.pct > 0) {
      prog.arcData = {startingAngle: -Math.PI/2, endingAngle: -Math.PI/2 + (2*Math.PI*v.pct/100), innerRadius: 0};
    } else {
      prog.arcData = {startingAngle: -Math.PI/2, endingAngle: Math.PI/4, innerRadius: 0};
    }
    c.appendChild(prog);
    // Label
    var lbl = figma.createText();
    lbl.fontName = {family:font, style:'Regular'};
    lbl.characters = v.pct > 0 ? v.pct + '%' : '...';
    lbl.fontSize = 10;
    lbl.fills = [{type:'SOLID',color:hex('#787878')}];
    lbl.x = 4; lbl.y = v.s + 4;
    c.appendChild(lbl);
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set = figma.combineAsVariants(nodes, figma.currentPage);
  set.name = 'Circular Progress';
  return set;
}

// ─── Component: Navigation Bar Item ─────────────────────────

async function mkNavBarItem(font) {
  var VARIANTS = [
    {state:'Inactive', badge:false},
    {state:'Active',   badge:false},
    {state:'Inactive', badge:true},
    {state:'Active',   badge:true}
  ];
  var icons = ['home','package','truck','settings'];
  var labels = ['Home','Inventory','Deliveries','Settings'];
  var nodes = [];
  for (var i=0; i<VARIANTS.length; i++) {
    var v = VARIANTS[i];
    var c = figma.createComponent();
    c.name = 'State=' + v.state + ', HasBadge=' + (v.badge ? 'Yes' : 'No');
    c.resize(64, 56);
    c.clipsContent = false;
    c.fills = [];
    var isActive = v.state === 'Active';
    // Pill bg for active
    if (isActive) {
      var pill = figma.createRectangle();
      pill.resize(48, 28);
      pill.x = 8; pill.y = 4;
      pill.cornerRadius = 14;
      pill.fills = [{type:'SOLID',color:hex('#E8EDFF')}];
      c.appendChild(pill);
    }
    // Icon placeholder (simple rectangle)
    var iconBg = figma.createRectangle();
    iconBg.resize(20, 20);
    iconBg.x = 22; iconBg.y = 8;
    iconBg.cornerRadius = 2;
    iconBg.fills = [{type:'SOLID',color:hex(isActive ? '#0A3EFF' : '#787878')}];
    c.appendChild(iconBg);
    // Badge
    if (v.badge) {
      var dot = figma.createEllipse();
      dot.resize(8, 8);
      dot.x = 38; dot.y = 6;
      dot.fills = [{type:'SOLID',color:hex('#EF4444')}];
      c.appendChild(dot);
    }
    // Label
    var lbl = figma.createText();
    lbl.fontName = {family:font, style: isActive ? 'Medium' : 'Regular'};
    lbl.characters = labels[i % labels.length];
    lbl.fontSize = 11;
    lbl.fills = [{type:'SOLID',color:hex(isActive ? '#0A3EFF' : '#787878')}];
    lbl.x = 32 - (lbl.width/2); lbl.y = 32;
    c.appendChild(lbl);
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set = figma.combineAsVariants(nodes, figma.currentPage);
  set.name = 'Navigation Bar Item';
  return set;
}

// ─── Component: Tab Item ─────────────────────────────────────

async function mkTabItem(font) {
  var VARIANTS = [
    {state:'Active',   icon:false},
    {state:'Inactive', icon:false},
    {state:'Active',   icon:true},
    {state:'Inactive', icon:true}
  ];
  var nodes = [];
  for (var i=0; i<VARIANTS.length; i++) {
    var v = VARIANTS[i];
    var c = figma.createComponent();
    c.name = 'State=' + v.state + ', HasIcon=' + (v.icon ? 'Yes' : 'No');
    var w = v.icon ? 96 : 80;
    c.resize(w, 48);
    c.clipsContent = false;
    c.fills = [];
    var isActive = v.state === 'Active';
    if (v.icon) {
      var iconRect = figma.createRectangle();
      iconRect.resize(16, 16);
      iconRect.x = w/2 - 8; iconRect.y = 8;
      iconRect.cornerRadius = 2;
      iconRect.fills = [{type:'SOLID',color:hex(isActive ? '#0A3EFF' : '#787878')}];
      c.appendChild(iconRect);
    }
    var t = figma.createText();
    t.fontName = {family:font, style: isActive ? 'Medium' : 'Regular'};
    t.characters = 'All Items';
    t.fontSize = 13;
    t.fills = [{type:'SOLID',color:hex(isActive ? '#0A3EFF' : '#787878')}];
    t.x = w/2 - 28; t.y = v.icon ? 28 : 16;
    c.appendChild(t);
    if (isActive) {
      var indicator = figma.createRectangle();
      indicator.resize(w, 2);
      indicator.x = 0; indicator.y = 46;
      indicator.fills = [{type:'SOLID',color:hex('#0A3EFF')}];
      c.appendChild(indicator);
    }
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set = figma.combineAsVariants(nodes, figma.currentPage);
  set.name = 'Tab Item';
  return set;
}

// ─── Component: Search Bar ───────────────────────────────────

async function mkSearchBar(font) {
  var VARIANTS = [
    {n:'Default',   focused:false, hasVal:false},
    {n:'Focused',   focused:true,  hasVal:false},
    {n:'HasValue',  focused:false, hasVal:true}
  ];
  var nodes = [];
  for (var i=0; i<VARIANTS.length; i++) {
    var v = VARIANTS[i];
    var c = figma.createComponent();
    c.name = 'State=' + v.n;
    c.resize(320, 48);
    c.clipsContent = true;
    c.fills = [];
    var bg = figma.createRectangle();
    bg.resize(320, 48);
    bg.x = 0; bg.y = 0;
    bg.cornerRadius = 0;
    bg.fills = [{type:'SOLID',color:hex('#F5F5F5')}];
    bg.strokes = [{type:'SOLID',color:hex(v.focused ? '#0A3EFF' : '#E0E0E0')}];
    bg.strokeWeight = v.focused ? 2 : 1;
    bg.strokeAlign = 'INSIDE';
    c.appendChild(bg);
    // Search icon placeholder
    var iconR = figma.createEllipse();
    iconR.resize(14, 14);
    iconR.x = 14; iconR.y = 17;
    iconR.fills = [];
    iconR.strokes = [{type:'SOLID',color:hex('#787878')}];
    iconR.strokeWeight = 1.5;
    c.appendChild(iconR);
    var t = figma.createText();
    t.fontName = {family:font, style:'Regular'};
    t.characters = v.hasVal ? 'Scaffold XR-204' : 'Search equipment, jobs...';
    t.fontSize = 14;
    t.fills = [{type:'SOLID',color:hex(v.hasVal ? '#202020' : '#ABABAB')}];
    t.x = 40; t.y = 15;
    c.appendChild(t);
    if (v.hasVal) {
      var clearR = figma.createEllipse();
      clearR.resize(16, 16);
      clearR.x = 296; clearR.y = 16;
      clearR.fills = [{type:'SOLID',color:hex('#ABABAB')}];
      c.appendChild(clearR);
    }
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set = figma.combineAsVariants(nodes, figma.currentPage);
  set.name = 'Search Bar';
  return set;
}

// ─── Component: Status Dot ───────────────────────────────────

async function mkStatusDot(font) {
  var STATUSES = [
    {n:'Online',  color:'#22C55E'},
    {n:'Offline', color:'#ABABAB'},
    {n:'Busy',    color:'#EF4444'},
    {n:'Away',    color:'#F59E0B'}
  ];
  var nodes = [];
  for (var i=0; i<STATUSES.length; i++) {
    var s = STATUSES[i];
    var c = figma.createComponent();
    c.name = 'Status=' + s.n;
    c.resize(80, 24);
    c.clipsContent = false;
    c.fills = [];
    var dot = figma.createEllipse();
    dot.resize(10, 10);
    dot.x = 0; dot.y = 7;
    dot.fills = [{type:'SOLID',color:hex(s.color)}];
    c.appendChild(dot);
    var t = figma.createText();
    t.fontName = {family:font, style:'Regular'};
    t.characters = s.n;
    t.fontSize = 13;
    t.fills = [{type:'SOLID',color:hex('#545454')}];
    t.x = 18; t.y = 4;
    c.appendChild(t);
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set = figma.combineAsVariants(nodes, figma.currentPage);
  set.name = 'Status Dot';
  return set;
}

// ─── Component: Skeleton ─────────────────────────────────────

async function mkSkeleton(font) {
  var VARIANTS = [
    {n:'Text',      w:240, h:16},
    {n:'Rectangle', w:240, h:120},
    {n:'Card',      w:240, h:160},
    {n:'Avatar',    w:40,  h:40, circle:true}
  ];
  var nodes = [];
  for (var i=0; i<VARIANTS.length; i++) {
    var v = VARIANTS[i];
    var c = figma.createComponent();
    c.name = 'Variant=' + v.n;
    c.resize(v.w, v.h + 24);
    c.clipsContent = false;
    c.fills = [];
    var r;
    if (v.circle) {
      r = figma.createEllipse();
    } else {
      r = figma.createRectangle();
    }
    r.resize(v.w, v.h);
    r.x = 0; r.y = 0;
    if (!v.circle) { r.cornerRadius = 4; }
    r.fills = [{type:'SOLID',color:hex('#EEEEEE')}];
    c.appendChild(r);
    var lbl = figma.createText();
    lbl.fontName = {family:font, style:'Regular'};
    lbl.characters = v.n + ' skeleton';
    lbl.fontSize = 10;
    lbl.fills = [{type:'SOLID',color:hex('#ABABAB')}];
    lbl.x = 0; lbl.y = v.h + 4;
    c.appendChild(lbl);
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set = figma.combineAsVariants(nodes, figma.currentPage);
  set.name = 'Skeleton';
  return set;
}

// ─── Component: Navigation Drawer ───────────────────────────

async function mkNavDrawer(font) {
  var TYPES = ['Standard', 'Modal'];
  var nodes = [];
  for (var i=0; i<TYPES.length; i++) {
    var tp = TYPES[i];
    var c = figma.createComponent();
    c.name = 'Type=' + tp;
    c.resize(280, 480);
    c.clipsContent = true;
    c.fills = [{type:'SOLID',color:hex('#FFFFFF')}];
    if (tp === 'Modal') {
      c.effects = [{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:0.2},offset:{x:4,y:0},radius:16,spread:0,visible:true,blendMode:'NORMAL'}];
    }
    // Header
    var hdr = figma.createRectangle();
    hdr.resize(280, 64);
    hdr.x = 0; hdr.y = 0;
    hdr.fills = [{type:'SOLID',color:hex('#F8F8F8')}];
    c.appendChild(hdr);
    var appName = figma.createText();
    appName.fontName = {family:font, style:'Medium'};
    appName.characters = 'Quantify';
    appName.fontSize = 18;
    appName.fills = [{type:'SOLID',color:hex('#202020')}];
    appName.x = 20; appName.y = 22;
    c.appendChild(appName);
    // Nav items
    var navItems = ['Dashboard','Reservations','Deliveries','Inventory','Reports','Settings'];
    var navIcons = ['home','calendar','truck','package','barChart','settings'];
    for (var j=0; j<navItems.length; j++) {
      var itemY = 80 + j*56;
      var isSelected = j === 0;
      if (isSelected) {
        var selBg = figma.createRectangle();
        selBg.resize(256, 48);
        selBg.x = 12; selBg.y = itemY + 4;
        selBg.cornerRadius = 0;
        selBg.fills = [{type:'SOLID',color:hex('#E8EDFF')}];
        c.appendChild(selBg);
      }
      var iconR = figma.createRectangle();
      iconR.resize(20, 20);
      iconR.x = 20; iconR.y = itemY + 18;
      iconR.cornerRadius = 2;
      iconR.fills = [{type:'SOLID',color:hex(isSelected ? '#0A3EFF' : '#787878')}];
      c.appendChild(iconR);
      var itemLbl = figma.createText();
      itemLbl.fontName = {family:font, style: isSelected ? 'Medium' : 'Regular'};
      itemLbl.characters = navItems[j];
      itemLbl.fontSize = 14;
      itemLbl.fills = [{type:'SOLID',color:hex(isSelected ? '#0A3EFF' : '#202020')}];
      itemLbl.x = 52; itemLbl.y = itemY + 19;
      c.appendChild(itemLbl);
    }
    figma.currentPage.appendChild(c);
    nodes.push(c);
  }
  var set = figma.combineAsVariants(nodes, figma.currentPage);
  set.name = 'Navigation Drawer';
  return set;
}


// ═══════════════════════════════════════════════════════════
// SCREEN BUILDER UTILITIES
// ═══════════════════════════════════════════════════════════

function makeScreenFrame(page, font, x, y, title) {
  var f = figma.createFrame();
  f.resize(390, 844);
  f.x = x; f.y = y;
  f.fills = [{type:'SOLID',color:hex('#F5F5F5')}];
  f.clipsContent = true;
  f.name = title;
  page.appendChild(f);
  // Status bar
  var sb = figma.createRectangle();
  sb.resize(390, 24);
  sb.x = 0; sb.y = 0;
  sb.fills = [{type:'SOLID',color:hex('#202020')}];
  f.appendChild(sb);
  var sbTime = figma.createText();
  sbTime.fontName = {family:font, style:'Medium'};
  sbTime.characters = '9:41';
  sbTime.fontSize = 12;
  sbTime.fills = [{type:'SOLID',color:hex('#FFFFFF')}];
  sbTime.x = 16; sbTime.y = 5;
  f.appendChild(sbTime);
  var sbRight = figma.createText();
  sbRight.fontName = {family:font, style:'Regular'};
  sbRight.characters = 'WiFi  100%';
  sbRight.fontSize = 11;
  sbRight.fills = [{type:'SOLID',color:hex('#FFFFFF')}];
  sbRight.x = 310; sbRight.y = 6;
  f.appendChild(sbRight);
  // Screen label below frame
  var lbl = figma.createText();
  lbl.fontName = {family:font, style:'Regular'};
  lbl.characters = title;
  lbl.fontSize = 11;
  lbl.fills = [{type:'SOLID',color:hex('#ABABAB')}];
  lbl.x = x; lbl.y = y + 852;
  page.appendChild(lbl);
  return f;
}

function screenRect(f, x, y, w, h, fill, radius, stroke) {
  var r = figma.createRectangle();
  r.resize(w, h);
  r.x = x; r.y = y;
  r.fills = [{type:'SOLID',color:hex(fill || '#FFFFFF')}];
  if (radius) { r.cornerRadius = radius; }
  if (stroke) {
    r.strokes = [{type:'SOLID',color:hex(stroke)}];
    r.strokeWeight = 1;
    r.strokeAlign = 'INSIDE';
  }
  f.appendChild(r);
  return r;
}

function screenText(f, font, text, x, y, size, color, style, w) {
  var t = figma.createText();
  t.fontName = {family:font, style: style || 'Regular'};
  t.characters = String(text);
  t.fontSize = size || 14;
  t.fills = [{type:'SOLID',color:hex(color || '#202020')}];
  t.x = x; t.y = y;
  if (w) { t.resize(w, t.height); t.textAutoResize = 'HEIGHT'; }
  f.appendChild(t);
  return t;
}

function screenLine(f, x1, y1, x2, y2, color) {
  var line = figma.createLine();
  line.x = x1; line.y = y1;
  line.resize(Math.max(1, x2-x1), 0);
  line.strokes = [{type:'SOLID',color:hex(color || '#E0E0E0')}];
  line.strokeWeight = 1;
  f.appendChild(line);
  return line;
}

// Top App Bar helper
function screenAppBar(f, font, title, hasBack) {
  screenRect(f, 0, 24, 390, 56, '#FFFFFF');
  if (hasBack) {
    var arrow = figma.createRectangle();
    arrow.resize(20, 2);
    arrow.x = 20; arrow.y = 51;
    arrow.fills = [{type:'SOLID',color:hex('#202020')}];
    f.appendChild(arrow);
  }
  screenText(f, font, title, hasBack ? 52 : 20, 42, 18, '#202020', 'Medium');
  screenLine(f, 0, 80, 390, 80, '#E0E0E0');
}

// Bottom Nav helper
function screenBottomNav(f, font) {
  screenRect(f, 0, 780, 390, 64, '#FFFFFF');
  screenLine(f, 0, 780, 390, 780, '#E0E0E0');
  var items = ['Home','Deliveries','Inventory','Profile'];
  for (var i=0; i<items.length; i++) {
    var bx = i * 97 + 28;
    screenRect(f, bx, 790, 20, 20, i===0 ? '#0A3EFF' : '#ABABAB', 2);
    screenText(f, font, items[i], bx-4, 814, 10, i===0 ? '#0A3EFF' : '#ABABAB');
  }
}

// ═══════════════════════════════════════════════════════════
// SCREENS
// ═══════════════════════════════════════════════════════════

// 1. Sign In
function buildScreenSignIn(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'SignIn');
  f.fills = [{type:'SOLID',color:hex('#FFFFFF')}];
  // Logo circle
  screenRect(f, 155, 100, 80, 80, '#0A3EFF', 40);
  screenText(f, font, 'Q', 178, 118, 36, '#FFFFFF', 'Medium');
  screenText(f, font, 'Quantify', 133, 194, 24, '#202020', 'Medium');
  screenText(f, font, 'Avontus Scaffolding Platform', 65, 226, 13, '#787878');
  // Email field
  screenRect(f, 24, 290, 342, 56, '#FFFFFF', 0, '#E0E0E0');
  screenText(f, font, 'Email address', 40, 300, 11, '#ABABAB');
  screenText(f, font, 'user@avontus.com', 40, 316, 14, '#202020');
  // Password field
  screenRect(f, 24, 362, 342, 56, '#FFFFFF', 0, '#E0E0E0');
  screenText(f, font, 'Password', 40, 372, 11, '#ABABAB');
  screenText(f, font, '••••••••••', 40, 388, 14, '#202020');
  // Forgot
  screenText(f, font, 'Forgot password?', 240, 428, 13, '#0A3EFF');
  // Sign In btn
  screenRect(f, 24, 456, 342, 48, '#0A3EFF');
  screenText(f, font, 'Sign In', 155, 470, 15, '#FFFFFF', 'Medium');
}

// 2. Dashboard
function buildScreenDashboard(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'Dashboard');
  // App bar
  screenRect(f, 0, 24, 390, 56, '#FFFFFF');
  screenText(f, font, 'Quantify', 20, 42, 20, '#0A3EFF', 'Medium');
  screenRect(f, 330, 36, 20, 20, '#ABABAB', 2);
  screenRect(f, 356, 36, 20, 20, '#ABABAB', 2);
  screenLine(f, 0, 80, 390, 80, '#E0E0E0');
  // KPI cards row 1
  var kpis = [
    {label:'Deliveries Today', val:'24', color:'#0A3EFF'},
    {label:'Active Rentals',   val:'312', color:'#22C55E'},
    {label:'Pending Returns',  val:'8',  color:'#F59E0B'},
    {label:'Revenue MTD',      val:'$42k', color:'#3B82F6'}
  ];
  for (var i=0; i<4; i++) {
    var kx = (i % 2) * 183 + 12;
    var ky = 92 + Math.floor(i/2) * 92;
    screenRect(f, kx, ky, 171, 80, '#FFFFFF', 0, '#E0E0E0');
    screenText(f, font, kpis[i].label, kx+10, ky+8, 11, '#787878');
    screenText(f, font, kpis[i].val, kx+10, ky+30, 28, kpis[i].color, 'Medium');
  }
  // Recent Activity
  screenText(f, font, 'Recent Activity', 16, 284, 16, '#202020', 'Medium');
  var activities = [
    {t:'RES-2041 shipped to North Site', sub:'2 hours ago', color:'#22C55E'},
    {t:'EQ-1822 returned — damaged', sub:'3 hours ago', color:'#EF4444'},
    {t:'RES-2039 confirmed', sub:'5 hours ago', color:'#0A3EFF'}
  ];
  for (var ai=0; ai<activities.length; ai++) {
    var aY = 310 + ai * 70;
    screenRect(f, 16, aY, 358, 60, '#FFFFFF', 0, '#EEEEEE');
    screenRect(f, 16, aY, 4, 60, activities[ai].color);
    screenText(f, font, activities[ai].t, 28, aY+10, 13, '#202020');
    screenText(f, font, activities[ai].sub, 28, aY+30, 12, '#ABABAB');
  }
  screenBottomNav(f, font);
}

// 3. Reservation List
function buildScreenReservationList(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'ReservationList');
  screenAppBar(f, font, 'Reservations', false);
  screenRect(f, 80, 36, 20, 20, '#ABABAB', 2); // filter icon placeholder
  // Search bar
  screenRect(f, 16, 88, 358, 44, '#F5F5F5', 0, '#E0E0E0');
  screenText(f, font, 'Search reservations...', 44, 101, 13, '#ABABAB');
  // Filter chips
  var chips = ['All', 'Active', 'Pending', 'Completed'];
  var chipColors = ['#0A3EFF', '#787878', '#787878', '#787878'];
  var chipBgs = ['#E8EDFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'];
  var cx = 16;
  for (var ci=0; ci<chips.length; ci++) {
    var cw = chips[ci].length * 8 + 24;
    screenRect(f, cx, 144, cw, 30, chipBgs[ci], 0, ci===0 ? '#0A3EFF' : '#E0E0E0');
    screenText(f, font, chips[ci], cx+10, 151, 12, chipColors[ci], ci===0 ? 'Medium' : 'Regular');
    cx += cw + 8;
  }
  // Reservation rows
  var rows = [
    {id:'RES-2041', client:'North Site Scaffolding', status:'Active',  sColor:'#22C55E', sBg:'#DCFCE7'},
    {id:'RES-2040', client:'Building 7 Facade',      status:'Pending', sColor:'#F59E0B', sBg:'#FEF3C7'},
    {id:'RES-2039', client:'Downtown Tower',          status:'Active',  sColor:'#22C55E', sBg:'#DCFCE7'},
    {id:'RES-2038', client:'Warehouse Complex',       status:'Completed',sColor:'#787878',sBg:'#F5F5F5'}
  ];
  for (var ri=0; ri<rows.length; ri++) {
    var rY = 188 + ri * 72;
    screenRect(f, 16, rY, 358, 64, '#FFFFFF', 0, '#EEEEEE');
    screenText(f, font, rows[ri].id, 24, rY+10, 14, '#202020', 'Medium');
    screenRect(f, 280, rY+8, rows[ri].status.length*7+16, 22, rows[ri].sBg);
    screenText(f, font, rows[ri].status, 288, rY+13, 11, rows[ri].sColor, 'Medium');
    screenText(f, font, rows[ri].client, 24, rY+34, 13, '#545454');
  }
  screenBottomNav(f, font);
}


// 4. Reservation Detail
function buildScreenReservationDetail(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'ReservationDetail');
  screenAppBar(f, font, 'RES-2041', true);
  // Customer info card
  screenRect(f, 16, 92, 358, 100, '#FFFFFF', 0, '#E0E0E0');
  screenText(f, font, 'Customer', 28, 100, 11, '#ABABAB');
  screenText(f, font, 'North Site Scaffolding Ltd.', 28, 116, 15, '#202020', 'Medium');
  screenText(f, font, 'Contact: John Miller', 28, 140, 13, '#545454');
  screenText(f, font, '+1 (555) 204-0192', 28, 160, 13, '#0A3EFF');
  // Items section
  screenText(f, font, 'Items (3)', 16, 208, 15, '#202020', 'Medium');
  var items = [
    {name:'Ringlock Standard Ledger 1.5m', qty:'24 pcs', code:'RL-LED-150'},
    {name:'Ringlock Vertical Post 2m',     qty:'16 pcs', code:'RL-VRT-200'},
    {name:'Base Jack Screw 600mm',         qty:'32 pcs', code:'BJ-SCR-600'}
  ];
  for (var i=0; i<items.length; i++) {
    var iY = 232 + i * 68;
    screenRect(f, 16, iY, 358, 60, '#FFFFFF', 0, '#EEEEEE');
    screenText(f, font, items[i].name, 24, iY+8, 13, '#202020');
    screenText(f, font, items[i].code, 24, iY+30, 11, '#ABABAB');
    screenText(f, font, items[i].qty, 296, iY+18, 14, '#0A3EFF', 'Medium');
  }
  // Delivery info
  screenRect(f, 16, 440, 358, 72, '#F8F8F8', 0, '#E0E0E0');
  screenText(f, font, 'Delivery Date', 28, 450, 11, '#ABABAB');
  screenText(f, font, 'Mar 15, 2026 · 8:00 AM', 28, 466, 14, '#202020');
  screenText(f, font, 'North Site, Building 3 Yard', 28, 488, 13, '#545454');
  // Action buttons
  screenRect(f, 16, 540, 170, 48, '#0A3EFF');
  screenText(f, font, 'Confirm', 62, 556, 15, '#FFFFFF', 'Medium');
  screenRect(f, 200, 540, 174, 48, '#FFFFFF', 0, '#EF4444');
  screenText(f, font, 'Cancel', 256, 556, 15, '#EF4444', 'Medium');
}

// 5. Ship Reservation
function buildScreenShipReservation(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'ShipReservation');
  screenAppBar(f, font, 'Ship RES-2041', true);
  // Stepper
  var steps = ['Verify', 'Pack', 'Ship'];
  for (var si=0; si<steps.length; si++) {
    var stepX = 40 + si * 120;
    var isActive = si === 1;
    var isDone = si === 0;
    var bgColor = isDone ? '#22C55E' : (isActive ? '#0A3EFF' : '#E0E0E0');
    var circle2 = figma.createEllipse();
    circle2.resize(32, 32);
    circle2.x = f.x + stepX + x - f.x; circle2.y = f.y + 92 + y - f.y;
    // position relative to frame
    circle2.x = stepX + 16;
    circle2.y = 92;
    circle2.fills = [{type:'SOLID',color:hex(bgColor)}];
    f.appendChild(circle2);
    screenText(f, font, isDone ? '✓' : String(si+1), stepX+24, 100, 13, '#FFFFFF', 'Medium');
    screenText(f, font, steps[si], stepX+12, 130, 11, isActive ? '#0A3EFF' : '#787878', isActive ? 'Medium' : 'Regular');
    if (si < 2) {
      screenLine(f, stepX+48, 108, stepX+120, 108, '#E0E0E0');
    }
  }
  // Items checklist
  screenText(f, font, 'Pack Checklist', 16, 164, 15, '#202020', 'Medium');
  var packItems = [
    {name:'Ringlock Ledger 1.5m', qty:'24', done:true},
    {name:'Ringlock Vertical 2m',  qty:'16', done:true},
    {name:'Base Jack 600mm',       qty:'32', done:false}
  ];
  for (var pi=0; pi<packItems.length; pi++) {
    var pY = 192 + pi * 60;
    screenRect(f, 16, pY, 358, 52, '#FFFFFF', 0, '#EEEEEE');
    // Checkbox
    screenRect(f, 24, pY+16, 20, 20, packItems[pi].done ? '#0A3EFF' : '#FFFFFF', 0, packItems[pi].done ? '#0A3EFF' : '#E0E0E0');
    if (packItems[pi].done) {
      screenText(f, font, '✓', 27, pY+18, 12, '#FFFFFF', 'Medium');
    }
    screenText(f, font, packItems[pi].name, 54, pY+10, 13, '#202020');
    screenText(f, font, 'Qty: ' + packItems[pi].qty, 54, pY+30, 12, '#787878');
  }
  // QR code area
  screenRect(f, 96, 380, 198, 198, '#F8F8F8', 0, '#E0E0E0');
  screenText(f, font, 'Scan QR to confirm', 104, 488, 12, '#ABABAB');
  // QR pattern placeholder
  for (var qr=0; qr<3; qr++) {
    screenRect(f, 112+qr*56, 392, 40, 40, '#EEEEEE', 0, '#ABABAB');
    screenRect(f, 120+qr*56, 400, 24, 24, '#202020');
  }
  // Ship button
  screenRect(f, 16, 596, 358, 48, '#0A3EFF');
  screenText(f, font, 'Mark as Shipped', 118, 612, 15, '#FFFFFF', 'Medium');
}

// 6. Equipment Scanner
function buildScreenEquipmentScanner(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'EquipmentScanner');
  screenAppBar(f, font, 'Scan Equipment', true);
  // Camera viewfinder
  screenRect(f, 0, 80, 390, 420, '#1A1A1A');
  // Corner markers
  var corners = [[24,104],[354,104],[24,484],[354,484]];
  for (var ci=0; ci<corners.length; ci++) {
    screenRect(f, corners[ci][0], corners[ci][1], 32, 4, '#FFFFFF');
    screenRect(f, corners[ci][0], corners[ci][1], 4, 32, '#FFFFFF');
  }
  // Scan line
  screenRect(f, 64, 290, 262, 2, '#0A3EFF');
  screenText(f, font, 'Align barcode or QR code within frame', 50, 510, 13, '#787878');
  // Manual entry button
  screenRect(f, 16, 540, 358, 48, '#FFFFFF', 0, '#0A3EFF');
  screenText(f, font, 'Enter Code Manually', 102, 556, 15, '#0A3EFF', 'Medium');
  // Recent scans
  screenText(f, font, 'Recent Scans', 16, 606, 14, '#202020', 'Medium');
  var recentScans = ['EQ-1822 · Base Jack 600mm', 'EQ-1799 · Ringlock Ledger'];
  for (var rs=0; rs<recentScans.length; rs++) {
    screenRect(f, 16, 630+rs*44, 358, 36, '#FFFFFF', 0, '#EEEEEE');
    screenText(f, font, recentScans[rs], 28, 639+rs*44, 13, '#202020');
  }
}

// 7. Equipment Detail
function buildScreenEquipmentDetail(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'EquipmentDetail');
  screenAppBar(f, font, 'Equipment Detail', true);
  // Photo placeholder
  screenRect(f, 0, 80, 390, 220, '#F0F0F0');
  screenText(f, font, 'Equipment Photo', 132, 182, 14, '#ABABAB');
  screenRect(f, 165, 154, 60, 60, '#E0E0E0', 4);
  // Name & ID
  screenText(f, font, 'Ringlock Standard Ledger 1.5m', 16, 316, 18, '#202020', 'Medium');
  screenRect(f, 16, 342, 100, 24, '#E8EDFF');
  screenText(f, font, 'EQ-1822', 22, 348, 12, '#0A3EFF', 'Medium');
  // Specs grid
  var specs = [
    {l:'Category', v:'Ledger'},
    {l:'Length', v:'1.5m'},
    {l:'Material', v:'Steel'},
    {l:'Weight', v:'3.2 kg'}
  ];
  for (var sp=0; sp<specs.length; sp++) {
    var sx = (sp%2) * 183 + 16;
    var sy2 = 380 + Math.floor(sp/2) * 60;
    screenRect(f, sx, sy2, 175, 52, '#F8F8F8', 0, '#EEEEEE');
    screenText(f, font, specs[sp].l, sx+10, sy2+8, 11, '#ABABAB');
    screenText(f, font, specs[sp].v, sx+10, sy2+26, 14, '#202020', 'Medium');
  }
  // Status badge
  screenRect(f, 250, 342, 80, 24, '#DCFCE7');
  screenText(f, font, 'Available', 260, 348, 12, '#22C55E', 'Medium');
  // Maintenance history
  screenText(f, font, 'Maintenance History', 16, 512, 14, '#202020', 'Medium');
  var maint = ['Mar 2026 · Routine Inspection · Passed', 'Jan 2026 · Cleaning · Completed'];
  for (var mi=0; mi<maint.length; mi++) {
    screenRect(f, 16, 538+mi*52, 358, 44, '#FFFFFF', 0, '#EEEEEE');
    screenText(f, font, maint[mi], 24, 548+mi*52, 12, '#545454');
  }
}


// 8. Delivery Tracking
function buildScreenDeliveryTracking(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'DeliveryTracking');
  screenAppBar(f, font, 'Track Delivery', true);
  // Map placeholder
  screenRect(f, 0, 80, 390, 380, '#E8F0E8');
  // Map grid lines
  for (var ml=0; ml<5; ml++) {
    screenRect(f, 0, 80+ml*76, 390, 1, '#D0DCD0');
    screenRect(f, ml*78, 80, 1, 380, '#D0DCD0');
  }
  // Route path
  screenRect(f, 80, 200, 240, 3, '#0A3EFF');
  // Truck marker
  screenRect(f, 182, 190, 26, 22, '#0A3EFF', 2);
  screenText(f, font, 'T', 190, 196, 12, '#FFFFFF', 'Medium');
  // Destination pin
  screenRect(f, 300, 188, 18, 26, '#EF4444', 0);
  // Delivery info card
  screenRect(f, 0, 460, 390, 200, '#FFFFFF');
  screenLine(f, 0, 460, 390, 460, '#E0E0E0');
  screenText(f, font, 'ETA: 14 minutes', 16, 472, 18, '#202020', 'Medium');
  screenText(f, font, 'North Site · Building 3 Yard', 16, 500, 13, '#787878');
  // Timeline
  var tl = [
    {label:'Order confirmed', done:true},
    {label:'Loaded at warehouse', done:true},
    {label:'En route', done:true},
    {label:'Delivered', done:false}
  ];
  for (var ti=0; ti<tl.length; ti++) {
    var tY = 526 + ti * 36;
    var dot2 = figma.createEllipse();
    dot2.resize(10, 10);
    dot2.x = 20; dot2.y = tY;
    dot2.fills = [{type:'SOLID',color:hex(tl[ti].done ? '#0A3EFF' : '#E0E0E0')}];
    f.appendChild(dot2);
    if (ti < tl.length - 1) {
      screenRect(f, 24, tY+10, 2, 26, tl[ti].done ? '#0A3EFF' : '#E0E0E0');
    }
    screenText(f, font, tl[ti].label, 40, tY, 13, tl[ti].done ? '#202020' : '#ABABAB');
  }
}

// 9. Return Inspection
function buildScreenReturnInspection(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'ReturnInspection');
  screenAppBar(f, font, 'Return Inspection', true);
  screenText(f, font, 'RES-2038 · Warehouse Complex', 16, 92, 13, '#787878');
  // Items with condition
  var inspItems = [
    {name:'Ringlock Ledger 1.5m (24 pcs)', cond:'Good'},
    {name:'Ringlock Vertical 2m (16 pcs)', cond:'Damaged'},
    {name:'Base Jack 600mm (32 pcs)',       cond:'Good'}
  ];
  for (var ii=0; ii<inspItems.length; ii++) {
    var iY = 116 + ii * 96;
    screenRect(f, 16, iY, 358, 88, '#FFFFFF', 0, '#E0E0E0');
    screenText(f, font, inspItems[ii].name, 24, iY+8, 13, '#202020');
    // Condition radio buttons
    var conds = ['Good','Damaged','Missing'];
    var condColors = ['#22C55E','#EF4444','#F59E0B'];
    for (var cc=0; cc<conds.length; cc++) {
      var cx2 = 24 + cc * 110;
      var isSelected = conds[cc] === inspItems[ii].cond;
      var circle3 = figma.createEllipse();
      circle3.resize(16, 16);
      circle3.x = cx2; circle3.y = iY + 40;
      circle3.fills = [{type:'SOLID',color:hex(isSelected ? condColors[cc] : '#FFFFFF')}];
      circle3.strokes = [{type:'SOLID',color:hex(isSelected ? condColors[cc] : '#E0E0E0')}];
      circle3.strokeWeight = 1.5;
      f.appendChild(circle3);
      screenText(f, font, conds[cc], cx2+20, iY+43, 12, isSelected ? condColors[cc] : '#787878');
    }
  }
  // Notes field
  screenText(f, font, 'Notes', 16, 412, 12, '#ABABAB');
  screenRect(f, 16, 432, 358, 80, '#FFFFFF', 0, '#E0E0E0');
  screenText(f, font, 'Item EQ-1822 has visible rust on joint...', 26, 442, 13, '#ABABAB', 'Regular', 330);
  // Submit
  screenRect(f, 16, 532, 358, 48, '#0A3EFF');
  screenText(f, font, 'Submit Inspection', 108, 548, 15, '#FFFFFF', 'Medium');
}

// 10. Inventory
function buildScreenInventory(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'Inventory');
  screenAppBar(f, font, 'Inventory', false);
  // Search bar
  screenRect(f, 16, 88, 310, 44, '#F5F5F5', 0, '#E0E0E0');
  screenText(f, font, 'Search inventory...', 44, 101, 13, '#ABABAB');
  // Grid/List toggle
  screenRect(f, 334, 92, 36, 36, '#E8EDFF');
  screenText(f, font, '⊞', 342, 100, 16, '#0A3EFF');
  // Filter row
  var filters2 = ['All','Available','Rented','Maintenance'];
  var fx2 = 16;
  for (var fi=0; fi<filters2.length; fi++) {
    var fw = filters2[fi].length * 8 + 20;
    screenRect(f, fx2, 144, fw, 28, fi===0?'#E8EDFF':'#FFFFFF', 0, fi===0?'#0A3EFF':'#E0E0E0');
    screenText(f, font, filters2[fi], fx2+8, 151, 11, fi===0?'#0A3EFF':'#787878', fi===0?'Medium':'Regular');
    fx2 += fw + 8;
  }
  // Inventory grid 2-col, 4 items
  var invItems = [
    {name:'Ringlock Ledger', qty:'124 pcs', status:'Available', sc:'#22C55E', sb:'#DCFCE7'},
    {name:'Vertical Post 2m', qty:'86 pcs', status:'Rented', sc:'#0A3EFF', sb:'#E8EDFF'},
    {name:'Base Jack 600mm', qty:'48 pcs', status:'Available', sc:'#22C55E', sb:'#DCFCE7'},
    {name:'Diagonal Brace', qty:'12 pcs', status:'Maintenance', sc:'#F59E0B', sb:'#FEF3C7'}
  ];
  for (var inv=0; inv<invItems.length; inv++) {
    var col = inv % 2;
    var row = Math.floor(inv / 2);
    var gx = col * 183 + 16;
    var gy = 188 + row * 140;
    screenRect(f, gx, gy, 175, 128, '#FFFFFF', 0, '#E0E0E0');
    screenRect(f, gx, gy, 175, 64, '#F5F5F5');
    screenRect(f, gx+60, gy+16, 55, 32, '#E0E0E0', 4);
    screenText(f, font, invItems[inv].name, gx+8, gy+72, 12, '#202020', 'Medium', 159);
    screenText(f, font, invItems[inv].qty, gx+8, gy+92, 11, '#787878');
    screenRect(f, gx+8, gy+108, invItems[inv].status.length*7+16, 16, invItems[inv].sb);
    screenText(f, font, invItems[inv].status, gx+12, gy+110, 9, invItems[inv].sc, 'Medium');
  }
  screenBottomNav(f, font);
}

// 11. Search
function buildScreenSearch(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'Search');
  f.fills = [{type:'SOLID',color:hex('#FFFFFF')}];
  // Large search bar focused state
  screenRect(f, 16, 32, 358, 56, '#FFFFFF', 0, '#0A3EFF');
  var focusBorder = figma.createRectangle();
  focusBorder.resize(358, 56);
  focusBorder.x = 16; focusBorder.y = 32;
  focusBorder.fills = [];
  focusBorder.strokes = [{type:'SOLID',color:hex('#0A3EFF')}];
  focusBorder.strokeWeight = 2;
  focusBorder.strokeAlign = 'INSIDE';
  f.appendChild(focusBorder);
  screenText(f, font, 'ringlock', 50, 52, 16, '#202020');
  // Cursor line
  screenRect(f, 114, 48, 2, 20, '#0A3EFF');
  // Back arrow
  screenRect(f, 22, 52, 18, 2, '#202020');
  // Recent searches
  screenText(f, font, 'Recent searches', 16, 108, 12, '#ABABAB');
  var recents = ['Ringlock Ledger 1.5m', 'Base Jack 600mm', 'RES-2041'];
  for (var ri2=0; ri2<recents.length; ri2++) {
    screenRect(f, 16, 132+ri2*44, 358, 36, '#F8F8F8');
    screenRect(f, 24, 143+ri2*44, 14, 14, '#EEEEEE', 2);
    screenText(f, font, recents[ri2], 46, 143+ri2*44, 13, '#202020');
  }
  // Results
  screenText(f, font, 'Results for "ringlock"', 16, 284, 12, '#ABABAB');
  var results = [
    {name:'Ringlock Ledger 1.5m', sub:'Equipment · 124 available'},
    {name:'Ringlock Vertical 2m', sub:'Equipment · 86 rented'},
    {name:'RES-2041 — Ringlock order', sub:'Reservation · Active'}
  ];
  for (var ri3=0; ri3<results.length; ri3++) {
    screenRect(f, 16, 308+ri3*68, 358, 60, '#FFFFFF', 0, '#EEEEEE');
    screenRect(f, 24, 320+ri3*68, 36, 36, '#E8EDFF', 2);
    screenText(f, font, results[ri3].name, 72, 316+ri3*68, 14, '#202020');
    screenText(f, font, results[ri3].sub, 72, 336+ri3*68, 12, '#787878');
  }
}


// 12. Notifications
function buildScreenNotifications(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'Notifications');
  screenAppBar(f, font, 'Notifications', false);
  var notifs = [
    {icon:'truck', title:'RES-2041 shipped', sub:'Your reservation is on its way', time:'2m ago', read:false, color:'#0A3EFF'},
    {icon:'checkCircle', title:'Inspection passed', sub:'EQ-1799 cleared for rental', time:'1h ago', read:false, color:'#22C55E'},
    {icon:'alertTriangle', title:'Equipment damage reported', sub:'EQ-1822 flagged by driver', time:'3h ago', read:true, color:'#EF4444'},
    {icon:'calendar', title:'Reservation due tomorrow', sub:'RES-2038 return due Mar 13', time:'5h ago', read:true, color:'#F59E0B'},
    {icon:'info', title:'System maintenance', sub:'Scheduled downtime Sat 2-4 AM', time:'1d ago', read:true, color:'#787878'}
  ];
  for (var ni=0; ni<notifs.length; ni++) {
    var nY = 92 + ni * 72;
    var nBg = notifs[ni].read ? '#FFFFFF' : '#F0F4FF';
    screenRect(f, 0, nY, 390, 68, nBg);
    screenLine(f, 0, nY+68, 390, nY+68, '#EEEEEE');
    // Unread indicator
    if (!notifs[ni].read) {
      var dot3 = figma.createEllipse();
      dot3.resize(8, 8);
      dot3.x = 12; dot3.y = nY + 30;
      dot3.fills = [{type:'SOLID',color:hex('#0A3EFF')}];
      f.appendChild(dot3);
    }
    // Icon circle
    screenRect(f, 28, nY+14, 40, 40, notifs[ni].read ? '#EEEEEE' : '#E8EDFF', 20);
    // Icon placeholder
    screenRect(f, 40, nY+26, 16, 16, notifs[ni].color, 2);
    screenText(f, font, notifs[ni].title, 80, nY+14, 14, '#202020', notifs[ni].read ? 'Regular' : 'Medium', 240);
    screenText(f, font, notifs[ni].sub, 80, nY+36, 12, '#787878', 'Regular', 240);
    screenText(f, font, notifs[ni].time, 330, nY+14, 11, '#ABABAB');
  }
}

// 13. Settings
function buildScreenSettings(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'Settings');
  screenAppBar(f, font, 'Settings', false);
  // Avatar + name
  var ava = figma.createEllipse();
  ava.resize(72, 72);
  ava.x = 159; ava.y = 96;
  ava.fills = [{type:'SOLID',color:hex('#0A3EFF')}];
  f.appendChild(ava);
  screenText(f, font, 'JM', 183, 122, 24, '#FFFFFF', 'Medium');
  screenText(f, font, 'John Miller', 143, 178, 16, '#202020', 'Medium');
  screenText(f, font, 'Fleet Manager · North Branch', 100, 200, 12, '#787878');
  // Settings groups
  var groups = [
    {label:'ACCOUNT', items:['Profile', 'Change Password', 'Branch Settings']},
    {label:'PREFERENCES', items:['Notifications', 'Appearance', 'Language']},
    {label:'SUPPORT', items:['Help & Documentation', 'Report Issue']}
  ];
  var gy = 236;
  for (var gi=0; gi<groups.length; gi++) {
    screenText(f, font, groups[gi].label, 16, gy, 11, '#ABABAB', 'Medium');
    gy += 20;
    for (var item=0; item<groups[gi].items.length; item++) {
      screenRect(f, 0, gy, 390, 52, '#FFFFFF');
      screenLine(f, 16, gy, 390, gy, '#EEEEEE');
      screenRect(f, 16, gy+16, 20, 20, '#EEEEEE', 2);
      screenText(f, font, groups[gi].items[item], 48, gy+17, 14, '#202020');
      // Chevron
      screenRect(f, 360, gy+22, 12, 2, '#ABABAB');
      gy += 52;
    }
    gy += 16;
  }
  // Logout
  screenRect(f, 16, gy+8, 358, 48, '#FFFFFF', 0, '#EF4444');
  screenText(f, font, 'Log Out', 160, gy+24, 15, '#EF4444', 'Medium');
}

// 14. Connection Settings
function buildScreenConnectionSettings(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'ConnectionSettings');
  screenAppBar(f, font, 'Connection', true);
  screenText(f, font, 'Server Configuration', 16, 96, 16, '#202020', 'Medium');
  screenText(f, font, 'Configure your Quantify server connection below.', 16, 120, 13, '#787878', 'Regular', 358);
  // Server URL field
  screenText(f, font, 'Server URL', 16, 164, 12, '#545454');
  screenRect(f, 16, 184, 358, 56, '#FFFFFF', 0, '#E0E0E0');
  screenText(f, font, 'Server URL', 28, 192, 11, '#ABABAB');
  screenText(f, font, 'https://quantify.avontus.com', 28, 210, 14, '#202020');
  // Port field
  screenText(f, font, 'Port', 16, 256, 12, '#545454');
  screenRect(f, 16, 276, 170, 56, '#FFFFFF', 0, '#E0E0E0');
  screenText(f, font, 'Port', 28, 284, 11, '#ABABAB');
  screenText(f, font, '8443', 28, 302, 14, '#202020');
  // Timeout
  screenText(f, font, 'Timeout (seconds)', 200, 256, 12, '#545454');
  screenRect(f, 200, 276, 174, 56, '#FFFFFF', 0, '#E0E0E0');
  screenText(f, font, 'Timeout', 212, 284, 11, '#ABABAB');
  screenText(f, font, '30', 212, 302, 14, '#202020');
  // Test connection button
  screenRect(f, 16, 360, 358, 48, '#FFFFFF', 0, '#0A3EFF');
  screenText(f, font, 'Test Connection', 114, 376, 15, '#0A3EFF', 'Medium');
  // Status indicator
  screenRect(f, 16, 428, 358, 64, '#DCFCE7', 0, '#22C55E');
  var dot4 = figma.createEllipse();
  dot4.resize(10, 10); dot4.x = 28; dot4.y = 451;
  dot4.fills = [{type:'SOLID',color:hex('#22C55E')}];
  f.appendChild(dot4);
  screenText(f, font, 'Connected', 46, 449, 14, '#22C55E', 'Medium');
  screenText(f, font, 'Last successful ping: just now', 46, 467, 12, '#22C55E');
  // SSL toggle row
  screenRect(f, 16, 512, 358, 52, '#FFFFFF');
  screenLine(f, 16, 512, 390, 512, '#EEEEEE');
  screenText(f, font, 'Use SSL/TLS', 24, 527, 14, '#202020');
  // Toggle
  screenRect(f, 322, 524, 42, 24, '#0A3EFF', 12);
  var thumb2 = figma.createEllipse();
  thumb2.resize(18, 18); thumb2.x = 343; thumb2.y = 527;
  thumb2.fills = [{type:'SOLID',color:hex('#FFFFFF')}];
  f.appendChild(thumb2);
  // Save button
  screenRect(f, 16, 588, 358, 48, '#0A3EFF');
  screenText(f, font, 'Save Settings', 128, 604, 15, '#FFFFFF', 'Medium');
}

// 15. Crew Schedule
function buildScreenCrewSchedule(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'CrewSchedule');
  screenAppBar(f, font, 'Crew Schedule', true);
  // Week header
  var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  var dayW = 50;
  screenRect(f, 80, 88, 310, 36, '#F8F8F8', 0, '#E0E0E0');
  for (var di=0; di<7; di++) {
    var isToday = di === 2;
    if (isToday) {
      screenRect(f, 80+di*dayW, 88, dayW, 36, '#E8EDFF');
    }
    screenText(f, font, days[di], 90+di*dayW, 98, 11, isToday?'#0A3EFF':'#787878', isToday?'Medium':'Regular');
    screenText(f, font, String(10+di), 94+di*dayW, 112, 10, isToday?'#0A3EFF':'#ABABAB');
  }
  // Crew rows
  var crew = [
    {name:'John M.', shifts:[{d:0,dur:2},{d:1,dur:3},{d:2,dur:2},{d:4,dur:4}]},
    {name:'Sarah K.', shifts:[{d:1,dur:4},{d:3,dur:3},{d:5,dur:2}]},
    {name:'Mike R.', shifts:[{d:0,dur:3},{d:2,dur:4},{d:4,dur:3}]},
    {name:'Anna P.', shifts:[{d:1,dur:2},{d:2,dur:3},{d:4,dur:4},{d:6,dur:2}]},
    {name:'Tom B.', shifts:[{d:0,dur:4},{d:3,dur:2},{d:5,dur:3}]}
  ];
  for (var ci2=0; ci2<crew.length; ci2++) {
    var crewY = 136 + ci2 * 60;
    screenRect(f, 0, crewY, 80, 52, '#F8F8F8', 0, '#EEEEEE');
    screenText(f, font, crew[ci2].name, 6, crewY+18, 11, '#545454');
    screenRect(f, 80, crewY, 310, 52, '#FFFFFF', 0, '#EEEEEE');
    for (var sh=0; sh<crew[ci2].shifts.length; sh++) {
      var shift = crew[ci2].shifts[sh];
      var shiftColors = ['#E8EDFF','#DCFCE7','#FEF3C7','#E8EDFF','#DCFCE7'];
      screenRect(f, 82+shift.d*dayW, crewY+8, shift.dur*dayW-4, 36, shiftColors[ci2%5], 0, '#0A3EFF');
    }
  }
  // Legend
  screenText(f, font, 'Delivery', 16, 452, 11, '#787878');
  screenRect(f, 68, 454, 14, 10, '#E8EDFF', 0, '#0A3EFF');
  screenText(f, font, 'Installation', 100, 452, 11, '#787878');
  screenRect(f, 162, 454, 14, 10, '#DCFCE7', 0, '#22C55E');
}


// 16. Quote Builder
function buildScreenQuoteBuilder(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'QuoteBuilder');
  screenAppBar(f, font, 'New Quote', true);
  // Customer field
  screenText(f, font, 'Customer', 16, 90, 12, '#545454');
  screenRect(f, 16, 110, 358, 48, '#FFFFFF', 0, '#E0E0E0');
  screenText(f, font, 'North Site Scaffolding Ltd.', 24, 122, 14, '#202020');
  // Date picker
  screenText(f, font, 'Rental Period', 16, 170, 12, '#545454');
  screenRect(f, 16, 190, 170, 48, '#FFFFFF', 0, '#E0E0E0');
  screenText(f, font, 'Mar 15, 2026', 24, 202, 13, '#202020');
  screenRect(f, 204, 190, 170, 48, '#FFFFFF', 0, '#E0E0E0');
  screenText(f, font, 'Mar 28, 2026', 212, 202, 13, '#202020');
  // Line items table header
  screenRect(f, 16, 254, 358, 32, '#F8F8F8', 0, '#E0E0E0');
  screenText(f, font, 'Item', 24, 263, 11, '#ABABAB', 'Medium');
  screenText(f, font, 'Qty', 250, 263, 11, '#ABABAB', 'Medium');
  screenText(f, font, 'Rate', 290, 263, 11, '#ABABAB', 'Medium');
  screenText(f, font, 'Total', 336, 263, 11, '#ABABAB', 'Medium');
  // Line items
  var lineItems = [
    {name:'Ringlock Ledger 1.5m', qty:'24', rate:'$2.50', total:'$60.00'},
    {name:'Ringlock Vertical 2m', qty:'16', rate:'$3.00', total:'$48.00'},
    {name:'Base Jack 600mm',       qty:'32', rate:'$1.50', total:'$48.00'}
  ];
  for (var li=0; li<lineItems.length; li++) {
    var lY = 286 + li * 48;
    screenRect(f, 16, lY, 358, 40, '#FFFFFF', 0, '#EEEEEE');
    screenText(f, font, lineItems[li].name, 24, lY+12, 12, '#202020', 'Regular', 218);
    screenText(f, font, lineItems[li].qty, 250, lY+12, 12, '#202020');
    screenText(f, font, lineItems[li].rate, 286, lY+12, 12, '#202020');
    screenText(f, font, lineItems[li].total, 328, lY+12, 12, '#202020', 'Medium');
  }
  // Add row button
  screenRect(f, 16, 430, 358, 36, '#F8F8F8', 0, '#E0E0E0');
  screenText(f, font, '+ Add Item', 152, 440, 13, '#0A3EFF', 'Medium');
  // Total summary
  screenRect(f, 16, 484, 358, 96, '#F0F4FF', 0, '#0A3EFF');
  screenText(f, font, 'Subtotal', 24, 496, 12, '#545454');
  screenText(f, font, '$156.00', 290, 496, 12, '#202020', 'Medium');
  screenLine(f, 24, 518, 366, 518, '#D0DCFF');
  screenText(f, font, 'Tax (8%)', 24, 526, 12, '#545454');
  screenText(f, font, '$12.48', 290, 526, 12, '#202020');
  screenText(f, font, 'Total', 24, 548, 15, '#202020', 'Medium');
  screenText(f, font, '$168.48', 284, 548, 16, '#0A3EFF', 'Medium');
  // Generate Quote button
  screenRect(f, 16, 600, 358, 48, '#0A3EFF');
  screenText(f, font, 'Generate Quote', 112, 616, 15, '#FFFFFF', 'Medium');
}

// 17. Report
function buildScreenReport(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'Report');
  screenAppBar(f, font, 'Reports', false);
  // Report type chips
  var rtypes = ['Utilization','Revenue','Deliveries','Maintenance'];
  var rx = 16;
  for (var ri4=0; ri4<rtypes.length; ri4++) {
    var rw = rtypes[ri4].length * 8 + 20;
    screenRect(f, rx, 88, rw, 30, ri4===0?'#E8EDFF':'#FFFFFF', 0, ri4===0?'#0A3EFF':'#E0E0E0');
    screenText(f, font, rtypes[ri4], rx+8, 95, 11, ri4===0?'#0A3EFF':'#787878', ri4===0?'Medium':'Regular');
    rx += rw + 8;
  }
  // Date range
  screenRect(f, 16, 132, 170, 40, '#FFFFFF', 0, '#E0E0E0');
  screenText(f, font, 'Mar 1, 2026', 24, 145, 13, '#202020');
  screenRect(f, 204, 132, 170, 40, '#FFFFFF', 0, '#E0E0E0');
  screenText(f, font, 'Mar 12, 2026', 212, 145, 13, '#202020');
  // Chart placeholder
  screenRect(f, 16, 188, 358, 240, '#F8F8F8', 0, '#E0E0E0');
  // Bar chart bars
  var bars = [40, 75, 55, 88, 62, 48, 70];
  var barLabels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  for (var bi=0; bi<bars.length; bi++) {
    var barH = bars[bi] * 1.6;
    var bx2 = 28 + bi * 48;
    screenRect(f, bx2, 420-barH, 32, barH, '#0A3EFF');
    screenText(f, font, barLabels[bi], bx2+4, 424, 10, '#ABABAB');
  }
  screenText(f, font, 'Equipment Utilization Rate', 92, 200, 11, '#ABABAB');
  // Summary stats
  var stats = [
    {l:'Avg utilization', v:'68%'},
    {l:'Peak day', v:'Thursday'},
    {l:'Total items tracked', v:'312'}
  ];
  for (var sti=0; sti<stats.length; sti++) {
    screenRect(f, 16+sti*122, 444, 114, 52, '#FFFFFF', 0, '#E0E0E0');
    screenText(f, font, stats[sti].l, 24+sti*122, 452, 10, '#787878', 'Regular', 98);
    screenText(f, font, stats[sti].v, 24+sti*122, 468, 14, '#202020', 'Medium');
  }
  // Export button
  screenRect(f, 16, 516, 358, 48, '#FFFFFF', 0, '#0A3EFF');
  screenText(f, font, 'Export Report', 122, 532, 15, '#0A3EFF', 'Medium');
  screenBottomNav(f, font);
}

// 18. About
function buildScreenAbout(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'About');
  f.fills = [{type:'SOLID',color:hex('#FFFFFF')}];
  screenAppBar(f, font, 'About', true);
  // App logo
  var logoCircle = figma.createEllipse();
  logoCircle.resize(120, 120);
  logoCircle.x = 135; logoCircle.y = 96;
  logoCircle.fills = [{type:'SOLID',color:hex('#0A3EFF')}];
  f.appendChild(logoCircle);
  screenText(f, font, 'Q', 170, 136, 56, '#FFFFFF', 'Medium');
  screenText(f, font, 'Quantify', 138, 230, 24, '#202020', 'Medium');
  screenText(f, font, 'Avontus Scaffolding Platform', 80, 262, 14, '#787878');
  screenText(f, font, 'Version 4.2.1 (Build 2026.03.12)', 90, 288, 12, '#ABABAB');
  // Links list
  var links = ['Privacy Policy', 'Terms of Service', 'Help & Support', 'Release Notes'];
  for (var li2=0; li2<links.length; li2++) {
    var lY2 = 336 + li2 * 56;
    screenRect(f, 0, lY2, 390, 48, '#FFFFFF');
    screenLine(f, 16, lY2, 390, lY2, '#EEEEEE');
    screenText(f, font, links[li2], 16, lY2+16, 14, '#202020');
    screenRect(f, 360, lY2+18, 12, 2, '#ABABAB');
  }
  // Company info
  screenRect(f, 0, 564, 390, 80, '#F8F8F8');
  screenLine(f, 0, 564, 390, 564, '#EEEEEE');
  screenText(f, font, 'Avontus Software', 16, 580, 14, '#202020', 'Medium');
  screenText(f, font, '© 2026 Avontus Software Inc. All rights reserved.', 16, 600, 11, '#ABABAB', 'Regular', 358);
}

// 19. Empty State
function buildScreenEmptyState(page, font, x, y) {
  var f = makeScreenFrame(page, font, x, y, 'EmptyState');
  f.fills = [{type:'SOLID',color:hex('#FFFFFF')}];
  screenAppBar(f, font, 'Reservations', false);
  // Illustration placeholder
  var illus = figma.createEllipse();
  illus.resize(180, 180);
  illus.x = 105; illus.y = 180;
  illus.fills = [{type:'SOLID',color:hex('#F0F4FF')}];
  illus.strokes = [{type:'SOLID',color:hex('#C8D4FF')}];
  illus.strokeWeight = 2;
  f.appendChild(illus);
  // Inner icon
  screenRect(f, 162, 248, 66, 44, '#C8D4FF', 4);
  screenRect(f, 174, 260, 42, 4, '#8EAAFF', 2);
  screenRect(f, 174, 272, 30, 4, '#8EAAFF', 2);
  // Heading
  screenText(f, font, 'No Reservations Yet', 82, 384, 20, '#202020', 'Medium', 226);
  // Subtext
  screenText(f, font, 'Create your first reservation to start tracking scaffold rentals and deliveries.', 40, 416, 14, '#787878', 'Regular', 310);
  // Primary action
  screenRect(f, 56, 492, 278, 48, '#0A3EFF');
  screenText(f, font, 'Create Reservation', 98, 508, 15, '#FFFFFF', 'Medium');
  // Secondary action
  screenRect(f, 56, 556, 278, 48, '#FFFFFF', 0, '#0A3EFF');
  screenText(f, font, 'Import from CSV', 106, 572, 15, '#0A3EFF', 'Medium');
}

