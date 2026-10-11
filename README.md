# 🌿 LawnNotifier

PWA de planification de tonte — iOS 27 Design · Météo · IA

## Déploiement GitHub Pages (2 commandes)

```bash
git init && git add . && git commit -m "LawnNotifier v9"
git remote add origin https://github.com/TON_USER/lawnnotifier
git push -u origin main
```

Puis : **Settings → Pages → Source : main / (root)**

Ton app sera disponible sur `https://TON_USER.github.io/lawnnotifier`

## Pourquoi GitHub Pages ?

Safari iOS bloque les scripts sur `file://`. 
L'app nécessite HTTPS pour fonctionner pleinement :
- Service Worker (offline, notifications)
- Notifications push natives
- Géolocalisation météo
- API Claude (conseils IA)

## Stack

| Fichier | Rôle |
|---------|------|
| `index.html` | App complète (HTML + CSS + JS inline) |
| `sw.js` | Service Worker offline + notifications |
| `manifest.json` | Métadonnées PWA (icône, nom, couleurs) |
| `icon-192.png` | Icône app standard |
| `icon-512.png` | Icône app haute résolution |
