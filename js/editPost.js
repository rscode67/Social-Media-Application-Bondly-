const token = localStorage.getItem("token");
const apiKey = localStorage.getItem("apiKey");


const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

if (!postId || !token || !apiKey) {
  alert("Invalid access");
  window.location.href = "userProfile.html";
}

const form = document.querySelector("form");
const message = document.createElement("div");
message.style.marginTop = "1rem";
form.appendChild(message);


async function loadPost() {
  const res = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey
    }
  });
  const { data } = await res.json();

  document.getElementById("post-title").value = data.title || "";
  document.getElementById("post-content").value = data.body || "";
  document.getElementById("tags").value = (data.tags || []).join(", ");
  document.getElementById("image-URL").value = data.media?.url || "";
 
  const imageAltInput = document.getElementById("image-alt") || document.querySelector('[name="image-alt"]');
  if (imageAltInput) imageAltInput.value = data.media?.alt || "";
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const imageAltInput = document.getElementById("image-alt") || document.querySelector('[name="image-alt"]');

  const updatedPost = {
    title: document.getElementById("post-title").value,
    body: document.getElementById("post-content").value,
    tags: document.getElementById("tags").value
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag),
    media: {
      url: document.getElementById("image-URL").value,
      alt: imageAltInput ? imageAltInput.value : ""
    }
  };

  try {
    const res = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedPost)
    });

    if (!res.ok) throw new Error("Failed to update post");

    message.textContent = "Post updated successfully!";
    message.style.color = "green";
    setTimeout(() => {
      window.location.href = "userProfile.html";
    }, 1000);
  } catch (err) {
    message.textContent = "Error: " + err.message;
    message.style.color = "red";
  }
});


document.getElementById("delete-btn").addEventListener("click", async (e) => {
  e.preventDefault();
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey
      }
    });

    if (!res.ok) throw new Error("Failed to delete post");

    message.textContent = "Post deleted successfully!";
    message.style.color = "green";
    setTimeout(() => {
      window.location.href = "userProfile.html";
    }, 1000);
  } catch (err) {
    message.textContent = "Error: " + err.message;
    message.style.color = "red";
  }
});

loadPost();