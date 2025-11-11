# 🛠️ Development Setup Guide

## ⚡ Quick Start (30 seconds)

```bash
# Clone/Open project
cd /home/huy/Documents/device-web-console

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**Server sẽ chạy tại:** `http://localhost:3000`

✨ **Auto-reload khi bạn thay đổi code!**

---

## 📦 Development Commands

### Start Dev Server (Hot Reload)
```bash
npm run dev
```
- Chạy với `nodemon` + `ts-node`
- Tự động reload khi file `.ts` thay đổi
- Không cần compile lại thủ công
- Xem logs real-time trong terminal

### Start Normal (No Auto-reload)
```bash
npm start
```
- Chạy trực tiếp ts-node
- Không có hot reload
- Nhanh hơn một chút

### Watch TypeScript Compilation
```bash
npm run dev:watch
```
- Compile TypeScript in real-time
- Hữu ích nếu bạn muốn thấy lỗi ngay

### Build for Production
```bash
npm run build
```
- Compile TypeScript → JavaScript
- Output: `dist/` folder

### Production Build (Optimized)
```bash
npm run build:prod
```
- Build + remove devDependencies
- Sẵn sàng để deploy

---

## 🔄 Development Workflow

### Khi làm việc với Backend (TypeScript)

1. **Bắt đầu dev server:**
   ```bash
   npm run dev
   ```

2. **Code your changes** trong `src/server/`
   - Controllers, Routes, Middleware, Config
   - Nodemon tự động reload

3. **Test API** với curl/Postman:
   ```bash
   curl http://localhost:3000/api/status
   curl http://localhost:3000/api/about
   ```

4. **Xem console logs** để debug

### Khi làm việc với Frontend (HTML/CSS/JS)

1. **Dev server đang chạy** (tự phục vụ static files)
   ```bash
   npm run dev
   ```

2. **Edit files** trong `src/client/`
   - HTML: `src/client/index.html`
   - CSS: `src/client/css/styles.css`
   - JS: `src/client/js/*.js`

3. **Reload browser** (F5) để thấy changes

---

## 📁 Project Structure (Dev)

```
device-web-console/
├── src/
│   ├── server/              ← Backend TypeScript
│   │   ├── index.ts        ← Main server file
│   │   ├── controllers/    ← API handlers
│   │   ├── routes/         ← API routes
│   │   ├── middleware/     ← Auth, validation, etc
│   │   └── config/         ← Database, settings
│   ├── client/             ← Frontend
│   │   ├── index.html      ← Main page
│   │   ├── css/            ← Styles
│   │   └── js/             ← Client scripts
│   └── types/              ← TypeScript interfaces
├── dist/                   ← Compiled output (auto-generated)
├── node_modules/           ← Dependencies
├── package.json            ← Scripts + Dependencies
├── tsconfig.json           ← TypeScript config
├── nodemon.json            ← Dev server config
├── .env.development        ← Dev environment variables
└── ...
```

---

## 🧪 Testing Development Setup

### 1. Check Server Running
```bash
# In another terminal
curl http://localhost:3000
```

### 2. Test API Endpoint
```bash
curl http://localhost:3000/api/status
curl http://localhost:3000/api/about
```

### 3. View Static Files
```bash
# Browser
http://localhost:3000
http://localhost:3000/index.html
```

### 4. Check Logs
```bash
# Watch nodemon output in terminal where npm run dev is running
```

---

## 🐛 Debugging

### Enable Debug Logging
Add to `src/server/index.ts`:
```typescript
import express from 'express';
const app = express();

// Enable debug
process.env.DEBUG = 'express:*';
```

### Use Chrome DevTools
```bash
node --inspect dist/server/index.js
# Then visit: chrome://inspect
```

### Check Port Usage
```bash
# Find what's using port 3000
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

### Common Issues

| Problem | Solution |
|---------|----------|
| `Port 3000 in use` | Change PORT in `.env.development` or kill process |
| `Cannot find module` | Run `npm install` |
| `TypeScript errors` | Check `tsconfig.json` or run `npm run build` |
| `Hot reload not working` | Restart `npm run dev` |
| `Static files not loading` | Check `src/client/` folder exists |

---

## 🔄 Hot Reload How It Works

When you edit `src/server/**/*.ts`:

1. **Nodemon detects** file change
2. **Terminates** old process
3. **Restarts** with `ts-node`
4. **Loads** new code
5. **Ready** for next request

⚡ Takes ~1-2 seconds typically

---

## 💡 Tips for Development

### Use Environment Variables
```typescript
// In your code
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';
```

### Leverage TypeScript
```typescript
// Type safety helps catch errors early
interface Device {
    id: string;
    name: string;
    status: 'online' | 'offline';
}
```

### Monitor Changes
```bash
# In separate terminal, watch TypeScript compilation
npm run dev:watch
```

### Use REST Client Extension (VS Code)
Create `requests.rest` file:
```
GET http://localhost:3000/api/status
Authorization: Bearer dev_token_12345

###

GET http://localhost:3000/api/about

###

POST http://localhost:3000/api/admin/password
Content-Type: application/json

{
  "newPassword": "new_password_123"
}
```

Then click "Send Request" in VS Code!

---

## 📚 Next Steps

1. **Start dev server:** `npm run dev`
2. **Edit a file** in `src/server/controllers/`
3. **See auto-reload** in terminal
4. **Test API** with curl/Postman
5. **Build for production:** `npm run build`

Happy coding! 🚀
