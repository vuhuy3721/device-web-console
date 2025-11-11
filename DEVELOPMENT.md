# 💻 Development Mode - Quick Start

## ⚡ 3 Ways to Run

### 1. **Dev Mode with Auto-reload** (BEST) ⭐
```bash
npm run dev
```
- Auto-restarts when you edit `.ts` files
- Hot reload = super fast development
- **Recommended for development**

### 2. **Normal Start** (No auto-reload)
```bash
npm start
```
- Run once, no auto-reload
- Good for testing final build

### 3. **Build for Production**
```bash
npm run build
npm run build:prod
```
- Compiles TypeScript to JavaScript
- Optimizes for embedded device

---

## 🎯 What's Included

✅ **nodemon** - Auto-restart on file changes  
✅ **ts-node** - Run TypeScript directly  
✅ **TypeScript** - Type safety  
✅ **Express** - Web framework  
✅ **REST Client** - Test APIs in VS Code  
✅ **VS Code Debug** - Breakpoint debugging  

---

## 🔧 Files Setup for Dev

```
✅ package.json          - Added "dev" script
✅ nodemon.json          - Watch configuration
✅ .env.development      - Dev environment variables
✅ tsconfig.ts-node.json - ts-node configuration
✅ .vscode/launch.json   - Debugger config
✅ requests.http         - API test requests
```

---

## 📝 Complete Guide

See `DEV_GUIDE.md` for:
- Detailed workflow
- Debugging setup
- Testing APIs
- Troubleshooting
- Pro tips

---

## 🚀 Next: Deploy

When ready to deploy:

**Development ✓**  
**→ Production Build:** `npm run build:prod`  
**→ Deploy Script:** `./deploy.sh 192.168.1.100`  

See `DEPLOY_GUIDE.md` for details.

---

Made with ❤️ for embedded devices
