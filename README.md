# OopBuy Spreadsheet

Static site for [oopbuylookup.com](https://oopbuylookup.com) — OopBuy product spreadsheet, guides, and category pages.

## Local preview

```bash
node serve.js
```

Open http://localhost:3000

## Regenerate pages

Edit `CONFIG` at the top of `generate.js`, then:

```bash
node generate.js
```

## Deploy config (`generate.js`)

| Variable | Description |
|----------|-------------|
| `INVITE` | OopBuy affiliate invite code |
| `DOMAIN` | `https://oopbuylookup.com` |
| `DISCORD` | Discord invite URL |
| `EMAIL` | Contact email |

## Push to GitHub

From this folder (`csh`):

```bash
git init
git add .
git commit -m "Initial commit: OopBuy Spreadsheet site for oopbuylookup.com"
gh repo create oopbuylookup --public --source=. --remote=origin --push
```

Or create the repo on [github.com/new](https://github.com/new), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/oopbuylookup.git
git branch -M main
git push -u origin main
```
