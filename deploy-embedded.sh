#!/bin/bash
# Script deploy lên thiết bị nhúng

# Biến cấu hình
DEVICE_IP="192.168.1.100"  # Thay bằng IP thiết bị của bạn
DEVICE_USER="root"          # Username trên thiết bị
DEVICE_PATH="/opt/device-console"
PRIVATE_KEY="~/.ssh/id_rsa" # SSH key nếu có

# Build ứng dụng
echo "🔨 Compiling TypeScript..."
npm run build

# Tạo folder deployment
echo "📁 Creating deployment package..."
mkdir -p build-dist
cp -r src/client build-dist/
cp -r dist/* build-dist/ 2>/dev/null || true
cp package.json build-dist/
cp package-lock.json build-dist/ 2>/dev/null || true

# Deploy lên thiết bị
echo "🚀 Uploading to device..."
scp -r build-dist/* "$DEVICE_USER@$DEVICE_IP:$DEVICE_PATH/"

# Khởi động service
echo "▶️  Starting service on device..."
ssh "$DEVICE_USER@$DEVICE_IP" << EOF
  cd $DEVICE_PATH
  npm install --production
  pm2 start index.js --name "device-console" || node index.js &
  echo "✅ Deployed successfully!"
EOF

echo "✨ Deploy complete! Access at http://$DEVICE_IP:3000"
