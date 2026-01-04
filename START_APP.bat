@echo off
title Pulsif Kick App Launcher
color 0a

echo ==================================================
echo       URUCHAMIANIE PULSIF KICK APP
echo ==================================================
echo.

:: Sprawdz czy Node jest zainstalowany
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [BLAD] Nie wykryto Node.js!
    echo Zrestartuj komputer, jesli wlasnie go zainstalowales.
    echo.
    pause
    exit
)

:: Sprawdz czy sa biblioteki
if not exist "node_modules" (
    echo [INFO] Pierwze uruchomienie - instaluje biblioteki...
    call npm install
)

echo [INFO] Uruchamianie serwera...
node server.js

pause
