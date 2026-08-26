# EXAMENS - Guide de Développement

## 🚀 Démarrage rapide

### Prérequis minimums
- Node.js 18+ (optionnel - l'application peut fonctionner sans)
- Python 3 (pour le serveur de développement)
- Navigateur moderne

### Mode Développement sans Node.js

Si vous n'avez pas npm installé ou de problèmes de connectivité réseau :

```bash
# Sur Linux/macOS
./dev-server.sh

# Sur Windows
dev-server.bat

# Accédez à http://localhost:8000
```

### Mode Développement avec Node.js

Quand npm/yarn est disponible :

```bash
npm install
npm run dev
```

## 📁 Structure du Projet

```
src/
├── index.html              # Point d'entrée HTML
├── css/                    # Feuilles de styles
│   ├── reset.css          # Réinitialisation des styles
│   ├── variables.css      # Thèmes et couleurs
│   ├── layout.css         # Disposition générale
│   ├── components.css     # Composants réutilisables
│   └── responsive.css     # Media queries
├── js/                     # Code JavaScript
│   ├── app.js             # Initialisation de l'application
│   ├── router.js          # Gestion de la navigation
│   ├── state.js           # État global
│   ├── utils.js           # Fonctions utilitaires
│   ├── storage/
│   │   └── examRepository.js  # Logique du stockage
│   ├── components/        # Composants réutilisables
│   │   ├── sidebar.js
│   │   ├── header.js
│   │   ├── examCard.js
│   │   └── modal.js
│   └── pages/             # Pages/vues
│       ├── dashboard.js
│       ├── subject.js
│       ├── favorites.js
│       ├── viewer.js
│       └── settings.js

src-tauri/                  # Backend Tauri
├── src/
│   ├── lib.rs            # Logique Rust
│   └── main.rs           # Point d'entrée
├── Cargo.toml            # Dépendances Rust
└── tauri.conf.json       # Configuration

.github/workflows/         # CI/CD
└── build.yml
```

## 💻 Développement Frontend

### Architecture

L'application utilise une architecture modulaire sans framework :

1. **Router** : gère la navigation entre les pages
2. **State** : état global (thème, recherche, filtres)
3. **Pages** : classes représentant chaque écran
4. **Components** : éléments réutilisables
5. **Repository** : couche d'abstraction du stockage

### Ajouter une nouvelle page

1. Créez un fichier dans `src/js/pages/` :

```javascript
// src/js/pages/mypage.js
export class MyPage {
    constructor(params = {}) {
        this.params = params;
    }

    async render() {
        return `
            <div class="content-wrapper">
                <div class="page-header">
                    <h1 class="page-title">Ma Page</h1>
                </div>
                <div>Contenu de la page...</div>
            </div>
        `;
    }

    cleanup() {
        // Nettoyage si nécessaire
    }
}

export default MyPage;
```

2. Enregistrez-la dans `src/js/app.js` :

```javascript
import MyPage from './pages/mypage.js';

// Dans la méthode registerPages()
router.registerPage('mypage', MyPage);
```

3. Naviguez vers la page :

```javascript
router.navigate('mypage', { param: 'value' });
```

### Ajouter un composant réutilisable

```javascript
// src/js/components/mycomponent.js
export class MyComponent {
    static render(data) {
        return `<div class="my-component">${data}</div>`;
    }

    static attachListeners() {
        // Attachez les event listeners après le rendu
        document.querySelectorAll('.my-component').forEach(el => {
            el.addEventListener('click', () => {
                // Votre logique
            });
        });
    }
}

export default MyComponent;
```

### Styles et thèmes

Les couleurs et variables sont définies dans `src/css/variables.css` :

```css
:root {
    /* Thème clair par défaut */
    --color-primary: #0d6efd;
    --color-bg: #ffffff;
    /* ... */
}

body.dark-theme {
    /* Thème sombre */
    --color-primary: #4a9eff;
    --color-bg: #1a1a1a;
    /* ... */
}
```

Les media queries pour responsive sont dans `src/css/responsive.css`.

## 🛠️ Développement Backend (Tauri)

### Structure Rust

```rust
// src-tauri/src/lib.rs
use tauri::Manager;

#[tauri::command]
fn get_app_data_dir() -> String {
    // Logique Rust
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_app_data_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Appeler du code Rust depuis JavaScript

```javascript
import { invoke } from '@tauri-apps/api/tauri';

// Dans une page ou composant
async function getData() {
    try {
        const data = await invoke('get_app_data_dir');
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
```

### Permissions Tauri

Les permissions sont configurées dans `src-tauri/tauri.conf.json` :

```json
{
    "app": {
        "security": {
            "csp": "default-src 'self'; ..."
        }
    }
}
```

## 🧪 Débogage

### Console DevTools

Dans le navigateur ou Tauri :
- **Linux/Windows** : Ctrl+Shift+I
- **macOS** : Cmd+Option+I

### Objets globaux

```javascript
window.app              // Instance App
window.state            // État global
window.examRepository   // Accès au stockage
window.router           // Routeur
```

### Logs

```javascript
// Voir les examens
console.log(examRepository.getExams());

// Voir l'état
console.log(state.getState());

// Tester la recherche
console.log(examRepository.searchExams('2025'));
```

## 🔄 Git Workflow

```bash
# Cloner
git clone https://github.com/...
cd examens

# Créer une branche feature
git checkout -b feature/amazing-feature

# Développer, committer
git add .
git commit -m "Add amazing feature"

# Pousser
git push origin feature/amazing-feature

# Créer une Pull Request sur GitHub
```

## 📦 Build and Release

### Build local

```bash
# Sans npm (frontend seulement)
# Utilisez dev-server.sh pour tester

# Avec npm (compilation Tauri)
npm run build
```

### Build automatique

Les workflows GitHub Actions compilent automatiquement les commits sur `main` ou `develop`.

Fichiers de build disponibles dans : `.github/workflows/build.yml`

## 🐛 Troubleshooting

### "Impossible d'import..."

Vérifiez les chemins relatifs dans les imports :
```javascript
import examRepository from '../storage/examRepository.js';  // ✓ Correct
import examRepository from './storage/examRepository.js';    // ✗ Incorrect
```

### LocalStorage not persisting

Vérifiez que vous utilisez le prefix correct :
```javascript
const key = 'examens_' + keyName;  // ✓ Correct
```

### Module CORS errors

Utilisez `dev-server.py` ou `npm run dev` - les modules ES6 requièrent HTTPS ou localhost.

### Tauri ne compile pas

```bash
# Réinstallez les dépendances
cargo clean
cargo build

# Ou via Tauri
tauri build --debug
```

## 📚 Ressources

- [JavaScript Vanilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Tauri Documentation](https://tauri.app/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [CSS MDN](https://developer.mozilla.org/en-US/docs/Web/CSS)

## ✅ Checklist avant Push

- [ ] Code testé localement
- [ ] Pas de console errors
- [ ] Responsive design ok
- [ ] Thème light et dark ok
- [ ] Commit messages clairs
- [ ] Tests additionnels si changement logic

## 🚀 Performance Tips

- Utilisez `debounce()` pour les recherches
- Utilisez `throttle()` pour les scroll events
- Lazy-load les pages si possible
- Minifiez CSS/JS pour production
- Utilisez LocalStorage pour les données fréquentes

---

**Happy Coding! 🎉**
