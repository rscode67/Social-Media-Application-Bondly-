async function registerUser(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  message.textContent = "";

  if (!name || !email || !password) {
    message.style.color = "red";
    message.textContent = "All fields are required!";
    return;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    message.style.color = "red";
    message.textContent =
      "Name can only contain letters, numbers, and underscore (_).";
    return;
  }

  if (!email.endsWith("@stud.noroff.no")) {
    message.style.color = "red";
    message.textContent = "Only stud.noroff.no emails are allowed!";
    return;
  }

  if (password.length < 8) {
    message.style.color = "red";
    message.textContent = "Password must be at least 8 characters long.";
    return;
  }

  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.errors?.[0]?.message || "Failed to register user";
      message.style.color = "red";
      message.textContent = errMsg.includes("already exists")
        ? "This email is already registered. Try another."
        : errMsg;
      return;
    }

    message.style.color = "green";
    message.textContent = ` User registered successfully!`;

    setTimeout(() => (window.location.href = "login.html"), 2000);
  } catch (err) {
    message.style.color = "red";
    message.textContent = err.message;
  }
}

document.getElementById("signUpForm").addEventListener("submit", registerUser);
