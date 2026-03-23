# Vite JS & Packages

## Packages et gestion des dépendances

### Qu'est-ce qu'un package ?

Un package est un **module réutilisable** de code (JavaScript, CSS, etc.) distribué via un gestionnaire de packages comme **npm** (Node Package Manager).

### Semantic Versioning (SemVer)

Le versioning sémantique suit le format : **major.minor.patch**

```
Exemple : 2.3.1
         │ │ └── patch : corrections de bugs (rétrocompatible)
         │ └──── minor : nouvelles fonctionnalités (rétrocompatible)
         └────── major : changements cassants (non rétrocompatible)
```

**Règles importantes :**
- `v0.x.x` = version instable, **à éviter** en production
- Avant d'utiliser un package, vérifier :
  - Le nombre d'utilisateurs
  - La fréquence de maintenance
  - Les dépendances du package

### 3 méthodes d'intégration de packages

#### 1. Copy-paste (déconseillé)
Copier manuellement les fichiers dans le projet. Problème : pas de gestion des mises à jour.

#### 2. CDN (Content Delivery Network)
Réseau de serveurs géographiquement distribués qui servent le contenu depuis le serveur le plus proche de l'utilisateur.

```html
<!-- Exemple : Google Fonts avec Material Icons -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Icons" />
```

**Avantages :** rapide à mettre en place, pas de fichier local.
**Inconvénients :** dépendance réseau, pas de contrôle sur le fichier.

#### 3. Package Manager (npm) — méthode recommandée

```bash
npm install nom-du-package
```

---

## Vite JS

### Qu'est-ce que Vite ?

Vite est un **module bundler** basé sur NodeJS/NPM. Il :
- **Package** le JavaScript et le CSS
- Fournit un **serveur de développement** avec **hot reloading** (rechargement automatique à chaque modification)
- Optimise le code pour la production

### Installation

```bash
npm install --save-dev vite
```

Le flag `--save-dev` indique que Vite est une dépendance de **développement** uniquement (pas nécessaire en production).

### Structure d'un projet Vite

```
mon-projet/
├── node_modules/      # Dépendances installées (ne PAS toucher)
├── src/               # Code source
│   ├── index.html     # Point d'entrée HTML
│   └── index.js       # Point d'entrée JavaScript
├── lib/               # Bibliothèques externes (optionnel)
├── package.json       # Configuration du projet et dépendances
└── package-lock.json  # Versions exactes des dépendances
```

### package.json

```json
{
  "name": "mon-projet",
  "version": "1.0.0",
  "scripts": {
    "start": "vite",
    "build": "vite build"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

### Commandes essentielles

```bash
npm install          # Installe toutes les dépendances du package.json
npm start            # OU npm run start — lance le serveur de développement
npm run build        # Construit le projet pour la production
```

### Lier le JS au HTML

Dans `index.html` :

```html
<!DOCTYPE html>
<html>
<head>
  <title>Mon App</title>
</head>
<body>
  <script type="module" src="./index.js"></script>
</body>
</html>
```

**Important :** `type="module"` est obligatoire pour utiliser les imports ES6.

### Imports / Exports ES6

```js
// api.js — exporter des fonctions
export const loadSongs = async () => { /* ... */ }
export const loadArtist = async (id) => { /* ... */ }

// index.js — importer
import { loadSongs, loadArtist } from './api.js'
```
