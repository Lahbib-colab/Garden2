# 🌿 LawnNotifier

PWA de planification de tonte · iOS 27 Design · Météo · IA Claude

**→ [Ouvrir l'app](https://lahbib-colab.github.io/lawnnotifier)**

## Fonctionnalités

| Onglet | Contenu |
|--------|---------|
| 🗓 Planifier | Date, fréquence, planning 8 tontes, conseil IA |
| 📋 Historique | Log, statistiques, intervalle moyen |
| 🌤 Conseils | Tips saisonniers + checklist pré-tonte |
| ⛅ Météo | Décision tonte temps réel, hourly, 7 jours |
| ⚙️ Réglages | Push, .ics, export JSON, °C/°F |

## Déploiement — 3 étapes

### 1. Créer le repo
Aller sur [github.com/new](https://github.com/new) :
- Nom : `lawnnotifier`
- Visibilité : **Public**
- Sans README (on a déjà tout)

### 2. Pousser le code (depuis ton Mac)

```bash
# Décompresse le ZIP, ouvre un terminal dans le dossier
cd lawnnotifier-gh

git init
git add .
git commit -m "🌿 LawnNotifier v9 — iOS 27 Design"

git remote add origin https://github.com/lahbib-colab/lawnnotifier.git
git push -u origin main
```

### 3. Activer GitHub Pages

Dans ton repo → **Settings** → **Pages** :
- Source : `Deploy from a branch`
- Branch : `main` · Folder : `/ (root)`
- Cliquer **Save**

L'app est live en ~2 min sur :
```
https://lahbib-colab.github.io/lawnnotifier
```

## Ajouter à l'écran d'accueil iPhone

1. Ouvrir l'URL dans **Safari** (pas Chrome)
2. Toucher **Partager** → **Sur l'écran d'accueil**
3. L'app s'installe comme une app native ✓

## Notifications push sur iPhone

Requiert iOS 16.4+ **ET** l'app ajoutée à l'écran d'accueil.
Activer dans l'onglet Réglages → Notifications push.

## Stack

```
index.html    — App complète (HTML + CSS + JS, 107 KB)
sw.js         — Service Worker (offline + push)  
manifest.json — Métadonnées PWA
icon-*.png    — Icônes app (180/192/512px)
.nojekyll     — GitHub Pages : désactive Jekyll
```

## APIs utilisées

- **Open-Meteo** · météo gratuite, sans clé
- **Nominatim** · géocodage inverse, gratuit
- **Claude API** · conseils IA (via claude.ai uniquement)

---
MIT License
