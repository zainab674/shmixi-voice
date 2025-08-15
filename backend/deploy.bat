@echo off
echo 🚀 Deploying Backend to Vercel...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Check if we're in the backend directory
if not exist "package.json" (
    echo ❌ Please run this script from the backend directory
    pause
    exit /b 1
)

if not exist "vercel.json" (
    echo ❌ Please run this script from the backend directory
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Deploy to Vercel
echo 🌐 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 🔗 Check your Vercel dashboard for the deployment URL
pause
