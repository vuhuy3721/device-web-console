document.addEventListener("DOMContentLoaded", function() {
    const aboutSection = document.getElementById("about-section");

    const aboutContent = `
        <h1>About This Device</h1>
        <p>This device is designed to provide comprehensive connectivity and media management features.</p>
        <h2>Features</h2>
        <ul>
            <li>Real-time connection monitoring</li>
            <li>Media playback controls</li>
            <li>Device status updates</li>
            <li>3G/4G network management</li>
            <li>Admin functionalities for secure access</li>
        </ul>
        <h2>Version</h2>
        <p>Version 1.0.0</p>
        <h2>Support</h2>
        <p>If you have any questions or need support, please contact our support team.</p>
    `;

    aboutSection.innerHTML = aboutContent;
});