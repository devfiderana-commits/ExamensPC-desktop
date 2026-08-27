Oui. Pour ton dépôt **`ExamensPC-desktop`**, il faut surtout corriger plusieurs incohérences de l'ancien README : tu utilises **Tauri 2**, SQLite est déjà intégré, le build GitHub Actions produit des artifacts, et il faut donner des liens de téléchargement clairs.

Voici une version plus professionnelle, adaptée à GitHub, avec **licence MIT**, outils/prérequis et section **Téléchargement**.

# 📚 EXAMENS PC Desktop

<p align="center">
  <strong>Application desktop moderne pour organiser, rechercher et consulter des sujets d'examens.</strong>
</p>

<p align="center">
  <a href="https://github.com/devfiderana-commits/ExamensPC-desktop">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub">
  </a>
  <img src="https://img.shields.io/badge/Tauri-2-24C8DB?style=for-the-badge&logo=tauri" alt="Tauri 2">
  <img src="https://img.shields.io/badge/Rust-Backend-000000?style=for-the-badge&logo=rust" alt="Rust">
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript" alt="JavaScript">
  <img src="https://img.shields.io/badge/SQLite-Local%20Storage-003B57?style=for-the-badge&logo=sqlite" alt="SQLite">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License">
</p>

---

## 📖 Présentation

**EXAMENS PC Desktop** est une application desktop développée avec **Tauri 2, Rust et Vanilla JavaScript**.

Elle permet aux étudiants et aux enseignants de gérer localement une bibliothèque de sujets d'examens de :

* 🔬 Physique
* 🧪 Chimie
* 📐 Mathématiques

L'application fonctionne **hors ligne** et stocke les données localement avec **SQLite**.

L'objectif est de proposer une solution simple, rapide et professionnelle pour centraliser les sujets d'examens sur un ordinateur.

---

## ✨ Fonctionnalités

### 📚 Gestion des sujets

* Ajouter des sujets d'examens
* Modifier les informations d'un sujet
* Supprimer un sujet
* Organiser les sujets par matière
* Organiser les sujets par chapitre
* Associer une année et une session
* Importer des fichiers PDF et images

### 🔎 Recherche et filtrage

* Recherche instantanée
* Recherche par titre
* Recherche par matière
* Recherche par chapitre
* Recherche par année
* Filtrage combiné
* Filtrage des favoris

### ⭐ Organisation personnelle

* Ajouter un sujet aux favoris
* Consulter les sujets récents
* Historique des consultations
* Dashboard avec statistiques

### 📄 Consultation

* Visualisation des documents
* Support des fichiers PDF
* Support des images
* Lecteur intégré

### 🎨 Interface

* Mode clair
* Mode sombre
* Interface responsive
* Navigation rapide
* Design moderne
* Interface adaptée aux écrans desktop

### 🔒 Fonctionnement offline

EXAMENS PC Desktop ne nécessite pas de serveur distant pour fonctionner.

Les données sont conservées localement sur l'ordinateur de l'utilisateur.

> **Aucune connexion Internet n'est nécessaire pour utiliser les fonctionnalités principales de l'application.**

---

# 🖥️ Téléchargement

Vous souhaitez simplement utiliser l'application sans installer l'environnement de développement ?

Téléchargez la dernière version disponible depuis les **Releases GitHub** :

### 🚀 Télécharger EXAMENS PC Desktop

👉 **[Télécharger la dernière version](https://github.com/devfiderana-commits/ExamensPC-desktop/releases/latest)**

Selon votre système d'exploitation, choisissez le fichier correspondant :

| Système    | Format                          |
| ---------- | ------------------------------- |
| 🪟 Windows | `.msi` / `.exe`                 |
| 🐧 Linux   | `.AppImage` / `.deb`            |
| 🍎 macOS   | Selon l'architecture disponible |

> Les fichiers d'installation sont générés automatiquement par **GitHub Actions**.

### 📦 Builds GitHub Actions

Les builds générés automatiquement sont également disponibles dans les artifacts des workflows GitHub Actions.

👉 **[Voir les builds GitHub Actions](https://github.com/devfiderana-commits/ExamensPC-desktop/actions)**

---

# 🛠️ Technologies utilisées

## Frontend

* **HTML5**
* **CSS3**
* **JavaScript Vanilla**
* CSS Variables
* ES Modules

Aucun framework frontend n'est nécessaire.

## Backend / Desktop

* **Tauri 2**
* **Rust**
* **Serde**
* **SQLite**
* **rusqlite**

## Outils de développement

* **Git**
* **GitHub**
* **GitHub Actions**
* **Node.js**
* **npm**
* **Cargo**
* **Rustup**

---

# 🏗️ Architecture

```text
ExamensPC-desktop/
│
├── src/
│   ├── index.html
│   │
│   ├── css/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── responsive.css
│   │
│   └── js/
│       ├── app.js
│       ├── router.js
│       ├── state.js
│       ├── utils.js
│       │
│       ├── storage/
│       │   └── examRepository.js
│       │
│       ├── components/
│       │   ├── sidebar.js
│       │   ├── header.js
│       │   ├── examCard.js
│       │   └── modal.js
│       │
│       └── pages/
│           ├── dashboard.js
│           ├── subject.js
│           ├── favorites.js
│           ├── viewer.js
│           └── settings.js
│
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs
│   │   └── main.rs
│   │
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── icons/
│
├── .github/
│   └── workflows/
│       └── build.yml
│
├── package.json
├── LICENSE
└── README.md
```

---

# 🗄️ Stockage local

L'application utilise **SQLite** pour conserver les informations des examens.

La base est créée automatiquement au premier lancement.

### Données principales

```text
examens
├── id
├── title
├── subject
├── chapter
├── year
├── session
├── file_path
├── file_type
├── date_ajout
└── date_modification

favoris
├── id
├── examen_id
└── date_ajout

historique
├── id
├── examen_id
└── date_ouverture

parametres
├── id
├── cle
└── valeur
```

### 📍 Emplacement

**Windows**

```text
%APPDATA%\com.examens.app\
```

**Linux**

```text
~/.local/share/com.examens.app/
```

**macOS**

```text
~/Library/Application Support/com.examens.app/
```

---

# 🚀 Installation pour développeurs

## Prérequis

Avant de commencer, installez :

* **Node.js 18+**
* **Rust**
* **Cargo**
* **Git**
* Les dépendances système nécessaires à Tauri

### Télécharger les outils

| Outil   | Site officiel                               |
| ------- | ------------------------------------------- |
| Node.js | [nodejs.org](https://nodejs.org/)           |
| Rust    | [rust-lang.org](https://www.rust-lang.org/) |
| Rustup  | [rustup.rs](https://rustup.rs/)             |
| Git     | [git-scm.com](https://git-scm.com/)         |
| Tauri   | [tauri.app](https://tauri.app/)             |
| SQLite  | [sqlite.org](https://sqlite.org/)           |

---

# 📥 Cloner le projet

```bash
git clone https://github.com/devfiderana-commits/ExamensPC-desktop.git

cd ExamensPC-desktop
```

Installer les dépendances :

```bash
npm install
```

---

# 🧪 Développement

Lancer l'application en mode développement :

```bash
npm run tauri dev
```

ou, selon les scripts définis dans `package.json` :

```bash
npm run dev
```

Le mode développement permet de modifier le code et de voir rapidement les changements.

---

# 📦 Compilation

Pour générer une version de production :

```bash
npm run tauri build
```

Les fichiers générés se trouvent généralement dans :

```text
src-tauri/target/release/bundle/
```

Les formats dépendent du système d'exploitation.

---

# 🔄 CI/CD

Le projet utilise **GitHub Actions** pour automatiser la compilation.

Chaque modification poussée sur le dépôt peut déclencher automatiquement le workflow de build.

```text
Developer
    │
    ▼
Git Push
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ├── Linux Build
    │
    └── Windows Build
    │
    ▼
Artifacts
    │
    ▼
Release
```

👉 **[Consulter les workflows](https://github.com/devfiderana-commits/ExamensPC-desktop/actions)**

---

# 🔐 Sécurité

EXAMENS PC Desktop suit le modèle de sécurité de Tauri.

Principes appliqués :

* Validation des entrées utilisateur
* Validation des chemins de fichiers
* Permissions Tauri limitées
* Pas d'exécution arbitraire de code
* Pas d'utilisation d'`eval()`
* Stockage local des données
* Fonctionnement sans serveur distant

La configuration Tauri est disponible dans :

```text
src-tauri/tauri.conf.json
```

---

# 📱 Compatibilité

| Plateforme | Support        |
| ---------- | -------------- |
| 🪟 Windows | ✅              |
| 🐧 Linux   | ✅              |
| 🍎 macOS   | 🔄 Selon build |
| 🤖 Android | 🔜 Prévu       |
| 🍎 iOS     | 🔜 Prévu       |

---

# 🧭 Utilisation

## 1. Ajouter un sujet

Depuis l'application :

```text
Ajouter un sujet
        ↓
Sélectionner le fichier
        ↓
Renseigner les informations
        ↓
Enregistrer
```

Informations disponibles :

* Titre
* Matière
* Chapitre
* Année
* Session
* Fichier

## 2. Rechercher

Utilisez la barre de recherche pour retrouver rapidement un sujet.

Exemples :

```text
2025
Mécanique
Physique
Mathématiques
```

## 3. Favoris

Cliquez sur ⭐ pour ajouter ou retirer un sujet des favoris.

## 4. Consulter un document

Sélectionnez un sujet pour ouvrir son document dans le lecteur intégré.

---

# 📊 Matières prises en charge

## 🔬 Physique

* Mécanique
* Électricité
* Optique
* Thermodynamique

## 🧪 Chimie

* Atomistique
* Thermodynamique
* Chimie organique
* Électrochimie

## 📐 Mathématiques

* Analyse
* Algèbre

---

# 🎨 Personnalisation

L'interface utilise des variables CSS centralisées.

```text
src/css/variables.css
```

Les thèmes clair et sombre peuvent être configurés depuis le système de thème de l'application.

---

# 🧪 Exemple de données

```javascript
{
    id: "exam_1234567890",
    title: "Examen Mécanique - Session 2025",
    subject: "Physique",
    chapter: "Mécanique",
    year: 2025,
    session: "Normale",
    fileType: "pdf",
    favorite: false,
    createdAt: "2025-08-21T10:30:00Z"
}
```

---

# 🗺️ Roadmap

## v0.1.x — Version actuelle

* [x] Gestion des sujets
* [x] Recherche
* [x] Filtres
* [x] Favoris
* [x] Historique
* [x] Dashboard
* [x] Import PDF/images
* [x] SQLite
* [x] Mode sombre
* [x] Mode clair
* [x] Build desktop
* [x] CI/CD GitHub Actions

## v0.2.0

* [ ] Lecteur PDF amélioré
* [ ] Zoom PDF
* [ ] Rotation des images
* [ ] Recherche dans les documents
* [ ] Annotations

## v0.3.0

* [ ] Importation de plusieurs sujets
* [ ] Tags personnalisés
* [ ] Collections
* [ ] Export de données

## v1.0.0

* [ ] Version mobile
* [ ] Export avancé
* [ ] Génération de quiz
* [ ] Synchronisation optionnelle

---

# 🤝 Contribution

Les contributions sont les bienvenues.

### 1. Fork

Forkez le repository :

👉 [ExamensPC-desktop](https://github.com/devfiderana-commits/ExamensPC-desktop)

### 2. Créez une branche

```bash
git checkout -b feature/ma-fonctionnalite
```

### 3. Effectuez vos modifications

```bash
git add .
git commit -m "feat: ajout de ma fonctionnalité"
```

### 4. Poussez votre branche

```bash
git push origin feature/ma-fonctionnalite
```

### 5. Ouvrez une Pull Request

Décrivez clairement :

* ce qui a été ajouté ;
* ce qui a été modifié ;
* comment tester la modification.

---

# 📄 Licence

Ce projet est distribué sous licence **MIT**.

Vous pouvez :

* utiliser le logiciel ;
* copier le logiciel ;
* modifier le logiciel ;
* distribuer le logiciel ;
* utiliser le logiciel à des fins commerciales.

Sous réserve de conserver la notice de copyright et la licence.

Voir le fichier [`LICENSE`](./LICENSE).

---

# 👨‍💻 Auteur

**RATIARISON Fanilo Fiderana**

Développeur / Étudiant en informatique

GitHub :

👉 [@devfiderana-commits](https://github.com/devfiderana-commits)

Projet :

👉 [ExamensPC-desktop](https://github.com/devfiderana-commits/ExamensPC-desktop)

---

# 📚 Documentation & Outils

* [Tauri](https://tauri.app/) — Framework desktop
* [Rust](https://www.rust-lang.org/) — Backend système
* [MDN Web Docs](https://developer.mozilla.org/) — HTML, CSS et JavaScript
* [SQLite](https://sqlite.org/) — Base de données embarquée
* [Node.js](https://nodejs.org/) — Environnement JavaScript
* [Git](https://git-scm.com/) — Contrôle de version
* [GitHub Actions](https://github.com/features/actions) — CI/CD

---

<p align="center">

<strong>EXAMENS PC Desktop</strong>

<br>

Organisez vos sujets. Retrouvez-les rapidement. Étudiez efficacement.

<br><br>

Made with ❤️ using Tauri 🦀 + Rust + Vanilla JavaScript

</p>
