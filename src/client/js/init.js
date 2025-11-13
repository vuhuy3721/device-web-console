// Initialization code - runs when DOM is loaded

document.addEventListener("DOMContentLoaded", () => {
  // Check authentication
  checkAuth();
  
  // Load initial data for all tabs
  loadApiData("connection", "connection-info", formatConnectionData);
  loadApiData("settings", "settings-info", formatSettingsData);
  loadApiData("media", "media-info", formatMediaData);
  loadApiData("status", "status-info", formatStatusData);
  loadApiData("about", "about-info", formatAboutData);
  loadApiData("network", "network-info", formatNetworkData);
  loadApiData("admin/settings", "admin-info", formatConnectionData);
});
