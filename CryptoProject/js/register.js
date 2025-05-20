import { createUser } from "./service.js";

const passwordReg = document.getElementById("passwordReg");
const confPassword = document.getElementById("confPassword");
const lengthError = document.getElementById("lengthError");
const usernameReg = document.getElementById("usernameReg");

const genBtn = document.querySelector("#generateKey");
const pubKeyDisplay = document.getElementById("pbKey");

let publicKeyStr = null;
let privateKeyStr = null;

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let b of bytes) {
    binary += String.fromCharCode(b);
  }
  return window.btoa(binary);
}

genBtn.addEventListener("click", async () => {
  pubKeyDisplay.textContent = "Generating keys...";
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 1024,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    const pubBuf = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privBuf = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    publicKeyStr = arrayBufferToBase64(pubBuf);
    privateKeyStr = arrayBufferToBase64(privBuf);

    pubKeyDisplay.textContent = `Public key: ${publicKeyStr}`;
  } catch (err) {
    console.error(err);
    pubKeyDisplay.textContent = "Key generation failed.";
  }
});

passwordReg.addEventListener("input", checkLength);

document.querySelector("form").addEventListener("submit", validateForm);

function checkLength() {
  if (passwordReg.value.length < 8) {
    lengthError.textContent = "Password should be 8 or more characters";
  } else {
    lengthError.textContent = "";
  }
}

async function validateForm(event) {
  event.preventDefault();

  if (passwordReg.value.length < 8) {
    lengthError.textContent = "Password should be 8 or more characters";
    alert("Password must be at least 8 characters.");
    passwordReg.value = "";
    confPassword.value = "";
    return false;
  }

  if (confPassword.value !== passwordReg.value) {
    alert("Passwords do not match.");
    passwordReg.value = "";
    confPassword.value = "";
    lengthError.textContent = "";
    return false;
  }

  if (!publicKeyStr || !privateKeyStr) {
    alert("Please generate your RSA key pair first.");
    return false;
  }

  const newUser = {
    username: usernameReg.value,
    password: passwordReg.value,
    publicKey: publicKeyStr,
  };
  
  try {
    const data = await createUser(newUser);
    console.log("User created:", data);

    localStorage.setItem(`key_priv_${newUser.username}`, privateKeyStr);
    sessionStorage.setItem("currentUser", JSON.stringify(newUser));
    window.location.href = "login.html";
  } catch (err) {
    alert("User creation failed: " + err.message);
  }

  return true;
}
