/* Seltener Anaglyphen-Glitch auf Fensterrahmen und ASCII-Banner.
   Alle 6–10 s für ca. 200 ms; ein einziger Zustand pro Glitch, also weit
   unter 3 Hz. Aus bei prefers-reduced-motion und solange ein Rechtstext
   (.legal) offen ist. Text bleibt unverändert (nur Schatten/Overlay). */
(function () {
  "use strict";

  var win = document.querySelector(".window");
  var ascii = document.querySelector(".ascii");
  if (!win || !ascii) return;

  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");

  function rand(min, max) { return min + Math.random() * (max - min); }

  // Zwei verrutschte Streifen (clip-path) mit eigener Höhe, Lage und Versatz.
  function setStrip(prefix) {
    var top = rand(0, 70);
    var h = rand(8, 18);
    var dx = (Math.random() < 0.5 ? -1 : 1) * rand(4, 8);
    ascii.style.setProperty("--" + prefix + "-top", top.toFixed(1) + "%");
    ascii.style.setProperty("--" + prefix + "-bottom", (100 - top - h).toFixed(1) + "%");
    ascii.style.setProperty("--" + prefix + "-x", dx.toFixed(1) + "px");
  }

  function glitch() {
    if (!mq.matches && !document.hidden && !document.querySelector(".legal")) {
      ascii.setAttribute("data-text", ascii.textContent);
      setStrip("a");
      setStrip("b");
      win.classList.add("glitch");
      ascii.classList.add("glitch");
      setTimeout(function () {
        win.classList.remove("glitch");
        ascii.classList.remove("glitch");
        ascii.removeAttribute("data-text");
      }, 200);
    }
    schedule();
  }

  function schedule() { setTimeout(glitch, rand(6000, 10000)); }

  schedule();
})();
