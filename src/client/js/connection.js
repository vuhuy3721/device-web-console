const connectionInfo = {
    status: 'Disconnected',
    signalStrength: 'N/A',
    networkType: 'N/A',
    ipAddress: 'N/A',
};

function updateConnectionInfo() {
    // Simulate fetching connection info from the server
    fetch('/api/connection')
        .then(response => response.json())
        .then(data => {
            connectionInfo.status = data.status;
            connectionInfo.signalStrength = data.signalStrength;
            connectionInfo.networkType = data.networkType;
            connectionInfo.ipAddress = data.ipAddress;
            renderConnectionInfo();
        })
        .catch(error => console.error('Error fetching connection info:', error));
}

function renderConnectionInfo() {
    const deviceIdElement = document.getElementById('device-id');
    const verifyCodeElement = document.getElementById('verify-code');
    const firmwareVersionElement = document.getElementById('firmware-version');
    const connectionStatusElement = document.getElementById('connection-status');
    const signalStrengthElement = document.getElementById('signal-strength');
    const networkTypeElement = document.getElementById('network-type');
    const ipAddressElement = document.getElementById('ip-address');
    const subnetElement = document.getElementById('subnet-mask');
    const gatewayElement = document.getElementById('gateway');

    gatewayElement.textContent = `Gateway: ${connectionInfo.gateway}`;

    subnetElement.textContent = `Subnet Mask: ${connectionInfo.subnet}`;
    deviceIdElement.textContent = `Device ID: ${connectionInfo.deviceId}`;
    verifyCodeElement.textContent = `Verify Code: ${connectionInfo.verifyCode}`;
    firmwareVersionElement.textContent = `Firmware Version: ${connectionInfo.firmwareVersion}`;
    connectionStatusElement.textContent = `Status: ${connectionInfo.status}`;
    signalStrengthElement.textContent = `Signal Strength: ${connectionInfo.signalStrength}`;
    networkTypeElement.textContent = `Network Type: ${connectionInfo.networkType}`;
    ipAddressElement.textContent = `IP Address: ${connectionInfo.ipAddress}`;
}

// Call updateConnectionInfo on page load
document.addEventListener('DOMContentLoaded', updateConnectionInfo);