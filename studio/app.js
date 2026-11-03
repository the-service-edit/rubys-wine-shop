/* Ruby's Email Studio. Works like The Ember Room website editor:
   hover a section for its tools, click words to type, click a photo or button to change it or link it. */
(function () {
  'use strict';
  var R = window.RS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var LS = 'rubys-studio-v5';

  var P = {
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>', redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9a5 5 0 0 0 0 10h3"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>', phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>', help: '<path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
    pencil: '<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>', up: '<path d="m18 15-6-6-6 6"/>', down: '<path d="m6 9 6 6 6-6"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    back: '<path d="m15 18-6-6 6-6"/>', plus: '<path d="M12 5v14M5 12h14"/>', gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>', send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    text: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>', button: '<rect x="3" y="7" width="18" height="10" rx="5"/>'
  };
  function icon(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || '') + '</svg>'; }
  function setIcon(el, n, label) { el.innerHTML = icon(n) + (label ? '<span>' + label + '</span>' : ''); }
  [['#btn-back', 'back'], ['#btn-new', 'plus'], ['#btn-page', 'gear'], ['#btn-undo', 'undo'], ['#btn-redo', 'redo'], ['#dev-desktop', 'monitor'], ['#dev-mobile', 'phone'], ['#lib-close', 'x'], ['#panel-close', 'x']].forEach(function (a) { setIcon($(a[0]), a[1]); });
  $$('[data-icon]').forEach(function (b) { var t = b.textContent; b.innerHTML = '<span class="ic">' + icon(b.dataset.icon) + '</span><span class="nm">' + t + '</span>'; });

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var st = { store: null, doc: null, mode: 'browse', hover: null, sel: null, editing: null, undo: [], redo: [], phone: false, rt: null };

  /* ---------- storage ---------- */
  function newId() { return 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
  function cur() { return st.store.emails.filter(function (e) { return e.id === st.store.cur; })[0]; }
  function load() { try { var s = JSON.parse(localStorage.getItem(LS) || 'null'); if (s && s.emails && s.emails.length) return s; } catch (x) {} return null; }
  var saveT = null;
  function persist() { try { localStorage.setItem(LS, JSON.stringify(st.store)); status('Saved'); } catch (x) { status('Not saved: this browser is blocking storage'); } }
  function saved() { var e = cur(); if (e) { e.doc = st.doc; e.updated = Date.now(); } status('Saving…'); clearTimeout(saveT); saveT = setTimeout(function () { persist(); drawList(); }, 500); }
  function status(t) { $('#status').textContent = t; }
  var toastT = null;
  function toast(t) { var e = $('#toast'); e.textContent = t; e.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { e.hidden = true; }, 3000); }

  /* ---------- model ---------- */
  function sec(id) { return st.doc.sections.filter(function (s) { return s.id === id; })[0]; }
  function secIdx(id) { for (var i = 0; i < st.doc.sections.length; i++) if (st.doc.sections[i].id === id) return i; return -1; }
  function target(path) { var p = path.split(':'); return { obj: p[0] === 'doc' ? st.doc : sec(p[0]), key: p[1], sid: p[0] }; }
  function getP(path) { var t = target(path); return t.obj ? R.get(t.obj, t.key) : ''; }
  function setP(path, v) { var t = target(path); if (!t.obj) return; var ks = t.key.split('.'), o = t.obj; for (var i = 0; i < ks.length - 1; i++) o = o[ks[i]]; o[ks[ks.length - 1]] = v; }
  function itemOf(path) { var m = path.match(/^([^:]+):(items)\.(\d+)\./); return m ? { sid: m[1], i: +m[3] } : null; }

  /* ---------- undo ---------- */
  function json() { return JSON.stringify(st.doc); }
  function checkpoint() { var j = json(); if (st.undo[st.undo.length - 1] === j) return; st.undo.push(j); if (st.undo.length > 80) st.undo.shift(); st.redo = []; bar(); }
  function dropIfUnchanged() { if (st.undo[st.undo.length - 1] === json()) { st.undo.pop(); bar(); } }
  function bar() { $('#btn-undo').disabled = !st.undo.length; $('#btn-redo').disabled = !st.redo.length; }
  function restore(j) { st.doc = JSON.parse(j); closePanel(true); clearSel(); render(); saved(); bar(); }
  function undo() { finishEdit(); if (!st.undo.length) return; st.redo.push(json()); restore(st.undo.pop()); toast('Undone'); }
  function redo() { finishEdit(); if (!st.redo.length) return; st.undo.push(json()); restore(st.redo.pop()); toast('Redone'); }

  /* ---------- the email in the frame ---------- */
  var TOOLS_CSS =
    'body.ee [data-f]{cursor:text}' +
    'body.ee [data-f]:hover{outline:1px dashed rgba(26,26,26,.7);outline-offset:3px}' +
    '.ee-editing{outline:2px solid #1A1A1A!important;outline-offset:3px;box-shadow:0 0 0 5px rgba(255,255,255,.85)!important}' +
    '.ee-sel{outline:2px solid #1A1A1A!important;outline-offset:3px;box-shadow:0 0 0 6px rgba(255,255,255,.85)}' +
    'body.ee [data-img]{cursor:pointer}body.ee [data-img]:hover{outline:2px solid #1A1A1A;outline-offset:-2px}' +
    'body.ee a[data-btn]{cursor:pointer}body.ee a[data-btn]:hover{outline:1px dashed rgba(26,26,26,.7);outline-offset:3px}' +
    'body.ee [data-f]:empty::before{content:attr(data-ph);opacity:.45;font-style:italic;pointer-events:none}' +
    'body.ee div[data-f]:empty,body.ee p[data-f]:empty,body.ee h1[data-f]:empty,body.ee h2[data-f]:empty{min-height:1em}' +
    'body.ee span[data-f]:empty{display:inline-block;min-width:80px}';
  var frame = $('#frame');
  function fdoc() { try { return frame.contentDocument; } catch (x) { return null; } }
  function fwin() { try { return frame.contentWindow; } catch (x) { return null; } }
  function render() {
    var w = fwin(), y = w ? w.scrollY : 0;
    var html = R.renderEmail(st.doc, st.mode === 'edit' ? 'edit' : 'export');
    if (st.mode !== 'edit') html = html.replace(/\{\{ unsubscribe_url \}\}/g, '#').replace(/\{\{ open_tracking_block \}\}/g, '');
    frame.onload = function () { bind(); var w2 = fwin(); if (w2) w2.scrollTo(0, y); drawOverlay(); };
    frame.srcdoc = html;
    $('#page-name').textContent = st.doc.subject || 'Untitled email';
  }
  var plainOK = (function () { var d = document.createElement('div'); try { d.contentEditable = 'plaintext-only'; return d.contentEditable === 'plaintext-only'; } catch (x) { return false; } })();
  function bind() {
    var d = fdoc(), w = fwin(); if (!d) return;
    var s = d.createElement('style'); s.textContent = TOOLS_CSS; d.head.appendChild(s);
    if (st.mode === 'edit') d.body.classList.add('ee');
    d.addEventListener('click', onFrameClick, true);
    d.addEventListener('mousemove', function (e) { if (st.mode !== 'edit') return; var t = e.target.closest && e.target.closest('[data-sec]'); var id = t ? t.dataset.sec : null; if (id && id !== st.hover) { st.hover = id; drawOverlay(); } });
    d.addEventListener('keydown', keys);
    w.addEventListener('scroll', function () { drawOverlay(); placeET(); }, { passive: true });
  }
  function onFrameClick(e) {
    var t = e.target;
    var a = t.closest && t.closest('a'); if (a) e.preventDefault();
    if (st.mode !== 'edit') return;
    var secEl = t.closest('[data-sec]'); if (secEl && secEl.dataset.sec !== st.hover) { st.hover = secEl.dataset.sec; drawOverlay(); }
    var btn = t.closest('a[data-btn]');
    if (btn) { finishEdit(); select(btn, 'button'); return; }
    var im = t.closest('[data-img]');
    if (im) { finishEdit(); select(im, 'image'); return; }
    var f = t.closest('[data-f]');
    if (f) { if (st.editing !== f) startEdit(f); return; }
    finishEdit(); clearSel();
  }

  /* ---------- typing on the email ---------- */
  function startEdit(el) {
    finishEdit(); clearSel();
    checkpoint();
    st.editing = el; el.__before = getP(el.dataset.f);
    el.contentEditable = plainOK ? 'plaintext-only' : 'true';
    el.classList.add('ee-editing'); el.focus();
    var d = fdoc(), r = d.createRange(); r.selectNodeContents(el); r.collapse(false); var s = d.getSelection(); s.removeAllRanges(); s.addRange(r);
    el.oninput = function () { var v = read(el); if (!el.innerText.trim()) el.innerHTML = ''; setP(el.dataset.f, v); saved(); drawOverlay(); placeET(); };
    el.onblur = function () { setTimeout(function () { if (st.editing === el) finishEdit(); }, 120); };
    el.onkeydown = function (e) { if (e.key === 'Enter' && el.dataset.single) { e.preventDefault(); finishEdit(); } if (e.key === 'Escape') finishEdit(); };
    if (!plainOK) el.onpaste = function (e) { e.preventDefault(); d.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text/plain')); };
    var it = itemOf(el.dataset.f); if (it) showET(el, 'item'); else hideET();
  }
  function read(el) { var v = el.innerText.replace(/ /g, ' '); if (el.dataset.single) v = v.replace(/\s*\n\s*/g, ' '); return v.replace(/\n{3,}/g, '\n\n').replace(/^\s+|\s+$/g, ''); }
  function finishEdit() {
    var el = st.editing; if (!el) return; st.editing = null;
    var v = read(el); setP(el.dataset.f, v);
    el.removeAttribute('contenteditable'); el.classList.remove('ee-editing'); el.oninput = el.onblur = el.onkeydown = el.onpaste = null;
    if (v === (el.__before || '')) dropIfUnchanged(); else { saved(); if (el.dataset.f === 'doc:eyebrow') {} }
    if ($('#et').__mode === 'item') hideET();
  }

  /* ---------- selected photo or button, and its toolbar ---------- */
  function select(el, kind) { clearSel(); st.sel = { el: el, kind: kind }; el.classList.add('ee-sel'); showET(el, kind); }
  function clearSel() { if (st.sel && st.sel.el) st.sel.el.classList.remove('ee-sel'); st.sel = null; hideET(); }
  function hideET() { $('#et').hidden = true; $('#et').__mode = null; }
  function etBtn(ic, label, fn, cls, title) { var b = document.createElement('button'); b.type = 'button'; b.innerHTML = (ic ? icon(ic) : '') + (label ? '<span>' + label + '</span>' : ''); if (title || !label) b.title = title || label; if (cls) b.className = cls; b.onmousedown = function (e) { e.preventDefault(); }; b.onclick = function (e) { e.stopPropagation(); fn(); }; return b; }
  function showET(el, kind) {
    var b = $('#et'); b.innerHTML = ''; b.__mode = kind; b.__el = el;
    if (kind === 'image') {
      var path = el.dataset.img;
      b.append(etBtn('image', 'Change photo', function () { pickPhoto(path); }));
      b.append(etBtn('link', 'Link', function () { askLink(path + '_link', 'Where should this photo go?', true); }, '', 'Where people go when they tap the photo'));
      b.append(etBtn('pencil', 'Describe', function () { askText('Describe the photo', 'A few words about what is in it. People see this if their email hides pictures, and screen readers read it out.', path + '_alt'); }));
    } else if (kind === 'button') {
      var lp = el.dataset.btn, tp = el.dataset.f;
      b.append(etBtn('button', 'Button', function () { editButton(tp, lp); }, '', 'Button words and link'));
      b.append(etBtn('link', 'Link', function () { askLink(lp, 'Where should this button go?', false); }));
      b.append(etBtn('trash', '', function () { checkpoint(); setP(tp, ''); saved(); clearSel(); render(); toast('Button removed. Undo brings it back.'); }, 'danger', 'Remove button'));
    } else if (kind === 'item') {
      var it = itemOf(el.dataset.f), s = sec(it.sid), n = s.items.length;
      var lbl = document.createElement('span'); lbl.className = 'sep';
      b.append(etBtn('up', '', function () { moveItem(it, -1); }, '', 'Move up'));
      b.append(etBtn('down', '', function () { moveItem(it, 1); }, '', 'Move down'));
      if (s.type !== 'twoUp') b.append(etBtn('copy', '', function () { copyItem(it); }, '', 'Duplicate'));
      if (n > 1 && s.type !== 'twoUp') b.append(etBtn('trash', 'Delete item', function () { delItem(it); }, 'danger'));
    }
    b.hidden = false; placeET();
  }
  function placeET() {
    var b = $('#et'); if (b.hidden || !b.__el || !b.__el.isConnected) { if (!b.hidden && b.__el && !b.__el.isConnected) b.hidden = true; return; }
    var fr = frame.getBoundingClientRect(), r = b.__el.getBoundingClientRect();
    var above = fr.top + r.top - 46, below = fr.top + r.bottom + 8;
    var top = above < fr.top + 4 ? below : above; top = Math.min(top, fr.bottom - 44);
    b.style.top = Math.max(fr.top + 4, top) + 'px';
    b.style.left = Math.min(window.innerWidth - b.offsetWidth - 8, Math.max(8, fr.left + r.left)) + 'px';
  }
  function moveItem(it, dir) { var s = sec(it.sid), j = it.i + dir; if (j < 0 || j >= s.items.length) return; finishEdit(); checkpoint(); var t = s.items[it.i]; s.items[it.i] = s.items[j]; s.items[j] = t; saved(); hideET(); render(); }
  function copyItem(it) { var s = sec(it.sid); finishEdit(); checkpoint(); s.items.splice(it.i + 1, 0, JSON.parse(JSON.stringify(s.items[it.i]))); saved(); hideET(); render(); toast('Duplicated. Click the copy to change it.'); }
  function delItem(it) { var s = sec(it.sid); finishEdit(); checkpoint(); s.items.splice(it.i, 1); saved(); hideET(); render(); toast('Deleted. Undo brings it back.'); }

  /* ---------- section overlay ---------- */
  function stageOffset() { var fr = frame.getBoundingClientRect(), sr = $('#stage').getBoundingClientRect(); return { x: fr.left - sr.left, y: fr.top - sr.top, w: fr.width, h: fr.height }; }
  function drawOverlay() {
    var ov = $('#ov'), box = $('#ov-box'), tools = $('#ov-tools'), at = $('#ov-add-top'), ab = $('#ov-add-bot');
    var d = fdoc(), node = d && st.hover && d.querySelector('[data-sec="' + st.hover + '"]');
    var hide = function () { [box, tools, at, ab].forEach(function (x) { x.style.display = 'none'; }); };
    if (st.mode !== 'edit' || !node) { hide(); return; }
    ov.hidden = false;
    var o = stageOffset(), r = node.getBoundingClientRect();
    var top = Math.max(r.top, 0), bot = Math.min(r.bottom, o.h);
    if (bot <= top) { hide(); return; }
    Object.assign(box.style, { display: 'block', left: o.x + r.left + 'px', top: o.y + top + 'px', width: r.width + 'px', height: (bot - top) + 'px' });
    if (tools.__for !== st.hover) buildTools(st.hover);
    tools.style.display = 'flex';
    tools.style.top = o.y + Math.max(top, Math.min(Math.max(r.top, 22), o.h - 70) - 22) + 12 + 'px';
    tools.style.left = Math.max(o.x + 8, o.x + Math.min(r.right, o.w) - tools.offsetWidth - 12) + 'px';
    var cx = o.x + r.left + r.width / 2 + 'px';
    var ty = Math.min(Math.max(r.top, 22), o.h - 70), by = Math.max(Math.min(r.bottom, o.h - 22), ty + 48);
    Object.assign(at.style, { display: 'block', left: cx, top: o.y + ty + 'px' });
    Object.assign(ab.style, { display: 'block', left: cx, top: o.y + by + 'px' });
    at.title = 'Add a section above this one'; ab.title = 'Add a section below this one';
  }
  function buildTools(id) {
    var t = $('#ov-tools'); t.innerHTML = ''; t.__for = id; var s = sec(id); if (!s) return;
    var lbl = document.createElement('span'); lbl.className = 'lbl'; lbl.textContent = R.SECTIONS[s.type].n; t.append(lbl);
    var b = function (ic, text, act, title, cls) { var x = document.createElement('button'); x.type = 'button'; x.innerHTML = icon(ic) + (text ? '<span>' + text + '</span>' : ''); x.title = title; if (cls) x.className = cls; x.onclick = function (e) { e.stopPropagation(); sectionAction(id, act); }; t.append(x); };
    b('pencil', 'Edit section', 'settings', 'Edit this section: photos, buttons, links and colours');
    var sep = document.createElement('span'); sep.className = 'sep'; t.append(sep);
    b('up', '', 'up', 'Move section up'); b('down', '', 'down', 'Move section down');
    b('copy', '', 'copy', 'Duplicate section'); b('trash', '', 'delete', 'Delete section', 'danger');
  }
  $('#ov-add-top').onclick = function () { if (st.hover) openLibrary(secIdx(st.hover), 'above'); };
  $('#ov-add-bot').onclick = function () { if (st.hover) openLibrary(secIdx(st.hover) + 1, 'below'); };
  $('#stage').addEventListener('mouseleave', function (e) {
    var r = $('#stage').getBoundingClientRect(); var inside = e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
    if (!inside && $('#lib').hidden && $('#panel').hidden && window.innerWidth > 760) { st.hover = null; drawOverlay(); }
  });
  window.addEventListener('resize', function () { drawOverlay(); placeET(); });
  function sectionAction(id, act) {
    finishEdit(); clearSel();
    var i = secIdx(id), n = st.doc.sections.length;
    if (act === 'settings') return sectionSettings(id);
    if (act === 'delete') { return confirmBox('Delete this section?', 'It comes out of the email. Undo brings it back.').then(function (ok) { if (!ok) return; checkpoint(); st.doc.sections.splice(i, 1); st.hover = null; saved(); render(); toast('Section deleted. Undo brings it back.'); }); }
    if ((act === 'up' && i === 0) || (act === 'down' && i === n - 1)) return;
    checkpoint();
    if (act === 'up') st.doc.sections.splice(i - 1, 0, st.doc.sections.splice(i, 1)[0]);
    if (act === 'down') st.doc.sections.splice(i + 1, 0, st.doc.sections.splice(i, 1)[0]);
    if (act === 'copy') { var c = JSON.parse(JSON.stringify(st.doc.sections[i])); c.id = 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); st.doc.sections.splice(i + 1, 0, c); st.hover = c.id; toast('Duplicated. Edit it like any other section.'); }
    $('#ov-tools').__for = null; saved(); render(); setTimeout(scrollToHover, 250);
  }
  function scrollToHover() { var d = fdoc(), w = fwin(), n = d && st.hover && d.querySelector('[data-sec="' + st.hover + '"]'); if (!n || !w) return; var r = n.getBoundingClientRect(); if (r.top < 0 || r.bottom > w.innerHeight) w.scrollTo({ top: Math.max(0, w.scrollY + r.top - 80), behavior: 'smooth' }); setTimeout(drawOverlay, 400); }

  /* ---------- add section drawer ---------- */
  var SAMPLE = {
    photoHead: { body: 'Here\'s what\'s open this week, and what\'s coming up.' },
    letter: { kicker: 'Christmas at Ruby\'s', title: 'Hand-picked by us, not an algorithm.', body: 'Three bottles in every box, with tasting cards, ready to give.', btn: 'Choose your box' },
    date: { body: 'Order by Sunday and we\'ll have yours packed and ready.', btn: 'Choose your box' },
    text: { title: 'Missed out?', body: 'Join the waitlist on our What\'s on page and we\'ll email you if a table opens up.' },
    lineup: { items: [{ name: 'House-made Pet Nat', note: 'Our own, open this week.', price: '' }, { name: 'Something Swiss', note: 'A hard-to-find drop from the shelf.', price: '' }, { name: 'From our QLD backyard', note: 'Local and independent.', price: '' }], btn: 'Come in for a glass' },
    twoUp: { items: [{ img: R.CDN + 'RubysAperoApril_0118.jpg', name: 'To take home', note: 'This week\'s bottle from the shelf.', price: '', btn: '', link: '' }, { img: R.CDN + 'RubysAperoApril_012.jpg', name: 'To share', note: 'Build a board from the fridge.', price: '', btn: '', link: '' }] },
    rows: { items: [{ img: R.CDN + 'RubysAperoApril_0118.jpg', name: 'Explorer\'s Collection', note: 'Three standout bottles.', price: '$260' }, { img: R.CDN + 'RubysAperoApril_012.jpg', name: 'Introduction Collection', note: 'A sparkling, a white and a red.', price: '$160' }] },
    eventPhoto: { title: 'Quiz night', when: 'Second Wednesday of the month', body: 'Hosted by The Weekly Fifty crew.' },
    story: { title: 'Meet Ruby', body: 'Our founder\'s border collie, and the reason the bar has a name.' },
    quote: { quote: 'No pretension, just great wine and good people.', by: 'The Ruby\'s crew' }
  };
  function thumb(html, scale) { return '<div class="th"><div class="sc" style="transform:scale(' + scale + ')">' + html.replace(/ data-(img|btn)="[^"]*"/g, '') + '</div></div>'; }
  function fitThumbs(root, scale, max) { $$('.th', root).forEach(function (th) { var sc = th.firstElementChild; var fit = function () { th.style.height = Math.min(max, Math.max(60, sc.offsetHeight * scale)) + 'px'; }; fit(); $$('img', sc).forEach(function (im) { if (!im.complete) im.addEventListener('load', fit); }); }); }
  var libAt = null, libCat = 'All';
  function openLibrary(at, where) {
    finishEdit(); clearSel(); closePanel(true);
    libAt = at;
    var cats = ['All'].concat(R.CATS);
    $('#lib-cats').innerHTML = cats.map(function (c) { return '<button type="button" data-g="' + esc(c) + '">' + esc(c) + '</button>'; }).join('');
    $$('#lib-cats button').forEach(function (b) { b.onclick = function () { drawLib(b.dataset.g, where); }; });
    $('#lib').hidden = false;
    drawLib(libCat, where);
  }
  function drawLib(g, where) {
    libCat = g;
    $$('#lib-cats button').forEach(function (b) { b.classList.toggle('on', b.dataset.g === g); });
    var grid = $('#lib-grid');
    var w = Math.max(200, ((grid.clientWidth || 570) - 48) / 2);
    var html = '<p class="lib-where">' + (where === 'above' ? 'Adds above' : where === 'below' ? 'Adds below' : 'Adds near the end of') + ' the section you were on. You can move it after.</p>';
    Object.keys(R.SECTIONS).filter(function (k) { return g === 'All' || R.SECTIONS[k].cat === g; }).forEach(function (k) {
      html += '<button type="button" class="lib-item" data-k="' + k + '">' + thumb(R.renderSection(R.make(k, SAMPLE[k]), 'edit'), (w / 600).toFixed(3)) + '<span>' + esc(R.SECTIONS[k].n) + '</span></button>';
    });
    grid.innerHTML = html;
    fitThumbs(grid, w / 600, 240);
    $$('.lib-item', grid).forEach(function (b) { b.onclick = function () { insertSection(b.dataset.k); }; });
  }
  function hideLib() { $('#lib').hidden = true; }
  $('#lib-close').onclick = hideLib;
  function insertSection(k) {
    var s = R.make(k); checkpoint();
    var at = libAt == null ? st.doc.sections.length : libAt;
    st.doc.sections.splice(at, 0, s); st.hover = s.id; hideLib(); saved(); render();
    setTimeout(scrollToHover, 300);
    toast(R.SECTIONS[k].n + ' added. Click its words to type, or Edit section for photos and links.');
  }

  /* ---------- panel ---------- */
  var panelOpenJSON = null;
  function openPanel(title, tabs) {
    finishEdit(); clearSel(); hideLib(); checkpoint(); panelOpenJSON = json();
    $('#panel-title').textContent = title;
    var barEl = $('#panel-tabs'); barEl.innerHTML = ''; barEl.hidden = tabs.length < 2;
    var body = $('#panel-body');
    var show = function (i) { $$('button', barEl).forEach(function (b, k) { b.classList.toggle('on', k === i); }); body.innerHTML = ''; tabs[i].build(body); body.scrollTop = 0; };
    tabs.forEach(function (t, i) { var b = document.createElement('button'); b.type = 'button'; b.textContent = t.name; b.onclick = function () { show(i); }; barEl.append(b); });
    show(0); $('#panel').hidden = false;
  }
  function closePanel(quiet) { if ($('#panel').hidden) return; $('#panel').hidden = true; if (!quiet) dropIfUnchanged(); }
  $('#panel-close').onclick = function () { closePanel(); }; $('#panel-done').onclick = function () { closePanel(); };
  var rt = null; function live() { saved(); clearTimeout(rt); rt = setTimeout(render, 250); }

  function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstElementChild; }
  function fieldText(label, path, opts) {
    opts = opts || {};
    var w = el('<div class="f"><label></label>' + (opts.area ? '<textarea></textarea>' : '<input type="text">') + (opts.hint ? '<p class="hint"></p>' : '') + '</div>');
    $('label', w).textContent = label; if (opts.hint) $('.hint', w).textContent = opts.hint;
    var inp = $('input,textarea', w); inp.value = getP(path) || ''; if (opts.ph) inp.placeholder = opts.ph;
    inp.oninput = function () { setP(path, inp.value); live(); };
    return w;
  }
  function linkName(u) { var l = R.LINKS.filter(function (x) { return x[0] === u; })[0]; return l ? l[1] : u; }
  function fieldLink(label, path, allowNone) {
    var v = getP(path) || '', known = R.LINKS.some(function (l) { return l[0] === v; });
    var w = el('<div class="f"><label></label><select></select><input type="text" placeholder="https://" style="display:none"><p class="hint">Pick one of your pages, or choose Another web address.</p></div>');
    $('label', w).textContent = label;
    var sel = $('select', w), inp = $('input', w);
    var opts = (allowNone ? '<option value="">No link</option>' : '') + R.LINKS.map(function (l) { return '<option value="' + esc(l[0]) + '">' + esc(l[1]) + '</option>'; }).join('') + '<option value="__other">Another web address…</option>';
    sel.innerHTML = opts;
    if (!v && allowNone) sel.value = ''; else if (known) sel.value = v; else { sel.value = '__other'; inp.style.display = ''; inp.value = v; }
    sel.onchange = function () { if (sel.value === '__other') { inp.style.display = ''; inp.focus(); } else { inp.style.display = 'none'; setP(path, sel.value); live(); } };
    inp.oninput = function () { setP(path, inp.value.trim()); live(); };
    return w;
  }
  function groupBox(title) { var g = el('<div class="group"><b style="font-size:13px"></b></div>'); $('b', g).textContent = title; return g; }
  function photoBox(title, s, key) {
    var g = groupBox(title), v = R.get(s, key);
    var row = el('<div class="thumb"><img alt=""><button class="btn small" type="button">Change photo</button></div>');
    $('img', row).src = v ? R.imgUrl(v, 'square', 200) : ''; $('button', row).onclick = function () { pickPhoto(s.id + ':' + key); };
    g.append(row);
    g.append(fieldLink('When someone taps the photo, take them to', s.id + ':' + key + '_link', true));
    g.append(fieldText('Describe the photo', s.id + ':' + key + '_alt', { hint: 'Shown if pictures are turned off, and read out by screen readers.' }));
    return g;
  }
  function buttonBox(title, s, lk, uk) {
    var g = groupBox(title);
    g.append(fieldText('Button words', s.id + ':' + lk, { hint: 'Leave this empty and the button won\'t show.' }));
    g.append(fieldLink('Where the button goes', s.id + ':' + uk, false));
    return g;
  }
  function imageKeys(s) { var k = []; if ('img' in s) k.push(['Photo', 'img']); if (s.type === 'photoPair') { k.push(['Left photo', 'a'], ['Right photo', 'b']); } if (s.items) s.items.forEach(function (it, i) { if (it.img !== undefined) k.push(['Photo ' + (i + 1), 'items.' + i + '.img']); }); return k; }
  function buttonKeys(s) { var k = []; if ('btn' in s) k.push(['Button', 'btn', 'link']); if (s.type === 'twoUp') s.items.forEach(function (it, i) { k.push(['Button on item ' + (i + 1), 'items.' + i + '.btn', 'items.' + i + '.link']); }); return k; }
  function sectionSettings(id) {
    var s = sec(id), def = R.SECTIONS[s.type];
    var tabs = [{ name: 'Content', build: function (body) {
      body.append(el('<p class="note">Click any words in the email to type over them. Photos, buttons and links are here.</p>'));
      imageKeys(s).forEach(function (k) { body.append(photoBox(k[0], s, k[1])); });
      buttonKeys(s).forEach(function (k) { body.append(buttonBox(k[0], s, k[1], k[2])); });
      if (s.items && s.type !== 'twoUp') {
        var g = groupBox('Items in this list');
        s.items.forEach(function (it, i) {
          var row = el('<div class="item"><div class="item-head"><span></span><span class="acts"></span></div></div>');
          $('span', row).textContent = (i + 1) + '. ' + (it.name || 'Empty item');
          var acts = $('.acts', row);
          [['Up', -1], ['Down', 1]].forEach(function (a) { var b = el('<button class="mini" type="button"></button>'); b.textContent = a[0]; b.disabled = (a[1] < 0 && i === 0) || (a[1] > 0 && i === s.items.length - 1); b.onclick = function () { var j = i + a[1]; var t = s.items[i]; s.items[i] = s.items[j]; s.items[j] = t; live(); sectionSettings(id); }; acts.append(b); });
          var rm = el('<button class="mini" type="button">Delete</button>'); rm.disabled = s.items.length < 2; rm.onclick = function () { s.items.splice(i, 1); live(); sectionSettings(id); }; acts.append(rm);
          g.append(row);
        });
        var add = el('<button class="btn small" type="button">+ Add an item</button>'); add.onclick = function () { var n = { name: '', note: '', price: '' }; if (s.items[0] && s.items[0].img !== undefined) n.img = R.CDN + R.PICS[2].f; s.items.push(n); live(); sectionSettings(id); toast('Item added. Click it in the email to type.'); };
        g.append(add); body.append(g);
      }
      if (!imageKeys(s).length && !buttonKeys(s).length && !s.items) body.append(el('<p class="pane-note">Everything in this section is words. Click them in the email to change them.</p>'));
    } }, { name: 'Design', build: function (body) {
      if (def.bg !== false && s.bg) {
        var g = el('<div class="f"><span class="lab">Background colour</span><div class="sws"></div><div class="sws-names"></div></div>');
        Object.keys(R.THEMES).forEach(function (k) { var b = el('<button type="button"></button>'); b.style.background = R.THEMES[k].bg; b.title = R.THEMES[k].n; b.setAttribute('aria-label', R.THEMES[k].n); if (s.bg === k) b.className = 'on'; b.onclick = function () { s.bg = k; live(); sectionSettings(id); openTab(1); }; $('.sws', g).append(b); var n = document.createElement('span'); n.textContent = R.THEMES[k].n; $('.sws-names', g).append(n); });
        body.append(g);
      }
      var opt = function (label, key, list) { var g = el('<div class="f"><span class="lab"></span><div class="optrow"></div></div>'); $('.lab', g).textContent = label; list.forEach(function (o) { var b = el('<button type="button"></button>'); b.textContent = o[1]; if (String(s[key]) === String(o[0])) b.className = 'on'; b.onclick = function () { s[key] = o[0]; live(); sectionSettings(id); openTab(1); }; $('.optrow', g).append(b); }); body.append(g); };
      if ('shape' in s) opt('Photo shape', 'shape', [['wide', 'Wide'], ['square', 'Square'], ['original', 'As it is']]);
      if ('align' in s) opt('Line up the words', 'align', [['left', 'Left'], ['center', 'Centre']]);
      if ('flip' in s) opt('Photo side', 'flip', [[false, 'Left'], [true, 'Right']]);
      if (!body.children.length) body.append(el('<p class="pane-note">This section always uses Ruby\'s cream background.</p>'));
    } }];
    openPanel(def.n, tabs);
  }
  function openTab(i) { var b = $$('#panel-tabs button')[i]; if (b) b.click(); }
  function editButton(tp, lp) {
    var s = sec(tp.split(':')[0]);
    openPanel('Button', [{ name: 'Content', build: function (body) {
      body.append(fieldText('Button words', tp, { hint: 'Leave this empty and the button won\'t show.' }));
      body.append(fieldLink('Where the button goes', lp, false));
    } }]);
  }
  function emailSettings() {
    openPanel('Email settings', [{ name: 'Content', build: function (body) {
      var f1 = fieldText('Subject line', 'doc:subject', { hint: 'What people see in their inbox. Copy this into Shopify when you send.' });
      $('input', f1).addEventListener('input', function () { $('#page-name').textContent = st.doc.subject || 'Untitled email'; drawList(); });
      body.append(f1);
      body.append(fieldText('Preview text', 'doc:pre', { hint: 'The grey line after the subject in most inboxes.' }));
      body.append(fieldText('Line under the logo', 'doc:eyebrow', { hint: 'You can also click it in the email.' }));
    } }]);
  }
  $('#btn-page').onclick = emailSettings;

  /* ---------- modals ---------- */
  function openModal(wide) { var m = $('#modal'); var c = $('.modal-card', m); c.classList.toggle('wide', !!wide); $('#modal-body').remove(); var b = document.createElement('div'); b.id = 'modal-body'; b.style.display = 'contents'; c.append(b); m.hidden = false; return b; }
  function closeModal() { $('#modal').hidden = true; }
  $('#modal').addEventListener('click', function (e) { if (e.target.id === 'modal') closeModal(); });
  function confirmBox(title, text, yes) {
    return new Promise(function (res) {
      var m = openModal(); m.innerHTML = '<h2></h2><p></p><div class="row"><button class="btn" type="button" data-n>Cancel</button><button class="btn dark" type="button" data-y></button></div>';
      $('h2', m).textContent = title; $('p', m).textContent = text; $('[data-y]', m).textContent = yes || 'Delete';
      $('[data-n]', m).onclick = function () { closeModal(); res(false); }; $('[data-y]', m).onclick = function () { closeModal(); res(true); };
    });
  }
  function askText(title, text, path) {
    var m = openModal(); m.innerHTML = '<h2></h2><p></p><div class="f"><input type="text"></div><div class="row"><button class="btn" type="button" data-n>Cancel</button><button class="btn dark" type="button" data-y>Save</button></div>';
    $('h2', m).textContent = title; $('p', m).textContent = text; var inp = $('input', m); inp.value = getP(path) || ''; setTimeout(function () { inp.focus(); }, 30);
    $('[data-n]', m).onclick = closeModal;
    $('[data-y]', m).onclick = function () { checkpoint(); setP(path, inp.value.trim()); saved(); closeModal(); render(); toast('Saved.'); };
  }
  function askLink(path, title, allowNone) {
    var v = getP(path) || '';
    var m = openModal(); m.innerHTML = '<h2></h2><p>Pick one of your pages, or paste a web address.</p><div class="links"></div><div class="f"><label>Another web address</label><input type="text" placeholder="https://"></div><div class="row"><button class="btn" type="button" data-n>Cancel</button><button class="btn dark" type="button" data-y>Save</button></div>';
    $('h2', m).textContent = title; var inp = $('input', m), pick = v;
    var list = $('.links', m);
    var opts = (allowNone ? [['', 'No link']] : []).concat(R.LINKS);
    opts.forEach(function (l) { var b = el('<button type="button"><span></span><small></small></button>'); $('span', b).textContent = l[1]; $('small', b).textContent = l[0].replace(/^https:\/\/(www\.)?/, ''); if (l[0] === v) b.classList.add('on'); b.onclick = function () { pick = l[0]; inp.value = ''; $$('button', list).forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); }; list.append(b); });
    if (v && !R.LINKS.some(function (l) { return l[0] === v; })) inp.value = v;
    inp.oninput = function () { if (inp.value.trim()) { pick = inp.value.trim(); $$('button', list).forEach(function (x) { x.classList.remove('on'); }); } };
    $('[data-n]', m).onclick = closeModal;
    $('[data-y]', m).onclick = function () { if (pick && !/^(https?:\/\/|mailto:)/i.test(pick)) pick = 'https://' + pick; checkpoint(); setP(path, pick); saved(); closeModal(); render(); toast(pick ? 'Link saved: ' + linkName(pick) : 'Link removed.'); };
  }
  function pickPhoto(path) {
    var curv = String(getP(path) || '');
    var m = openModal(true);
    m.innerHTML = '<h2>Change photo</h2><p>Your own photos, straight from your website.</p><div class="pics"></div><div class="f"><label>Or use a new photo</label><input type="text" placeholder="Paste the photo&#x27;s link from Shopify"><p class="hint">In Shopify, go to Content, then Files. Upload the photo, copy its link and paste it here.</p></div><div class="row"><button class="btn" type="button" data-n>Cancel</button><button class="btn dark" type="button" data-y>Use this link</button></div>';
    var grid = $('.pics', m);
    R.PICS.forEach(function (p) { var u = R.CDN + p.f; var b = el('<button type="button"><img alt=""><span></span></button>'); $('img', b).src = R.imgUrl(u, 'square', 300); $('span', b).textContent = p.l; b.setAttribute('aria-label', p.l); if (curv.indexOf(p.f) > -1) b.classList.add('on'); b.onclick = function () { use(u, p.l); }; grid.append(b); });
    var inp = $('input', m); if (curv && curv.indexOf(R.CDN) !== 0) inp.value = curv;
    $('[data-n]', m).onclick = closeModal;
    $('[data-y]', m).onclick = function () { var v = inp.value.trim(); if (!/^https:\/\//.test(v)) { toast('Paste a link that starts with https://'); return; } use(v, ''); };
    function use(u, label) { checkpoint(); setP(path, u); if (label) setP(path + '_alt', label); saved(); closeModal(); clearSel(); render(); if (!$('#panel').hidden && st.hover) setTimeout(function () { sectionSettings(st.hover); }, 50); toast('Photo changed.'); }
  }

  /* ---------- emails list ---------- */
  function ago(t) { var m = Math.round((Date.now() - t) / 60000); if (m < 1) return 'just now'; if (m < 60) return m + ' min ago'; var h = Math.round(m / 60); if (h < 24) return h + ' hr ago'; return new Date(t).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }); }
  function drawList() {
    var nav = $('#nav-emails'); nav.innerHTML = '';
    st.store.emails.slice().sort(function (a, b) { return b.updated - a.updated; }).forEach(function (e) {
      var r = el('<div class="row" role="button" tabindex="0"><span class="ic"></span><span class="nm"><b></b><span class="sub"></span></span><button class="icon-btn gear" type="button" aria-label="Email options"></button></div>');
      $('.ic', r).innerHTML = icon('mail'); $('b', r).textContent = e.doc.subject || 'Untitled email'; $('.sub', r).textContent = (e.kind || 'Email') + ' · ' + ago(e.updated);
      setIcon($('.gear', r), 'gear');
      if (e.id === st.store.cur) r.classList.add('on');
      r.onclick = function (ev) { if (ev.target.closest('.gear')) return; openEmail(e.id); };
      r.onkeydown = function (ev) { if (ev.key === 'Enter') openEmail(e.id); };
      $('.gear', r).onclick = function (ev) { ev.stopPropagation(); emailMenu(e); };
      nav.append(r);
    });
  }
  function emailMenu(e) {
    var m = openModal(); m.innerHTML = '<h2></h2><p>What would you like to do with this email?</p><div class="row"><button class="btn danger" type="button" data-d>Delete</button><button class="btn" type="button" data-c>Duplicate</button><button class="btn dark" type="button" data-n>Close</button></div>';
    $('h2', m).textContent = e.doc.subject || 'Untitled email';
    $('[data-n]', m).onclick = closeModal;
    $('[data-c]', m).onclick = function () { var c = { id: newId(), kind: e.kind, updated: Date.now(), doc: JSON.parse(JSON.stringify(e.doc)) }; c.doc.subject = (c.doc.subject || 'Untitled email') + ' (copy)'; st.store.emails.push(c); closeModal(); openEmail(c.id); persist(); toast('Duplicated.'); };
    $('[data-d]', m).onclick = function () { closeModal(); confirmBox('Delete "' + (e.doc.subject || 'Untitled email') + '"?', 'This can\'t be undone.').then(function (ok) { if (!ok) return; st.store.emails = st.store.emails.filter(function (x) { return x.id !== e.id; }); if (!st.store.emails.length) addEmail('weekly', true); else if (st.store.cur === e.id) openEmail(st.store.emails[0].id); persist(); drawList(); }); };
  }
  function openEmail(id) {
    finishEdit(); clearSel(); closePanel(true); hideLib();
    st.store.cur = id; st.doc = cur().doc; st.undo = []; st.redo = []; st.hover = null; bar();
    $('#app').classList.add('m-page'); drawList(); render();
    try { localStorage.setItem(LS, JSON.stringify(st.store)); } catch (x) {}
  }
  function addEmail(k, quiet) { var L = R.LAYOUTS[k]; var e = { id: newId(), kind: L.n, updated: Date.now(), doc: L.f() }; st.store.emails.push(e); openEmail(e.id); persist(); if (!quiet) setMode('edit'); }
  $('#btn-new').onclick = function () {
    var m = openModal(true);
    m.innerHTML = '<h2>New email</h2><p>Pick a starting point. You can change everything once it&#x27;s open.</p><div class="lay-grid"></div><div class="row"><button class="btn" type="button" data-n>Cancel</button></div>';
    var g = $('.lay-grid', m); var w = Math.min(220, ((m.parentElement.clientWidth || 700) - 72) / 3);
    Object.keys(R.LAYOUTS).forEach(function (k) {
      var L = R.LAYOUTS[k], html = R.renderEmail(L.f(), 'edit').replace(/^[\s\S]*<body[^>]*>/, '').replace(/<\/body>[\s\S]*$/, '').replace(/\{\{[^}]*\}\}/g, '');
      var b = el('<button type="button" class="lib-item">' + thumb(html, (w / 600).toFixed(3)) + '<span class="nm"></span><small class="ds"></small></button>');
      $('.nm', b).textContent = L.n; $('.ds', b).textContent = L.desc; b.onclick = function () { closeModal(); addEmail(k); toast('New email ready. Click any words to start.'); }; g.append(b);
    });
    fitThumbs(g, w / 600, 170);
    $('[data-n]', m).onclick = closeModal;
  };

  /* ---------- modes, devices, top bar ---------- */
  function setMode(mode) {
    finishEdit(); clearSel(); closePanel(true); hideLib();
    st.mode = mode; var ed = mode === 'edit';
    $('#app').classList.toggle('editing', ed);
    $('#btn-edit').hidden = ed; $('#btn-exit').hidden = !ed; $('.edit-only').hidden = !ed;
    $('#ov').hidden = !ed; st.hover = null;
    render();
    if (ed && !seenTip()) banner('Hover over a section to see its tools. Click any words to type. Click a photo or a button to change it or add a link.');
    else hideBanner();
  }
  function seenTip() { try { return localStorage.getItem(LS + '-tip') === '1'; } catch (x) { return false; } }
  function banner(t) { $('#stage').classList.add('has-banner'); var b = $('#banner'); b.innerHTML = '<span></span><button class="btn small" type="button">Got it</button>'; $('span', b).textContent = t; b.hidden = false; $('button', b).onclick = function () { hideBanner(); try { localStorage.setItem(LS + '-tip', '1'); } catch (x) {} }; }
  function hideBanner() { $('#banner').hidden = true; $('#stage').classList.remove('has-banner'); setTimeout(drawOverlay, 50); }
  $('#btn-edit').onclick = function () { setMode('edit'); };
  $('#btn-exit').onclick = function () { setMode('browse'); };
  $('#btn-back').onclick = function () { $('#app').classList.remove('m-page'); };
  $('#btn-undo').onclick = undo; $('#btn-redo').onclick = redo;
  function device(ph) { st.phone = ph; $('#frame-wrap').classList.toggle('mobile', ph); $('#dev-mobile').classList.toggle('on', ph); $('#dev-desktop').classList.toggle('on', !ph); setTimeout(function () { drawOverlay(); placeET(); }, 60); }
  $('#dev-desktop').onclick = function () { device(false); }; $('#dev-mobile').onclick = function () { device(true); };
  function keys(e) { var m = e.metaKey || e.ctrlKey; if (!m || st.mode !== 'edit') return; var k = e.key.toLowerCase(); if (k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); } else if (k === 'y') { e.preventDefault(); redo(); } }
  document.addEventListener('keydown', function (e) { var t = e.target; if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return; keys(e); if (e.key === 'Escape') { hideLib(); closeModal(); clearSel(); } });

  /* ---------- copy for Shopify, and help ---------- */
  function copyText(t) { if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t); return new Promise(function (res, rej) { var a = document.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy') ? res() : rej(); } catch (x) { rej(x); } a.remove(); }); }
  function exportHTML() { return R.renderEmail(st.doc, 'export'); }
  function sendBox() {
    finishEdit();
    var html = exportHTML(), kb = Math.ceil(new Blob([html]).size / 1024);
    var m = openModal();
    m.innerHTML = '<h2>Send it from Shopify</h2><p>Do these steps on your computer.</p>' +
      '<ol class="steps"><li>Click <b>Copy the email</b> below.</li><li>In Shopify Email, create a new email and choose <b>Code your own</b>.</li><li>Select everything in the code box and paste over it.</li><li>Copy in the subject line and preview text.</li><li>Send yourself a test, check it on your phone, then schedule it.</li></ol>' +
      '<button class="btn dark wide" type="button" id="cp-html">Copy the email</button>' +
      '<div class="copyrow"><div class="v" id="cp-sv"></div><button class="btn small" type="button" id="cp-s">Copy subject</button></div>' +
      '<div class="copyrow"><div class="v" id="cp-pv"></div><button class="btn small" type="button" id="cp-p">Copy preview</button></div>' +
      '<p class="hint">' + kb + ' KB, well under Shopify&#x27;s 500 KB limit. The unsubscribe link Shopify needs is already in it. Need a change after pasting? Change it here and paste again.</p>' +
      '<div class="row"><button class="btn" type="button" id="cp-dl">Download file</button><button class="btn dark" type="button" data-n>Done</button></div>';
    $('#cp-sv').textContent = st.doc.subject || 'No subject line yet'; $('#cp-pv').textContent = st.doc.pre || 'No preview text yet';
    $('#cp-s').disabled = !st.doc.subject; $('#cp-p').disabled = !st.doc.pre;
    $('#cp-html').onclick = function () { copyText(exportHTML()).then(function () { $('#cp-html').textContent = 'Copied. Now paste it into Shopify'; }, function () { toast('Couldn\'t copy here. Use Download file instead.'); }); };
    $('#cp-s').onclick = function () { copyText(st.doc.subject).then(function () { toast('Subject copied.'); }); };
    $('#cp-p').onclick = function () { copyText(st.doc.pre).then(function () { toast('Preview text copied.'); }); };
    $('#cp-dl').onclick = function () { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([exportHTML()], { type: 'text/html' })); a.download = ((st.doc.subject || 'rubys-email').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'rubys-email') + '.html'; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000); };
    $('[data-n]', m).onclick = closeModal;
  }
  $('#btn-copy').onclick = sendBox; $('#btn-send').onclick = sendBox;
  $('#btn-help').onclick = function () {
    var m = openModal();
    m.innerHTML = '<h2>How it works</h2><ol class="steps">' +
      '<li><b>Pick an email</b> on the left, or click <b>+</b> for a new one.</li>' +
      '<li>Click <b>Edit</b> at the top.</li>' +
      '<li><b>Words:</b> click them in the email and type.</li>' +
      '<li><b>Photos:</b> click a photo, then <b>Change photo</b> or <b>Link</b>.</li>' +
      '<li><b>Buttons:</b> click a button, then <b>Button</b> to change its words, or <b>Link</b> to choose where it goes.</li>' +
      '<li><b>Sections:</b> hover over one for <b>Edit section</b>, move up or down, duplicate or delete. Use <b>+ Add a section</b> for a new one.</li>' +
      '<li>When it&#x27;s ready, click <b>Copy for Shopify</b> and follow the steps.</li></ol>' +
      '<p class="hint">Grey italic words are hints. Leave them empty and they won&#x27;t appear in the email. Everything saves in this browser as you go.</p><div class="row"><button class="btn dark" type="button" data-n>Got it</button></div>';
    $('[data-n]', m).onclick = closeModal;
  };

  /* ---------- start ---------- */
  st.store = load();
  if (!st.store) { st.store = { emails: [], cur: null }; ['weekly', 'quiz', 'gift', 'shelf', 'night'].forEach(function (k, i) { var L = R.LAYOUTS[k]; st.store.emails.push({ id: newId(), kind: L.n, updated: Date.now() - i * 60000, doc: L.f() }); }); st.store.cur = st.store.emails[0].id; }
  if (!cur()) st.store.cur = st.store.emails[0].id;
  st.doc = cur().doc; bar(); drawList(); setMode('browse');
  window.__studio = { get doc() { return st.doc; }, exportHTML: exportHTML, store: function () { return st.store; }, setMode: setMode };
})();
