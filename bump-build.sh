#!/bin/sh
# Marque une nouvelle version avant publication : les utilisateurs verront alors
# la bannière « Mise à jour disponible ».
#   ./bump-build.sh                       → nouveau build (date/heure actuelles)
#   ./bump-build.sh 9.4 "Nouveautés…"     → + numéro de version et notes affichées
set -e
cd "$(dirname "$0")"
BUILD=$(date +%Y%m%d%H%M)
sed -i.bak -E "s/(name=\"app-build\" content=\")[0-9]+/\1$BUILD/" index.html
if [ -n "$1" ]; then sed -i.bak -E "s/(name=\"app-version\" content=\")[^\"]*/\1$1/" index.html; fi
if [ -n "$2" ]; then sed -i.bak -E "s/(name=\"app-notes\" content=\")[^\"]*/\1$2/" index.html; fi
rm -f index.html.bak
echo "Build $BUILD — $(grep -o 'name="app-version" content="[^"]*"' index.html)"
