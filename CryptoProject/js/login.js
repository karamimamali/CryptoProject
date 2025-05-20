import { loginUser } from "./service.js";

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const enteredUsername = usernameInput.value.trim();
  const enteredPassword = passwordInput.value;

  if (!enteredUsername || !enteredPassword) {
    alert("Please enter username and password.");
    return;
  }

  try {
    const response = await loginUser({ username: enteredUsername, password: enteredPassword });
    // Gözlənilən backend cavabı: { token: "...", user: { ... } }

    sessionStorage.setItem("authToken", response.token);
    sessionStorage.setItem("currentUser", JSON.stringify(enteredUsername));

    alert("Login successful! 🔐");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Incorrect username or password!");
    passwordInput.value = "";
  }
});
