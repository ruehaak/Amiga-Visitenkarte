/* Alt oder Ctrl (einzeln gedrückt) klappt das Rechtliches-Menü auf/zu.
   Escape schließt es. Ohne JS bleibt das Menü per Klick bedienbar. */
(function () {
  "use strict";

  var menu = document.getElementById("menu");
  if (!menu) return;

  document.addEventListener("keydown", function (e) {
    if (e.repeat) return;
    if (e.key === "Alt" || e.key === "Control") {
      menu.open = !menu.open;
      if (menu.open) menu.querySelector("a").focus();
    } else if (e.key === "Escape") {
      menu.open = false;
    }
  });
})();
