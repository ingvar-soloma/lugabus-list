# Local CI script for Windows (PowerShell)
Write-Host "Starting Local CI runner..." -ForegroundColor Cyan

# 1. Install dependencies
Write-Host "`n[1/4] Installing dependencies..." -ForegroundColor Yellow
pnpm install --frozen-lockfile
if ($LASTEXITCODE -ne 0) { Write-Host "Dependencies installation failed!" -ForegroundColor Red; exit $LASTEXITCODE }

# 2. Lint
Write-Host "`n[2/4] Running Lint..." -ForegroundColor Yellow
pnpm lint
if ($LASTEXITCODE -ne 0) { Write-Host "Lint failed!" -ForegroundColor Red; exit $LASTEXITCODE }

# 3. Generate Prisma Client
Write-Host "`n[3/4] Generating Prisma Client..." -ForegroundColor Yellow
pnpm --filter backend exec prisma generate
if ($LASTEXITCODE -ne 0) { Write-Host "Prisma generation failed!" -ForegroundColor Red; exit $LASTEXITCODE }

# 4. Build
Write-Host "`n[4/4] Building project..." -ForegroundColor Yellow
pnpm build
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed!" -ForegroundColor Red; exit $LASTEXITCODE }

Write-Host "`nCI Run Successful!" -ForegroundColor Green
