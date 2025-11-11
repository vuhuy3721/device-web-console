# 📦 Deployment Files Summary

## 🎯 Main Deployment Files

### `deploy.sh` ⭐ **RECOMMENDED**
- Tự động build, package, và upload lên thiết bị
- Kiểm tra SSH connection
- Cài dependencies tự động
- Cách dùng: `./deploy.sh 192.168.1.100 root`

### `QUICKSTART.md`
- Hướng dẫn nhanh (3 bước)
- Troubleshooting cơ bản
- API endpoints
- **Đọc cái này trước!**

### `DEPLOY_GUIDE.md`
- Hướng dẫn chi tiết 
- 2 phương pháp deploy (auto + manual)
- Setup systemd service
- Docker deploy
- Tối ưu hóa cho thiết bị nhúng

---

## 🔧 Service & Config Files

### `device-console.service`
- SystemD service file
- Copy vào `/etc/systemd/system/` trên thiết bị
- Enable: `systemctl enable device-console`
- Tự động restart khi boot hoặc crash

### `setup-service.sh`
- Script setup service trên thiết bị
- Tự động copy service file
- Enable auto-start
- Kiểm tra status

### `deploy-embedded.sh` (deprecated)
- Script cũ, thay thế bởi `deploy.sh`
- Giữ lại cho tương thích

---

## 🐳 Docker Files

### `Dockerfile`
- Alpine Linux base (nhẹ)
- Node.js v16
- Production ready
- Phục vụ static files + API

### `docker-compose.yml`
- One-command docker deployment
- Port mapping 3000
- Environment variables
- Volume config
- Auto-restart

### `.dockerignore`
- Loại bỏ files không cần khi build

---

## 📝 Config Files

### `.gitignore`
- Git ignore patterns
- node_modules, dist, .env, logs
- IDE files (.vscode, .idea)

### `.env` (để tạo tay)
```bash
PORT=3000
NODE_ENV=production
MQTT_SERVER=aiot.mobifone.vn
MQTT_PORT=6668
AUTH_TOKEN=your_token_here
```

---

## 📋 Workflow Tóm Tắt

### 🔸 Deploy to Embedded Device (LOCAL)

```bash
# Bước 1: Build + Deploy (1 command)
./deploy.sh 192.168.1.100 root

# Bước 2: Chạy trên device
ssh root@192.168.1.100
cd /opt/device-console
node dist/server/index.js
```

### 🔸 Deploy with Docker (PC or Cloud)

```bash
# Build image
docker build -t device-console:latest .

# Run container
docker run -d -p 3000:3000 \
  --name device-console \
  device-console:latest

# Or use compose
docker-compose up -d
```

### 🔸 Setup Auto-start on Boot

```bash
# SSH vào device
ssh root@192.168.1.100

# Run setup
bash /opt/device-console/setup-service.sh

# Check
systemctl status device-console
journalctl -u device-console -f
```

---

## ✅ Pre-deployment Checklist

- [ ] `npm install` - Dependencies installed
- [ ] `npm run build` - Code compiled
- [ ] Server port (3000) available
- [ ] Device IP reachable - `ping 192.168.1.100`
- [ ] SSH access to device - `ssh root@192.168.1.100`
- [ ] Device has /opt directory or create it
- [ ] Node.js v14+ on device - `node --version`
- [ ] Disk space available (~200MB)

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -i :3000` + `kill -9 <PID>` |
| SSH connection failed | Check IP, SSH enabled, firewall |
| npm install fails on device | Use `npm ci --production` |
| Slow startup | Check available RAM, increase Node heap |
| Cannot find static files | Check `src/client/` copied to device |

---

## 📞 Support Commands

```bash
# Check if running
ps aux | grep node

# View recent logs
journalctl -u device-console --no-pager -n 50

# Restart service
systemctl restart device-console

# Stop service
systemctl stop device-console

# View systemd service status
systemctl status device-console

# Enable on boot
systemctl enable device-console
```

---

## 📊 File Structure After Deploy

```
/opt/device-console/
├── dist/
│   ├── server/
│   │   ├── index.js
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   └── types/
├── src/
│   └── client/
│       ├── index.html
│       ├── css/
│       └── js/
├── node_modules/
├── package.json
├── device-console.service
├── setup-service.sh
└── server.log (auto-created)
```

---

## 🎓 Next Steps

1. **Read** `QUICKSTART.md` (3 min read)
2. **Prepare** deploy.sh script
3. **Deploy** using `./deploy.sh YOUR_DEVICE_IP`
4. **Access** http://YOUR_DEVICE_IP:3000
5. **Setup** auto-start with systemd
6. **Monitor** with `journalctl` or logs

Happy deploying! 🚀
