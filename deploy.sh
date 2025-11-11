#!/bin/bash

# ============================================
# Device Web Console - Embedded Deploy Script
# ============================================

set -e

# Configuration
DEVICE_IP="${1:-192.168.1.100}"
DEVICE_USER="${2:-root}"
DEVICE_PATH="/opt/device-console"
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Device Web Console - Deploy${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Validation
if [ -z "$DEVICE_IP" ]; then
    echo -e "${RED}Error: Device IP not specified${NC}"
    echo "Usage: ./deploy-embedded.sh <device_ip> [username]"
    echo "Example: ./deploy-embedded.sh 192.168.1.100 root"
    exit 1
fi

echo -e "${YELLOW}Target Device:${NC} $DEVICE_USER@$DEVICE_IP:$DEVICE_PATH"
echo ""

# Step 1: Build
echo -e "${YELLOW}[1/5]${NC} Building application..."
npm run build
echo -e "${GREEN}✓ Build complete${NC}"
echo ""

# Step 2: Create deployment package
echo -e "${YELLOW}[2/5]${NC} Preparing deployment package..."
mkdir -p deploy-pkg
rm -rf deploy-pkg/*

# Copy files
cp -r dist deploy-pkg/
cp -r src/client deploy-pkg/
cp package.json deploy-pkg/
cp package-lock.json deploy-pkg/ 2>/dev/null || true

# Create startup script
cat > deploy-pkg/start.sh << 'STARTUP'
#!/bin/bash
cd /opt/device-console
node dist/server/index.js
STARTUP

chmod +x deploy-pkg/start.sh

echo -e "${GREEN}✓ Deployment package ready${NC}"
echo ""

# Step 3: Test SSH connection
echo -e "${YELLOW}[3/5]${NC} Testing SSH connection..."
if ! ssh -o ConnectTimeout=5 -o BatchMode=yes $DEVICE_USER@$DEVICE_IP "echo 'SSH connection OK'" > /dev/null 2>&1; then
    echo -e "${RED}✗ Cannot connect to device${NC}"
    echo "Make sure:"
    echo "  1. Device is reachable at $DEVICE_IP"
    echo "  2. SSH is enabled on device"
    echo "  3. You have SSH key configured (or use password auth)"
    exit 1
fi
echo -e "${GREEN}✓ SSH connection successful${NC}"
echo ""

# Step 4: Upload files
echo -e "${YELLOW}[4/5]${NC} Uploading files to device..."
ssh $DEVICE_USER@$DEVICE_IP "mkdir -p $DEVICE_PATH"
scp -r deploy-pkg/* $DEVICE_USER@$DEVICE_IP:$DEVICE_PATH/
echo -e "${GREEN}✓ Files uploaded${NC}"
echo ""

# Step 5: Install dependencies and start
echo -e "${YELLOW}[5/5]${NC} Finalizing setup on device..."
ssh $DEVICE_USER@$DEVICE_IP << REMOTE_CMD
  set -e
  cd $DEVICE_PATH
  
  echo "Installing production dependencies..."
  npm install --production --no-save 2>&1 | tail -5
  
  echo "Checking Node.js..."
  node --version
  
  echo "Done!"
REMOTE_CMD

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Deploy Successful!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}Access the console at:${NC}"
echo -e "  ${YELLOW}http://$DEVICE_IP:3000${NC}"
echo ""
echo -e "${BLUE}To start the service on device:${NC}"
echo -e "  ${YELLOW}ssh $DEVICE_USER@$DEVICE_IP${NC}"
echo -e "  ${YELLOW}cd $DEVICE_PATH${NC}"
echo -e "  ${YELLOW}node dist/server/index.js${NC}"
echo ""
echo -e "${BLUE}To run in background:${NC}"
echo -e "  ${YELLOW}nohup node dist/server/index.js > server.log 2>&1 &${NC}"
echo ""
echo -e "${BLUE}To view logs:${NC}"
echo -e "  ${YELLOW}ssh $DEVICE_USER@$DEVICE_IP tail -f $DEVICE_PATH/server.log${NC}"
echo ""

# Cleanup
rm -rf deploy-pkg
