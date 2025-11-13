// UI utility functions

/**
 * Show/hide sections
 */
function showSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll("section");
  sections.forEach((s) => s.classList.remove("active"));

  // Show selected section
  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.classList.add("active");
  }
}

/**
 * Create info row for displaying data
 */
function createInfoRow(label, value, isEditable = false) {
  if (isEditable) {
    return `<div class="info-row editable">
              <div class="info-label">${label}</div>
              <div class="info-value"><input type="text" value="${value}"></div>
            </div>`;
  }
  return `<div class="info-row">
            <div class="info-label">${label}</div>
            <div class="info-value">${value}</div>
          </div>`;
}

/**
 * Select row (for UI interactions)
 */
function selectRow(row) {
  row.classList.toggle("selected");
}

/**
 * Show alert message
 */
function showAlert(message, type = 'success') {
  const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
  alert(message);
}
