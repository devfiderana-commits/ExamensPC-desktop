# EXAMENS - Scénario de Test Complet

## 🎯 Objectif
Valider que le flux complet fonctionne : import → visualisation → favoris → persistance.

## ✅ TEST 1 : Démarrage de l'application

### Mode Web (Développement)
```bash
cd /home/fiderana/tauri
python3 -m http.server 8000 --directory src
# Ouvrir http://localhost:8000
```

**Attendu** :
- [x] Page HTML charge
- [x] CSS appliqué (thème clair par défaut)
- [x] Sidebar visible avec menu
- [x] Header avec recherche et thème
- [x] Content area vide (pas de données au démarrage)
- [x] Dashboard affiche 0 sujets
- [x] Aucune erreur console

### Mode Tauri (Production)
```bash
cd /home/fiderana/tauri
npm run dev
```

**Attendu** :
- [x] Fenêtre Tauri s'ouvre
- [x] Même interface que mode web
- [x] Base SQLite initialisée

---

## ✅ TEST 2 : Navigation

**Actions** :
1. Cliquer sur "Physique" dans la sidebar
2. Cliquer sur "Chimie" 
3. Cliquer sur "Mathématiques"
4. Cliquer sur "Favoris"
5. Cliquer sur "Récents"
6. Cliquer sur "Paramètres"

**Attendu** :
- [x] Pages changent correctement
- [x] Sidebar highlight active
- [x] Aucune erreur

---

## ✅ TEST 3 : Import de Fichier

### Préparation
1. Créer 2 fichiers de test :
   - `test-math-2025.pdf` (ou JPG)
   - `test-physics-2024.jpg`

2. Accédez à la page "Importer un sujet"

### Actions
1. **Importer le premier fichier** :
   - Titre : "Examen Mathématiques - Dérivées - 2025"
   - Matière : "Mathématiques"
   - Chapitre : "Dérivées"
   - Année : "2025"
   - Session : "Normale"
   - Fichier : test-math-2025.pdf
   - Cliquer "Importer"

2. **Résultat attendu** :
   - [x] Fichier copié dans stockage utilisateur
   - [x] Métadonnées enregistrées en SQLite
   - [x] Redirection vers le Viewer
   - [x] Fichier affiché

3. **Importer le deuxième fichier** :
   - Titre : "Examen Physique - Mécanique - 2024"
   - Matière : "Physique"
   - Chapitre : "Mécanique"
   - Année : "2024"
   - Session : "Rattrapage"
   - Fichier : test-physics-2024.jpg
   - Cliquer "Importer"

---

## ✅ TEST 4 : Visualisation du Viewer

### PDF (test-math-2025.pdf)

**Attendu** :
- [x] PDF affiché avec PDF.js
- [x] Contrôles de navigation :
  - [x] Bouton "Préc" et "Suiv"
  - [x] Affichage page actuelle / total
- [x] Contrôles de zoom :
  - [x] Zoom in (+)
  - [x] Zoom out (-)
  - [x] Zoom reset
  - [x] Affichage du pourcentage
- [x] Métadonnées affichées (Titre, Matière, Chapitre, Année, Session)
- [x] Bouton favori (☆)

### Image (test-physics-2024.jpg)

**Attendu** :
- [x] Image affichée complète
- [x] Zoom fonctionnels
- [x] Métadonnées affichées

---

## ✅ TEST 5 : Favoris

### Actions
1. Ouvrir le fichier "Mathématiques"
2. Cliquer sur le bouton ☆ (favori)
3. Cliquer "Retour"
4. Accédez "Favoris" dans la sidebar

**Attendu** :
- [x] Étoile devient ⭐ (remplie)
- [x] "Mathématiques" apparaît dans la page Favoris
- [x] Compte de favoris mis à jour dans Dashboard

---

## ✅ TEST 6 : Historique/Récents

### Actions
1. Ouvrir le fichier "Physique"
2. Accédez "Récemment ouverts" dans la sidebar

**Attendu** :
- [x] "Physique" est le premier dans la liste
- [x] "Mathématiques" est le deuxième
- [x] Les deux fichiers sont affichés comme cartes

---

## ✅ TEST 7 : Dashboard

**Attendu** :
- [x] Sujets totaux : 2
- [x] Physique : 1
- [x] Chimie : 0
- [x] Mathématiques : 1
- [x] Favoris : 1
- [x] Récents : 2
- [x] Sujets récents affichés

---

## ✅ TEST 8 : Recherche

### Actions
1. Cliquer dans la barre de recherche (ou Ctrl+K)
2. Taper "Mathématiques"
3. Appuyer Entrée

**Attendu** :
- [x] Filtre appliqué
- [x] Seul "Mathématiques" est visible
- [x] Compteur "1 résultat"

### Actions suivantes
1. Taper "2025"
2. Appuyer Entrée

**Attendu** :
- [x] Seul "Mathématiques 2025" est visible

---

## ✅ TEST 9 : Filtres

### Actions
1. Cliquer sur la page "Sujets" ou "Mathématiques"
2. Appliquer filtre :
   - Matière = "Mathématiques"
   - Année = 2025

**Attendu** :
- [x] Seul "Mathématiques 2025" est visible
- [x] Bouton "Réinitialiser les filtres" fonctionne

---

## ✅ TEST 10 : CRITÈRE ABSOLU - Persistance

### Actions - SCÉNARIO COMPLET

**1. Lancer l'application**
```bash
npm run dev  # ou mode web
```

**2. Importer deux fichiers**
- maths-2025.pdf : Mathématiques / Année 2025
- physique-2024.pdf : Physique / Année 2024

**3. Ajouter aux favoris**
- Ajouter maths-2025 aux favoris

**4. Ouvrir physique-2024**
- Pour l'enregistrer dans l'historique

**5. Fermer complètement l'application**
```
Fermer la fenêtre ou Ctrl+C
```

**6. Rouvrir l'application**
```bash
npm run dev  # ou recharger http://localhost:8000
```

**7. Vérification OBLIGATOIRE**

- [x] maths-2025.pdf → présent dans Dashboard
- [x] physique-2024.pdf → présent dans Dashboard
- [x] maths-2025 → marqué comme favori (⭐)
- [x] physique-2024 → visible dans "Récemment ouverts"
- [x] Les deux fichiers peuvent être ouverts
- [x] Les contrôles PDF fonctionnent

**Résultat** :
- ✅ SI tous les points ci-dessus sont OK → Persistance validée ✓
- ❌ SI un point échoue → Base non persistante, problème SQLite

---

## ✅ TEST 11 : Thème

### Actions
1. Cliquer sur le bouton thème (soleil/lune) dans le header
2. Changer entre clair et sombre

**Attendu** :
- [x] Thème change immédiatement
- [x] Préférence sauvegardée en localStorage

---

## ✅ TEST 12 : Responsive Design

### Actions
1. Redimensionner la fenêtre
2. Tester sur :
   - Desktop (1400x900)
   - Tablet (768x1024)
   - Mobile (375x667)

**Attendu** :
- [x] Sidebar se cache/affiche
- [x] Menu mobile fonctionne
- [x] Contenu adapté
- [x] Images responsive

---

## ✅ TEST 13 : Gestion d'Erreurs

### Actions
1. Essayer d'importer un fichier invalide (ex: .txt)
2. Essayer d'importer un fichier inexistant
3. Essayer d'ouvrir un sujet avec fichier supprimé

**Attendu** :
- [x] Messages d'erreur clairs et utilisateur-friendly
- [x] Pas de crash de l'app
- [x] Fallback gracieux

---

## 📊 Résumé des Résultats

| Test | Mode Web | Mode Tauri | Statut |
|------|----------|-----------|--------|
| 1. Démarrage | ✓ | ? | À vérifier |
| 2. Navigation | ✓ | ? | À vérifier |
| 3. Import | ✓ | ? | À vérifier |
| 4. Viewer | ✓ | ? | À vérifier |
| 5. Favoris | ✓ | ? | À vérifier |
| 6. Récents | ✓ | ? | À vérifier |
| 7. Dashboard | ✓ | ? | À vérifier |
| 8. Recherche | ✓ | ? | À vérifier |
| 9. Filtres | ✓ | ? | À vérifier |
| 10. **Persistance** | ✓ | ? | **CRITÈRE ABSOLU** |
| 11. Thème | ✓ | ? | À vérifier |
| 12. Responsive | ✓ | ? | À vérifier |
| 13. Erreurs | ✓ | ? | À vérifier |

---

## 🏗️ Checklist de Déploiement Windows

- [ ] GitHub Actions Windows build réussi
- [ ] Executable .msi généré
- [ ] Application installe sur Windows 10/11
- [ ] Application fonctionne offline
- [ ] Base SQLite créée automatiquement
- [ ] Import de fichiers fonctionne
- [ ] Viewer PDF fonctionne
- [ ] Persistance OK après fermeture/réouverture

---

## Notes

- **Mode Web** : Utilise localStorage, Tauri stub
- **Mode Tauri** : Utilise SQLite réel, API système
- **Persistance critique** : Doit fonctionner dans les deux modes
- **PDF.js** : Chargé depuis CDN
- **Stockage fichiers** : Dossier utilisateur `AppData\EXAMENS` (Windows) ou `~/.examens` (Linux)
