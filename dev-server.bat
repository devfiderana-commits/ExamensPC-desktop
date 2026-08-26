@echo off
REM EXAMENS Development Server for Windows

echo.
echo ╔════════════════════════════════════════════╗
echo ║          EXAMENS - Dev Server              ║
echo ║     Gestion des Sujets d'Examens          ║
echo ╚════════════════════════════════════════════╝
echo.

cd /d "%~dp0src"

echo 🚀 Starting development server...
echo.
echo 📂 Serving from: %cd%
echo 🌐 Access at: http://localhost:8000
echo.
echo Press Ctrl+C to stop
echo.

python -m http.server 8000
