document.addEventListener("DOMContentLoaded", function() {
    const connectionSection = document.getElementById("connection");
    const settingsSection = document.getElementById("settings");
    const mediaSection = document.getElementById("media");
    const playerSection = document.getElementById("player");
    const statusSection = document.getElementById("status");
    const networkSection = document.getElementById("network");
    const adminSection = document.getElementById("admin");
    const aboutSection = document.getElementById("about");

    function fetchData(url, section) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                section.innerHTML = JSON.stringify(data, null, 2);
            })
            .catch(error => {
                section.innerHTML = "Error fetching data: " + error;
            });
    }

    document.getElementById("loadConnection").addEventListener("click", function() {
        fetchData("/api/connection", connectionSection);
    });

    document.getElementById("loadSettings").addEventListener("click", function() {
        fetchData("/api/settings", settingsSection);
    });

    document.getElementById("loadMedia").addEventListener("click", function() {
        fetchData("/api/media", mediaSection);
    });

    document.getElementById("loadPlayer").addEventListener("click", function() {
        fetchData("/api/player", playerSection);
    });

    document.getElementById("loadStatus").addEventListener("click", function() {
        fetchData("/api/status", statusSection);
    });

    document.getElementById("loadNetwork").addEventListener("click", function() {
        fetchData("/api/network", networkSection);
    });

    document.getElementById("loadAdmin").addEventListener("click", function() {
        fetchData("/api/admin", adminSection);
    });

    document.getElementById("loadAbout").addEventListener("click", function() {
        fetchData("/api/about", aboutSection);
    });
});