@echo off
REM === Full Stack Project Auto Setup Script ===
REM Creates backend + frontend with Vite React setup

echo Creating root project folder...
mkdir rootFolder
cd rootFolder

echo Creating server folder...
mkdir server
cd server

echo Initializing npm project...
call npm init -y

echo Installing backend dependencies...
call npm install express mongoose dotenv bcryptjs jsonwebtoken cors multer socket.io openai

echo Installing dev dependencies...
call npm install -D nodemon

echo Creating backend structure...
mkdir models
mkdir routes
mkdir uploads

echo Creating backend files...
type nul > server.js
type nul > .env
type nul > routes\auth.js
type nul > routes\files.js
type nul > routes\chat.js
type nul > models\User.js
type nul > models\File.js
type nul > models\Message.js

cd ..

echo Creating Vite React client app...
call npm create vite@latest client -- --template react

cd client

echo Installing frontend dependencies...
call npm install

echo Installing frontend libraries...
call npm install axios socket.io-client

echo Creating frontend folders and files...
type nul > .env
mkdir src\components
type nul > src\components\App.jsx
type nul > src\components\Chat.jsx

cd ..

echo.
echo ===========================================
echo ✅ Project setup completed successfully!
echo Root folder: %cd%
echo ===========================================
pause
