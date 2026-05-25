# GitHub 登录 — 不依赖 PATH，直接调用 gh.exe
$gh = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $gh)) {
    Write-Host "未找到 GitHub CLI。请先安装: winget install GitHub.cli" -ForegroundColor Red
    exit 1
}
& $gh auth login
