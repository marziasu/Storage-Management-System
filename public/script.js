const plusButton = document.getElementById('plus-btn');
const dropdown = document.getElementById('dropdown');
const createFolderBtn = document.getElementById('create-folder-btn');
const modal = document.getElementById('modal');
const cancelBtn = document.getElementById('cancel-btn');
const saveBtn = document.getElementById('save-btn');
const folderNameInput = document.getElementById('folder-name');
const folderContainer = document.getElementById('folders');

// Toggle dropdown visibility
plusButton.addEventListener('click', () => {
  dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
});

// Open modal for folder creation
createFolderBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
  dropdown.style.display = 'none';
});

// Close modal without saving
cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  folderNameInput.value = '';
});

// Save folder
saveBtn.addEventListener('click', async () => {
  const folderName = folderNameInput.value.trim();
  if (folderName) {
    // Send folder name to backend
    const response = await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: folderName }),
    });

    if (response.ok) {
      const folder = document.createElement('div');
      folder.className = 'folder';
      folder.textContent = folderName;
      folderContainer.appendChild(folder);

      modal.style.display = 'none';
      folderNameInput.value = '';
    } else {
      alert('Failed to create folder');
    }
  } else {
    alert('Folder name cannot be empty');
  }
});

// Fetch folders on page load
async function fetchFolders() {
  const response = await fetch('/api/folders');
  const folders = await response.json();
  folders.forEach(folder => {
    const folderDiv = document.createElement('div');
    folderDiv.className = 'folder';
    folderDiv.textContent = folder.name;
    folderContainer.appendChild(folderDiv);
  });
}
fetchFolders();
