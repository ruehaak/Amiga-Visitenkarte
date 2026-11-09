# Projekt: Amiga-CLI-Visitenkarte

Persönliche One-Page-Visitenkarte im Stil einer Amiga Workbench 1.x
AmigaShell: weißer Text auf blauem Grund, Topaz-Font, getippte CLI-Session,
etwas ASCII-Art. Zusätzlich zwei Rechtsseiten (Impressum, Datenschutz).

**Leitprinzip: keep it simple.** Kein Framework, kein Theme, keine Build-Tools
außer Hugo selbst. Lieber wenige, klar lesbare Dateien.

## Stack
- Hugo (extended), getestet mit v0.168. Eigene Layouts, kein Theme.
- Vanilla JS für die Tipp-Animation, kein npm.
- Reines CSS, Variablen für die Workbench-Palette.

## Struktur
```
hugo.toml                  Konfiguration + alle Profil-Inhalte ([params])
content/
  _index.md                Startseite (Inhalt kommt aus hugo.toml)
  impressum.md             Vorlage mit Platzhaltern
  datenschutz.md           Vorlage mit Platzhaltern
layouts/
  _default/baseof.html     Grundgerüst (head, Footer-Links)
  _default/single.html     Impressum/Datenschutz
  index.html               Startseite: Banner, CLI, noscript-Fallback
static/
  css/amiga.css            Look (Farben, Topaz, Cursor)
  js/cli.js                Tipp-Animation, Rechtstexte im Terminal (Klick auf Footer-Links)
  fonts/                   Topaz-Webfont hier ablegen (siehe fonts/README.md)
```

## Konventionen
- Inhalte der Startseite ausschließlich in `hugo.toml` unter `[params]` pflegen.
- Deprecated Hugo-Keys meiden (kein `languageCode`, kein `.Site.GoogleAnalytics`).
- Progressive Enhancement: ohne JS muss das Profil über den `noscript`-Block
  lesbar bleiben; `prefers-reduced-motion` wird respektiert.
- Palette nur über die CSS-Variablen in `:root` ändern.

## Offene Aufgaben (TODO)
1. **Topaz-Font** nach `static/fonts/Topaz-a500.woff2` legen (Anleitung in
   `static/fonts/README.md`). Ohne Datei greift die Monospace-Ersatzschrift.
2. ~~Berufsbezeichnung~~ erledigt: „Agile Digital Innovator“ (`role`) plus
   CLI-Zeile `tagline` in `hugo.toml`.
3. **Interessen** (`scope`) in `hugo.toml` kuratieren.
3a. ~~LinkedIn-URL~~ erledigt (`net` in `hugo.toml`).
4. ~~ASCII-Banner~~ erledigt („DÖRK“, optional via patorjk.com/software/taag ersetzbar).
5. **Impressum & Datenschutz**: Platzhalter `[ ]` ausfüllen; Impressumspflicht
   und Hosting-Angaben prüfen. (Beides sind Vorlagen, keine Rechtsberatung.)
6. `baseURL` in `hugo.toml` auf die echte Domain setzen.
7. ~~404-Seite~~ erledigt.

## Lokal starten
```
hugo server --renderToMemory
# http://localhost:1313
```

## Bauen & Deployen
```
hugo --minify          # Ergebnis landet in public/
```
`public/` auf einen beliebigen Static-Host legen (Netlify, GitHub/GitLab Pages,
Uberspace, eigener Webspace). Vorher `baseURL` korrekt setzen.
