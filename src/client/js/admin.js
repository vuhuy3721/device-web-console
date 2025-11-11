document.addEventListener("DOMContentLoaded", function() {
    const passwordForm = document.getElementById("password-form");
    const passwordInput = document.getElementById("password-input");
    const confirmPasswordInput = document.getElementById("confirm-password-input");
    const messageBox = document.getElementById("message-box");

    passwordForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password === confirmPassword) {
            // Call the API to update the password
            fetch('/api/admin/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messageBox.textContent = "Password updated successfully.";
                    messageBox.style.color = "green";
                } else {
                    messageBox.textContent = "Error updating password: " + data.message;
                    messageBox.style.color = "red";
                }
            })
            .catch(error => {
                messageBox.textContent = "Error: " + error.message;
                messageBox.style.color = "red";
            });
        } else {
            messageBox.textContent = "Passwords do not match.";
            messageBox.style.color = "red";
        }
    });
});