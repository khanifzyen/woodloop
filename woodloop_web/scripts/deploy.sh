#!/usr/bin/env bash
# ============================================================
# WoodLoop Web — Docker Build & Push Script
# ============================================================
# Prerequisites:
#   1. Docker installed
#   2. GitHub token with `write:packages` scope
#   3. Login: echo $GITHUB_TOKEN | docker login ghcr.io -u <username> --password-stdin
#
# Usage:
#   ./scripts/deploy.sh                    # Interactive: pilih versi
#   ./scripts/deploy.sh v1.0.0            # Build + push dengan versi tertentu
#   ./scripts/deploy.sh latest             # Build + push dengan tag latest
#   ./scripts/deploy.sh --no-push          # Build only (skip push)
#   ./scripts/deploy.sh --list-tags        # Lihat semua tags yang sudah ada
#   ./scripts/deploy.sh --list-tags v1     # Filter tag (misal: v1*)
# ============================================================
set -euo pipefail

# ── Configuration ──
GITHUB_USER="${GITHUB_USER:-khanifzyen}"
IMAGE_NAME="woodloop-web"
REGISTRY="ghcr.io"
FULL_IMAGE="${REGISTRY}/${GITHUB_USER}/${IMAGE_NAME}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ============================================================
# FUNCTIONS
# ============================================================

# ── List tags from ghcr.io ──
list_tags() {
    local filter="${1:-}"
    echo -e "${CYAN}==========================================${NC}"
    echo -e "${CYAN} Tags di ghcr.io/${GITHUB_USER}/${IMAGE_NAME}${NC}"
    echo -e "${CYAN}==========================================${NC}"

    # Cek login dulu
    if ! docker system info 2>/dev/null | grep -q "ghcr.io"; then
        echo -e "${YELLOW}⚠ Belum login ke ghcr.io. Login dulu:${NC}"
        echo "  echo \$GITHUB_TOKEN | docker login ghcr.io -u ${GITHUB_USER} --password-stdin"
        echo ""
    fi

    # Query API registry
    local auth_header="Accept: application/vnd.github+json"
    if [ -n "${GITHUB_TOKEN:-}" ]; then
        auth_header="Authorization: Bearer ${GITHUB_TOKEN}"
    fi

    local response
    response=$(curl -s -H "${auth_header}" \
        "https://api.github.com/users/${GITHUB_USER}/packages/container/${IMAGE_NAME}/versions?per_page=30" 2>/dev/null)

    # Fallback: coba Docker Registry API v2
    if echo "$response" | grep -q "Requires authentication\|Not Found" 2>/dev/null; then
        response=$(curl -s \
            "https://ghcr.io/v2/${GITHUB_USER}/${IMAGE_NAME}/tags/list?n=50" 2>/dev/null)
    fi

    if echo "$response" | grep -q "Not Found\|Not Found -" 2>/dev/null; then
        echo -e "${YELLOW}Belum ada package di registry. Push dulu dengan:${NC}"
        echo "  ./scripts/deploy.sh v1.0.0"
        return
    fi

    if echo "$response" | grep -q "message" 2>/dev/null; then
        local msg
        msg=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('message',''))" 2>/dev/null || echo "unknown")
        if [ -n "$msg" ]; then
            echo -e "${RED}✗ API Error: $msg${NC}"
            echo -e "${YELLOW}Coba dengan token: curl -H \"Authorization: Bearer \$GITHUB_TOKEN\" ...${NC}"
            return
        fi
    fi

    # Parse tags dari JSON response
    local tags
    tags=$(echo "$response" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if isinstance(data, list):
    for v in data:
        tags = v.get('metadata', {}).get('container', {}).get('tags', [])
        created = v.get('created_at', '')[:10]
        for t in tags:
            print(f'{created}  {t}')
" 2>/dev/null || echo "Parse error")

    if [ -z "$tags" ]; then
        echo -e "${YELLOW}Belum ada tags (package masih kosong).${NC}"
    else
        if [ -n "$filter" ]; then
            echo "$tags" | grep "$filter" || echo -e "${YELLOW}Tidak ada tag matching '$filter'${NC}"
        else
            echo "$tags"
        fi
    fi
    echo ""
}

# ── Prompt versi ──
prompt_version() {
    echo -e "${CYAN}==========================================${NC}"
    echo -e "${CYAN} WoodLoop Web — Pilih Versi${NC}"
    echo -e "${CYAN}==========================================${NC}"
    echo ""
    echo -e "${YELLOW}Semantic versioning: v<major>.<minor>.<patch>${NC}"
    echo "  v1.0.0  — Rilis resmi pertama"
    echo "  v1.1.0  — Ada fitur baru (minor)"
    echo "  v1.0.1  — Bugfix saja (patch)"
    echo ""

    # Cari versi terakhir dari registry atau lokal
    local last_tag=""
    last_tag=$(docker images --format '{{.Tag}}' "${FULL_IMAGE}" 2>/dev/null | grep '^v[0-9]' | sort -V | tail -1 || true)

    if [ -n "$last_tag" ]; then
        # Extract angka untuk suggest next patch
        local major minor patch
        IFS='.' read -r major minor patch <<< "${last_tag#v}"
        patch=$((patch + 1))
        echo -e "${GREEN}Versi terakhir: ${last_tag}${NC}"
        echo -e "${GREEN}Suggest next:   v${major}.${minor}.${patch}${NC}"
        echo ""
        read -r -p "Masukkan versi (contoh: v${major}.${minor}.${patch}) atau kosongkan untuk latest: " VERSION
    else
        read -r -p "Masukkan versi (contoh: v1.0.0) atau kosongkan untuk latest: " VERSION
    fi

    # Default ke latest
    if [ -z "${VERSION:-}" ]; then
        VERSION="latest"
        echo -e "${YELLOW}Menggunakan tag: latest${NC}"
    fi

    echo ""
}

# ── Cek apakah port tersedia ──
find_available_port() {
    local port=3000
    while ss -tlnp "sport = :${port}" 2>/dev/null | grep -q LISTEN; do
        port=$((port + 1))
    done
    echo "$port"
}

# ============================================================
# MAIN
# ============================================================
cd "$PROJECT_DIR"

# ── Parse argumen ──
NO_PUSH=false

for arg in "$@"; do
    case "$arg" in
        --no-push)
            NO_PUSH=true
            ;;
        --list-tags)
            shift  # consume the flag
            list_tags "${1:-}"
            exit 0
            ;;
        --help|-h)
            echo "Usage:"
            echo "  ./scripts/deploy.sh                    # Interactive (pilih versi)"
            echo "  ./scripts/deploy.sh v1.2.3            # Langsung dengan versi"
            echo "  ./scripts/deploy.sh latest             # Tag latest"
            echo "  ./scripts/deploy.sh --no-push          # Build only"
            echo "  ./scripts/deploy.sh --list-tags        # Lihat semua tags"
            echo "  ./scripts/deploy.sh --list-tags v1     # Filter tag: v1*"
            exit 0
            ;;
    esac
done

# Jika argumen pertama bukan flag, itu adalah versi
VERSION="${1:-}"
if [[ "$VERSION" == "--no-push" ]]; then
    VERSION="latest"
elif [ -z "$VERSION" ]; then
    # Interactive mode: minta input versi
    prompt_version
fi

# ── Info ──
echo -e "${CYAN}==========================================${NC}"
echo -e "${CYAN} WoodLoop Web — Docker Build & Push${NC}"
echo -e "${CYAN}==========================================${NC}"
echo -e " Registry:  ${FULL_IMAGE}"
echo -e " Tag:       ${VERSION}"
echo -e " No Push:   ${NO_PUSH}"
echo -e "${CYAN}==========================================${NC}"
echo ""

# ── Step 1: Build ──
echo -e "${YELLOW}→ Building Docker image...${NC}"
docker build \
    -t "${IMAGE_NAME}:${VERSION}" \
    -t "${FULL_IMAGE}:${VERSION}" \
    --build-arg NEXT_PUBLIC_PB_URL=https://pb-woodloop.pasarjepara.com \
    -f Dockerfile \
    .

BUILD_EXIT=$?
if [ $BUILD_EXIT -ne 0 ]; then
    echo -e "${RED}✗ Build failed (exit code: $BUILD_EXIT)${NC}"
    exit $BUILD_EXIT
fi

IMAGE_SIZE=$(docker image inspect "${FULL_IMAGE}:${VERSION}" --format='{{.Size}}' | numfmt --to=iec 2>/dev/null || echo "?")
echo -e "${GREEN}✓ Build success: ${FULL_IMAGE}:${VERSION}${NC}"
echo -e "  Image size: ${IMAGE_SIZE}"

# Also tag as "latest" if a version tag was given
if [[ "$VERSION" != "latest" ]]; then
    echo -e "${YELLOW}→ Also tagging as latest...${NC}"
    docker tag "${FULL_IMAGE}:${VERSION}" "${FULL_IMAGE}:latest"
fi

# ── Step 2: Test ──
echo ""
echo -e "${YELLOW}→ Quick test: running container...${NC}"
TEST_PORT=$(find_available_port)
echo "  Using port: ${TEST_PORT}"

CONTAINER_ID=$(docker run -d -p "${TEST_PORT}:3000" -e PORT=3000 "${FULL_IMAGE}:${VERSION}")

# Wait for server to respond
HEALTHY=false
for i in $(seq 1 15); do
    sleep 2
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${TEST_PORT}/" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
        echo -e "${GREEN}✓ Container is serving on http://localhost:${TEST_PORT}/ (HTTP ${HTTP_CODE})${NC}"
        HEALTHY=true
        break
    fi
    echo "  Waiting... ($i/15, HTTP $HTTP_CODE)"
done

docker stop "$CONTAINER_ID" > /dev/null 2>&1
docker rm "$CONTAINER_ID" > /dev/null 2>&1

if [ "$HEALTHY" != "true" ]; then
    echo -e "${RED}⚠ Warning: Container did not respond. Check logs.${NC}"
fi

# ── Step 3: Push ──
if [ "$NO_PUSH" = false ]; then
    echo ""
    echo -e "${YELLOW}→ Pushing to registry...${NC}"

    echo "  Pushing ${FULL_IMAGE}:${VERSION}..."
    docker push "${FULL_IMAGE}:${VERSION}" || {
        echo ""
        echo -e "${RED}✗ Push failed. Did you login?${NC}"
        echo "  echo \$GITHUB_TOKEN | docker login ghcr.io -u ${GITHUB_USER} --password-stdin"
        exit 1
    }
    echo -e "${GREEN}  ✓ Pushed: ${FULL_IMAGE}:${VERSION}${NC}"

    if [[ "$VERSION" != "latest" ]]; then
        echo "  Pushing latest tag..."
        docker push "${FULL_IMAGE}:latest" > /dev/null 2>&1
        echo -e "${GREEN}  ✓ Pushed: ${FULL_IMAGE}:latest${NC}"
    fi

    echo ""
    echo -e "${CYAN}==========================================${NC}"
    echo -e "${GREEN} Deployment ready!${NC}"
    echo -e " Image: ${FULL_IMAGE}:${VERSION}"
    echo ""
    echo -e " ${YELLOW}Di VPS, jalankan:${NC}"
    echo "   docker pull ${FULL_IMAGE}:${VERSION}"
    echo "   docker run -d --name woodloop-web \\"
    echo "     -p 127.0.0.1:3000:3000 \\"
    echo "     -e PORT=3000 \\"
    echo "     --restart unless-stopped \\"
    echo "     ${FULL_IMAGE}:${VERSION}"
    echo ""
    echo -e " ${YELLOW}Lihat semua tags:${NC}"
    echo "   ./scripts/deploy.sh --list-tags"
    echo -e "${CYAN}==========================================${NC}"
else
    echo ""
    echo -e "${GREEN}✓ Build complete (--no-push).${NC}"
    echo "  Image: ${FULL_IMAGE}:${VERSION}"
fi
