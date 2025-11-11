document.addEventListener('DOMContentLoaded', function() {
    const settingsContainer = document.getElementById('settings-container');
    
    // Fetch settings from the server
    fetch('/api/settings')
        .then(response => response.json())
        .then(data => {
            displaySettings(data);
        })
        .catch(error => console.error('Error fetching settings:', error));

    function displaySettings(settings) {
        settingsContainer.innerHTML = `
            <h2>Settings</h2>
            <div>
                <strong>Bootstrap Enabled:</strong> ${settings.bootstrap_enabled ? 'Yes' : 'No'}<br>
                <strong>MQTT Server:</strong> ${settings.bootstrap_mqtt_defaults.mqtt_server}<br>
                <strong>MQTT Port:</strong> ${settings.bootstrap_mqtt_defaults.mqtt_port}<br>
                <strong>MQTT Security:</strong> ${settings.bootstrap_mqtt_defaults.mqtt_security}<br>
                <strong>Main Volume:</strong> ${settings.main_volume}<br>
                <strong>FM Volume:</strong> ${settings.fm_volume}<br>
                <strong>FM Threshold:</strong> ${settings.fm_threshold}<br>
                <strong>Mobile Mode:</strong> ${settings.mobile_mode}<br>
                <strong>External ID:</strong> ${settings.external_id}<br>
                <strong>External Key:</strong> ${settings.external_key}<br>
            </div>
            <button id="update-settings">Update Settings</button>
        `;

        document.getElementById('update-settings').addEventListener('click', updateSettings);
    }

    function updateSettings() {
        const updatedSettings = {
            bootstrap_enabled: true, // Example value, replace with actual input values
            bootstrap_mqtt_defaults: {
                mqtt_port: 6668,
                mqtt_security: 1,
                mqtt_server: "aiot.mobifone.vn"
            },
            main_volume: 50,
            fm_volume: 50,
            fm_threshold: 20,
            mobile_mode: 3,
            external_id: "88171961790594632",
            external_key: "1587939242"
        };

        fetch('/api/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedSettings)
        })
        .then(response => response.json())
        .then(data => {
            alert('Settings updated successfully!');
            displaySettings(data);
        })
        .catch(error => console.error('Error updating settings:', error));
    }
});