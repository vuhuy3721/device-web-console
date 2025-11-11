# 🚀 Development Commands Summary

## Start Development

```bash
# Option 1: Dev mode with hot reload (RECOMMENDED) ⭐
npm run dev

# Option 2: Normal start (no auto-reload)
npm start

# Option 3: Watch TypeScript compilation
npm run dev:watch
```

**Server will run at:** `http://localhost:3000`

---

## 📝 File Changes You Made

1. ✅ `package.json` - Added `dev` and `dev:watch` scripts
2. ✅ `nodemon.json` - Dev server auto-reload config
3. ✅ `.env.development` - Development environment variables
4. ✅ `tsconfig.json` - TypeScript compiler options
5. ✅ `tsconfig.ts-node.json` - ts-node specific config
6. ✅ `src/server/index.ts` - Fixed imports for dev mode
7. ✅ `.vscode/settings.json` - IDE configuration
8. ✅ `.vscode/launch.json` - Debugger configuration
9. ✅ `requests.http` - REST client for testing API
10. ✅ `DEV_GUIDE.md` - Complete development guide

---

## 🔥 Quick Dev Workflow

### Terminal 1: Start Dev Server
```bash
npm run dev

# Output:
# [nodemon] watching path(s): src/**/*
# Server is running on port 3000
```

### Terminal 2: Test API (Optional)
```bash
curl http://localhost:3000/api/status
curl http://localhost:3000/api/about
```

### Edit Code
Change any `.ts` file in `src/` → **nodemon auto-restarts** ✨

---

## 🧪 Test API Endpoints

### Using cURL
```bash
# Get status
curl -H "Authorization: Bearer dev_token_12345" \
  http://localhost:3000/api/status

# Get about
curl -H "Authorization: Bearer dev_token_12345" \
  http://localhost:3000/api/about
```

### Using VS Code REST Client
1. Install "REST Client" extension (humao.rest-client)
2. Open `requests.http`
3. Click "Send Request" on any API call

### Using Postman
1. Create new request
2. Set Authorization header: `Bearer dev_token_12345`
3. Send to `http://localhost:3000/api/*`

---

## 🐛 Debugging

### Debug in VS Code
1. Press `F5` or go to Run → Start Debugging
2. Choose "Launch Dev Server" or "Launch with Nodemon"
3. Set breakpoints with F9
4. Step through code

### View Console Logs
```bash
# Terminal where npm run dev is running shows all console.log()
console.log('Debug message');
// Will appear in terminal immediately
```

### Check Types
```bash
# Watch TypeScript compilation for errors
npm run dev:watch
```

---

## 📂 Important Dev Files

| File | Purpose |
|------|---------|
| `src/server/` | Backend TypeScript code |
| `src/client/` | Frontend HTML/CSS/JS |
| `dist/` | Compiled JavaScript output |
| `node_modules/` | Dependencies |
| `tsconfig.json` | TypeScript config |
| `.env.development` | Dev environment variables |
| `nodemon.json` | Auto-reload config |
| `requests.http` | REST API test requests |

---

## ⚡ Performance Tips

1. **Change PORT** in `.env.development` if 3000 is used
2. **Keep node_modules** fresh: `npm install` if issues
3. **Clear dist** if strange errors: `rm -rf dist && npm run build`
4. **Restart dev** if auto-reload fails: Ctrl+C then `npm run dev`

---

## 🎯 Common Scenarios

### I want to add a new API endpoint

1. Create controller method in `src/server/controllers/`
2. Add route in `src/server/routes/`
3. Register route in `src/server/index.ts`
4. Test with `requests.http` or curl
5. nodemon auto-reloads automatically ✨

### I want to test without auth

Remove/comment out auth middleware in `src/server/index.ts`:
```typescript
// app.use('/api', authenticate);  // ← comment this
```

### Port 3000 is already in use

```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or change port in .env.development
PORT=3001 npm run dev
```

### TypeScript errors but code works

1. Check `tsconfig.json`
2. Run `npm install @types/[package-name]`
3. Clear `node_modules`: `rm -rf node_modules && npm install`

---

## 📚 Next Steps

1. **Run dev server:** `npm run dev`
2. **Open browser:** `http://localhost:3000`
3. **Edit code** in `src/server/controllers/`
4. **Watch auto-reload** in terminal
5. **Test API** with `requests.http`
6. **Build for production:** `npm run build`

---

## 🆘 Troubleshooting

### Server won't start
```bash
# Clean and reinstall
rm -rf node_modules dist
npm install
npm run dev
```

### Auto-reload not working
```bash
# Restart nodemon
# Kill process (Ctrl+C)
# Run again
npm run dev
```

### TypeScript compilation errors
```bash
# Check types
npm run dev:watch

# Install missing types
npm i --save-dev @types/[package]
```

### Can't connect to http://localhost:3000
```bash
# Check if server is running
ps aux | grep node

# Check port
lsof -i :3000

# Try different port
PORT=3001 npm run dev
```

---

Happy Coding! 🎉

For more details, see `DEV_GUIDE.md`
