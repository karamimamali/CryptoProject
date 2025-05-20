import BASE_URL from "./config.js";

let currentUser = null;

// Set the current user - this should be called from dashboard.js
const setCurrentUser = (user) => {
    currentUser = user;
};

const createUser = async (newUser) => {
    try {
        const res = await fetch(`${BASE_URL.POST}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
        });
        if (!res.ok) {
            throw new Error(`Post error, status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

const loginUser = async (credentials) => {
    try {
        const res = await fetch(`${BASE_URL.POST}/login`, {  // login endpoint
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials), // { username, password }
        });
        if (!res.ok) {
            throw new Error(`Login failed, status: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};

const getAllUsers = async (token) => {
    try {
        const res = await fetch(`${BASE_URL.GET}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!res.ok) {
            throw new Error(`Problem occured related with restApi`);
        }
        return await res.json();
    } catch (error) {
        console.error(`error message: ${error.message}`);
        throw error;
    }
};

const requestSession = async (receiverUsername, senderUsername, token) => {
    try {
        const payload = {
            senderUsername: senderUsername,
            receiverUsername: receiverUsername
        };

        const res = await fetch(`${BASE_URL.BASE}/session/request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error(`Session request failed, status: ${res.status}`);
        }

        // Updated to handle the new simplified response format
        // Expecting { caesarKey: "your-caesar-key" } instead of the previous format
        return await res.json();
    } catch (error) {
        console.error(`Session request error: ${error.message}`);
        throw error;
    }
};

export { createUser, loginUser, getAllUsers, requestSession, setCurrentUser };