import { getAllUsers, requestSession } from './service.js';

const usersContainer = document.getElementById('usersContainer');
const chatHeader = document.getElementById('chatHeader');
const keyInputContainer = document.getElementById('keyInputContainer');
const caesarKeyInput = document.getElementById('caesarKeyInput');
const messagesContainer = document.getElementById('messagesContainer');
const sendMessageContainer = document.getElementById('sendMessageContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

let currentUser;
let users = [];
let filteredUsers = [];
let selectedUser = null;
let sessionKeys = {};
let authToken;

const API_BASE = 'http://localhost:8080';

function loadSessionKeys() {
    const saved = sessionStorage.getItem('sessionKeys');
    if (saved) {
        try {
            sessionKeys = JSON.parse(saved);
        } catch {
            sessionKeys = {};
        }
    }
}

function saveSessionKeys() {
    sessionStorage.setItem('sessionKeys', JSON.stringify(sessionKeys));
}

function caesarEncrypt(text, shift) {
    if (typeof shift !== 'number' || shift <= 0) return text;
    return text
        .split('')
        .map(char => {
            const code = char.charCodeAt(0);
            // Uppercase letters
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 + shift) % 26) + 65);
            }
            // Lowercase letters
            if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 + shift) % 26) + 97);
            }
            // Other chars stay same
            return char;
        })
        .join('');
}

function caesarDecrypt(text, shift) {
    if (typeof shift !== 'number' || shift <= 0) return text;
    return text
        .split('')
        .map(char => {
            const code = char.charCodeAt(0);
            // Uppercase letters
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
            }
            // Lowercase letters
            if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
            }
            // Other chars stay same
            return char;
        })
        .join('');
}

async function loadUsers() {
    try {
        users = await getAllUsers(authToken);
        const currentUsername = typeof currentUser === 'object' ? currentUser.username : currentUser;
        filteredUsers = users.filter(u => u.username !== currentUsername);
        renderUsers(filteredUsers);
    } catch (err) {
        console.error('Failed to load users:', err);
        filteredUsers = [];
        renderUsers([]);
    }
}

function renderUsers(userList) {
    usersContainer.innerHTML = '';
    if (userList.length === 0) {
        usersContainer.innerHTML = '<div class="empty-state">No users found.</div>';
        return;
    }
    userList.forEach(user => {
        const hasKey = sessionKeys[user.username] !== undefined;
        const div = document.createElement('div');
        div.className = 'user-item';
        if (selectedUser && selectedUser.username === user.username) {
            div.classList.add('selected');
        }
        div.textContent = user.username + (hasKey ? ' (Key Ready)' : '');
        div.onclick = () => selectUser(user);
        usersContainer.appendChild(div);
    });
}

function selectUser(user) {
    selectedUser = user;
    renderUsers(filteredUsers);

    // Update chat header but preserve the dashboard link
    const headerContent = chatHeader.innerHTML;
    const dashboardLink = headerContent.substring(headerContent.indexOf('<a'));
    chatHeader.innerHTML = `<span>Chat with ${user.username}</span> ${dashboardLink}`;

    // Show Caesar key input if key exists
    if (sessionKeys[user.username]) {
        keyInputContainer.style.display = 'flex';
        caesarKeyInput.value = sessionKeys[user.username];
    } else {
        keyInputContainer.style.display = 'flex';
        caesarKeyInput.value = '';
        // Optionally: auto-request the key here or prompt user
    }

    sendMessageContainer.style.display = 'flex';
    messageInput.value = '';
    sendBtn.disabled = true;
    messagesContainer.innerHTML = '';

    loadMessages();
}

function validateKeyInput() {
    const key = parseInt(caesarKeyInput.value);
    if (isNaN(key) || key < 1 || key > 25) {
        sendBtn.disabled = true;
        return false;
    }
    sendBtn.disabled = messageInput.value.trim().length === 0;
    return true;
}

messageInput.addEventListener('input', () => {
    sendBtn.disabled = messageInput.value.trim().length === 0 || !validateKeyInput();
});

caesarKeyInput.addEventListener('input', () => {
    if (!validateKeyInput()) return;
    // Save key to sessionKeys if valid
    const key = parseInt(caesarKeyInput.value);
    if (selectedUser) {
        sessionKeys[selectedUser.username] = key;
        saveSessionKeys();
        renderUsers(filteredUsers);
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendBtn.disabled) {
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
    if (!selectedUser) return;
    const key = parseInt(caesarKeyInput.value);
    if (isNaN(key) || key < 1 || key > 25) {
        alert('Please enter a valid Caesar key (1-25)');
        return;
    }
    const plainText = messageInput.value.trim();
    if (!plainText) return;

    const encrypted = caesarEncrypt(plainText, key);

    const payload = {
        senderUsername: typeof currentUser === 'object' ? currentUser.username : currentUser,
        receiverUsername: selectedUser.username,
        encryptedText: encrypted
    };

    try {
        const res = await fetch(`${API_BASE}/message/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            throw new Error(`Send message failed: ${res.status}`);
        }
        messageInput.value = '';
        sendBtn.disabled = true;
        await loadMessages(); // Reload after sending
    } catch (err) {
        console.error(err);
        alert('Failed to send message: ' + err.message);
    }
}

async function loadMessages() {
    if (!selectedUser) return;
    try {
        const currentUsername = typeof currentUser === 'object' ? currentUser.username : currentUser;
        // GET messages between current user and selected user
        const res = await fetch(`${API_BASE}/message/history?user1=${currentUsername}&user2=${selectedUser.username}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (!res.ok) {
            throw new Error(`Load messages failed: ${res.status}`);
        }
        const messages = await res.json();
        renderMessages(messages);
    } catch (err) {
        console.error('Failed to load messages:', err);
        messagesContainer.innerHTML = '<div class="empty-state">Error loading messages.</div>';
    }
}

function renderMessages(messages) {
    messagesContainer.innerHTML = '';
    if (!messages || messages.length === 0) {
        messagesContainer.innerHTML = '<div class="empty-state">No messages yet. Send a message to start the conversation.</div>';
        return;
    }

    const key = sessionKeys[selectedUser.username];
    const currentUsername = typeof currentUser === 'object' ? currentUser.username : currentUser;

    messages.forEach(msg => {
        // msg: { sender, receiver, encryptedMessage, timestamp }
        let decryptedText = msg.encryptedText;
        if (key && msg.encryptedText) {
            // Try decrypting only if key exists
            decryptedText = caesarDecrypt(msg.encryptedText, key);
        }

        const div = document.createElement('div');
        div.classList.add('message');
        if (msg.senderUsername === currentUsername) {
            div.classList.add('sent');
        } else {
            div.classList.add('received');
        }

        div.textContent = decryptedText;

        // Add timestamp if available
        if (msg.timestamp) {
            const time = new Date(msg.timestamp);
            const timeSpan = document.createElement('span');
            timeSpan.className = 'message-time';
            timeSpan.textContent = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            timeSpan.style.fontSize = '11px';
            timeSpan.style.opacity = '0.7';
            timeSpan.style.display = 'block';
            timeSpan.style.marginTop = '5px';
            timeSpan.style.textAlign = msg.sender === currentUsername ? 'right' : 'left';
            div.appendChild(document.createElement('br'));
            div.appendChild(timeSpan);
        }

        messagesContainer.appendChild(div);
    });

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function checkLoggedInUser() {
    const raw = sessionStorage.getItem('currentUser');
    authToken = sessionStorage.getItem('authToken');
    if (!raw || !authToken) {
        window.location.href = 'login.html';
        return false;
    }
    try {
        currentUser = JSON.parse(raw);
    } catch {
        currentUser = raw;
    }
    return true;
}

// Auto refresh messages every 5 seconds
let refreshInterval = null;
function startAutoRefresh() {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
        if (selectedUser) loadMessages();
    }, 5000);
}

// On page unload, clear interval
window.addEventListener('beforeunload', () => {
    if (refreshInterval) clearInterval(refreshInterval);
});

// On load
(async () => {
    if (!checkLoggedInUser()) return;

    loadSessionKeys();

    await loadUsers();

    startAutoRefresh();

    // Focus on user list on page load for better UX
    if (usersContainer.firstChild) {
        usersContainer.firstChild.focus();
    }
})();