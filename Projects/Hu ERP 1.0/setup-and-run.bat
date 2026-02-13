@echo off
REM ============================================================
REM Haridwar University ERP - Setup and Run Script
REM This script installs dependencies and runs both frontend & backend
REM ============================================================

REM Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"

REM Remove trailing backslash if present
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

set "FRONTEND_DIR=%SCRIPT_DIR%\frontend"
set "BACKEND_DIR=%SCRIPT_DIR%\backend"

REM Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ============================================================
echo        Haridwar University ERP - Setup and Run
echo ============================================================
echo.
echo Script Location: %SCRIPT_DIR%
echo Frontend Path:   %FRONTEND_DIR%
echo Backend Path:    %BACKEND_DIR%
echo.

REM Check if directories exist
if not exist "%FRONTEND_DIR%" (
    echo [ERROR] Frontend directory not found: %FRONTEND_DIR%
    pause
    exit /b 1
)

if not exist "%BACKEND_DIR%" (
    echo [ERROR] Backend directory not found: %BACKEND_DIR%
    pause
    exit /b 1
)

echo [STEP 1/2] Installing dependencies...
echo.

REM Install frontend dependencies in a separate terminal and wait for it
echo Installing Frontend dependencies...
start /wait cmd /c "cd /d "%FRONTEND_DIR%" && echo Installing Frontend Dependencies... && npm install && echo. && echo Frontend dependencies installed successfully! && timeout /t 2 >nul"

REM Install backend dependencies in a separate terminal and wait for it
echo Installing Backend dependencies...
start /wait cmd /c "cd /d "%BACKEND_DIR%" && echo Installing Backend Dependencies... && npm install && echo. && echo Backend dependencies installed successfully! && timeout /t 2 >nul"

echo.
echo [STEP 2/2] Starting the application...
echo.

REM Start backend server in a new terminal (stays open)
echo Starting Backend Server...
start "HU ERP - Backend Server" cmd /k "cd /d "%BACKEND_DIR%" && echo ============================================ && echo       HARIDWAR ERP - BACKEND SERVER && echo ============================================ && echo. && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 >nul

REM Start frontend dev server in a new terminal (stays open)
echo Starting Frontend Dev Server...
start "HU ERP - Frontend Server" cmd /k "cd /d "%FRONTEND_DIR%" && echo ============================================ && echo       HARIDWAR ERP - FRONTEND SERVER && echo ============================================ && echo. && npm run dev"

echo.
echo ============================================================
echo Application started successfully!
echo.
echo Backend:  Running in "HU ERP - Backend Server" terminal
echo Frontend: Running in "HU ERP - Frontend Server" terminal
echo.
echo To stop the servers, close their respective terminal windows.
echo ============================================================
echo.
echo This window will close in 5 seconds...
timeout /t 5 >nul
