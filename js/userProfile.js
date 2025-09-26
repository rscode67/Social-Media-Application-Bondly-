 const token = localStorage.getItem("token");
    const apiKey = localStorage.getItem("apiKey");
    const loggedInUser = localStorage.getItem("username");

    if (!token || !apiKey || !loggedInUser) {
      alert("You must log in first!");
      window.location.href = "login.html";
    }

    
    async function fetchProfile() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/social/profiles/${loggedInUser}?_posts=true&_followers=true&_following=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch profile");
        const { data } = await res.json();
        renderProfile(data);
        renderPosts(data.posts);
      } catch (err) {
        document.getElementById("postContainer").innerHTML =
          `<p style="color:red;">${err.message}</p>`;
      }
    }

    
    function renderProfile(user) {
      document.getElementById("profileName").textContent = user.name;
      document.getElementById("profileFullName").textContent = user.name;
      document.getElementById("profileEmail").textContent = user.email;
      document.getElementById("followersCount").textContent =
        `Followers ${user._count.followers} | Following ${user._count.following}`;

      document.getElementById("profileAvatar").src =
        user.avatar?.url || "./assets/profilepic.jpg";
      document.getElementById("headerAvatar").src =
        user.avatar?.url || "./assets/profilepic.jpg";
    }

    
  function renderPosts(posts) {
  const container = document.getElementById("postContainer");
  if (!posts || posts.length === 0) {
    container.innerHTML = `<p style="color:#555; font-style:italic;">No posts yet.</p>`;
    return;
  }

  container.innerHTML = posts.map(
    (post) => `
      <a href="./test4.html?id=${post.id}" class="post-link">
        <section class="post-container">
          <div class="post-content">
            <h2>${post.title || "Untitled"}</h2>
            <p>${post.body || ""}</p>
            ${
              post.media?.url
                ? `<img class="post-image" src="${post.media.url}" alt="${post.media.alt || "Post image"}" />`
                : ""
            }
            <div class="tags">
              ${
                post.tags?.length
                  ? post.tags.map((t) => `<span>#${t}</span>`).join("")
                  : ""
              }
            </div>
          </div>
        </section>
      </a>
    `
  ).join("");
}

    
    function logout() {
      if (confirm("Are you sure you want to log out?")) {
        localStorage.clear();
        window.location.href = "login.html";
      }
    }

    
    fetchProfile();

    