# 🌐 Hệ thống Quản lý Thiết bị Từ xa

## Tổng quan

Hệ thống này cho phép quản lý thiết bị nhúng từ xa **ngay cả khi MQTT không kết nối được**. Bạn luôn có quyền truy cập vào thiết bị qua HTTP API.

## 🎯 Giải pháp Dual-Channel

### **Kênh 1: HTTP API (Kênh chính - Luôn hoạt động)**
- ✅ Truy cập trực tiếp qua `http://device-ip:3000`
- ✅ Không phụ thuộc vào MQTT broker
- ✅ Cho phép sửa cấu hình MQTT từ xa
- ✅ Quản lý thiết bị hoàn toàn độc lập

### **Kênh 2: MQTT (Kênh phụ - Cho IoT Platform)**
- 📡 Kết nối đến Mobifone IoT Platform
- 📡 Cho phép quản lý từ cloud platform
- 📡 Tự động reconnect khi mất kết nối
- 📡 Fallback khi không truy cập trực tiếp được HTTP

## 📋 Tính năng

### 1. **Giám sát MQTT Real-time**
- Hiển thị trạng thái kết nối MQTT (connected/disconnected)
- Thông tin broker hiện tại (server, port)
- Cập nhật tự động mỗi 10 giây

### 2. **Cấu hình MQTT từ xa**
- Thay đổi MQTT broker mà không cần truy cập vật lý
- Hỗ trợ username/password authentication
- Tự động reconnect sau khi cập nhật

### 3. **Quản lý thiết bị**
- Xem thông tin thiết bị (Device ID, uptime)
- Khởi động lại thiết bị từ xa
- Refresh trạng thái real-time

## 🚀 Sử dụng

### **Bước 1: Truy cập Remote Management**

Mở trình duyệt và truy cập:
```
http://<device-ip>:3000/remote.html
```

Hoặc click vào menu **🌐 Remote Mgmt** trong dashboard.

### **Bước 2: Kiểm tra MQTT Status**

Màn hình sẽ hiển thị:
- ✅ **Màu xanh**: MQTT đã kết nối thành công
- ⚠️ **Màu đỏ**: MQTT không kết nối (nhưng HTTP vẫn hoạt động bình thường)

### **Bước 3: Cập nhật MQTT Configuration**

Nếu cần kết nối đến broker khác:

1. Điền thông tin broker mới:
   - **MQTT Server**: `aiot.mobifone.vn` hoặc IP khác
   - **MQTT Port**: `6668` hoặc port khác
   - **Username/Password**: (tùy chọn)

2. Click **💾 Save & Reconnect**

3. Hệ thống sẽ:
   - Lưu cấu hình mới vào `settings.json`
   - Tự động ngắt kết nối cũ
   - Kết nối lại với broker mới
   - Cập nhật trạng thái sau 2 giây

### **Bước 4: Reconnect thủ công**

Nếu MQTT bị disconnect, click **🔄 Reconnect Now** để thử kết nối lại.

### **Bước 5: Khởi động lại thiết bị**

Khi cần reboot thiết bị:
1. Click **🔴 Reboot Device**
2. Xác nhận trong dialog
3. Thiết bị sẽ khởi động lại sau 5 giây

## 🔌 API Endpoints

### **1. GET /api/remote/status**
Lấy trạng thái thiết bị

**Response:**
```json
{
  "success": true,
  "deviceId": "880027546738806682",
  "mqttConnected": true,
  "mqttServer": "aiot.mobifone.vn",
  "mqttPort": 6668,
  "uptime": 86400,
  "timestamp": 1699876543210,
  "config": { ... }
}
```

### **2. GET /api/remote/mqtt/status**
Lấy trạng thái kết nối MQTT

**Response:**
```json
{
  "success": true,
  "connected": true,
  "server": "aiot.mobifone.vn",
  "port": 6668
}
```

### **3. POST /api/remote/mqtt/config**
Cập nhật cấu hình MQTT

**Request:**
```json
{
  "server": "new-broker.example.com",
  "port": 1883,
  "username": "device123",
  "password": "secret"
}
```

**Response:**
```json
{
  "success": true,
  "message": "MQTT configuration updated, reconnecting..."
}
```

### **4. POST /api/remote/mqtt/reconnect**
Force reconnect MQTT

**Response:**
```json
{
  "success": true,
  "message": "MQTT reconnection initiated"
}
```

### **5. POST /api/remote/config**
Cập nhật cấu hình tổng quát của thiết bị

**Request:**
```json
{
  "main_volume": 80,
  "fm_volume": 60,
  "mobile_mode": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Configuration updated successfully",
  "config": { ... }
}
```

### **6. POST /api/remote/reboot**
Khởi động lại thiết bị

**Request:**
```json
{
  "delay": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device will reboot in 5 seconds"
}
```

## 🔐 Bảo mật

### **Authentication Required**
- Tất cả các trang đều yêu cầu đăng nhập
- Username: `admin`
- Password: `admin`
- Session được lưu trong localStorage

### **Khuyến nghị:**
1. ✅ Thay đổi password mặc định
2. ✅ Sử dụng HTTPS khi deploy production
3. ✅ Cấu hình firewall để hạn chế truy cập
4. ✅ Sử dụng VPN khi truy cập từ xa

## 🌐 Kịch bản sử dụng

### **Kịch bản 1: MQTT broker sai**

**Vấn đề:**
- Thiết bị được cấu hình kết nối đến broker sai
- Không thể quản lý qua MQTT platform

**Giải pháp:**
1. Truy cập `http://device-ip:3000/remote.html`
2. Cập nhật MQTT configuration với broker đúng
3. Hệ thống tự động reconnect

### **Kịch bản 2: MQTT broker offline**

**Vấn đề:**
- MQTT broker bị down hoặc network issue
- Cần quản lý thiết bị ngay lập tức

**Giải pháp:**
- Sử dụng HTTP API trực tiếp
- Tất cả chức năng vẫn hoạt động bình thường
- MQTT chỉ là kênh phụ, không ảnh hưởng đến quản lý

### **Kịch bản 3: Thiết bị ở xa (remote location)**

**Vấn đề:**
- Thiết bị đặt ở vị trí xa
- Không thể truy cập vật lý

**Giải pháp:**
1. Truy cập qua public IP hoặc VPN
2. Quản lý hoàn toàn qua web interface
3. Reboot, cập nhật config từ xa

### **Kịch bản 4: Chuyển đổi MQTT platform**

**Vấn đề:**
- Cần chuyển từ platform này sang platform khác
- Broker mới có địa chỉ/cổng khác

**Giải pháp:**
1. Truy cập Remote Management
2. Nhập thông tin broker mới
3. Save & Reconnect
4. Kiểm tra kết nối thành công

## 📊 Monitoring

### **Auto-refresh**
- Trạng thái MQTT tự động cập nhật mỗi 10 giây
- Thông tin thiết bị real-time
- Visual indicator (màu xanh/đỏ)

### **Alerts**
- ✅ Success: Màu xanh, tự động ẩn sau 5 giây
- ❌ Error: Màu đỏ, hiển thị lỗi chi tiết

## 🔧 Development

### **Local Testing**
```bash
npm run dev
```

Truy cập: `http://localhost:3000/remote.html`

### **Production Build**
```bash
npm run build
npm start
```

### **Deploy to Device**
```bash
./deploy.sh 100.88.138.81
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client Browser                     │
│  ┌──────────────┐         ┌──────────────────────┐  │
│  │ Dashboard    │────────▶│ Remote Management    │  │
│  │ (index.html) │         │ (remote.html)        │  │
│  └──────────────┘         └──────────────────────┘  │
└──────────────────┬───────────────────────┬──────────┘
                   │                        │
                   │ HTTP/HTTPS             │
                   ▼                        ▼
┌─────────────────────────────────────────────────────┐
│              Express.js Server                       │
│  ┌────────────────────────────────────────────────┐ │
│  │         Remote Management Service              │ │
│  │  ┌─────────────┐      ┌──────────────────────┐ │ │
│  │  │ HTTP API    │      │ MQTT Client          │ │ │
│  │  │ (Primary)   │      │ (Secondary/Optional) │ │ │
│  │  └─────────────┘      └──────────────────────┘ │ │
│  └────────────────────────────────────────────────┘ │
└──────────────┬────────────────────────┬─────────────┘
               │                        │
               ▼                        ▼
      ┌───────────────┐       ┌────────────────┐
      │ settings.json │       │ MQTT Broker    │
      │ (Local File)  │       │ (aiot.mobifone)│
      └───────────────┘       └────────────────┘
```

### **Key Components:**

1. **RemoteManagementService** (`src/server/services/remoteManagementService.ts`)
   - Quản lý kết nối MQTT (non-blocking)
   - Execute commands từ HTTP hoặc MQTT
   - Auto-reconnect logic
   - Configuration management

2. **RemoteController** (`src/server/controllers/remoteController.ts`)
   - HTTP API endpoints
   - Request validation
   - Error handling

3. **Remote Routes** (`src/server/routes/remote.ts`)
   - RESTful API routing
   - Authentication (future)

4. **Frontend** (`src/client/remote.html`)
   - Real-time status monitoring
   - MQTT configuration UI
   - Device control interface

## 🎓 Best Practices

### **1. Luôn kiểm tra HTTP API trước**
- HTTP là kênh chính, MQTT là phụ
- Nếu HTTP fail → kiểm tra network/firewall
- Nếu MQTT fail → thiết bị vẫn hoạt động bình thường

### **2. Backup cấu hình trước khi thay đổi**
- Lưu settings.json cũ
- Test broker mới trước khi apply production

### **3. Monitoring**
- Kiểm tra MQTT status định kỳ
- Set up alerts khi disconnect
- Log reconnection attempts

### **4. Security**
- Đổi password mặc định
- Sử dụng HTTPS cho production
- Hạn chế access qua firewall

## 🐛 Troubleshooting

### **MQTT không kết nối được**

**Triệu chứng:** Status hiển thị màu đỏ "MQTT không kết nối"

**Nguyên nhân:**
- Broker offline
- Sai địa chỉ/port
- Network firewall block
- Sai username/password

**Giải pháp:**
1. Kiểm tra broker có online không: `telnet mqtt-server 6668`
2. Thử reconnect: Click "🔄 Reconnect Now"
3. Cập nhật config nếu sai
4. Kiểm tra firewall: `sudo ufw status`
5. **LƯU Ý**: Thiết bị vẫn quản lý được qua HTTP API

### **Không thể reboot thiết bị**

**Triệu chứng:** Click Reboot nhưng không thực hiện

**Nguyên nhân:**
- Thiếu quyền sudo
- Command không tồn tại

**Giải pháp:**
```bash
# Cho phép user chạy reboot không cần password
sudo visudo
# Thêm dòng:
www-data ALL=(ALL) NOPASSWD: /sbin/reboot
```

### **Settings không lưu được**

**Triệu chứng:** Cập nhật config nhưng không persist

**Nguyên nhân:**
- File permission issue
- Disk full

**Giải pháp:**
```bash
# Check permissions
ls -la /path/to/device-web-console/dist/server/config/

# Fix permissions
chmod 664 settings.json
chown www-data:www-data settings.json
```

## 📈 Future Enhancements

- [ ] Server-side authentication với JWT
- [ ] Role-based access control
- [ ] Command history/audit log
- [ ] Firmware update qua HTTP
- [ ] Multiple device management
- [ ] WebSocket cho real-time updates
- [ ] Scheduled tasks/commands
- [ ] MQTT topic customization

## 📞 Support

Nếu gặp vấn đề, kiểm tra:
1. Server logs: `journalctl -u device-console -f`
2. MQTT connection status trong UI
3. Network connectivity: `ping mqtt-server`
4. Settings.json có hợp lệ không

---

**Lưu ý quan trọng:**
- ✅ HTTP API luôn là kênh chính để quản lý thiết bị
- ✅ MQTT chỉ là kênh phụ cho IoT platform integration
- ✅ Thiết bị hoàn toàn có thể hoạt động mà không cần MQTT
- ✅ Bạn luôn có quyền truy cập qua HTTP ngay cả khi MQTT fail
