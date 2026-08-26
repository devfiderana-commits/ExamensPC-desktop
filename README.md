# EXAMENS - Application Desktop de Gestion des Sujets d'Examens

Une application Desktop moderne, offline et responsive pour organiser et consulter une bibliothèque de vrais sujets d'examens de Physique, Chimie et Mathématiques.

## 🎯 Objectif

**EXAMENS** permet aux étudiants et aux enseignants de gérer localement une collection de vrais sujets d'examens, offrant une interface professionnelle, rapide et 100% offline.

## ✨ Fonctionnalités principales

- ✅ **Gestion complète des sujets** : organiser par matière et chapitre
- ✅ **Recherche rapide** : recherche instantanée par titre, matière, année, etc.
- ✅ **Filtres avancés** : combiner plusieurs critères de filtrage
- ✅ **Favoris** : marquer et retrouver facilement vos sujets préférés
- ✅ **Récents** : accès rapide aux sujets consultés
- ✅ **Dashboard statistique** : vue d'ensemble de votre bibliothèque
- ✅ **Lecteur de documents** : visualiser PDFs et images
- ✅ **Mode sombre/clair** : interface adaptée à vos préférences
- ✅ **Responsive** : fonctionne sur desktop, tablette et préparation mobile
- ✅ **100% Offline** : aucune connexion internet requise
- ✅ **Stockage local** : données persistantes et sécurisées

## 🏗️ Architecture

```
EXAMENS/
├── src/                          # Frontend (HTML/CSS/JS)
│   ├── index.html               # Fichier principal
│   ├── css/                      # Feuilles de styles
│   │   ├── reset.css
│   │   ├── variables.css         # Thèmes et variables
│   │   ├── layout.css            # Disposition principale
│   │   ├── components.css        # Composants réutilisables
│   │   └── responsive.css        # Media queries
│   └── js/                       # Logique JavaScript
│       ├── app.js               # Point d'entrée
│       ├── router.js            # Navigation
│       ├── state.js             # État global
│       ├── utils.js             # Fonctions utilitaires
│       ├── storage/
│       │   └── examRepository.js # Stockage et logique métier
│       ├── components/          # Composants réutilisables
│       │   ├── sidebar.js
│       │   ├── header.js
│       │   ├── examCard.js
│       │   └── modal.js
│       └── pages/               # Pages/vues
│           ├── dashboard.js
│           ├── subject.js
│           ├── favorites.js
│           ├── viewer.js
│           └── settings.js
├── src-tauri/                    # Backend Rust/Tauri
│   ├── src/
│   │   ├── lib.rs              # Logique Tauri
│   │   └── main.rs             # Point d'entrée
│   ├── Cargo.toml              # Dépendances Rust
│   ├── tauri.conf.json         # Configuration Tauri
│   └── icons/                  # Icônes application
├── .github/
│   └── workflows/
│       └── build.yml           # CI/CD GitHub Actions
├── package.json                # Dépendances Node
└── README.md                   # Cette documentation
```

## 🚀 Installation et Développement

### Prérequis

- **Node.js** 18+ ([télécharger](https://nodejs.org/))
- **Rust** 1.60+ ([installer via rustup](https://rustup.rs/))
- **Ubuntu/Debian** : dépendances système
- **Git** pour le contrôle de version

### Installation sur Ubuntu

```bash
# 1. Installer les dépendances système
sudo apt-get update
sudo apt-get install -y \
  curl \
  wget \
  build-essential \
  libssl-dev \
  libglib2.0-0 \
  libxkbcommon-x11-0 \
  libayatana-appindicator3-1 \
  libgtk-3-0

# 2. Installer Rust (si non déjà installé)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 3. Installer Node.js (si non déjà installé)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Installer Tauri CLI globalement (optionnel mais recommandé)
npm install -g @tauri-apps/cli@latest

# 5. Cloner le repository
git clone https://github.com/votre-username/examens.git
cd examens

# 6. Installer les dépendances Node
npm install
```

### Démarrer en développement

```bash
# Lancer l'application en mode développement avec rechargement automatique
npm run dev

# Ou avec Tauri CLI directement
tauri dev
```

L'application s'ouvrira automatiquement dans une fenêtre Tauri.

### Build pour production

```bash
# Créer une build optimisée
npm run build

# Ou en debug
npm run build:debug
```

Les fichiers compilés seront disponibles dans `src-tauri/target/release/bundle/`.

## 📚 Structure de données

### Sujet d'examen

```js
{
  id: "exam_1234567890_abc123def",
  title: "Examen Mécanique - Session 2025",
  subject: "Physique",              // Physique, Chimie, Mathématiques
  chapter: "Mécanique",              // Dépend de la matière
  year: 2025,
  session: "Normale",                // Normale, Rattrapage
  filePath: "/path/to/file.pdf",     // Chemin local (vide pour démo)
  fileType: "pdf",                   // pdf, png, jpg, etc.
  favorite: false,
  createdAt: "2025-08-21T10:30:00Z",
  lastOpenedAt: null
}
```

### Matières et chapitres

**Physique**
- Mécanique
- Électricité
- Optique
- Thermodynamique

**Chimie**
- Atomistique
- Thermodynamique
- Organique
- Électrochimie

**Mathématiques**
- Analyse
- Algèbre

## 🎨 Thèmes et Customisation

### Mode sombre/clair

Les thèmes sont implémentés via CSS variables dans `src/css/variables.css`. Basculez entre les modes :

```js
state.setTheme('dark');   // Mode sombre
state.setTheme('light');  // Mode clair
```

### Personnalisation des couleurs

Modifiez les variables CSS dans `src/css/variables.css` :

```css
:root {
    --color-primary: #0d6efd;
    --color-bg: #ffffff;
    /* ... */
}

body.dark-theme {
    --color-primary: #4a9eff;
    --color-bg: #1a1a1a;
    /* ... */
}
```

## 🔍 Utilisation

### Navigation principale

- **Tableau de bord** : vue d'ensemble avec statistiques
- **Physique/Chimie/Maths** : consultez les sujets par matière
- **Favoris** : accédez à vos sujets épinglés
- **Récents** : consultez l'historique
- **Paramètres** : configuration de l'application

### Recherche et filtres

```js
// Recherche instantanée
state.setSearchQuery('2025');           // Cherche l'année 2025
state.setSearchQuery('mécanique');      // Cherche le chapitre
state.setSearchQuery('physique 2024');  // Combinaison

// Filtres
state.updateFilter('subject', 'Physique');
state.updateFilter('chapter', 'Mécanique');
state.updateFilter('year', 2025);
state.updateFilter('isFavorite', true);
```

### Importer des sujets

1. Cliquez sur **➕ Ajouter un sujet**
2. Sélectionnez un PDF ou une image
3. Remplissez les informations :
   - Titre
   - Matière
   - Chapitre
   - Année
   - Session
4. Confirmez

### Ajouter aux favoris

Cliquez sur **⭐** sur une carte de sujet pour l'ajouter/retirer des favoris.

## 🛠️ Développement

### Ajouter une nouvelle page

1. Créez un fichier dans `src/js/pages/` :

```js
// src/js/pages/myPage.js
export class MyPage {
    constructor(params = {}) {
        this.params = params;
    }

    async render() {
        return `<div>Contenu de ma page</div>`;
    }

    cleanup() {
        // Nettoyage si nécessaire
    }
}
```

2. Enregistrez dans `src/js/app.js` :

```js
router.registerPage('mypage', MyPage);
```

3. Naviguez :

```js
router.navigate('mypage', { param: 'value' });
```

### Ajouter un composant réutilisable

1. Créez le composant dans `src/js/components/` :

```js
// src/js/components/myComponent.js
export class MyComponent {
    static render(data) {
        return `<div>${data}</div>`;
    }

    static attachListeners() {
        // Attachez les event listeners
    }
}
```

### Accéder au storage

```js
import examRepository from './storage/examRepository.js';

// Récupérer tous les sujets
const allExams = examRepository.getExams();

// Ajouter un sujet
const newExam = examRepository.addExam({
    title: 'Titre',
    subject: 'Physique',
    chapter: 'Mécanique',
    year: 2025,
    session: 'Normale',
    fileType: 'pdf'
});

// Mettre à jour
examRepository.updateExam(id, { favorite: true });

// Supprimer
examRepository.deleteExam(id);

// Rechercher
const results = examRepository.searchExams('2025');
```

## 🔐 Sécurité

L'application respecte le modèle de sécurité Tauri :

- ✅ Content Security Policy stricte
- ✅ Validation des chemins de fichiers
- ✅ Pas d'`eval()` ou exécution de code arbitraire
- ✅ Permissions Tauri minimales
- ✅ Validation des entrées utilisateur
- ✅ Pas de données sensibles en localStorage

Consultez `src-tauri/tauri.conf.json` pour les permissions.

## 📱 Responsive Design

L'application s'adapte automatiquement :

- **Desktop** (>1024px) : layout complet avec sidebar
- **Tablette** (768-1024px) : sidebar en menu hamburger
- **Mobile** (<768px) : interface tactile optimisée

Testez avec :

```bash
# Ouvrir les DevTools dans Tauri
Ctrl+Shift+I (Linux/Windows) ou Cmd+Option+I (macOS)
```

## 🚀 Préparation Mobile (Android/iOS)

L'architecture est prête pour une version mobile :

```
UI (agnostique de la plateforme)
    ↓
Services (logique métier)
    ↓
Storage abstraction
    ↓
Native Tauri (desktop/mobile)
```

Pour ajouter Android/iOS, mettez à jour `.github/workflows/build.yml` :

```yaml
build-android:
  runs-on: ubuntu-latest
  # Configuration pour Android...

build-ios:
  runs-on: macos-latest
  # Configuration pour iOS...
```

## 🔄 CI/CD avec GitHub Actions

Le workflow `build.yml` compile automatiquement pour :

- ✅ Ubuntu Linux
- ✅ Windows 11+
- 🔜 Android (à configurer)
- 🔜 iOS (à configurer)

Poussez sur `main` ou `develop` pour déclencher le build.

## 📝 Données de démonstration

L'application est prête pour accepter vos propres sujets via import. Aucune données de démonstration n'est incluse par défaut.

Pour commencer :
1. Ouvrez l'application
2. Allez à **Importer un sujet**
3. Sélectionnez un PDF ou une image
4. Remplissez les informations
5. Les données sont sauvegardées automatiquement en SQLite

## 💾 Stockage persistant avec SQLite

L'application utilise SQLite pour la persistance des données :

### Localisation de la base de données

- **Windows** : `%APPDATA%\com.examens.app\examens.db`
- **Linux** : `~/.local/share/com.examens.app/examens.db`
- **macOS** : `~/Library/Application Support/com.examens.app/examens.db`

### Structure de la base

```
examens.db
├── examens (table)
│   ├── id (TEXT PRIMARY KEY)
│   ├── title (TEXT)
│   ├── subject (TEXT)
│   ├── chapter (TEXT)
│   ├── year (INTEGER)
│   ├── session (TEXT)
│   ├── file_path (TEXT)
│   ├── file_type (TEXT)
│   ├── date_ajout (TEXT)
│   └── date_modification (TEXT)
├── favoris (table)
│   ├── id (TEXT PRIMARY KEY)
│   ├── examen_id (TEXT FOREIGN KEY → examens.id)
│   └── date_ajout (TEXT)
├── historique (table)
│   ├── id (TEXT PRIMARY KEY)
│   ├── examen_id (TEXT FOREIGN KEY → examens.id)
│   └── date_ouverture (TEXT)
└── parametres (table)
    ├── id (TEXT PRIMARY KEY)
    ├── cle (TEXT UNIQUE)
    └── valeur (TEXT)
```

### Pas d'installation externe requise

SQLite est bundled avec `rusqlite`, donc **aucune installation de base de données n'est requise**. L'application crée automatiquement la base au premier lancement.

## 🪟 Installation sur Windows

### Méthode 1 : Build GitHub Actions (Recommandé)

1. Attendez le build automatique sur `main`
2. Téléchargez l'executable `.msi` depuis les Releases
3. Double-cliquez pour installer
4. EXAMENS s'ajoute au menu Démarrage

### Méthode 2 : Build local

```powershell
# 1. Installer Node.js
# Télécharger depuis https://nodejs.org/

# 2. Installer Rust
# Télécharger depuis https://rustup.rs/ et exécuter

# 3. Cloner et installer
git clone https://github.com/votre-username/examens.git
cd examens
npm install

# 4. Build
npm run build

# 5. Executable dans src-tauri/target/release/bundle/msi/
```

### Démarrage sur Windows

Une fois installé, lancez l'application depuis :
- Menu Démarrage → EXAMENS
- Raccourci bureau (si créé pendant l'installation)

L'application s'initialise automatiquement. Aucune configuration requise.

### Fichiers stockés sur Windows

- Base de données : `%APPDATA%\com.examens.app\examens.db`
- Documents : `%APPDATA%\com.examens.app\documents\`

Ces dossiers sont créés automatiquement au premier démarrage.

## 🐛 Débogage

### Console et outils de développement

```bash
# Ouvrir la console de développement
Ctrl+Shift+I
```

### Objets globaux disponibles

```js
window.app              // Instance App
window.state            // État global
window.examRepository   // Accès au stockage
window.router           // Routeur
```

### Logs

```js
// Export des données pour débogage
console.log(examRepository.getExams());
console.log(state.getState());
```

## 📦 Dépendances

### Frontend
- HTML5 / CSS3 / JavaScript Vanilla (aucun framework)
- **@tauri-apps/api** : communication avec le backend

### Backend
- **Tauri 2** : framework desktop
- **Rust 1.60+** : langage backend
- **Serde** : sérialisation JSON

### Build
- **Node.js 18+** : outils frontend
- **npm** : gestionnaire de packages
- **Cargo** : gestionnaire de packages Rust

## 🤝 Contribution

Pour contribuer :

1. Fork le repository
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Poussez vers votre branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support et Questions

Pour les questions ou les problèmes :

1. Vérifiez les issues GitHub existantes
2. Ouvrez une nouvelle issue avec :
   - Description détaillée du problème
   - Étapes pour reproduire
   - Environnement (OS, version Node, etc.)
   - Logs de console

## 🎓 Ressources d'apprentissage

- [Documentation Tauri](https://tauri.app/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [JavaScript Vanilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 📈 Feuille de route

### v0.2.0 (Prochainement)
- [ ] Lecteur PDF complet avec zoom
- [ ] Lecture d'images avec rotation
- [ ] Recherche full-text dans les PDFs
- [ ] Support des annotations

### v0.3.0
- [ ] Synchronisation en cloud optionnelle
- [ ] Partage de collections
- [ ] Tags et catégories personnalisées
- [ ] Importation en batch

### v1.0.0
- [ ] Version mobile (Android/iOS)
- [ ] Base de données SQLite
- [ ] Export PDF personnalisé
- [ ] Génération de quizzes

## 👨‍💻 Auteur

Créé avec ❤️ pour les étudiants et les enseignants.

---

**Version** : 0.1.0  
**Dernière mise à jour** : Août 2025

Made with Tauri 🦀 + Vanilla JavaScript 💛
# ExamensPC-desktop
