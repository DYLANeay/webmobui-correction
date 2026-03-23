# HTML, CSS, JS et Standards Web

## Standards et organismes

### W3C (World Wide Web Consortium)
- Organisme de **standardisation** du web
- Publie les spécifications officielles de HTML, CSS, etc.
- Processus formel et lent

### WHATWG (Web Hypertext Application Technology Working Group)
- Groupe de travail alternatif créé par Apple, Mozilla, Opera
- Maintient un **Living Standard** de HTML (spécification vivante, mise à jour en continu)
- Plus réactif que le W3C

**En pratique :** le WHATWG maintient la spécification HTML actuelle, le W3C se concentre sur d'autres standards.

## HTML sémantique

Utiliser les balises HTML pour leur **sens**, pas pour leur apparence :

```html
<!-- ❌ Non sémantique -->
<div class="header">Mon titre</div>
<div class="nav">Navigation</div>

<!-- ✅ Sémantique -->
<header>Mon titre</header>
<nav>Navigation</nav>
<main>Contenu principal</main>
<footer>Pied de page</footer>
<article>Article</article>
<section>Section</section>
```

**Avantages :** accessibilité, SEO, lisibilité du code.

## JSON (JavaScript Object Notation)

### Format

```json
{
  "nom": "Spotlified",
  "version": 1,
  "actif": true,
  "tags": ["musique", "web"],
  "auteur": {
    "prenom": "Jean",
    "age": 25
  },
  "nullable": null
}
```

### Types supportés
- `string` (chaîne de caractères entre guillemets doubles)
- `number` (entier ou décimal)
- `boolean` (`true` / `false`)
- `array` (tableau `[]`)
- `object` (objet `{}`)
- `null`

### Méthodes JavaScript

```js
// Convertir un objet JS en chaîne JSON
const jsonString = JSON.stringify({ nom: "Alice", age: 30 })
// Résultat : '{"nom":"Alice","age":30}'

// Convertir une chaîne JSON en objet JS
const objet = JSON.parse('{"nom":"Alice","age":30}')
// Résultat : { nom: "Alice", age: 30 }
```

**Attention :** `JSON.parse()` lance une erreur si la chaîne n'est pas du JSON valide.
