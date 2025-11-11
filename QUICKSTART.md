# 🚀 Quick Start - Deploy Embedded

## Cách nhanh nhất (3 lệnh)

### 1. Chuẩn bị (trên máy tính)
```bash
chmod +x deploy.sh
npm install
```

### 2. Deploy (đổi IP thành IP thiết bị của bạn)
```bash
./deploy.sh 192.168.1.100 root
```

### 3. Chạy trên thiết bị
```bash
ssh root@192.168.1.100
cd /opt/device-console

# Start service
node dist/server/index.js

# Hoặc để auto-start on boot
bash setup-service.sh
```

### 4. Truy cập
```
http://192.168.1.100:3000
```

---

## File cần biết

- `deploy.sh` - Script deploy tự động ⭐
- `DEPLOY_GUIDE.md` - Hướng dẫn chi tiết
- `device-console.service` - SystemD service (auto-start)
- `setup-service.sh` - Setup service trên thiết bị

---

## Troubleshooting

**Không kết nối SSH?**
```bash
# Kiểm tra IP đúng không
ping 192.168.1.100

# Kiểm tra SSH có bật không
ssh -v root@192.168.1.100
```

**Port 3000 đã dùng?**
```bash
# Trên thiết bị, kill process cũ
lsof -i :3000
kill -9 <PID>

# Hoặc dùng port khác
PORT=8000 node dist/server/index.js
```

**Xem logs real-time**
```bash
# Nếu dùng systemd
ssh root@192.168.1.100 journalctl -u device-console -f

# Nếu dùng background nohup
ssh root@192.168.1.100 tail -f /opt/device-console/server.log
```

---

## API Endpoints

- `GET /api/connection` - Thông tin kết nối
- `GET /api/status` - Trạng thái thiết bị
- `GET /api/network` - Thông tin 3G/4G
- `GET /api/admin/settings` - Cấu hình admin
- `POST /api/admin/password` - Đổi mật khẩu
- `GET /api/about` - Thông tin ứng dụng

---

## Có câu hỏi?

Xem `DEPLOY_GUIDE.md` để hướng dẫn chi tiết!
