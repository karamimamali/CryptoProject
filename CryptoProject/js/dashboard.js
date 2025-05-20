import { getAllUsers, requestSession, setCurrentUser } from './service.js';

let users = [];
let filteredUsers = [];
let user;
let sessionKeys = {}; // Store session keys here

const raw = sessionStorage.getItem("currentUser");
const allUsers = document.getElementById("allUsers");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

if (!raw) {
    window.location.href = "login.html";
} else {
    try {
        user = JSON.parse(raw);
    } catch {
        user = { username: raw };
    }

    // Set the current username so service.js can access it
    document.getElementById("welcome").textContent = `Welcome, ${typeof user === 'object' ? user.username : user}!`;
    loadUsers();
}

async function loadUsers() {
    try {
        const token = sessionStorage.getItem("authToken");
        users = (await getAllUsers(token)) || [];
        console.log(users);

        // Filter out the current user
        const currentUsername = typeof user === 'object' ? user.username : user;
        filteredUsers = users.filter(item => item.username !== currentUsername);
        renderUsers(filteredUsers);
    } catch (err) {
        console.error("Failed to load users:", err);
        const currentUsername = typeof user === 'object' ? user.username : user;
        filteredUsers = users.filter(item => item.username !== currentUsername);
        renderUsers(filteredUsers);
    }
}

function renderUsers(list) {
    allUsers.innerHTML = "";

    if (list.length === 0) {
        allUsers.innerHTML = `
            <div class="col-span-2 p-4 text-center text-gray-500">
                No users found. Try a different search term.
            </div>
        `;
        return;
    }

    list.forEach(item => {
        // Check if we already have a key for this user
        const hasKey = sessionKeys[item.username] !== undefined;
        const buttonClass = hasKey ?
            "px-4 py-2 bg-green-500 text-white font-medium rounded-lg request-btn ready" :
            "px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition request-btn";
        const buttonText = hasKey ? "View Key" : "Request Key";

        const cardId = `user-card-${item.username.replace(/[^a-zA-Z0-9]/g, '')}`;

        allUsers.innerHTML += `
            <div id="${cardId}" class="user-card flex flex-col border border-slate-200 rounded-lg bg-slate-50">
                <div class="flex items-center justify-between p-4">
                    <div class="user-info text-left">
                        <h4 class="text-lg font-medium text-slate-800">${item.username}</h4>
                        ${hasKey ? '<p class="text-sm text-green-600">Session established</p>' : ''}
                    </div>
                    <button class="${buttonClass}" 
                        data-username="${item.username}" 
                        onclick="${hasKey ? `showKey('${item.username}', '${cardId}')` : `requestSessionKey('${item.username}')`}">
                        ${buttonText}
                    </button>
                </div>
                <div id="keys-${cardId}" class="keys-container hidden p-4 bg-gray-50 border-t border-slate-200 text-left"></div>
            </div>
        `;
    });
}

// Function to show/hide the Caesar key
window.showKey = function(username, cardId) {
    if (!sessionKeys[username]) {
        alert("No key available for this user. Please request a key first.");
        return;
    }

    const keysContainer = document.getElementById(`keys-${cardId}`);

    // Toggle visibility of the key container
    if (keysContainer.classList.contains("hidden")) {
        // Hide all other open key containers first
        document.querySelectorAll(".keys-container:not(.hidden)").forEach(container => {
            container.classList.add("hidden");
        });

        // Show this key
        const caesarKey = sessionKeys[username];
        keysContainer.innerHTML = `
            <div class="mb-3">
                <p class="text-sm font-semibold mb-1">Your Caesar key for ${username}:</p>
                <div class="flex">
                    <input type="text" value="${caesarKey}" readonly 
                        class="flex-1 p-2 text-sm bg-white border border-slate-300 rounded-l text-slate-800" 
                        id="caesarKey-${cardId}">
                    <button onclick="copyToClipboard('caesarKey-${cardId}')" 
                        class="px-3 bg-blue-500 text-white rounded-r hover:bg-blue-600">
                        Copy
                    </button>
                </div>
            </div>
            <div class="mt-3">
                <a href="decrypt.html" class="text-sm text-blue-600 hover:underline">Go to Decrypt page</a>
            </div>
        `;

        keysContainer.classList.remove("hidden");
    } else {
        // Hide the container if it's already visible
        keysContainer.classList.add("hidden");
    }
};

// Function to copy text to clipboard
window.copyToClipboard = function(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    document.execCommand("copy");

    // Show temporary success message
    const originalButtonText = event.target.innerText;
    event.target.innerText = "Copied!";
    setTimeout(() => {
        event.target.innerText = originalButtonText;
    }, 1500);
};

// Add the requestSessionKey function to window so it can be called from inline onclick
window.requestSessionKey = async function(receiverUsername) {
    try {
        const token = sessionStorage.getItem("authToken");
        const currentUsername = typeof user === 'object' ? user.username : user;

        const keyResponse = await requestSession(receiverUsername, currentUsername, token);

        // With the new plan, we only need to store the single Caesar key
        // Assuming the API now returns a simpler object with just the caesarKey
        sessionKeys[receiverUsername] = keyResponse.caesarKey;

        // Store the session keys in sessionStorage for persistence
        sessionStorage.setItem("sessionKeys", JSON.stringify(sessionKeys));

        // Re-render the users to update the button status
        const term = searchInput.value.trim().toLowerCase();
        if (!term) {
            renderUsers(filteredUsers);
        } else {
            const matches = filteredUsers.filter(u =>
                u.username.toLowerCase().includes(term)
            );
            renderUsers(matches);
        }
    } catch (err) {
        console.error(`Failed to request session key for ${receiverUsername}:`, err);
        alert(`Failed to request session key: ${err.message}`);
    }
};

// Load any existing session keys from sessionStorage
const savedKeys = sessionStorage.getItem("sessionKeys");
if (savedKeys) {
    try {
        sessionKeys = JSON.parse(savedKeys);
    } catch (err) {
        console.error("Failed to parse saved session keys:", err);
        sessionKeys = {};
    }
}

searchBtn.addEventListener("click", () => {
    const term = searchInput.value.trim().toLowerCase();
    if (!term) {
        renderUsers(filteredUsers);
    } else {
        const matches = filteredUsers.filter(u =>
            u.username.toLowerCase().includes(term)
        );
        renderUsers(matches);
    }
});
window.newKey = function() {
    alert("New key pair Generated");
};
window.logout = function() {
    sessionStorage.removeItem("currentUser");
    window.location.href = "login.html";
};