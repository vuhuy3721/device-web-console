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
  html += createInfoRow("Speaker Status", formatSpeakerStatus(data.spkerr));
  if (data.streamBack) html += createInfoRow("Stream Back", data.streamBack);
  if (data.deviceTemperature) html += createInfoRow("Device Temperature", data.deviceTemperature);
  if (data.deviceHumidity) html += createInfoRow("Device Humidity", data.deviceHumidity);
  
  if (data.fm_status !== undefined) html += createInfoRow("FM Module", data.fm_status === 1 ? "On" : "Off");
  if (data.fm_frequency) html += createInfoRow("FM Frequency", data.fm_frequency + " MHz");
  if (data.amplifier_status) html += createInfoRow("Amplifier Status", data.amplifier_status);
  if (data.main_volume) html += createInfoRow("Main Volume", data.main_volume);
  if (data.fm_volume) html += createInfoRow("FM Volume", data.fm_volume);
  
  html += "</div>";

  if (data.last_update || data.timestamp) {
    const timestamp = data.last_update || data.timestamp;
    html += `<div class="info-footer">Last updated: ${new Date(timestamp).toLocaleString()}</div>`;
  }

  return html;
}

/**
 * Decode speaker status bitmask (12-bit) and return HTML representation.
 * Expected mapping (bits):
 * 0x100 -> Speaker 1, 0x200 -> Speaker 2, 0x400 -> Speaker 3, 0x800 -> Speaker 4
 */
function formatSpeakerStatus(value) {
  if (value === undefined || value === null || value === '') return 'N/A';

  const num = Number(value) || 0;
  const bin = '0b' + num.toString(2).padStart(12, '0');
  const dec = String(num);
  const hex = '0x' + num.toString(16).toUpperCase().padStart(3, '0');

  // Determine which speakers are active
  const parts = [];
  const badges = [];
  if (num & 0x100) { parts.push('Speaker 1'); badges.push('<span class="badge-connected">Spk1</span>'); }
  if (num & 0x200) { parts.push('Speaker 2'); badges.push('<span class="badge-connected">Spk2</span>'); }
  if (num & 0x400) { parts.push('Speaker 3'); badges.push('<span class="badge-connected">Spk3</span>'); }
  if (num & 0x800) { parts.push('Speaker 4'); badges.push('<span class="badge-connected">Spk4</span>'); }

  const active = parts.length ? parts.join(', ') : 'None';

  // Compose HTML: binary / dec / hex and badges for quick view
  return `
    <div class="speaker-status">
      <div>${badges.length ? badges.join(' ') : '<span class="no-data">No speaker active</span>'}</div>
      <div style="margin-top:6px; color:#7f8c8d; font-size:0.9em;">${active}</div>
    </div>
  `;
}

/**
 * Format network data for display
 */
function formatNetworkData(data) {
  let html = '<div class="info-section"><h3>Network Information</h3>';

  if (data.imei) html += createInfoRow("GSM IMEI", data.imei);  
  if (data.imsi) html += createInfoRow("GSM IMSI", data.imsi);
  if (data.model) html += createInfoRow("GSM Model", data.model);
  if (data.revision) html += createInfoRow("GSM Revision", data.revision);
  if (data.phoneNumber) html += createInfoRow("Phone Number", data.phoneNumber);
  if (data.gsmStatus) html += createInfoRow("GSM Status", data.gsmStatus);

  html += "</div>";

  if (data.timestamp) {
    html += `<div class="info-footer">Last updated: ${new Date(
      data.timestamp
    ).toLocaleString()}</div>`;
  }

  return html;
}

/**
 * Format admin data for display
 */
function formatAdminData(data) {
  let html = '<div class="info-section"><h3>Basic Information</h3>';
  
  html += createInfoRow("Local Time", new Date().toLocaleString());
  
  html += '</div>';
  
  html += '<div class="info-section"><h3>Change Password</h3>';
  html += '<div class="info-row">';
  html += '<span class="info-label">Current Password</span>';
  html += '<div class="info-value"><input type="password" id="currentPassword" placeholder="Enter current password" /></div>';
  html += '</div>';
  
  html += '<div class="info-row">';
  html += '<span class="info-label">New Password</span>';
  html += '<div class="info-value"><input type="password" id="newPassword" placeholder="Enter new password" /></div>';
  html += '</div>';
  
  html += '<div class="info-row">';
  html += '<span class="info-label">Confirm Password</span>';
  html += '<div class="info-value"><input type="password" id="confirmPassword" placeholder="Confirm new password" /></div>';
  html += '</div>';
  html += '</div>';
  
  return html;
}

/**
 * Format about data for display
 */
function formatAboutData(data) {
  let html = '<div class="info-section"><h3>System Information</h3>';

  html += createInfoRow("Device ID", data.id);
  html += createInfoRow("Device Vcode", data.vcode);
  html += createInfoRow("Firmware Version", data.fvers);
  html += createInfoRow("OS Version", data.os_version);
  html += createInfoRow("OS Build Date", data.os_builddate);
  html += createInfoRow("CPU Processor", "ARM Cortex-A53");
  html += createInfoRow("CPU Frequency", "1.4 GHz");
  html += createInfoRow("CPU Cores", "4");
  html += createInfoRow("RAM", "1 GB");
  html += createInfoRow("GSM IMEI", data.gsm_imei);
  html += createInfoRow("GSM IMSI", data.gsm_imsi);
  html += createInfoRow("GSM Model", data.gsm_model);
  html += createInfoRow("GSM Revision", data.gsm_revision);
  html += createInfoRow("Phone Number", data.gsm_phone || "N/A");

  html += "</div>";

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
 * Format media data for display - Table view with expandable details
 */
function formatMediaData(data) {
  let html = '';

  if (data.mediaFiles && Array.isArray(data.mediaFiles) && data.mediaFiles.length > 0) {
    // Media table
    html += '<div class="media-table-container">';
    html += '<table class="media-table">';
    html += '<thead>';
    html += '<tr>';
    html += '<th>NEWS TITLE</th>';
    html += '<th>START TIME</th>';
    html += '<th>EXPIRATION TIME</th>';
    html += '<th>RECURRENCE</th>';
    html += '<th>STATUS</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    
    data.mediaFiles.forEach((media, index) => {
      const statusClass = getMediaStatusClass(media.status, media.expired, media.start);
      const statusText = getMediaStatusText(media.status, media.expired, media.start);
      const recurrence = media.repeatType === 'MONTH DAYS' ? (media.activeDays ? 'Monthly on days ' + media.activeDays.split(',').slice(0, 3).join(',') + '...' : 'None') : (media.repeatType === 'WEEK DAYS' ? 'Weekly' : 'None');
      
      html += `<tr class="media-row" onclick="toggleMediaDetails(${index})">`;
      html += `<td class="media-title">Media ${media.id || media.mid}</td>`;
      html += `<td>${media.start || '--'}</td>`;
      html += `<td>${media.expired || 'Ongoing'}</td>`;
      html += `<td>${recurrence}</td>`;
      html += `<td><span class="status-badge status-${statusClass}">${statusText}</span></td>`;
      html += '</tr>';
      
      // Hidden details row
      html += `<tr id="details-${index}" class="media-details-row" style="display: none;">`;
      html += '<td colspan="5">';
      html += '<div class="media-details-content">';
      html += '<div class="details-grid">';
      html += `<div class="detail-item"><strong>Media ID:</strong> ${media.mid}</div>`;
      html += `<div class="detail-item"><strong>Mode:</strong> ${media.mode}</div>`;
      html += `<div class="detail-item"><strong>Priority:</strong> ${media.priority}</div>`;
      html += `<div class="detail-item"><strong>Created:</strong> ${media.created}</div>`;
      html += `<div class="detail-item"><strong>Start:</strong> ${media.start}</div>`;
      html += `<div class="detail-item"><strong>Expired:</strong> ${media.expired}</div>`;
      html += `<div class="detail-item"><strong>Repeat Type:</strong> ${media.repeatType}</div>`;
      html += `<div class="detail-item"><strong>Active Days:</strong> ${media.activeDays || 'N/A'}</div>`;
      html += `<div class="detail-item"><strong>Schedule Times:</strong> ${media.scheduleTimes || 'N/A'}</div>`;
      html += `<div class="detail-item"><strong>Durations:</strong> ${media.scheduleDurations || 'N/A'}</div>`;
      html += '</div>';
      if (media.filesInfo) {
        html += `<div class="detail-item-full"><strong>Files Info:</strong><pre>${media.filesInfo}</pre></div>`;
      }
      html += '<div class="detail-actions">';
      html += `<button class="btn-play" onclick="event.stopPropagation(); playMedia(${index})">▶ Play</button>`;
      html += `<button class="btn-stop" onclick="event.stopPropagation(); stopMedia()">⏹ Stop</button>`;
      html += `<button class="btn-delete" onclick="event.stopPropagation(); deleteMedia(${index})">🗑 Delete</button>`;
      html += '</div>';
      html += '</div>';
      html += '</td>';
      html += '</tr>';
    });
    
    html += '</tbody>';
    html += '</table>';
    html += '</div>';
    
    // Pagination info
    html += `<div class="pagination-info">Showing 1 to ${Math.min(5, data.mediaFiles.length)} of ${data.mediaFiles.length} results</div>`;
    
    // Store media data globally
    window.currentMediaData = data.mediaFiles;
  } else {
    html += '<p class="no-data">No media files available</p>';
  }

  if (data.timestamp) {
    html += `<div class="info-footer">Last updated: ${new Date(
      data.timestamp
    ).toLocaleString()}</div>`;
  }

  return html;
}

function getMediaStatusClass(status, expired, start) {
  const now = new Date();
  const expDate = expired ? new Date(expired.split(', ')[0].split('/').reverse().join('-')) : null;
  const startDate = start ? new Date(start.split(', ')[0].split('/').reverse().join('-')) : null;
  
  if (expDate && now > expDate) return 'expired';
  if (startDate && now < startDate) return 'scheduled';
  if (expired === 'Ongoing') return 'active';
  return 'active';
}

function getMediaStatusText(status, expired, start) {
  const now = new Date();
  const expDate = expired ? new Date(expired.split(', ')[0].split('/').reverse().join('-')) : null;
  const startDate = start ? new Date(start.split(', ')[0].split('/').reverse().join('-')) : null;
  
  if (expDate && now > expDate) return 'Expired';
  if (startDate && now < startDate) return 'Scheduled';
  if (expired === 'Ongoing') return 'Active';
  return 'Active';
}

window.toggleMediaDetails = function(index) {
  const detailsRow = document.getElementById(`details-${index}`);
  if (detailsRow) {
    detailsRow.style.display = detailsRow.style.display === 'none' ? 'table-row' : 'none';
  }
};

window.playMedia = function(index) {
  if (!window.currentMediaData) return;
  const media = window.currentMediaData[index];
  playSelectedMedia(media.mid);
};

window.deleteMedia = function(index) {
  if (!window.currentMediaData) return;
  const media = window.currentMediaData[index];
  deleteSelectedMedia(media.mid);
};

/**
 * Format GSM Basic Information for display
 */
function formatBasicInfo(data) {
  let html = '';
  
  if (data.gsm_imei) html += createInfoRow('IMEI', data.gsm_imei);
  if (data.gsm_model) html += createInfoRow('MODEL', data.gsm_model);
  if (data.gsm_revision) html += createInfoRow('REVISION', data.gsm_revision);
  if (data.gsm_imsi) html += createInfoRow('IMSI', data.gsm_imsi);
  if (data.gsm_phone) html += createInfoRow('Phone Number', data.gsm_phone);
  if (data.gsm_status) html += createInfoRow('GSM status', data.gsm_status);
  if (data.data_status) html += createInfoRow('DATA status', data.data_status);
  
  return html;
}
    
