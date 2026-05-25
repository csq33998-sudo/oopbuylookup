# 创建 GitHub 仓库并推送 — 不依赖 PATH
$git = "C:\Program Files\Git\cmd\git.exe"
$gh = "C:\Program Files\GitHub CLI\gh.exe"
$repoName = "oopbuylookup"

if (-not (Test-Path $git)) {
    Write-Host "未找到 Git。请先安装: winget install Git.Git" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $gh)) {
    Write-Host "未找到 GitHub CLI。请先安装: winget install GitHub.cli" -ForegroundColor Red
    exit 1
}

Set-Location $PSScriptRoot

$status = & $gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "请先登录 GitHub，运行:" -ForegroundColor Yellow
    Write-Host "  .\github-login.ps1" -ForegroundColor Cyan
    exit 1
}

if (-not (Test-Path ".git")) {
    & $git init
    & $git add .
    & $git -c user.email="help@oopbuylookup.com" -c user.name="oopbuylookup" commit -m "Initial commit: OopBuy Spreadsheet site for oopbuylookup.com"
}

& $git branch -M main
& $gh repo create $repoName --public --source=. --remote=origin --push
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n完成! 仓库已推送到 GitHub。" -ForegroundColor Green
    & $gh repo view --web
}
