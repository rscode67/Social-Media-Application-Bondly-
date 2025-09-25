async function registerUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageElem = document.getElementById("message");

  if (!name || !email || !password) {
    messageElem.textColor = "red";
    messageElem.textContent = "Please fill in all fields.";
    return;
  }

  if (password.length < 6) {
    messageElem.textContent = "Password must be at least 6 characters long.";
    return;
  }

  if (!email.endsWith("@stud.noroff.no")) {
    messageElem.textContent = "Email must be a valid stud.noroff.no address.";
    return;
  }

  try {
    const response = await fetch(
      "https://api.noroff.dev/api/v1/auction/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors?.[0]?.message || "Registration failed. Please try again.";
      messageElem.textContent = errorMessage;
      return;
    }

    messageElem.textContent = "Registration successful!";
  } catch (error) {
    messageElem.textContent = "An error occurred. Please try again.";
  }
}
