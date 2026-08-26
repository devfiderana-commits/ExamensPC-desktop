# EXAMENS - Guide d'Installation Windows

## 🚀 Installation Rapide (Recommandée)

### Prérequis
- Windows 10 ou ultérieur
- Environ 150 MB d'espace libre

### Étapes

1. **Télécharger le fichier d'installation**
   - Accédez à [Releases](https://github.com/votre-username/examens/releases)
   - Téléchargez `examens-0.1.0.msi`

2. **Installer EXAMENS**
   - Double-cliquez sur le fichier `.msi`
   - Un assistant d'installation s'ouvre
   - Lisez et acceptez la licence
   - Cliquez "Installer"
   - Attendez la fin de l'installation (1-2 minutes)

3. **Terminer l'installation**
   - Cliquez "Terminer"
   - EXAMENS peut se lancer automatiquement

4. **Créer un raccourci (Optionnel)**
   - Le raccourci est automatiquement ajouté au menu Démarrage
   - Vous pouvez créer un raccourci bureau si nécessaire

---

## 📍 Localisation des Fichiers

### Base de Données
```
C:\Users\[VotreNomUtilisateur]\AppData\Roaming\com.examens.app\examens.db
```

### Documents Importés
```
C:\Users\[VotreNomUtilisateur]\AppData\Roaming\com.examens.app\documents\
```

### Note
- Ces dossiers sont créés automatiquement au premier lancement
- Vous pouvez les consulter pour vérifier que les fichiers sont bien sauvegardés

---

## 🎯 Premier Lancement

1. **Lancez EXAMENS**
   - Menu Démarrage → EXAMENS
   - Ou double-cliquez le raccourci bureau

2. **Attendez l'initialisation**
   - La base de données SQLite est créée (quelques secondes)

3. **Commencez à importer**
   - Cliquez "Importer un sujet"
   - Sélectionnez un PDF ou une image
   - Remplissez les informations
   - Cliquez "Importer"

---

## ✨ Fonctionnalités

### Importation
- ✅ PDF, JPG, JPEG, PNG
- ✅ Métadonnées (Titre, Matière, Chapitre, Année, Session)
- ✅ Stockage sécurisé et indexé

### Lecture
- ✅ Lecteur PDF avec navigation pages
- ✅ Zoom avant/arrière
- ✅ Affichage d'images

### Organisation
- ✅ Favoris (cliquez l'étoile)
- ✅ Historique automatique
- ✅ Recherche Ctrl+K
- ✅ Filtres par matière/année

### Personnalisation
- ✅ Thème clair/sombre
- ✅ Paramètres sauvegardés

---

## 🔧 Utilisation Quotidienne

### Importer un sujet
```
Menu → Importer un sujet
  ↓
Sélectionner fichier
  ↓
Remplir infos
  ↓
Cliquer Importer
  ↓
Ouvrir dans le lecteur
```

### Retrouver un sujet
```
Option 1 : Barre de recherche (Ctrl+K)
Option 2 : Favoris (⭐)
Option 3 : Récents (cliquer l'horloge)
Option 4 : Par matière (sidebar)
```

### Lecture
```
Navigation PDF :
  ← Préc | Page X/Y | Suiv →
  
Zoom :
  - ou + (ou Reset)
  
Favoris :
  Cliquez ⭐
```

---

## ⚙️ Paramètres et Options

### Thème
- Cliquez 🌙 en haut à droite
- Basculez entre clair et sombre
- La préférence est sauvegardée

### Stockage
- Paramètres → Voir les données
- Les fichiers sont dans le dossier AppData
- Pas de limite de stockage (dépend du disque)

---

## 🚨 Problèmes Courants

### "L'application refuse de démarrer"

**Solution** :
1. Vérifiez que Windows est à jour
2. Réinstallez EXAMENS :
   - Allez à Paramètres → Applications
   - Trouvez "EXAMENS"
   - Cliquez Désinstaller
   - Téléchargez et installez à nouveau

### "Impossible d'importer un fichier"

**Vérifications** :
- ✅ Le fichier est PDF, JPG ou PNG
- ✅ Le fichier n'est pas corrompu
- ✅ Vous avez les droits d'accès au fichier

**Solution** :
1. Essayez un autre fichier
2. Copiez le fichier dans Documents
3. Essayez depuis là

### "Les données disparaissent"

**Diagnostic** :
- EXAMENS utilise SQLite (persistant)
- Les données doivent survivre à la fermeture/réouverture

**Solution** :
1. Vérifiez que le dossier `AppData\Roaming\com.examens.app\` existe
2. Si absent, relancez l'application (il sera recréé)

### "Le lecteur PDF ne s'ouvre pas"

**Cause possible** :
- PDF.js charge depuis CDN (Internet requis pour première utilisation)
- PDF corrompu

**Solution** :
1. Vérifiez la connexion Internet
2. Essayez un autre PDF
3. Téléchargez le PDF à nouveau

### "La recherche ne retrouve rien"

**Causes** :
- Aucun sujet n'a été importé
- Recherche sensible à la casse/accents

**Solution** :
1. Importez d'abord des sujets
2. Essayez sans accents (e.g., "physique" au lieu de "physique")

---

## 💾 Sauvegarde et Restauration

### Sauvegarder vos données

**Option 1 : Manuel**
```
Copier le dossier:
C:\Users\[Vous]\AppData\Roaming\com.examens.app\

Vers:
D:\Backup\examens_backup\
```

**Option 2 : Avec Windows Backup**
```
Paramètres → Système → Sauvegarde
Inclure: C:\Users\[Vous]\AppData\Roaming\com.examens.app\
```

### Restaurer vos données

1. Allez à l'emplacement backup
2. Copiez le dossier `com.examens.app`
3. Collez dans `C:\Users\[VotreNom]\AppData\Roaming\`
4. Relancez EXAMENS

---

## 🔒 Sécurité et Confidentialité

### Où sont stockées les données ?
- **Local** : C:\Users\[Vous]\AppData\Roaming\
- **Offline** : Aucune donnée envoyée
- **Chiffré** : Stockage système Windows

### Confidentialité
- ✅ Aucune collecte de données personnelles
- ✅ Aucune analytics
- ✅ Application 100% locale et offline
- ✅ Pas de phoning maison

---

## 🆘 Support Technique

### Si rien ne fonctionne

1. **Réinstallez**
   - Désinstaller : Paramètres → Applications
   - Réinstaller : Télécharger le `.msi` à nouveau

2. **Réinitialisez la base**
   - Allez à `C:\Users\[Vous]\AppData\Roaming\com.examens.app\`
   - Supprimez `examens.db`
   - Relancez l'application (une nouvelle base sera créée)

3. **Cherchez une solution**
   - Issues sur GitHub : https://github.com/votre-username/examens/issues
   - Consultez [FAQ](README.md#questions-fréquentes)

---

## 📊 Spécifications Système Recommandées

| Composant | Minimum | Recommandé |
|---|---|---|
| **Processeur** | Intel i5 2014+ / AMD Ryzen 2 | Quelconque moderne |
| **RAM** | 4 GB | 8 GB+ |
| **Disque** | 150 MB | 500 MB + espace pour docs |
| **Windows** | 10 ou 11 | 11 |
| **Internet** | Optional | Pour première utilisation PDF.js |

---

## 🎓 Conseils d'Utilisation

### Organisation Recommandée

**Par Matière**
```
Physique
  - Mécanique
  - Électricité
  - Thermodynamique

Chimie
  - Atomistique
  - Organique
  - Électrochimie

Mathématiques
  - Analyse
  - Algèbre
```

### Bonnes Pratiques

1. **Importez régulièrement** vos nouveaux sujets
2. **Marquez les difficiles** en favoris
3. **Consultez les récents** régulièrement
4. **Utilisez la recherche** pour trouver rapidement

### Productivité

- **Ctrl+K** : Recherche rapide
- **⭐** : Ajouter favoris
- **🌙** : Basculer thème sans quitter
- **Fermeture** : Reprendre là où vous aviez arrêté

---

## 📞 Contact et Feedback

Avez-vous des suggestions ? Des bugs ?

- 🐛 Ouvrez une issue : GitHub Issues
- 💬 Discussion : GitHub Discussions
- 📧 Email : [contact si disponible]

---

## 📈 Mises à Jour

EXAMENS reçoit des mises à jour régulièrement :

1. **Vérifiez automatiquement** (si activé)
2. **Téléchargez** la nouvelle version `.msi`
3. **Installez** (les données sont préservées)

La mise à jour est transparente et préserve tous vos documents.

---

## ✅ Checklist Première Installation

- [ ] Windows 10/11
- [ ] 150 MB libres
- [ ] Télécharger `.msi`
- [ ] Double-cliquer et installer
- [ ] Lancer EXAMENS
- [ ] Importer premier sujet
- [ ] Tester le lecteur
- [ ] Ajouter aux favoris
- [ ] Fermer et rouvrir
- [ ] Vérifier persistance

Si tous les points ✓, installation réussie !

---

**EXAMENS est prêt à améliorer votre gestion des sujets d'examens !** 📚
