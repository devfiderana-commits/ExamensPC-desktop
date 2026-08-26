# 📁 EXAMENS - Structure du Projet

```
examens/
│
├── 📄 Files de Configuration
│   ├── package.json              ← Dépendances Node
│   ├── Makefile                  ← Commandes pratiques
│   ├── .gitignore               ← Fichiers à ne pas committer
│   └── README.md                ← Documentation principale
│
├── 📚 Documentation
│   ├── QUICKSTART.md            ← Démarrage en 2 min
│   ├── DEVELOPMENT.md           ← Guide développeur
│   ├── PROJECT_STATUS.md        ← État du projet
│   └── STRUCTURE.md             ← Ce fichier
│
├── 🚀 Scripts de Lancement
│   ├── dev-server.sh            ← Serveur dev Linux/macOS
│   └── dev-server.bat           ← Serveur dev Windows
│
├── src/                          ← APPLICATION WEB
│   │
│   ├── 📄 index.html            ← Point d'entrée HTML
│   │
│   ├── css/                      ← Feuilles de styles
│   │   ├── reset.css            ← Réinitialisation CSS
│   │   ├── variables.css        ← Thèmes & couleurs
│   │   ├── layout.css           ← Disposition générale
│   │   ├── components.css       ← Composants réutilisables
│   │   └── responsive.css       ← Media queries (mobile/tablet)
│   │
│   └── js/                       ← CODE JAVASCRIPT
│       │
│       ├── 🎯 Noyau
│       │   ├── app.js           ← Initialisation application
│       │   ├── router.js        ← Gestion navigation
│       │   ├── state.js         ← État global (thème, filtres)
│       │   ├── utils.js         ← 20+ fonctions utilitaires
│       │   └── tauri-shim.js    ← Compatibilité web
│       │
│       ├── 💾 Stockage
│       │   └── storage/
│       │       └── examRepository.js  ← Logique métier & données
│       │
│       ├── 🧩 Composants Réutilisables
│       │   └── components/
│       │       ├── sidebar.js   ← Navigation latérale
│       │       ├── header.js    ← Barre supérieure
│       │       ├── examCard.js  ← Carte de sujet
│       │       └── modal.js     ← Dialogues modaux
│       │
│       └── 📄 Pages/Vues
│           └── pages/
│               ├── dashboard.js     ← Tableau de bord
│               ├── subject.js       ← Physique/Chimie/Maths
│               ├── favorites.js     ← Favoris & Récents
│               ├── viewer.js        ← Lecteur documents
│               └── settings.js      ← Paramètres
│
├── src-tauri/                    ← APPLICATION DESKTOP (Tauri)
│   │
│   ├── src/                      ← Code Rust
│   │   ├── lib.rs              ← Logique backend
│   │   └── main.rs             ← Point d'entrée Tauri
│   │
│   ├── Cargo.toml              ← Dépendances Rust
│   ├── tauri.conf.json         ← Configuration Tauri
│   │
│   ├── icons/                  ← Icônes application
│   │   ├── 32x32.png
│   │   ├── 128x128.png
│   │   ├── icon.icns           ← macOS
│   │   └── icon.ico            ← Windows
│   │
│   └── capabilities/           ← Sécurité Tauri (à completer)
│
├── .github/                      ← CI/CD
│   └── workflows/
│       └── build.yml           ← Compilation auto GitHub Actions
│
└── 📊 Données & Cache
    ├── node_modules/           ← (généré par npm install)
    └── src-tauri/target/       ← (généré par cargo build)
```

## 🎯 Flux de l'Application

```
index.html
    ↓
app.js (Initialisation)
    ↓
┌─────────────────────────────────┐
│  Composants globaux             │
├─────────────────────────────────┤
│  • sidebar (navigation)         │
│  • header (recherche + actions) │
│  • content (zone principale)    │
└─────────────────────────────────┘
    ↓
Router (Navigation entre pages)
    ↓
State (État global: thème, filtres)
    ↓
Pages (render())
    ↓
ExamRepository (getData)
    ↓
localStorage (Persistance)
```

## 📋 Hiérarchie des Fichiers

### Pages

```
Dashboard
├─ Statistiques (totalExams, bySubject, favorites)
└─ Sujets récents

Subject (Physics, Chemistry, Mathematics)
├─ Breadcrumb (navigation)
├─ Filtres par chapitre
└─ Grille de sujets

Favorites
└─ Sujets marqués ⭐

Recent
└─ Historique d'ouvertures

Viewer
├─ Métadonnées sujet
├─ Lecteur document
└─ Boutons actions

Settings
├─ Apparence (thème)
├─ Application (notifications)
├─ Stockage (export/import)
└─ À propos
```

### Composants

```
Sidebar
├─ Logo
├─ Menu principal
│   ├─ Dashboard
│   ├─ Matières (avec sous-menus)
│   ├─ Favoris
│   ├─ Récents
│   └─ Paramètres
└─ Footer (toggle menu)

Header
├─ Barre de recherche
└─ Boutons action
    ├─ Ajouter sujet
    ├─ Importer
    ├─ Thème
    └─ Menu

ExamCard
├─ Titre + sous-titre
├─ Métadonnées (année, session, type)
└─ Actions (ouvrir, favori)

Modal
├─ Header (titre + close)
├─ Body (contenu)
└─ Footer (boutons)
```

## 🔄 Flux de Données

```
┌──────────────────────────────────────────┐
│  localStorage                            │
│  (examRepository.getExams())             │
└──────────────────────────────────────────┘
           ↑        ↓
           │        │
┌──────────────────────────────────────────┐
│  ExamRepository (logique métier)         │
│  • addExam()                             │
│  • updateExam()                          │
│  • toggleFavorite()                      │
│  • searchExams()                         │
└──────────────────────────────────────────┘
           ↑        ↓
           │        │
┌──────────────────────────────────────────┐
│  State (état global)                     │
│  • theme                                 │
│  • searchQuery                           │
│  • filters                               │
│  • isMenuOpen                            │
└──────────────────────────────────────────┘
           ↑        ↓
           │        │
┌──────────────────────────────────────────┐
│  Pages & Composants                      │
│  • render() -> HTML                      │
│  • attachListeners() -> Events           │
└──────────────────────────────────────────┘
           ↑        ↓
           │        │
┌──────────────────────────────────────────┐
│  Router (navigation)                     │
│  • navigate(pageName, params)            │
│  • goBack()                              │
└──────────────────────────────────────────┘
           ↑        ↓
           │        │
┌──────────────────────────────────────────┐
│  DOM / Utilisateur                       │
└──────────────────────────────────────────┘
```

## 🎨 Architecture CSS

```
reset.css
│
├─ Réinitialisation globale
├─ Scrollbars personnalisées
└─ Typos de base

variables.css
│
├─ :root (thème clair)
│   ├─ Couleurs
│   ├─ Espacements
│   ├─ Radius
│   └─ Shadows
│
└─ .dark-theme (thème sombre)
    └─ Overrides

layout.css
│
├─ .layout (flexbox principal)
├─ .sidebar
├─ .main-wrapper
├─ .header
├─ .content
└─ Breadcrumb & page-header

components.css
│
├─ Buttons
├─ Cards
├─ Inputs
├─ Tags/Badges
├─ Modals
├─ Grilles
└─ Animations

responsive.css
│
├─ @media (max-width: 1024px) - Tablet
├─ @media (max-width: 640px) - Mobile
├─ @media (max-width: 480px) - Small mobile
├─ @media (hover: none) - Touch devices
└─ @media (min-width: 1440px) - Large screens
```

## 📦 Dépendances

```
Frontend:
  - Aucune! (Vanilla JS 100%)
  - Les imports ES6 natifs du navigateur

Backend (Tauri):
  - Rust 1.60+
  - Tauri 2.0
  - Serde (JSON)
  - Tokio (async)

Build:
  - Node.js 18+ (optionnel)
  - npm (optionnel)
  - Cargo (Rust package manager)
  - Python 3 (dev server)

CI/CD:
  - GitHub Actions
  - Runners: Ubuntu, Windows
```

## 🗂️ Organisation Logique

```
User-Facing:
  Dashboard → Statistiques globales
  Subjects → Exploration par matière
  Favorites → Accès rapide
  Recent → Historique
  Settings → Configuration

Technical:
  app.js → État initial
  router.js → Navigation
  state.js → Réactivité
  examRepository.js → Persistance
  components/ → Réutilisabilité
  utils.js → Fonctions communes
```

## 🔐 Sécurité

```
Données:
  ├─ localStorage (user domain only)
  ├─ Pas de données sensibles
  └─ Validation des entrées

Code:
  ├─ Pas d'eval()
  ├─ Pas d'innerHTML (innerHTML seulement avec sanitization)
  ├─ CSP stricte
  └─ Validation fichiers

Tauri:
  ├─ Permissions minimales
  ├─ Fs access restrictif
  └─ IPC securisé
```

## 📊 Tailles Approximatives

```
CSS:
  - reset.css: ~40 lignes
  - variables.css: ~100 lignes
  - layout.css: ~250 lignes
  - components.css: ~400 lignes
  - responsive.css: ~200 lignes
  Total: ~990 lignes

JavaScript:
  - app.js: ~80 lignes
  - router.js: ~60 lignes
  - state.js: ~80 lignes
  - utils.js: ~280 lignes
  - examRepository.js: ~350 lignes
  - components/: ~350 lignes
  - pages/: ~500 lignes
  Total: ~1700 lignes

HTML:
  - index.html: ~40 lignes

Documentation:
  - README.md: ~500 lignes
  - DEVELOPMENT.md: ~400 lignes
  - QUICKSTART.md: ~200 lignes
  - STRUCTURE.md: ~300 lignes
```

## 🚀 Exécution

```
Development:
  python3 -m http.server 8000
  → Ouvrir http://localhost:8000

Testing:
  → Ouvrir DevTools (F12)
  → Console: window.examRepository, window.state, etc.

Building:
  npm install
  npm run build
  → Fichiers dans src-tauri/target/release/bundle/
```

## 🔄 Extension

Pour ajouter une nouvelle fonctionnalité :

1. **Nouvelle page** ?
   → Créer `src/js/pages/newpage.js`
   → Enregistrer dans `app.js`

2. **Nouveau composant** ?
   → Créer `src/js/components/newcomponent.js`
   → Utiliser dans les pages

3. **Nouvelle fonction utile** ?
   → Ajouter dans `src/js/utils.js`
   → Importer partout où nécessaire

4. **Nouveaux styles** ?
   → Ajouter dans `src/css/components.css`
   → Utiliser les variables CSS

5. **Nouveau endpoint Tauri** ?
   → Ajouter `#[tauri::command]` dans `src-tauri/src/lib.rs`
   → Appeler via `invoke()` depuis JS

---

**Dernière mise à jour**: Août 2025
**Version**: 0.1.0
