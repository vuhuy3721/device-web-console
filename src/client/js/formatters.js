// Data formatter functions

/**
 * Format connection data for display
 */
function formatConnectionData(data) {
  let html = "";

  if (data) {
    html += '<div class="info-section"><h3>Basic Information</h3>';
    if (data.deviceId) html += createInfoRow("Device ID", data.deviceId);
    if (data.verifyCode)
      html += createInfoRow("Verify Code", data.verifyCode);
    if (data.firmwareVersion)
      html += createInfoRow("Firmware Version", data.firmwareVersion);
    html += createInfoRow("Local Time", new Date().toLocaleString());
    html += "</div>";
  }
  if (data.status || data.type || data.signalStrength || data.ipAddress) {
    html += '<div class="info-section"><h3>Network Information</h3>';
    if (data.status)
      html += createInfoRow(
        "Status",
        `<span class="badge-${data.status.toLowerCase()}">${data.status}</span>`
      );
    if (data.type) html += createInfoRow("Network Type", data.type);
    if (data.signalStrength)
      html += createInfoRow("Signal Strength", data.signalStrength);
    if (data.ipAddress)
      html += createInfoRow("IP Address", data.ipAddress);
    if (data.subnet)
      html += createInfoRow("Subnet Mask", data.subnet);
    if (data.gateway)
      html += createInfoRow("Gateway", data.gateway);
    html += "</div>";
  }

  if (data.mqttServer || data.mqttPort) {
    html += '<div class="info-section"><h3>MQTT Settings</h3>';
    if (data.bootstrapServer)
      html += createInfoRow("Bootstrap Server", data.bootstrapServer);
    if (data.mqttSecurity)
      html += createInfoRow("MQTT Security", data.mqttSecurity);
    if (data.mqttServer)
      html += createInfoRow("MQTT Server", data.mqttServer);
    if (data.mqttPort) html += createInfoRow("MQTT Port", data.mqttPort);
    html += "</div>";
  }

  if (data.timestamp) {
    html += `<div class="info-footer">Last updated: ${new Date(
      data.timestamp
    ).toLocaleString()}</div>`;
  }

  return html;
}

/**
 * Format status data for display
 */
function formatStatusData(data) {
  let html = '<div class="info-section"><h3>System Information</h3>';

  if (data.uptime) html += createInfoRow("Uptime", data.uptime);
  if (data.storage) html += createInfoRow("Storage", data.storage);
  if (data.log) html += createInfoRow("Memory Usage", data.log);
  if (data.networkType) html += createInfoRow("Network Type", data.networkType);
  if (data.fmStatus) html += createInfoRow("FM Status", data.fmStatus);
  if (data.speakerStatus) html += createInfoRow("Speaker Status", data.speakerStatus);
  if (data.streamBack) html += createInfoRow("Stream Back", data.streamBack);
  if (data.deviceTemperature) html += createInfoRow("Device Temperature", data.deviceTemperature);
  if (data.deviceHumidity) html += createInfoRow("Device Humidity", data.deviceHumidity);
  html += "</div>";

  if (data.timestamp) {
    html += `<div class="info-footer">Last updated: ${new Date(
      data.timestamp
    ).toLocaleString()}</div>`;
  }

  return html;
}

/**
 * Format network data for display
 */
function formatNetworkData(data) {
  let html = '<div class="info-section"><h3>Network Information</h3>';

  if (data.networkType)
    html += createInfoRow("Network Type", data.networkType);
  if (data.signalQuality)
    html += createInfoRow("Signal Quality", data.signalQuality);
  if (data.sim) html += createInfoRow("SIM Card", data.sim);
  if (data.latency) html += createInfoRow("Latency (ms)", data.latency);
  if (data.packetLoss)
    html += createInfoRow("Packet Loss", data.packetLoss);
  if (data.throughput)
    html += createInfoRow("Throughput", data.throughput);

  html += "</div>";

  if (data.timestamp) {
    html += `<div class="info-footer">Last updated: ${new Date(
      data.timestamp
    ).toLocaleString()}</div>`;
  }

  return html;
}

/**
 * Format about data for display
 */
function formatAboutData(data) {
  let html = '<div class="info-section"><h3>Device Information</h3>';

  if (data.device && data.device.id)
    html += createInfoRow("Device ID", data.device.id);
  if (data.version) html += createInfoRow("Version", data.version);
  if (data.buildDate) html += createInfoRow("Build Date", data.buildDate);
  if (data.platform) html += createInfoRow("Platform", data.platform);

  html += "</div>";

  if (
    data.features &&
    Array.isArray(data.features) &&
    data.features.length > 0
  ) {
    html += '<div class="info-section"><h3>Features</h3>';
    html += '<div class="feature-list">';
    data.features.forEach((f) => {
      html += `<div class="feature-item">✓ ${f}</div>`;
    });
    html += "</div></div>";
  }

  if (
    data.technology &&
    Array.isArray(data.technology) &&
    data.technology.length > 0
  ) {
    html += '<div class="info-section"><h3>Technology Stack</h3>';
    html += '<div class="tech-list">';
    data.technology.forEach((t) => {
      html += `<div class="tech-item">• ${t}</div>`;
    });
    html += "</div></div>";
  }

  if (data.timestamp) {
    html += `<div class="info-footer">Last updated: ${new Date(
      data.timestamp
    ).toLocaleString()}</div>`;
  }

  return html;
}

/**
 * Format settings data for display
 */
function formatSettingsData(data) {
  let html = '<div class="info-section"><h3>Network settings</h3>';
    // nếu giá trị không tồn tại thì hiện thị null hoặc để trống
    
    html += createInfoRow("Network Type", data.txtype, true);
    html += createInfoRow("Mobile Data Mode", data.mobile_mode, true);
    html += createInfoRow("Wifi SSID", data.wifi_ssid, true);
    html += createInfoRow("Wifi Password", data.wifi_password, true);
  html += "</div>";


    html += '<div class="info-section"><h3>Audio settings</h3>';
    html += createInfoRow("Main Volume", data.main_volume, true);
    html += createInfoRow("FM Volume", data.fm_volume, true);
    html += createInfoRow("FM Threshold", data.fm_threshold, true);

    html += "</div>";


  if (data.timestamp) {
    html += `<div class="info-footer">Last updated: ${new Date(
      data.timestamp
    ).toLocaleString()}</div>`;
  }

  return html;
}

/**
 * Format media data for display
 */
function formatMediaData(data) {
  let html = '<div class="info-section"><h3>Media Information</h3>';

  // Dropdown to select media
  if (data.mediaFiles && Array.isArray(data.mediaFiles) && data.mediaFiles.length > 0) {
    html += '<div class="info-row">';
    html += '<span class="info-label">Select Media (' + data.mediaFiles.length + ')</span>';
    html += '<select id="mediaSelect" class="media-select" onchange="loadMediaDetails()">';
    data.mediaFiles.forEach((media, index) => {
      html += `<option value="${index}">${media.id || media.mid || 'Media ' + (index + 1)}</option>`;
    });
    html += '</select>';
    html += '</div>';
    
    html += '</div>';
    
    // Media details section
    html += '<div class="info-section"><h3>Media details</h3>';
    html += '<div id="mediaDetails"></div>';
    html += '</div>';
    
    // Action buttons
    html += '<div class="media-actions">';
    html += '<button class="btn-play" onclick="playSelectedMedia()">Play</button>';
    html += '<button class="btn-stop" onclick="stopMedia()">Stop</button>';
    html += '<button class="btn-delete" onclick="deleteSelectedMedia()">Delete</button>';
    html += '<button class="btn-delete-all" onclick="deleteAllMedia()">Delete All</button>';
    html += '</div>';
    
    // Store media data globally for access
    window.currentMediaData = data.mediaFiles;
    
    // Auto-load first media details
    setTimeout(() => {
      if (window.loadMediaDetails) {
        window.loadMediaDetails();
      }
    }, 100);
  } else {
    html += '<p class="no-data">No media files available</p>';
    html += '</div>';
  }

  if (data.timestamp) {
    html += `<div class="info-footer">Last updated: ${new Date(
      data.timestamp
    ).toLocaleString()}</div>`;
  }

  return html;
}

/**
 * Load and display media details for selected media
 */
window.loadMediaDetails = function() {
  const select = document.getElementById('mediaSelect');
  const detailsDiv = document.getElementById('mediaDetails');
  
  if (!select || !detailsDiv || !window.currentMediaData) return;
  
  const selectedIndex = parseInt(select.value);
  const media = window.currentMediaData[selectedIndex];
  
  if (!media) return;
  
  let html = '';
  
  // Display media properties
  if (media.mode) html += createInfoRow('Mode', media.mode);
  if (media.priority !== undefined) html += createInfoRow('Priority', media.priority);
  if (media.created) html += createInfoRow('Created', media.created);
  if (media.expired) html += createInfoRow('Expired', media.expired);
  if (media.start) html += createInfoRow('Start', media.start);
  if (media.repeatType) html += createInfoRow('Repeat type', media.repeatType);
  if (media.activeDays) html += createInfoRow('Active Days', media.activeDays);
  if (media.scheduleTimes) html += createInfoRow('Schedule Times', media.scheduleTimes);
  if (media.scheduleDurations) html += createInfoRow('Schedule Durations', media.scheduleDurations);
  if (media.filesInfo) html += createInfoRow('Files information', typeof media.filesInfo === 'string' ? media.filesInfo : JSON.stringify(media.filesInfo));
  if (media.status) html += createInfoRow('Status', media.status);
  
  detailsDiv.innerHTML = html;
};

    
