/* Tippt eine kleine AmigaShell-Session Zeile für Zeile und zeigt auf Klick
   die Rechtstexte (Impressum, Datenschutz) als "TYPE xyz.nfo" im Terminal.
   Ohne Abhängigkeiten. Respektiert "prefers-reduced-motion".
   Inhalte kommen aus den data-Attributen von #cli und aus den <template>-
   Elementen "legal-*" (Quelle: hugo.toml bzw. content/*.md). */
(function () {
  "use strict";

  var el = document.getElementById("cli");
  if (!el) return;

  var d = el.dataset;
  var data = {
    name: d.name || "",
    domain: d.domain || "",
    location: d.location || "",
    net: d.net || "",
    tagline: d.tagline || "",
    taglineReply: d.taglineReply || "",
    scope: (d.scope || "").split("|").filter(Boolean)
  };

  var parsed = parseInt(d.speed, 10);
  var speed = isNaN(parsed) ? 35 : parsed;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || speed === 0;

  var fast = false;        // true: laufende Animation sofort beenden
  var finished = false;    // Profil-Session fertig getippt
  var pendingOpen = null;  // Rechtstext, der nach der Session geöffnet wird
  var cursorRow = null;
  var legal = null;        // aktuell offener Rechtstext-Block
  var opener = null;       // Footer-Link, der ihn geöffnet hat

  // Session aufbauen:
  //   type = Befehl, der Zeichen für Zeichen getippt wird (mit "1> "-Prompt)
  //   out  = Ausgabezeile, die sofort erscheint (optional mit Link)
  var lines = [
    { kind: "type", text: "TYPE profil.txt" },
    { kind: "out",  text: "Name  : " + data.name },
    { kind: "out",  text: "Domain: " + data.domain },
    { kind: "out",  text: "Where : " + data.location }
  ];
  if (data.net) {
    lines.push({ kind: "out", text: "Net   : ", href: "https://" + data.net, label: data.net });
  }
  if (data.tagline) {
    lines.push({ kind: "type", text: data.tagline });
    if (data.taglineReply) lines.push({ kind: "out", text: data.taglineReply });
  }
  lines.push({ kind: "type", text: "DIR greater_scope" });
  data.scope.forEach(function (item) {
    lines.push({ kind: "out", text: "  " + item + " (dir)" });
  });

  var i = 0;

  function instant() { return reduce || fast; }

  function run() {
    if (i >= lines.length) {
      finished = true;
      addCursor();
      if (pendingOpen) openLegal(pendingOpen);
      return;
    }
    var line = lines[i++];
    if (line.kind === "out" || instant()) {
      printLine(line, el);
      setTimeout(run, instant() ? 0 : 120);
    } else {
      typeLine(line, run, el);
    }
  }

  function makeRow(isPrompt, parent) {
    var p = document.createElement("p");
    if (isPrompt) {
      p.className = "prompt";
      var prefix = document.createElement("span");
      prefix.textContent = "1> ";
      p.appendChild(prefix);
    }
    parent.appendChild(p);
    return p;
  }

  function printLine(line, parent) {
    var p = makeRow(line.kind === "type", parent);
    p.appendChild(document.createTextNode(line.text));
    if (line.href) {
      var a = document.createElement("a");
      a.href = line.href;
      a.rel = "noopener";
      a.textContent = line.label;
      p.appendChild(a);
    }
  }

  function typeLine(line, done, parent) {
    var p = makeRow(true, parent);
    var node = document.createTextNode("");
    p.appendChild(node);
    var pos = 0;
    (function tick() {
      if (fast) {
        node.textContent = line.text;
        setTimeout(done, 0);
        return;
      }
      node.textContent += line.text.charAt(pos++);
      if (pos < line.text.length) {
        setTimeout(tick, speed);
      } else {
        setTimeout(done, 300);
      }
    })();
  }

  function addCursor() {
    if (cursorRow) return;
    cursorRow = makeRow(true, el);
    var cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursorRow.appendChild(cursor);
  }

  function removeCursor() {
    if (!cursorRow) return;
    cursorRow.remove();
    cursorRow = null;
  }

  // NFO-Kopf aus ASCII-Rahmen, echter Text in einem <pre>
  function nfoHead(title) {
    var t = title.toUpperCase().split("").join(" ");
    var w = Math.max(30, t.length + 4);
    var pad = w - t.length;
    var left = Math.floor(pad / 2);
    var rule = "+" + new Array(w + 1).join("=") + "+";
    var row = "|" + new Array(left + 1).join(" ") + t +
              new Array(pad - left + 1).join(" ") + "|";
    var pre = document.createElement("pre");
    pre.className = "nfo-head";
    pre.textContent = rule + "\n" + row + "\n" + rule;
    return pre;
  }

  function openLegal(id) {
    var tpl = document.getElementById("legal-" + id);
    if (!tpl) return;

    // Session noch nicht fertig: sofort fertig tippen, danach öffnen.
    if (!finished) { pendingOpen = id; fast = true; return; }
    pendingOpen = null;

    if (legal && legal.dataset.id === id) { scrollToLegal(); return; }
    closeLegal(true);
    removeCursor();

    var mine = document.createElement("div");
    mine.className = "legal";
    mine.dataset.id = id;
    el.appendChild(mine);
    legal = mine;

    function show() {
      if (legal !== mine) return;  // inzwischen geschlossen
      mine.appendChild(nfoHead(tpl.dataset.title));
      var body = document.createElement("div");
      body.className = "nfo-body";
      body.appendChild(tpl.content.cloneNode(true));
      mine.appendChild(body);

      var p = makeRow(true, mine);
      var a = document.createElement("a");
      a.href = "#";
      a.className = "cd";
      a.textContent = "CD /";
      a.addEventListener("click", function (e) {
        e.preventDefault();
        closeLegal();
      });
      p.appendChild(a);
      a.focus({ preventScroll: true });
      scrollToLegal();
    }

    var cmd = { kind: "type", text: "TYPE " + id + ".nfo" };
    if (reduce) { printLine(cmd, mine); show(); }
    else typeLine(cmd, show, mine);
  }

  function scrollToLegal() {
    if (legal) legal.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
  }

  function closeLegal(keepCursorOff) {
    if (!legal) return;
    legal.remove();
    legal = null;
    if (keepCursorOff) return;
    addCursor();
    window.scrollTo(0, 0);
    if (opener) opener.focus();
  }

  // Footer-Links: Klick, Tap und Enter öffnen den Text im Terminal.
  Array.prototype.forEach.call(document.querySelectorAll("a[data-legal]"), function (a) {
    a.addEventListener("click", function (e) {
      if (!document.getElementById("legal-" + a.dataset.legal)) return;
      e.preventDefault();
      opener = a;
      openLegal(a.dataset.legal);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && legal) closeLegal();
  });

  run();
})();
