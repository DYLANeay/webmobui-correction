# PWA (Progressive Web Application)

## Qu'est-ce qu'une PWA ?

Une **Progressive Web Application** est une application web qui offre une expérience proche d'une application native, **sans passer par un app store**.

### Avantages

- **Cache** : les ressources sont mises en cache pour un chargement rapide
- **Offline** : fonctionne même sans connexion internet
- **Coût de développement faible** : un seul code pour web + mobile
- **Mises à jour instantanées** : pas besoin de republier sur un store
- **Installable** : peut être ajoutée à l'écran d'accueil
- **Pas de téléchargement** depuis un store

### Inconvénients

- **Accès limité au matériel** : moins d'accès aux capteurs, Bluetooth, etc. que les apps natives
- **Performance** : moins performante qu'une app native pour les tâches lourdes
- **Support iOS limité** : Apple supporte moins bien les PWA que Google

### Caractéristiques Google d'une PWA

1. **Progressive** : fonctionne pour tous les utilisateurs, quel que soit le navigateur
2. **Sécurisée** : servie via HTTPS
3. **Engageante** : notifications push, plein écran
4. **Installable** : ajout à l'écran d'accueil
5. **Rapide** : chargement instantané grâce au cache
6. **SEO-optimisée** : indexable par les moteurs de recherche
7. **Indépendante de la connexion** : fonctionne hors ligne

## Prérequis pour une PWA

Pour qu'un site web soit reconnu comme PWA, il faut **4 éléments** :

1. **Un fichier Manifest** (`.webmanifest`)
2. **HTTPS** (ou `localhost` en développement)
3. **Une icône** (au moins 512x512 pixels)
4. **Un Service Worker**

---

## Fichier Manifest

### Qu'est-ce que c'est ?

Un fichier JSON (extension `.webmanifest`) qui décrit l'application : nom, icônes, couleurs, comportement au lancement.

### Exemple complet

```json
{
  "short_name": "Spotlified",
  "name": "Spotlified - Unleash the JS",
  "icons": [
    {
      "src": "images/logo_spotlified.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "/",
  "background_color": "#121212",
  "display": "standalone",
  "scope": "/",
  "theme_color": "#121212",
  "orientation": "portrait",
  "lang": "fr"
}
```

### Champs du Manifest

| Champ | Description |
|-------|-------------|
| `name` | Nom complet de l'application |
| `short_name` | Nom court (affiché sous l'icône) |
| `icons` | Tableau d'icônes avec `src`, `type`, `sizes` |
| `start_url` | URL de démarrage de l'application |
| `display` | Mode d'affichage (voir ci-dessous) |
| `background_color` | Couleur de fond au lancement (splash screen) |
| `theme_color` | Couleur de la barre d'état / barre de titre |
| `scope` | Portée de la PWA (quelles URLs sont gérées) |
| `orientation` | Orientation forcée (`portrait`, `landscape`) |
| `lang` | Langue de l'application |
| `related_applications` | Liens vers les apps natives associées |

### Valeurs de `display`

| Valeur | Description |
|--------|-------------|
| `fullscreen` | Plein écran total (pas de barre de statut) |
| **`standalone`** | **Comme une app native (le plus utilisé)** — pas de barre d'adresse |
| `minimal-ui` | Barre d'adresse minimale |
| `browser` | Comme un onglet de navigateur normal |

### Intégration dans le HTML

```html
<head>
  <link rel="manifest" href="manifest.webmanifest" />
</head>
```

---

## Détection Online / Offline

### Vérifier l'état actuel

```js
if (window.navigator.onLine) {
  console.log('Connecté à internet')
} else {
  console.log('Hors ligne')
}
```

### Écouter les changements de connexion

```js
window.addEventListener('offline', (e) => {
  console.log('Connexion perdue !')
  // Afficher un message à l'utilisateur
  document.querySelector('.status').textContent = 'Mode hors ligne'
})

window.addEventListener('online', (e) => {
  console.log('Connexion rétablie !')
  // Mettre à jour l'interface
  document.querySelector('.status').textContent = 'En ligne'
})
```
