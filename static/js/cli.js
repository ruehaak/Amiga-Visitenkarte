/* Tippt eine kleine AmigaShell-Session Zeile für Zeile.
   Ohne Abhängigkeiten. Respektiert "prefers-reduced-motion".
   Inhalte kommen aus den data-Attributen von #cli. */
(function () {
  "use strict";

  var el = document.getElementById("cli");
  if (!el) return;

  var d = el.dataset;
  var data = {
    name: d.name || "",
    role: d.role || "",
    location: d.location || "",
    tagline: d.tagline || "",
    interests: (d.interests || "").split("|").filter(Boolean)
  };

  var parsed = parseInt(d.speed, 10);
  var speed = isNaN(parsed) ? 35 : parsed;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || speed === 0;

  // Session aufbauen:
  //   type = Befehl, der Zeichen für Zeichen getippt wird (mit "1> "-Prompt)
  //   out  = Ausgabezeile, die sofort erscheint
  var lines = [
    { kind: "type", text: "TYPE profil.txt" },
    { kind: "out",  text: "Name  : " + data.name },
    { kind: "out",  text: "Beruf : " + data.role },
    { kind: "out",  text: "Ort   : " + data.location }
  ];
  if (data.tagline) lines.push({ kind: "type", text: data.tagline });
  lines.push({ kind: "type", text: "LIST interessen/" });
  data.interests.forEach(function (item) {
    lines.push({ kind: "out", text: "  " + item });
  });

  var i = 0;

  function run() {
    if (i >= lines.length) { addCursor(); return; }
    var line = lines[i++];
    if (line.kind === "out" || reduce) {
      printLine(line);
      setTimeout(run, reduce ? 0 : 120);
    } else {
      typeLine(line, run);
    }
  }

  function makeRow(isPrompt) {
    var p = document.createElement("p");
    if (isPrompt) {
      p.className = "prompt";
      var prefix = document.createElement("span");
      prefix.textContent = "1> ";
      p.appendChild(prefix);
    }
    el.appendChild(p);
    return p;
  }

  function printLine(line) {
    var p = makeRow(line.kind === "type");
    p.appendChild(document.createTextNode(line.text));
  }

  function typeLine(line, done) {
    var p = makeRow(true);
    var node = document.createTextNode("");
    p.appendChild(node);
    var pos = 0;
    (function tick() {
      node.textContent += line.text.charAt(pos++);
      if (pos < line.text.length) {
        setTimeout(tick, speed);
      } else {
        setTimeout(done, 300);
      }
    })();
  }

  function addCursor() {
    var p = makeRow(true);
    var cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.setAttribute("aria-hidden", "true");
    p.appendChild(cursor);
  }

  run();
})();
