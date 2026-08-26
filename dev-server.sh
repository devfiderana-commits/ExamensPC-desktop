#!/bin/bash

# EXAMENS Development Server
# Serve the frontend without npm dependencies

echo "╔════════════════════════════════════════════╗"
echo "║          EXAMENS - Dev Server              ║"
echo "║     Gestion des Sujets d'Examens          ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

cd "$(dirname "$0")/src"

echo "🚀 Starting development server..."
echo ""
echo "📂 Serving from: $(pwd)"
echo "🌐 Access at: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

python3 -m http.server 8000
