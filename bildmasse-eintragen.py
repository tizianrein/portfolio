#!/usr/bin/env python3
"""
Liest die Maße aller Projektbilder aus und schreibt sie als
Seitenverhältnisse in projekte.js.

Warum: Ohne bekannte Maße kann der Browser vor dem Laden nicht wissen,
wie hoch ein Bild wird. Die Seite reserviert dann zu wenig Platz, und
sobald das Bild ankommt, rutscht alles darunter nach unten — genau das
Springen in der Galerie. Mit hinterlegten Maßen steht die Höhe von der
ersten Zeichnung an fest.

Die unterschiedlichen Bildformate bleiben dabei erhalten; es wird nur
vorab bekannt gemacht, welches Bild welches Format hat.

Aufruf im Projektordner (Bilder müssen unter images/projects/ liegen):

    python3 bildmasse-eintragen.py

Es wird eine Sicherung projekte.js.bak angelegt.
Das Skript ist wiederholbar: bereits eingetragene Maße werden aktualisiert.
"""

import json
import pathlib
import re
import shutil
import struct
import sys
import urllib.parse

BILDORDNER = pathlib.Path("images/projects")
QUELLE = pathlib.Path("projekte.js")


# --- Bildmaße lesen, ohne externe Bibliotheken -------------------------

def masse_jpeg(f):
    f.seek(2)
    while True:
        b = f.read(1)
        while b and b != b"\xff":
            b = f.read(1)
        while b == b"\xff":
            b = f.read(1)
        if not b:
            return None
        marker = b[0]
        # SOF0..SOF15, ohne DHT(c4), DNL(c8), DAC(cc)
        if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):
            f.read(3)
            h, w = struct.unpack(">HH", f.read(4))
            return w, h
        laenge = struct.unpack(">H", f.read(2))[0]
        f.seek(laenge - 2, 1)


def masse_png(f):
    f.seek(16)
    w, h = struct.unpack(">II", f.read(8))
    return w, h


def masse_gif(f):
    f.seek(6)
    w, h = struct.unpack("<HH", f.read(4))
    return w, h


def masse(pfad):
    try:
        with open(pfad, "rb") as f:
            kopf = f.read(4)
            f.seek(0)
            if kopf.startswith(b"\xff\xd8"):
                return masse_jpeg(f)
            if kopf.startswith(b"\x89PNG"):
                return masse_png(f)
            if kopf.startswith(b"GIF8"):
                return masse_gif(f)
    except Exception as e:
        print(f"  ! {pfad.name}: {e}")
    return None


# --- projekte.js einlesen und Bildlisten finden ------------------------

def main():
    if not QUELLE.exists():
        sys.exit("projekte.js nicht gefunden. Bitte im Projektordner ausführen.")
    if not BILDORDNER.is_dir():
        sys.exit(f"{BILDORDNER} nicht gefunden. Liegen die Bilder woanders?")

    text = QUELLE.read_text(encoding="utf-8")

    # Jeder Projektblock hat  pre:"..."  und danach  imgs:[...]
    muster = re.compile(r'pre:"([^"]*)"\s*,\s*\n?\s*imgs:\[(.*?)\]', re.S)
    treffer = list(muster.finditer(text))
    if not treffer:
        sys.exit("Keine imgs:[...]-Blöcke gefunden — Format von projekte.js geändert?")

    verhaeltnisse = {}
    fehlend = []
    gefunden = 0

    for m in treffer:
        prefix = m.group(1)
        namen = re.findall(r'"([^"]+)"', m.group(2))
        for name in namen:
            # Präfixe enthalten teils URL-Kodierung (z.B. %C3%B6)
            dateiname = urllib.parse.unquote(prefix + name)
            pfad = BILDORDNER / dateiname
            if not pfad.exists():
                fehlend.append(dateiname)
                continue
            wh = masse(pfad)
            if not wh:
                fehlend.append(dateiname)
                continue
            w, h = wh
            verhaeltnisse[prefix + name] = [w, h]
            gefunden += 1

    if not verhaeltnisse:
        sys.exit("Keine Bildmaße gelesen. Stimmt der Pfad images/projects/ ?")

    # Als kompaktes Objekt am Dateianfang einfügen bzw. ersetzen
    zeilen = ["const MASSE={"]
    for schluessel, (w, h) in sorted(verhaeltnisse.items()):
        zeilen.append(f'"{schluessel}":[{w},{h}],')
    zeilen.append("};")
    block = "\n".join(zeilen)

    if "const MASSE=" in text:
        neu = re.sub(r"const MASSE=\{.*?\n\};", block, text, count=1, flags=re.S)
    else:
        # direkt nach der ersten Zeile (const B="images/projects/";) einsetzen
        neu = text.replace('const B="images/projects/";',
                           'const B="images/projects/";\n\n'
                           "/* Bildmaße: verhindern das Nachrutschen beim Laden.\n"
                           "   Erzeugt von bildmasse-eintragen.py — nicht von Hand pflegen. */\n"
                           + block, 1)

    shutil.copy(QUELLE, QUELLE.with_suffix(".js.bak"))
    QUELLE.write_text(neu, encoding="utf-8")

    print(f"{gefunden} Bildmaße eingetragen.")
    if fehlend:
        print(f"\n{len(fehlend)} Datei(en) nicht gefunden — diese behalten den "
              f"3:2-Platzhalter:")
        for f in fehlend[:10]:
            print("   ", f)
        if len(fehlend) > 10:
            print(f"    … und {len(fehlend) - 10} weitere")
    print("\nSicherung: projekte.js.bak")


if __name__ == "__main__":
    main()
