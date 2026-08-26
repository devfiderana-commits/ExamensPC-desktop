.PHONY: help dev build clean install check-deps

help:
	@echo "╔════════════════════════════════════════════╗"
	@echo "║          EXAMENS - Commands               ║"
	@echo "╚════════════════════════════════════════════╝"
	@echo ""
	@echo "Commandes disponibles:"
	@echo ""
	@echo "  make dev           Démarrer le serveur de développement"
	@echo "  make build         Compiler l'application (nécessite npm + Rust)"
	@echo "  make build:debug   Compiler en debug (plus lent mais debuggable)"
	@echo "  make install       Installer les dépendances (npm install)"
	@echo "  make clean         Nettoyer les fichiers de build"
	@echo "  make check-deps    Vérifier les dépendances"
	@echo "  make help          Afficher cette aide"
	@echo ""
	@echo "Installation rapide:"
	@echo "  1. make check-deps"
	@echo "  2. make install"
	@echo "  3. make dev"
	@echo ""

dev:
	@echo "🚀 Démarrage du serveur de développement..."
	@if command -v python3 >/dev/null 2>&1; then \
		cd src && python3 -m http.server 8000; \
	elif command -v python >/dev/null 2>&1; then \
		cd src && python -m http.server 8000; \
	else \
		echo "❌ Python 3 requis"; \
		exit 1; \
	fi

build:
	@echo "🔨 Compilation de l'application..."
	npm run build

build-debug:
	@echo "🔨 Compilation en debug..."
	npm run build:debug

install:
	@echo "📦 Installation des dépendances..."
	npm install

clean:
	@echo "🧹 Nettoyage des fichiers de build..."
	rm -rf src-tauri/target
	rm -rf dist
	rm -rf node_modules
	@echo "✅ Nettoyage terminé"

check-deps:
	@echo "🔍 Vérification des dépendances..."
	@command -v node >/dev/null 2>&1 && echo "✓ Node.js" || echo "✗ Node.js manquant"
	@command -v npm >/dev/null 2>&1 && echo "✓ npm" || echo "✗ npm manquant"
	@command -v cargo >/dev/null 2>&1 && echo "✓ Rust/Cargo" || echo "✗ Rust/Cargo manquant"
	@command -v python3 >/dev/null 2>&1 && echo "✓ Python 3" || echo "✗ Python 3 manquant"
	@echo ""
	@echo "Notes:"
	@echo "  - Python 3 est requis pour 'make dev'"
	@echo "  - Node.js, npm et Rust sont requis pour 'make build'"
	@echo ""
