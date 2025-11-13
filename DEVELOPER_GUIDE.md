# Quick Reference Guide - Modular JavaScript Structure

## Where to Find Things

### Need to add/modify authentication?
📁 **File**: `src/client/js/auth.js`
- Login check: `checkAuth()`
- Logout: `logout()`

### Need to add/modify UI elements?
📁 **File**: `src/client/js/ui-utils.js`
- Show/hide sections: `showSection(sectionId)`
- Create data rows: `createInfoRow(label, value, isEditable)`
- Alerts: `showAlert(message, type)`

### Need to add/modify API calls?
📁 **File**: `src/client/js/api.js`
- Load data: `loadApiData(endpoint, elementId, formatter)`
- POST: `postApiData(endpoint, data)`
- PUT: `putApiData(endpoint, data)`
- DELETE: `deleteApiData(endpoint)`

### Need to add/modify data formatting?
📁 **File**: `src/client/js/formatters.js`
- Connection: `formatConnectionData(data)`
- Status: `formatStatusData(data)`
- Network: `formatNetworkData(data)`
- About: `formatAboutData(data)`
- Settings: `formatSettingsData(data)`

### Need to add/modify button actions?
📁 **File**: `src/client/js/actions.js`
- Settings: `updateSettings()`, `resetToDefault()`
- Connection: `updateConnection()`, `resetConnection()`
- Media: `updateMedia()`, `resetMedia()`
- Player: `updatePlayer()`, `resetPlayer()`
- Status: `refreshStatus()`, `resetStatus()`
- Network: `updateNetwork()`, `resetNetwork()`
- Admin: `updateAdminSettings()`, `rebootDevice()`, `exportLogs()`

### Need to modify page initialization?
📁 **File**: `src/client/js/init.js`
- Page load: DOMContentLoaded event handler
- Initial data loading

### Need to modify HTML structure?
📁 **File**: `src/client/index.html`
- Header, navigation, sections, footer

## Common Tasks

### ✅ Adding a New Tab
1. **Add HTML section** in `index.html`:
```html
<section id="newtab">
  <h2>🆕 New Tab</h2>
  <div id="newtab-info" class="section-content">
    <p>Loading...</p>
  </div>
</section>
```

2. **Add navigation link** in `index.html`:
```html
<li><a href="#newtab" onclick="showSection('newtab')">🆕 New Tab</a></li>
```

3. **Add formatter** in `formatters.js`:
```javascript
function formatNewTabData(data) {
  let html = '<div class="info-section"><h3>Title</h3>';
  // Add your formatting logic
  html += "</div>";
  return html;
}
```

4. **Load data on init** in `init.js`:
```javascript
loadApiData("newtab", "newtab-info", formatNewTabData);
```

### ✅ Adding a New Action Button
1. **Add button** in `index.html`:
```html
<button onclick="updateNewTab()" class="btn btn-primary">
  💾 Update
</button>
```

2. **Add handler** in `actions.js`:
```javascript
async function updateNewTab() {
  try {
    const response = await fetch('/api/newtab', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_token_12345'
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      alert('✅ Updated successfully!');
      loadApiData("newtab", "newtab-info", formatNewTabData);
    }
  } catch (error) {
    alert('❌ Error: ' + error.message);
  }
}
```

### ✅ Adding a New Formatter
1. **Add function** in `formatters.js`:
```javascript
function formatMyData(data) {
  let html = '<div class="info-section">';
  html += '<h3>Section Title</h3>';
  
  if (data.field1) 
    html += createInfoRow("Field 1", data.field1);
  if (data.field2) 
    html += createInfoRow("Field 2", data.field2);
  
  html += "</div>";
  return html;
}
```

2. **Use it** in API call:
```javascript
loadApiData("myendpoint", "my-element-id", formatMyData);
```

### ✅ Adding a New API Endpoint Call
1. **Use existing helper** in `api.js`:
```javascript
// GET request
loadApiData("myendpoint", "element-id", formatMyData);

// POST request
const result = await postApiData("myendpoint", { key: "value" });

// PUT request
const result = await putApiData("myendpoint", { key: "value" });

// DELETE request
const result = await deleteApiData("myendpoint");
```

### ✅ Adding Custom UI Component
1. **Add function** in `ui-utils.js`:
```javascript
function createMyComponent(data) {
  return `<div class="my-component">
    <span>${data.label}</span>
    <span>${data.value}</span>
  </div>`;
}
```

2. **Use it** in formatter:
```javascript
html += createMyComponent({ label: "Test", value: "123" });
```

## Coding Conventions

### Function Naming
- **Actions**: `verb` + `Noun` (e.g., `updateSettings`, `resetConnection`)
- **Formatters**: `format` + `Noun` + `Data` (e.g., `formatConnectionData`)
- **UI**: `verb` + `Noun` (e.g., `showSection`, `createInfoRow`)
- **API**: `verb` + `Api` + `Data` (e.g., `loadApiData`, `postApiData`)

### Error Handling
Always use try-catch with user-friendly alerts:
```javascript
try {
  // Your code
  alert('✅ Success message');
} catch (error) {
  alert('❌ Error: ' + error.message);
  console.error('Detailed error:', error);
}
```

### Confirmation Dialogs
For destructive actions:
```javascript
if (confirm('⚠️ Are you sure?')) {
  // Proceed with action
}
```

### Loading Data Pattern
```javascript
async function loadMyData() {
  try {
    const response = await fetch('/api/endpoint');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    // Process data
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## File Structure Reference
```
src/client/
├── index.html          ← HTML structure only
├── login.html          ← Login page
├── remote.html         ← Remote management
├── css/
│   └── styles.css      ← All styles
└── js/
    ├── auth.js         ← 🔐 Authentication
    ├── ui-utils.js     ← 🎨 UI helpers
    ├── api.js          ← 🌐 API communication
    ├── formatters.js   ← 📊 Data formatters
    ├── actions.js      ← ⚡ Event handlers
    └── init.js         ← 🚀 Initialization
```

## Testing Checklist
Before committing changes:
- [ ] No console errors
- [ ] All tabs load correctly
- [ ] All buttons work
- [ ] API calls succeed
- [ ] Formatting looks good
- [ ] Authentication works
- [ ] Mobile responsive

## Debugging Tips

### Can't find a function?
1. Check `actions.js` for button handlers
2. Check `formatters.js` for display logic
3. Check `api.js` for HTTP calls
4. Check `ui-utils.js` for UI helpers
5. Check `auth.js` for authentication

### API not loading?
1. Check browser console for errors
2. Verify endpoint in `api.js` `loadApiData()` call
3. Check network tab in DevTools
4. Verify server is running (port 3000)
5. Check formatter function name matches

### Button not working?
1. Check `onclick` attribute in `index.html`
2. Verify function exists in `actions.js`
3. Check browser console for errors
4. Verify API endpoint is correct
5. Check authorization token

### Page not loading?
1. Check `init.js` DOMContentLoaded handler
2. Verify all script includes in `index.html`
3. Check authentication in `auth.js`
4. Verify localStorage has session

## Performance Tips
- Keep functions small and focused
- Use async/await for API calls
- Cache DOM queries if repeated
- Minimize DOM manipulations
- Use event delegation when possible

## Security Reminders
- Always validate user input
- Use authorization headers
- Sanitize HTML before inserting to DOM
- Don't expose sensitive data in client code
- Use HTTPS in production

---
**Last Updated**: 2025-01-XX
**Maintained by**: Development Team
