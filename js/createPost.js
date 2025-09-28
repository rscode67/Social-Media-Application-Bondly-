const token = localStorage.getItem("token");
const apiKey = localStorage.getItem("apiKey");

if (!token || !apiKey) {
  alert("You must log in first!");
  window.location.href = "login.html";
}

const form = document.getElementById("createPostForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const post = {
    title: document.getElementById("post-title").value,
    body: document.getElementById("post-content").value,
    tags: document.getElementById("tags").value
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag),
    media: {
      url: document.getElementById("image-URL").value,
      alt: document.getElementById("image-alt").value
    }
  };

  try {
    const res = await fetch("https://v2.api.noroff.dev/social/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(post)
    });

    if (!res.ok) throw new Error("Failed to create post");

    message.textContent = "Post created successfully!";
    message.style.color = "green";
    form.reset();
  } catch (err) {
    message.textContent = "Error: " + err.message;
    message.style.color = "red";
  }
});