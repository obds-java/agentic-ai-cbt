/* =========================================================================
   Agentic AI - CBT V2  |  Engine: Navigation, Fortschritt, Theme, Quiz
   ========================================================================= */
(function () {
  "use strict";

  var MODULES = [
    { id: "grundlagen",    file: "01-grundlagen.html",    num: 1,  short: "Chat vs. Workflow vs. Agent" },
    { id: "agent-minimal", file: "02-agent-minimal.html", num: 2,  short: "Was ist ein Agent?" },
    { id: "anatomie",      file: "03-anatomie.html",      num: 3,  short: "Anatomie: LLM · Agent · Harness" },
    { id: "harness",       file: "04-harness.html",       num: 4,  short: "Das Harness im Detail" },
    { id: "multiagent",    file: "05-multiagent.html",    num: 5,  short: "Single- vs. Multi-Agent" },
    { id: "bauen",         file: "06-bauen.html",         num: 6,  short: "Agenten bauen" },
    { id: "handson",       file: "07-handson.html",       num: 7,  short: "Hands-On Labs" },
    { id: "observability", file: "08-observability.html", num: 8,  short: "Observability & Evals" },
    { id: "produktion",    file: "09-produktion.html",    num: 9,  short: "Produktion: State & Oversight" },
    { id: "fallstricke",   file: "10-fallstricke.html",   num: 10, short: "Fallstricke" },
    { id: "security",      file: "11-security.html",      num: 11, short: "Security & Permissions" },
    { id: "abschluss",     file: "12-abschluss.html",     num: 12, short: "Abschluss & Ressourcen" }
  ];
  var LANDING = "index.html";
  var PKEY = "cbt_agentic_v2_progress";
  var TKEY = "cbt_agentic_theme";

  function load() { try { return JSON.parse(localStorage.getItem(PKEY)) || { done: {} }; } catch (e) { return { done: {} }; } }
  function save(s) { try { localStorage.setItem(PKEY, JSON.stringify(s)); } catch (e) {} }
  function markDone(id) { var s = load(); s.done[id] = true; save(s); refreshProgress(); }

  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(TKEY, t); } catch (e) {}
    var ic = document.getElementById("themeIcon");
    if (ic) ic.innerHTML = t === "dark"
      ? '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36l-.7-.7M6.34 6.34l-.7-.7m12.72 0l-.7.7M6.34 17.66l-.7.7M16 12a4 4 0 11-8 0 4 4 0 018 0z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
      : '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>';
  }
  function initTheme() {
    var t = "light";
    try { t = localStorage.getItem(TKEY) || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); } catch (e) {}
    applyTheme(t);
  }
  initTheme();

  function currentId() { return document.body.getAttribute("data-mod") || null; }

  function buildChrome() {
    var cur = currentId();
    var idx = -1;
    for (var k = 0; k < MODULES.length; k++) { if (MODULES[k].id === cur) { idx = k; break; } }
    var st = load();

    var bar = document.createElement("div");
    bar.className = "topbar";
    bar.innerHTML =
      '<div class="topbar-inner">' +
        '<a class="brand" href="' + LANDING + '">' +
          '<span class="logo-chip"><img class="blogo" src="assets/logo.svg" alt="Orange Business"></span>' +
          '<span class="brand-txt"><b>Agentic&nbsp;AI</b><small>CBT &middot; Self-Learning</small></span>' +
        '</a>' +
        '<div class="nav-spacer"></div>' +
        '<div class="modnav">' +
          '<button class="modnav-btn" id="modBtn" aria-label="Module"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round"/></svg><span class="lbl">Module</span></button>' +
          '<div class="modnav-menu" id="modMenu"></div>' +
        '</div>' +
        '<button class="iconbtn" id="themeBtn" aria-label="Theme wechseln"><svg id="themeIcon" viewBox="0 0 24 24"></svg></button>' +
      '</div>' +
      '<div class="progressline"><i id="progFill"></i></div>';
    document.body.insertBefore(bar, document.body.firstChild);

    var lg = bar.querySelector(".blogo");
    if (lg) lg.addEventListener("error", function () {
      this.src = "https://www.orange-business.com/sites/default/files/Orange%20Business_0_0.svg";
    }, { once: true });

    var menu = document.getElementById("modMenu");
    var html = '<a href="' + LANDING + '"' + (cur === null ? ' class="active"' : '') + '><span class="ix">&#8962;</span> Uebersicht / Start</a>';
    for (var i = 0; i < MODULES.length; i++) {
      var m = MODULES[i];
      var cls = [m.id === cur ? "active" : "", st.done[m.id] ? "done" : ""].join(" ").replace(/^\s+|\s+$/g, "");
      html += '<a href="' + m.file + '"' + (cls ? ' class="' + cls + '"' : '') +
              '><span class="ix">' + m.num + '</span> ' + m.short + '</a>';
    }
    menu.innerHTML = html;

    var btn = document.getElementById("modBtn");
    btn.addEventListener("click", function (e) { e.stopPropagation(); menu.classList.toggle("open"); });
    document.addEventListener("click", function () { menu.classList.remove("open"); });
    menu.addEventListener("click", function (e) { e.stopPropagation(); });

    document.getElementById("themeBtn").addEventListener("click", function () {
      var t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(t);
    });
    applyTheme(document.documentElement.getAttribute("data-theme"));

    var slot = document.getElementById("pager");
    if (slot && idx !== -1) {
      var prev = idx > 0 ? MODULES[idx - 1] : null;
      var next = idx < MODULES.length - 1 ? MODULES[idx + 1] : null;
      var prevHtml = prev
        ? '<a class="prev" href="' + prev.file + '"><span>&larr; Zurueck</span><b>' + prev.num + '. ' + prev.short + '</b></a>'
        : '<a class="prev disabled"><span>&larr; Zurueck</span><b>Start</b></a>';
      var nextHtml = next
        ? '<a class="next" href="' + next.file + '"><span>Weiter &rarr;</span><b>' + next.num + '. ' + next.short + '</b></a>'
        : '<a class="next" href="' + LANDING + '"><span>Fertig &rarr;</span><b>Zur Uebersicht</b></a>';
      slot.innerHTML = prevHtml + nextHtml;
    }
  }

  function refreshProgress() {
    var st = load();
    var done = 0;
    for (var i = 0; i < MODULES.length; i++) { if (st.done[MODULES[i].id]) done++; }
    var pct = Math.round(done / MODULES.length * 100);
    var fill = document.getElementById("progFill");
    if (fill) fill.style.width = pct + "%";
    var pc = document.getElementById("progCount");
    if (pc) pc.textContent = done + " / " + MODULES.length;
    var pp = document.getElementById("progPct");
    if (pp) pp.textContent = pct + "%";
  }

  function parseCorrect(q) {
    return (q.getAttribute("data-correct") || "").split(",").map(function (s) { return parseInt(s, 10); })
      .filter(function (n) { return !isNaN(n); }).sort(function (a, b) { return a - b; });
  }
  function initQuiz(quiz) {
    var questions = Array.prototype.slice.call(quiz.querySelectorAll(".q"));
    questions.forEach(function (q) {
      var correct = parseCorrect(q);
      var multi = correct.length > 1;
      var opts = Array.prototype.slice.call(q.querySelectorAll(".opt"));
      opts.forEach(function (opt) {
        opt.addEventListener("click", function () {
          if (quiz.classList.contains("locked")) return;
          if (multi) { opt.classList.toggle("sel"); }
          else { opts.forEach(function (o) { o.classList.remove("sel"); }); opt.classList.add("sel"); }
        });
      });
    });

    var check = quiz.querySelector(".check");
    var reset = quiz.querySelector(".reset");
    var resultEl = quiz.querySelector(".quiz-result");
    var scoreEl = quiz.querySelector(".score");

    if (check) check.addEventListener("click", function () {
      var correctCount = 0;
      questions.forEach(function (q) {
        var correct = parseCorrect(q);
        var opts = Array.prototype.slice.call(q.querySelectorAll(".opt"));
        var sel = [];
        opts.forEach(function (o, i) { if (o.classList.contains("sel")) sel.push(i); });
        var ok = sel.length === correct.length && sel.every(function (v, k) { return v === correct[k]; });
        if (ok) correctCount++;
        opts.forEach(function (o, i) {
          o.classList.add("disabled");
          if (correct.indexOf(i) !== -1) o.classList.add("correct");
          else if (o.classList.contains("sel")) o.classList.add("wrong");
        });
        var ex = q.querySelector(".explain");
        if (ex) ex.classList.add("show");
      });
      quiz.classList.add("locked");
      var total = questions.length;
      var pass = correctCount >= Math.ceil(total * 0.6);
      if (scoreEl) scoreEl.textContent = correctCount + " / " + total + " richtig";
      if (resultEl) {
        resultEl.textContent = pass
          ? "Bestanden - stark! " + correctCount + "/" + total + " korrekt."
          : "Knapp: " + correctCount + "/" + total + ". Schau dir die Erklaerungen an und versuch es nochmal.";
        resultEl.className = "quiz-result " + (pass ? "pass" : "fail");
      }
      if (check) check.style.display = "none";
      if (reset) reset.style.display = "inline-flex";
      var mod = currentId();
      if (pass && mod) markDone(mod);
    });

    if (reset) reset.addEventListener("click", function () {
      quiz.classList.remove("locked");
      Array.prototype.slice.call(quiz.querySelectorAll(".opt")).forEach(function (o) {
        o.classList.remove("sel", "correct", "wrong", "disabled");
      });
      Array.prototype.slice.call(quiz.querySelectorAll(".explain")).forEach(function (e) { e.classList.remove("show"); });
      if (resultEl) resultEl.textContent = "";
      if (scoreEl) scoreEl.textContent = "";
      if (check) check.style.display = "inline-flex";
      reset.style.display = "none";
    });
  }

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      Array.prototype.slice.call(els).forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    Array.prototype.slice.call(els).forEach(function (e) { io.observe(e); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildChrome();
    var mod = currentId();
    if (mod && document.body.hasAttribute("data-complete-on-visit")) markDone(mod);
    refreshProgress();
    Array.prototype.slice.call(document.querySelectorAll(".quiz")).forEach(initQuiz);
    initReveal();

    Array.prototype.slice.call(document.querySelectorAll("[data-reset-progress]")).forEach(function (b) {
      b.addEventListener("click", function (ev) {
        ev.preventDefault();
        if (window.confirm("Lernfortschritt wirklich neu starten?")) { save({ done: {} }); location.reload(); }
      });
    });
  });
})();
