# Topaz-Webfont einbinden

Die Seite erwartet die Datei `Topaz-a500.woff2` in diesem Ordner.
Fehlt sie, greift die Monospace-Ersatzschrift – die Seite funktioniert trotzdem.

## Variante A: aus dem Original-TTF selbst konvertieren
1. `Topaz_a500_v1.0.ttf` aus dem Repo **rewtnull/amigafonts** laden
   (originalgetreuer Nachbau; Lizenz erlaubt das Bündeln mit eigenen Projekten).
2. In woff2 umwandeln, z. B. mit fonttools:
   ```
   pip install fonttools brotli
   fonttools ttLib.woff2 compress -o Topaz-a500.woff2 Topaz_a500_v1.0.ttf
   ```
3. Die erzeugte `Topaz-a500.woff2` hier ablegen.

## Variante B: fertige Webfont
Es gibt fertige Topaz-Webfonts (woff/woff2), z. B. `emartisoft/AmigaTopazFont`.
Achtung: manche Varianten sind für Türkisch gebaut – vor dem Einsatz prüfen, ob
die deutschen Umlaute ä ö ü ß und das Euro-Zeichen korrekt dargestellt werden.
Datei in `Topaz-a500.woff2` umbenennen oder den Pfad in
`static/css/amiga.css` (@font-face) anpassen.

## Lizenz
Topaz ist © Amiga Inc.; die originalgetreuen Nachbauten stehen unter einer
Font-Lizenz, die das Bündeln mit eigenen Seiten erlaubt. Für eine private
Visitenkarte unproblematisch. Lege die jeweilige LICENSE-Datei mit ab.
