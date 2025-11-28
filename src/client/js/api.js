// API communication layer

/**
 * Generic API data loader
 */
async function loadApiData(endpoint, elementId, formatter) {
  try {
    const token = localStorage.getItem('token') || "dev_token_12345";
    const response = await fetch(`/api/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const element = document.getElementById(elementId);

    if (element) {
      if (formatter && typeof formatter === "function") {
        element.innerHTML = formatter(data);
      } else {
        element.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      }
    }
  } catch (error) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `<div class="error-message">⚠️ Error: ${error.message}</div>`;
    }
    console.error("API Error:", error);
  }
}

/**
 * POST request helper
 */
async function postApiData(endpoint, data) {
  try {
    const token = localStorage.getItem('token') || "dev_token_12345";
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error posting to ${endpoint}:`, error);
    throw error;
  }
}

/**
 * PUT request helper
 */
async function putApiData(endpoint, data) {
  try {
    const token = localStorage.getItem('token') || "dev_token_12345";
    const response = await fetch(`/api/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error updating ${endpoint}:`, error);
    throw error;
  }
}

/**
 * DELETE request helper
 */
async function deleteApiData(endpoint) {
  try {
    const token = localStorage.getItem('token') || "dev_token_12345";
    const response = await fetch(`/api/${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error deleting ${endpoint}:`, error);
    throw error;
  }
}
