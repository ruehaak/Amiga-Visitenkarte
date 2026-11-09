# Amiga-CLI-Visitenkarte

Eine persönliche One-Page-Visitenkarte, gestaltet wie eine Amiga-Workbench-1.x
Shell: weiß auf blau, Topaz-Font, getippte CLI-Session, etwas ASCII-Art.
Dazu Impressum und Datenschutz. Gebaut mit Hugo, ohne Theme.

## Voraussetzung
Hugo **extended** (Version 0.168 oder neuer):

```
brew install hugo
hugo version   # sollte "+extended" enthalten
```

## Start
```
hugo server --renderToMemory
```
Dann http://localhost:1313 öffnen.

## Inhalte ändern
Alles Sichtbare der Startseite steht in `hugo.toml` unter `[params]`
(Name, Berufsbezeichnung, Ort, Interessen, Tipp-Tempo).
Impressum und Datenschutz liegen in `content/`.

## Topaz-Font
Für den echten Amiga-Look eine Topaz-Webfont nach `static/fonts/` legen –
Anleitung in `static/fonts/README.md`. Ohne Font nutzt die Seite automatisch
eine Monospace-Ersatzschrift.

## Bauen
```
hugo --minify
```
Das Ergebnis liegt in `public/` und kann auf jeden Static-Host.

Mehr Kontext und die offene Aufgabenliste: siehe `CLAUDE.md`.
