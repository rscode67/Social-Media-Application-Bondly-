async function loginAndGetToken(email, password) {
  const response = await fetch("https://v2.api.noroff.dev/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  console.log("Login Response:", data);

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Login failed");
  }

  localStorage.setItem("token", data.data.accessToken);
  localStorage.setItem("username", data.data.name);
  localStorage.setItem("email", data.data.email);

  return data.data.accessToken;
}

async function getApiKey(token) {
  const response = await fetch(
    "https://v2.api.noroff.dev/auth/create-api-key",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  console.log("API Key Response:", data);

  if (!response.ok) {
    throw new Error(data.message || "Failed to create API key");
  }

  return data.data.key;
}

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const token = await loginAndGetToken(email, password);
    apiKey = await getApiKey(token);
    localStorage.setItem("apiKey", apiKey);

    alert("Login Successful! Redirecting...");
    window.location.href = "./userProfile.html";
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed: " + error.message);
  }
});
