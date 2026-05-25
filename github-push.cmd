@echo off
cd /d "%~dp0"
set GIT=C:\Program Files\Git\cmd\git.exe
set GH=C:\Program Files\GitHub CLI\gh.exe

if not exist "%GH%" (
  echo GitHub CLI not found. Run: winget install GitHub.cli
  pause
  exit /b 1
)

"%GH%" auth status >nul 2>&1
if errorlevel 1 (
  echo Please login first: double-click github-login.cmd
  pause
  exit /b 1
)

if not exist ".git" (
  "%GIT%" init
  "%GIT%" add .
  "%GIT%" -c user.email=help@oopbuylookup.com -c user.name=oopbuylookup commit -m "Initial commit: OopBuy Spreadsheet site for oopbuylookup.com"
)

"%GIT%" branch -M main
"%GH%" repo create oopbuylookup --public --source=. --remote=origin --push
if not errorlevel 1 (
  echo Done! Repo pushed to GitHub.
  "%GH%" repo view --web
)
pause
