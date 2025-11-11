# Hướng dẫn Deploy Lên Thiết Bị Nhúng

## 📋 Yêu cầu tiên quyết
- Thiết bị chạy Linux/OpenWrt/NodeMCU
- Node.js v14+ được cài đặt trên thiết bị
- SSH hoặc SCP để transfer file
- Kết nối mạng local giữa máy tính và thiết bị

## 🚀 Phương pháp 1: Deploy Tự Động (Khuyên Dùng)

### Bước 1: Chuẩn bị script deploy
```bash
# Trên máy tính, từ thư mục project
chmod +x deploy.sh
```

### Bước 2: Chạy script deploy
```bash
# Cách 1: Deploy với IP mặc định (thay bằng IP của bạn)
./deploy.sh 192.168.1.100 root

# Cách 2: Deploy với username khác
./deploy.sh 192.168.1.100 admin

# Script sẽ tự động:
# - Build ứng dụng
# - Chuẩn bị deployment package
# - Upload lên thiết bị
# - Cài dependencies
# - Sẵn sàng khởi động
```

### Bước 3: Khởi động service (trên thiết bị)
```bash
# SSH vào thiết bị
ssh root@192.168.1.100

# Cách A: Chạy trực tiếp
cd /opt/device-console
node dist/server/index.js

# Cách B: Setup auto-start với systemd
bash /opt/device-console/setup-service.sh

# Cách C: Chạy trong background
nohup node /opt/device-console/dist/server/index.js > /opt/device-console/server.log 2>&1 &
```

---

## 🚀 Phương pháp 2: Deploy qua SSH (Manual)

### Bước 1: Build trên máy tính
```bash
npm install
npm run build:prod
```

### Bước 2: Tạo package deployment
```bash
mkdir -p dist
npm run build
```

### Bước 3: Transfer file lên thiết bị
```bash
# Thay IP_DEVICE bằng IP thực của thiết bị
scp -r dist root@192.168.1.100:/opt/device-console/
scp -r src/client root@192.168.1.100:/opt/device-console/
scp package.json root@192.168.1.100:/opt/device-console/
```

### Bước 4: SSH vào thiết bị và cài dependencies
```bash
ssh root@192.168.1.100

# Trên thiết bị:
cd /opt/device-console
npm install --production
```

### Bước 5: Chạy ứng dụng
```bash
# Option A: Chạy trực tiếp
node dist/server/index.js

# Option B: Dùng PM2 (nếu có)
npm install -g pm2
pm2 start dist/server/index.js --name "device-console"
pm2 startup
pm2 save

# Option C: Chạy ở background
nohup node dist/server/index.js > app.log 2>&1 &
```

---

## 🐳 Phương pháp 2: Deploy qua Docker (Nếu thiết bị hỗ trợ)

### Bước 1: Build Docker image
```bash
docker build -t device-console:latest .
```

### Bước 2: Transfer image hoặc Dockerfile
```bash
# Cách A: Transfer Dockerfile và build trên thiết bị
scp Dockerfile root@192.168.1.100:/tmp/
ssh root@192.168.1.100 'cd /tmp && docker build -t device-console .'

# Cách B: Export image và transfer
docker save device-console:latest | gzip > device-console.tar.gz
scp device-console.tar.gz root@192.168.1.100:/tmp/
ssh root@192.168.1.100 'docker load < /tmp/device-console.tar.gz'
```

### Bước 3: Chạy container
```bash
ssh root@192.168.1.100 'docker run -d -p 3000:3000 \
  --name device-console \
  --restart unless-stopped \
  device-console:latest'
```

---

## ⚙️ Cấu hình cho thiết bị nhúng

### Tạo file `.env` trên thiết bị
```bash
# /opt/device-console/.env
PORT=3000
NODE_ENV=production
MQTT_SERVER=aiot.mobifone.vn
MQTT_PORT=6668
AUTH_TOKEN=your_auth_token_here
```

### Setup Systemd Service (Auto-start trên boot)

**Cách 1: Sử dụng script tự động**
```bash
# Trên thiết bị
bash /opt/device-console/setup-service.sh
```

**Cách 2: Setup manual**
```bash
# Copy service file
sudo cp /opt/device-console/device-console.service /etc/systemd/system/

# Enable service
sudo systemctl daemon-reload
sudo systemctl enable device-console
sudo systemctl start device-console

# Check status
sudo systemctl status device-console
```

---

## 🔍 Kiểm tra hoạt động

### Kiểm tra từ máy tính
```bash
# Test API
curl http://192.168.1.100:3000/api/status

# Mở web console
# Mở trình duyệt: http://192.168.1.100:3000
```

### Kiểm tra trên thiết bị
```bash
ps aux | grep node
netstat -tlnp | grep 3000
```

---

## 📊 Tối ưu cho thiết bị nhúng

1. **Giảm kích thước**
   - Loại bỏ các module không dùng trong `node_modules`
   - Dùng `npm ci --only=production`

2. **Tiết kiệm RAM**
   - Tăng garbage collection: `NODE_OPTIONS=--max-old-space-size=256`
   - Giảm process timeout

3. **Đối với Flash storage có hạn**
   - Lưu log vào RAM hoặc external storage
   - Nén source code

---

## 🐛 Troubleshooting

### Lỗi "Port 3000 already in use"
```bash
# Tìm process đang dùng port 3000
lsof -i :3000
# Hoặc
netstat -tlnp | grep 3000

# Kill process
kill -9 <PID>
```

### Lỗi "Cannot find module"
```bash
cd /opt/device-console
rm -rf node_modules
npm install --production
```

### Check log
```bash
# Nếu dùng PM2
pm2 log device-console

# Nếu dùng SystemD
journalctl -u device-console -f

# Nếu chạy background
tail -f /opt/device-console/app.log
```

---

## 📱 Deploy từ máy có script tự động

Chỉnh sửa file `deploy-embedded.sh` với IP thiết bị của bạn:
```bash
DEVICE_IP="192.168.1.100"
DEVICE_USER="root"
DEVICE_PATH="/opt/device-console"

chmod +x deploy-embedded.sh
./deploy-embedded.sh
```

---

## ✅ Checklist Deploy
- [ ] Build thành công: `npm run build`
- [ ] SSH kết nối được đến thiết bị
- [ ] Node.js v14+ trên thiết bị
- [ ] Có đủ disk space trên thiết bị (~200MB)
- [ ] Cấu hình settings.json phù hợp
- [ ] Test API endpoints
- [ ] Kiểm tra web UI trên http://IP:3000
