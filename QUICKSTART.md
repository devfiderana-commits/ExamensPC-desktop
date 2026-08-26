# EXAMENS - Démarrage Rapide ⚡

Lancez l'application EXAMENS en 2 minutes !

## 🚀 Lancer l'application

### Option 1: Mode Web (Sans installation)

**Prérequis** : Python 3 (généralement pré-installé)

```bash
cd examens
python3 -m http.server 8000
```

Puis ouvrez : **http://localhost:8000**

Fonctionne immédiatement avec localStorage comme stockage.

### Option 2: Mode Tauri (Recommandé - Produit final)

**Prérequis** : Node.js 18+ et Rust

```bash
cd examens
npm install
npm run dev
```

Tauri s'ouvre avec une vraie fenêtre desktop et **SQLite comme base de données**.

### Option 3: Avec Scripts

```bash
# Sur Linux/macOS
./dev-server.sh

# Sur Windows
dev-server.bat
```

### Option 4: Avec Makefile (Linux/macOS)

```bash
cd examens
make dev
```

---

## 📚 Première utilisation

1. **Lancez l'application**
2. **Le tableau de bord est vide au démarrage** ← C'est normal !
3. **Allez à "Importer un sujet"**
4. **Sélectionnez un PDF ou une image**
5. **Remplissez les informations**
6. **Cliquez "Importer"**
7. **Explorez le lecteur**

---

## 📥 Importer des sujets

### Formats supportés
- ✅ PDF
- ✅ JPG / JPEG
- ✅ PNG

### Étapes

1. Cliquez sur **"Importer un sujet"** dans la sidebar
2. Remplissez les informations :
   - **Titre** : ex. "Examen Mécanique 2025"
   - **Matière** : Physique, Chimie ou Mathématiques
   - **Chapitre** : ex. "Mécanique", "Dérivées"
   - **Année** : ex. 2025
   - **Session** : Normale, Rattrapage, etc.
3. Sélectionnez le fichier
4. Cliquez **"Importer"**

Les fichiers sont sauvegardés automatiquement et accessibles offline.

---

## 🔍 Utiliser l'application

| Fonctionnalité | Shortcut | Comment faire |
|---|---|---|
| **Recherche** | Ctrl+K | Tapez dans la barre de recherche |
| **Favoris** | Cliquez ⭐ | Sur chaque sujet pour l'épingler |
| **Récents** | Sidebar | Accès rapide aux derniers consultés |
| **Thème** | 🌙 | En haut à droite pour basculer clair/sombre |
| **Paramètres** | ⚙️ | En haut à droite |

---

## 👁️ Lecture de documents

### PDF
- Navigation : boutons **← Préc** et **Suiv →**
- Zoom : **+** / **−** / **Reset**
- Affichage : page actuelle / nombre total

### Images
- Zoom : **+** / **−** / **Reset**

---

## 💾 Stockage des données

### Mode Web
- Stockage : **localStorage du navigateur**
- Persistance : ✅ Survit à la fermeture
- Où : Cache du navigateur

### Mode Tauri
- Stockage : **SQLite database**
- Persistance : ✅ Survit à la fermeture
- Où : `~/.local/share/com.examens.app/examens.db` (Linux)  
       `%APPDATA%\com.examens.app\examens.db` (Windows)

---

## 🌙 Thème sombre

Cliquez sur l'icône 🌙 en haut à droite pour basculer entre mode clair et sombre. Votre préférence est sauvegardée.

---

## ⚙️ Paramètres

Accédez à **Paramètres** (⚙️ en haut à droite) pour :
- Changer le thème
- Configuration de l'application
- Réinitialiser si nécessaire

---

## 📊 Dashboard

Le tableau de bord affiche :
- ✅ Nombre total de sujets
- ✅ Compteurs par matière (Physique, Chimie, Maths)
- ✅ Nombre de favoris
- ✅ Sujets consultés récemment

---

## 🚨 Dépannage rapide

### "Le port 8000 est utilisé"
```bash
# Utilisez un autre port
python3 -m http.server 8001
```

### "Aucune donnée au démarrage"
C'est normal ! L'application démarre vide. Importez vos propres sujets.

### "Les données disparaissent après fermeture"
- **Mode Web** : Vérifiez que localStorage n'est pas effacé
- **Mode Tauri** : Les données SQLite sont persistantes

### "Import ne fonctionne pas"
- En mode web : limitation du navigateur, utilisez Tauri
- En mode Tauri : le fichier doit être PDF/JPG/PNG

---

## 🎓 Exemples d'utilisation

### Cas 1 : Préparer un examen
1. Importer tous les sujets de physique
2. Utiliser la recherche pour filtrer par année
3. Ouvrir les derniers sujets
4. Ajouter aux favoris les plus difficiles

### Cas 2 : Enseigner
1. Importer les sujets par chapitre
2. Partager le classement avec les étudiants
3. Projeter les sujets avec le lecteur PDF
4. Pointer avec les outils du lecteur

### Cas 3 : Révision
1. Ouvrir "Récemment ouverts"
2. Utiliser Ctrl+K pour chercher par année
3. Consulter les favoris pour les plus importants
4. Zoomer sur les parties difficiles

---

## 📖 Prochaines lectures

- [README.md](README.md) - Documentation complète
- [PROJECT_STATUS.md](PROJECT_STATUS.md) - État du projet
- [TEST_SCENARIO.md](TEST_SCENARIO.md) - Scénarios de test
- [FINALISATION_REPORT.md](FINALISATION_REPORT.md) - Rapport technique

---

## 🎯 Mode production (Windows)

1. Téléchargez `examens.msi` depuis les Releases
2. Double-cliquez et installez
3. Lancez depuis le menu Démarrage
4. Aucune configuration requise

L'application fonctionne 100% offline une fois installée.
- Videz le cache du navigateur (Ctrl+Shift+Delete)
- Rechargez la page (Ctrl+R ou Cmd+R)

### "Les données ont disparu"
- Restaurez depuis **Paramètres → Exporter les données**
- Ou réinitialisez avec **Paramètres → Effacer les données**

## 📚 Documentation complète

- `README.md` - Documentation générale
- `DEVELOPMENT.md` - Guide développeur
- `src/js/storage/examRepository.js` - API stockage

## 🚀 Prochaines étapes

Une fois familiarisé avec l'application :

1. **Ajouter vos propres sujets**
   - Cliquez sur ➕ dans le header
   - Sélectionnez vos fichiers PDF/images
   - Remplissez les métadonnées

2. **Exporter vos données**
   - Allez dans Paramètres
   - Cliquez "Exporter les données"
   - Gardez le fichier en sécurité

3. **Développer**
   - Lisez `DEVELOPMENT.md`
   - Modifiez les fichiers dans `src/`
   - Recharger le navigateur pour voir les changements

## 💡 Tips

- Utilisez **Ctrl+K** pour accéder rapidement à la recherche
- Les favoris sont persistants - utilisez ⭐ généreusement
- Le mode sombre est parfait pour étudier tard le soir
- Les récents vous aident à reprendre où vous aviez laissé

## 📞 Besoin d'aide?

1. Vérifiez les logs dans la **Console** (F12)
2. Lisez `DEVELOPMENT.md` pour plus de détails
3. Consultez `README.md` pour la documentation complète

---

**Bon étude ! 📚✨**

Vous êtes maintenant prêt à utiliser EXAMENS. Amusez-vous bien ! 🎉
