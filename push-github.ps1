$ErrorActionPreference = "Stop"
$git = "C:\Program Files\Git\cmd\git.exe"
$gh = "C:\Program Files\GitHub CLI\gh.exe"
$secretsPath = Join-Path $PSScriptRoot "secrets.json"
$repo = "oopbuylookup"
$owner = "csq33998-sudo"

if (-not (Test-Path $secretsPath)) {
    Write-Host "Missing secrets.json - copy secrets.json.example first."
    exit 1
}

$json = Get-Content $secretsPath -Raw | ConvertFrom-Json
$token = $json.github_token
if (-not $token) {
    Write-Host "github_token is empty in secrets.json"
    exit 1
}

Set-Location $PSScriptRoot
$token | & $gh auth login --with-token
& $gh auth setup-git

$null = & $gh repo view "${owner}/${repo}" 2>&1
if ($LASTEXITCODE -ne 0) {
    & $gh repo create $repo --public --description "OopBuy Spreadsheet for oopbuylookup.com"
}

& $git remote remove origin 2>$null
& $git remote add origin "https://github.com/${owner}/${repo}.git"
& $git branch -M main
& $git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Done: https://github.com/${owner}/${repo}"
} else {
    Write-Host "Push failed."
    exit 1
}
