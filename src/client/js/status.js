document.addEventListener("DOMContentLoaded", function() {
    const statusContainer = document.getElementById("status-container");

    function fetchStatus() {
        fetch('/api/status')
            .then(response => response.json())
            .then(data => {
                displayStatus(data);
            })
            .catch(error => {
                console.error('Error fetching status:', error);
                statusContainer.innerHTML = '<p>Error fetching status information.</p>';
            });
    }

    function displayStatus(data) {
        statusContainer.innerHTML = `
            <h2>Device Status</h2>
            <p><strong>Connection:</strong> ${data.connection}</p>
            <p><strong>Settings:</strong> ${JSON.stringify(data.settings)}</p>
            <p><strong>Media:</strong> ${data.media}</p>
            <p><strong>Player:</strong> ${data.player}</p>
            <p><strong>3G/4G:</strong> ${data.network}</p>
            <p><strong>Admin:</strong> ${data.admin}</p>
            <p><strong>About:</strong> ${data.about}</p>
        `;
    }

    fetchStatus();
});