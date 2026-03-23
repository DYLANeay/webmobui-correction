# Déploiement d'une PWA

## Plateformes de déploiement

Plusieurs plateformes permettent de déployer gratuitement une PWA :
- **Render** (utilisé dans le cours)
- Vercel
- Netlify
- GitHub Pages

## Déploiement sur Render

### Prérequis

1. Un compte sur [render.com](https://render.com)
2. Le projet doit être sur un dépôt **Git** (GitHub, GitLab)
3. Un script `build` dans le `package.json`

### Configuration du `package.json`

```json
{
  "name": "spotlified",
  "version": "1.0.0",
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

### Étapes sur Render

1. Connecter le dépôt Git
2. Choisir **Static Site** comme type de service
3. Configurer :
   - **Build Command** : `npm run build`
   - **Publish Directory** : `dist` (dossier de sortie de Vite)
4. Déployer

### Vérification

Après déploiement, vérifier que :
- Le site est accessible en HTTPS
- Le manifest est chargé (DevTools → Application → Manifest)
- Le Service Worker est enregistré (DevTools → Application → Service Workers)
- L'application est installable (icône d'installation dans la barre d'adresse)

## Checklist PWA complète

- [ ] `manifest.webmanifest` avec tous les champs requis
- [ ] Icône 512x512 pixels minimum
- [ ] `<link rel="manifest" href="manifest.webmanifest" />` dans le HTML
- [ ] Service Worker enregistré (`navigator.serviceWorker.register`)
- [ ] Fichier `sw.js` avec stratégie de cache
- [ ] Site servi en HTTPS
- [ ] Gestion du mode offline (affichage fallback)

## Outils de vérification

### Chrome DevTools

- **Application** → Manifest : vérifie le manifest
- **Application** → Service Workers : vérifie le SW
- **Application** → Cache Storage : inspecte le cache
- **Network** → case "Offline" : tester le mode hors ligne

### Lighthouse

Outil intégré à Chrome DevTools qui audite la qualité d'une PWA :
1. Ouvrir DevTools (F12)
2. Aller dans l'onglet **Lighthouse**
3. Cocher **Progressive Web App**
4. Lancer l'audit
5. Score et recommandations affichés
