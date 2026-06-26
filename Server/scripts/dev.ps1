Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Rakshak Server - Sequential Build    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Build-Service {
    param($svc)
    Write-Host "  --> $svc" -ForegroundColor Gray

    # Remove old image silently if it exists
    $null = docker image inspect "server-${svc}:latest" 2>$null
    if ($LASTEXITCODE -eq 0) {
        docker image rm "server-${svc}:latest" --force | Out-Null
    }

    docker compose build $svc
    if ($LASTEXITCODE -ne 0) {
        Write-Host "BUILD FAILED: $svc" -ForegroundColor Red
        exit 1
    }
    Write-Host "  OK: $svc" -ForegroundColor Green
}

# Step 0: Build the shared Python base image (pip install runs ONCE here)
Write-Host "[0/4] Building shared Python base image (heavy pip install, runs once)..." -ForegroundColor Yellow
docker build -t server-python-base:latest -f services/python-base/Dockerfile .
if ($LASTEXITCODE -ne 0) {
    Write-Host "BUILD FAILED: python-base" -ForegroundColor Red
    exit 1
}
Write-Host "  OK: python-base" -ForegroundColor Green

# Step 1: Build Node.js services (fast, uses cache)
Write-Host ""
Write-Host "[1/4] Building Node.js microservices..." -ForegroundColor Yellow
foreach ($svc in @("auth_service", "child_protection", "community_watch", "national_command", "investigation_war_room", "ai_forensic_lab", "mission_control")) {
    Build-Service $svc
}

# Step 2: Build Python services (fast now - just COPY files onto cached base)
Write-Host ""
Write-Host "[2/4] Building Python microservices (fast, reuses base image)..." -ForegroundColor Yellow
foreach ($svc in @("core_api", "ghost_engine", "migration_sensor", "network_genome", "psychology_search")) {
    Build-Service $svc
}

# Step 3: Start everything
Write-Host ""
Write-Host "[3/4] Cleaning up stale containers and starting all services..." -ForegroundColor Yellow
docker compose down --remove-orphans 2>&1 | Out-Null
docker compose up
