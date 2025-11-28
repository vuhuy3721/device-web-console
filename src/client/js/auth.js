// Authentication and session management

/**
 * Check if user is authenticated
 */
function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn !== 'true') {
    window.location.href = 'login.html';
    return false;
  }
  
  // Display username
  const username = localStorage.getItem('username') || 'Admin';
  const usernameDisplay = document.getElementById('username-display');
  if (usernameDisplay) {
    usernameDisplay.textContent = `👤 ${username}`;
  }
  return true;
}

/**
 * Logout function
 */
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    // Keep rememberMe if checked
    if (localStorage.getItem('rememberMe') !== 'true') {
      localStorage.removeItem('rememberMe');
    }
    window.location.href = 'login.html';
  }
}

// Check authentication on page load
if (!checkAuth()) {
  // Will redirect to login
}
