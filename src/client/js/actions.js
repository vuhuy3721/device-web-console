// Action handler functions

/**
 * Settings actions
 */
async function updateSettings() {
  try {
    const inputs = document.querySelectorAll('#settings-info input');
    const settings = {};
    
    // Map label text to actual field names
    const fieldMapping = {
      'Network Type': 'txtype',
      'Mobile Data Mode': 'mobile_mode',
      'Wifi SSID': 'wifi_ssid',
      'Wifi Password': 'wifi_password',
      'Main Volume': 'main_volume',
      'FM Volume': 'fm_volume',
      'FM Threshold': 'fm_threshold'
    };
    
    inputs.forEach(input => {
      const label = input.closest('.info-row').querySelector('.info-label').textContent;
      const fieldName = fieldMapping[label];
      if (fieldName) {
        settings[fieldName] = input.value;
      }
    });

    // Check if WiFi is being configured
    const isWifiUpdate = settings.wifi_ssid && settings.wifi_password;

    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_token_12345'
      },
      body: JSON.stringify(settings)
    });

    if (response.ok) {
      const result = await response.json();
      
      // Display different messages based on WiFi connection status
      if (isWifiUpdate) {
        if (result.wifi_connected) {
          alert('✅ Settings updated and successfully connected to WiFi: ' + settings.wifi_ssid);
        } else {
          alert('⚠️ Settings saved but failed to connect to WiFi: ' + settings.wifi_ssid + '\nError: ' + (result.error || 'Connection failed'));
        }
      } else {
        alert('✅ Settings updated successfully!');
      }
      
      loadApiData("settings", "settings-info", formatSettingsData);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    alert('❌ Error updating settings: ' + error.message);
    console.error('Update settings error:', error);
  }
}

async function resetToDefault() {
  if (confirm('Are you sure you want to reset all settings to default values? This cannot be undone.')) {
    try {
      const response = await fetch('/api/admin/settings/reset', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer dev_token_12345'
        }
      });

      if (response.ok) {
        alert('✅ Settings reset to default successfully!');
        loadApiData("settings", "settings-info", formatSettingsData);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      alert('❌ Error resetting settings: ' + error.message);
      console.error('Reset settings error:', error);
    }
  }
}

/**
 * Connection actions
 */
async function updateConnection() {
  try {
    const inputs = document.querySelectorAll('#connection-info input');
    const connectionData = {};
    
    inputs.forEach(input => {
      const label = input.closest('.info-row').querySelector('.info-label').textContent;
      connectionData[label] = input.value;
    });

    const response = await fetch('/api/connection', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_token_12345'
      },
      body: JSON.stringify(connectionData)
    });

    if (response.ok) {
      alert('✅ Connection updated successfully!');
      loadApiData("connection", "connection-info", formatConnectionData);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    alert('❌ Error updating connection: ' + error.message);
    console.error('Update connection error:', error);
  }
}

async function resetConnection() {
  if (confirm('Are you sure you want to reset connection settings to default?')) {
    try {
      const response = await fetch('/api/connection/reset', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer dev_token_12345'
        }
      });

      if (response.ok) {
        alert('✅ Connection reset to default successfully!');
        loadApiData("connection", "connection-info", formatConnectionData);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      alert('❌ Error resetting connection: ' + error.message);
      console.error('Reset connection error:', error);
    }
  }
}

/**
 * Media actions
 */
async function updateMedia() {
  try {
    const inputs = document.querySelectorAll('#media-info input');
    const mediaData = {};
    
    inputs.forEach(input => {
      const label = input.closest('.info-row').querySelector('.info-label').textContent;
      mediaData[label] = input.value;
    });

    const response = await fetch('/api/media', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_token_12345'
      },
      body: JSON.stringify(mediaData)
    });

    if (response.ok) {
      alert('✅ Media updated successfully!');
      loadApiData("media", "media-info", formatConnectionData);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    alert('❌ Error updating media: ' + error.message);
    console.error('Update media error:', error);
  }
}

async function resetMedia() {
  if (confirm('Are you sure you want to reset media settings to default?')) {
    try {
      const response = await fetch('/api/media/reset', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer dev_token_12345'
        }
      });

      if (response.ok) {
        alert('✅ Media reset to default successfully!');
        loadApiData("media", "media-info", formatConnectionData);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      alert('❌ Error resetting media: ' + error.message);
      console.error('Reset media error:', error);
    }
  }
}

/**
 * Player actions
 */
async function updatePlayer() {
  try {
    const inputs = document.querySelectorAll('#player-info input');
    const playerData = {};
    
    inputs.forEach(input => {
      const label = input.closest('.info-row').querySelector('.info-label').textContent;
      playerData[label] = input.value;
    });

    const response = await fetch('/api/player', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_token_12345'
      },
      body: JSON.stringify(playerData)
    });

    if (response.ok) {
      alert('✅ Player updated successfully!');
      loadApiData("player", "player-info", formatConnectionData);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    alert('❌ Error updating player: ' + error.message);
    console.error('Update player error:', error);
  }
}

async function resetPlayer() {
  if (confirm('Are you sure you want to reset player settings to default?')) {
    try {
      const response = await fetch('/api/player/reset', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer dev_token_12345'
        }
      });

      if (response.ok) {
        alert('✅ Player reset to default successfully!');
        loadApiData("player", "player-info", formatConnectionData);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      alert('❌ Error resetting player: ' + error.message);
      console.error('Reset player error:', error);
    }
  }
}

/**
 * Status actions
 */
async function refreshStatus() {
  try {
    alert('🔄 Refreshing status...');
    loadApiData("status", "status-info", formatStatusData);
    alert('✅ Status refreshed successfully!');
  } catch (error) {
    alert('❌ Error refreshing status: ' + error.message);
    console.error('Refresh status error:', error);
  }
}

async function resetStatus() {
  if (confirm('Are you sure you want to reset status to default?')) {
    try {
      const response = await fetch('/api/status/reset', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer dev_token_12345'
        }
      });

      if (response.ok) {
        alert('✅ Status reset to default successfully!');
        loadApiData("status", "status-info", formatStatusData);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      alert('❌ Error resetting status: ' + error.message);
      console.error('Reset status error:', error);
    }
  }
}

/**
 * Network actions
 */
async function updateNetwork() {
  try {
    const inputs = document.querySelectorAll('#network-info input');
    const networkData = {};
    
    inputs.forEach(input => {
      const label = input.closest('.info-row').querySelector('.info-label').textContent;
      networkData[label] = input.value;
    });

    const response = await fetch('/api/network', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_token_12345'
      },
      body: JSON.stringify(networkData)
    });

    if (response.ok) {
      alert('✅ Network updated successfully!');
      loadApiData("network", "network-info", formatNetworkData);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    alert('❌ Error updating network: ' + error.message);
    console.error('Update network error:', error);
  }
}

async function resetNetwork() {
  if (confirm('Are you sure you want to reset network settings to default?')) {
    try {
      const response = await fetch('/api/network/reset', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer dev_token_12345'
        }
      });

      if (response.ok) {
        alert('✅ Network reset to default successfully!');
        loadApiData("network", "network-info", formatNetworkData);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      alert('❌ Error resetting network: ' + error.message);
      console.error('Reset network error:', error);
    }
  }
}

async function sendATCommand() {
  try {
    const command = document.getElementById('atCommand').value;
    const timeout = document.getElementById('atTimeout').value;
    const responseField = document.getElementById('atResponse');

    if (!command) {
      alert('⚠️ Please enter an AT command');
      return;
    }

    responseField.value = 'Sending...';

    const response = await fetch('/api/network/at-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_token_12345'
      },
      body: JSON.stringify({
        command: command,
        timeout: parseInt(timeout) || 3
      })
    });

    const result = await response.json();

    if (response.ok) {
      responseField.value = result.data.response || result.message || 'OK';
    } else {
      responseField.value = 'ERROR: ' + (result.error || result.message || 'Command failed');
    }
  } catch (error) {
    document.getElementById('atResponse').value = 'ERROR: ' + error.message;
    console.error('AT Command error:', error);
  }
}

/**
 * Admin actions
 */
async function changePassword() {
  try {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('⚠️ Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('⚠️ New password and confirmation do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('⚠️ New password must be at least 6 characters long');
      return;
    }

    const response = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_token_12345'
      },
      body: JSON.stringify({
        currentPassword: currentPassword,
        newPassword: newPassword
      })
    });

    const result = await response.json();

    if (response.ok) {
      alert('✅ Password changed successfully!');
      // Clear password fields
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
      
      // Logout after password change
      setTimeout(() => {
        logout();
      }, 1000);
    } else {
      throw new Error(result.error || 'Failed to change password');
    }
  } catch (error) {
    alert('❌ Error changing password: ' + error.message);
    console.error('Change password error:', error);
  }
}

async function updateAdminSettings() {
  try {
    const inputs = document.querySelectorAll('#admin-info input');
    const adminData = {};
    
    inputs.forEach(input => {
      const label = input.closest('.info-row').querySelector('.info-label').textContent;
      adminData[label] = input.value;
    });

    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_token_12345'
      },
      body: JSON.stringify(adminData)
    });

    if (response.ok) {
      alert('✅ Admin settings updated successfully!');
      loadApiData("admin/settings", "admin-info", formatConnectionData);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    alert('❌ Error updating admin settings: ' + error.message);
    console.error('Update admin settings error:', error);
  }
}

async function rebootDevice() {
  if (confirm('⚠️ Are you sure you want to reboot the device? This will interrupt all operations.')) {
    try {
      const response = await fetch('/api/reboot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dev_token_12345'
        },
        body: JSON.stringify({ option: 1 })
      });

      if (response.ok) {
        alert('✅ Device reboot initiated! The device will be unavailable for a few moments.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      alert('❌ Error rebooting device: ' + error.message);
      console.error('Reboot device error:', error);
    }
  }
}

async function exportLogs() {
  try {
    const response = await fetch('/api/logs?limit=200', {
      headers: {
        'Authorization': 'Bearer dev_token_12345'
      }
    });

    if (response.ok) {
      const data = await response.json();
      
      // Create a formatted log file
      let logsText = 'Device Logs Export\n';
      logsText += '=' .repeat(50) + '\n';
      logsText += `Exported at: ${new Date().toLocaleString()}\n\n`;
      
      if (data.data && data.data.logs && Array.isArray(data.data.logs)) {
        data.data.logs.forEach(log => {
          logsText += `[${new Date(log.timestamp).toLocaleString()}] ${log.level} - ${log.message}\n`;
          if (log.details) {
            logsText += `  Details: ${JSON.stringify(log.details)}\n`;
          }
        });
      } else if (data.logs) {
        data.logs.forEach(log => {
          logsText += `[${new Date(log.timestamp).toLocaleString()}] ${log.level} - ${log.message}\n`;
        });
      }
      
      const blob = new Blob([logsText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `device-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      alert('✅ Logs exported successfully!');
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    alert('❌ Error exporting logs: ' + error.message);
    console.error('Export logs error:', error);
  }
}

/**
 * Media actions
 */
async function playSelectedMedia(mediaId) {
  try {
    // If mediaId not provided, try to get from old dropdown (backward compatibility)
    if (!mediaId) {
      const select = document.getElementById('mediaSelect');
      if (!select || !window.currentMediaData) {
        alert('⚠️ No media selected');
        return;
      }
      const selectedIndex = parseInt(select.value);
      const media = window.currentMediaData[selectedIndex];
      mediaId = media.mid;
    }
    
    const response = await fetch('/api/media/play', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev_token_12345'
      },
      body: JSON.stringify({ mediaId: mediaId })
    });

    if (response.ok) {
      alert('▶️ Playing media: ' + mediaId);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    alert('❌ Error playing media: ' + error.message);
    console.error('Play media error:', error);
  }
}

/**
 * Play media by index (wrapper for table view)
 */
async function playMedia(index) {
  if (!window.currentMediaData || !window.currentMediaData[index]) {
    alert('⚠️ Media not found');
    return;
  }
  const mediaId = window.currentMediaData[index].mid;
  await playSelectedMedia(mediaId);
}

/**
 * Stop media playback
 */
async function stopMedia() {
  try {
    const response = await fetch('/api/media/stop', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer dev_token_12345'
      }
    });

    if (response.ok) {
      alert('⏹️ Media stopped');
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    alert('❌ Error stopping media: ' + error.message);
    console.error('Stop media error:', error);
  }
}

/**
 * Delete media by index (wrapper for table view)
 */
async function deleteMedia(index) {
  if (!window.currentMediaData || !window.currentMediaData[index]) {
    alert('⚠️ Media not found');
    return;
  }
  const mediaId = window.currentMediaData[index].mid;
  await deleteSelectedMedia(mediaId);
}

async function deleteSelectedMedia(mediaId) {
  // If mediaId not provided, try to get from old dropdown (backward compatibility)
  if (!mediaId) {
    const select = document.getElementById('mediaSelect');
    if (!select || !window.currentMediaData) {
      alert('⚠️ No media selected');
      return;
    }
    const selectedIndex = parseInt(select.value);
    const media = window.currentMediaData[selectedIndex];
    mediaId = media.mid;
  }
  
  if (confirm('⚠️ Are you sure you want to delete media: ' + mediaId + '?')) {
    try {
      const response = await fetch('/api/media/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dev_token_12345'
        },
        body: JSON.stringify({ mediaId: mediaId })
      });

      if (response.ok) {
        alert('✅ Media deleted successfully!');
        loadApiData("media", "media-info", formatMediaData);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      alert('❌ Error deleting media: ' + error.message);
      console.error('Delete media error:', error);
    }
  }
}

async function deleteAllMedia() {
  if (confirm('⚠️ Are you sure you want to delete ALL media files? This action cannot be undone!')) {
    try {
      const response = await fetch('/api/media/delete-all', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer dev_token_12345'
        }
      });

      if (response.ok) {
        alert('✅ All media deleted successfully!');
        loadApiData("media", "media-info", formatMediaData);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      alert('❌ Error deleting all media: ' + error.message);
      console.error('Delete all media error:', error);
    }
  }
}

/**
 * Filter media by status
 */
function filterMedia(status) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Get all media rows
  const rows = document.querySelectorAll('.media-row');
  
  rows.forEach(row => {
    const statusBadge = row.querySelector('.status-badge');
    if (!statusBadge) return;
    
    const rowStatus = statusBadge.className.includes('status-active') ? 'active' :
                      statusBadge.className.includes('status-scheduled') ? 'scheduled' :
                      statusBadge.className.includes('status-expired') ? 'expired' : '';
    
    if (status === 'all' || rowStatus === status) {
      row.style.display = '';
      // Also show the details row if it exists
      const nextRow = row.nextElementSibling;
      if (nextRow && nextRow.classList.contains('media-details-row')) {
        // Keep it hidden unless it was opened
        if (nextRow.style.display === 'table-row') {
          nextRow.style.display = 'table-row';
        }
      }
    } else {
      row.style.display = 'none';
      // Hide details row too
      const nextRow = row.nextElementSibling;
      if (nextRow && nextRow.classList.contains('media-details-row')) {
        nextRow.style.display = 'none';
      }
    }
  });
  
  // Update visible count
  const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none');
  const paginationInfo = document.querySelector('.pagination-info');
  if (paginationInfo) {
    paginationInfo.textContent = `Showing ${visibleRows.length} of ${rows.length} results`;
  }
}

/**
 * Refresh media schedule
 */
async function refreshMediaSchedule() {
  try {
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '⏳ Loading...';
    button.disabled = true;
    
    await loadApiData("media", "media-info", formatMediaData);
    
    button.innerHTML = originalText;
    button.disabled = false;
    
    // Show success message briefly
    const tempText = button.innerHTML;
    button.innerHTML = '✅ Refreshed!';
    setTimeout(() => {
      button.innerHTML = tempText;
    }, 2000);
  } catch (error) {
    console.error('Refresh media error:', error);
    alert('❌ Error refreshing media schedule: ' + error.message);
    event.target.innerHTML = '🔄 Refresh';
    event.target.disabled = false;
  }
}

/**
 * Refresh About Info
 */
async function refreshInfo() {
  try {
    loadApiData("about", "about-info", formatAboutData);
    alert('✅ About information refreshed successfully!');
  } catch (error) {
    alert('❌ Error refreshing about information: ' + error.message);
    console.error('Refresh about info error:', error);
  }
} 