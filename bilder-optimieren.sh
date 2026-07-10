#!/usr/bin/env bash
#
# Verkleinert die Projektbilder für das Web.
# Der größte Hebel gegen langsames Laden — die Code-Optimierungen in
# index.html können nur verwalten, was ohnehin schon zu groß ist.
#
# Voraussetzung (einmalig):
#   macOS:  brew install imagemagick jpegoptim
#   Ubuntu: sudo apt install imagemagick jpegoptim
#
# Aufruf im Projektordner:
#   bash bilder-optimieren.sh
#
# Es wird NICHTS überschrieben: die Originale bleiben in
# images/projects/original/ liegen.

set -euo pipefail

QUELLE="images/projects"
SICHERUNG="$QUELLE/original"

# Längste Kante. 2000px reicht für Vollbild auf Retina-Displays;
# darüber sieht man keinen Unterschied mehr, die Datei wächst aber stark.
MAXKANTE=2000
QUALITAET=82          # 80–85 ist der Punkt, ab dem man nichts mehr sieht

if [ ! -d "$QUELLE" ]; then
  echo "Ordner $QUELLE nicht gefunden. Bitte im Projektordner ausführen."
  exit 1
fi

command -v magick >/dev/null 2>&1 || command -v convert >/dev/null 2>&1 || {
  echo "ImageMagick fehlt. Bitte zuerst installieren (siehe Kopf dieser Datei)."
  exit 1
}
# ImageMagick 7 nutzt 'magick', ältere Versionen 'convert'
if command -v magick >/dev/null 2>&1; then IM="magick"; else IM="convert"; fi

mkdir -p "$SICHERUNG"

vorher=0
nachher=0

shopt -s nullglob nocaseglob
for datei in "$QUELLE"/*.jpg "$QUELLE"/*.jpeg "$QUELLE"/*.png; do
  name="$(basename "$datei")"

  # Schon einmal gesichert? Dann wurde die Datei bereits bearbeitet.
  if [ -f "$SICHERUNG/$name" ]; then
    echo "übersprungen (schon optimiert): $name"
    continue
  fi

  groesse_vorher=$(wc -c < "$datei")
  cp "$datei" "$SICHERUNG/$name"

  "$IM" "$SICHERUNG/$name" \
    -auto-orient \
    -resize "${MAXKANTE}x${MAXKANTE}>" \
    -strip \
    -interlace Plane \
    -quality "$QUALITAET" \
    "$datei"

  # jpegoptim holt nochmal ein paar Prozent verlustfrei heraus
  if command -v jpegoptim >/dev/null 2>&1; then
    case "$name" in
      *.jpg|*.JPG|*.jpeg|*.JPEG) jpegoptim --strip-all --quiet "$datei" ;;
    esac
  fi

  groesse_nachher=$(wc -c < "$datei")

  # Sicherheitsnetz: Wurde die Datei GROESSER (kann bei schon optimierten
  # oder sehr kleinen Bildern passieren), das Original wiederherstellen.
  if [ "$groesse_nachher" -ge "$groesse_vorher" ]; then
    cp "$SICHERUNG/$name" "$datei"
    rm "$SICHERUNG/$name"
    printf "%-60s %5s KB    (unveraendert, war schon klein genug)\n" \
      "$name" "$((groesse_vorher / 1024))"
    vorher=$((vorher + groesse_vorher))
    nachher=$((nachher + groesse_vorher))
    continue
  fi

  vorher=$((vorher + groesse_vorher))
  nachher=$((nachher + groesse_nachher))

  printf "%-60s %5s KB -> %5s KB\n" "$name" \
    "$((groesse_vorher / 1024))" "$((groesse_nachher / 1024))"
done

echo
echo "----------------------------------------------------------"
if [ "$vorher" -gt 0 ]; then
  echo "Gesamt:  $((vorher / 1024)) KB  ->  $((nachher / 1024)) KB"
  echo "Ersparnis: $(( 100 - (nachher * 100 / vorher) )) %"
else
  echo "Nichts zu tun — alle Bilder sind bereits optimiert."
fi
echo "Originale liegen unverändert in: $SICHERUNG"
echo
echo "Hinweis: GIF-Dateien werden bewusst nicht angefasst (Animationen)."
