const token = localStorage.getItem("token");
const apiKey = localStorage.getItem("apiKey");

if (!token || !apiKey) {
  window.location.href = "login.html";
}

async function loadFeed(type = "all") {
  const feedContainer = document.getElementById("feed");
  feedContainer.innerHTML = "<p>Loading...</p>";

  try {
    let url =
      "https://v2.api.noroff.dev/social/posts?_author=true";

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error("Failed to fetch posts");

    renderPosts(data.data || []);
  } catch (err) {
    feedContainer.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

async function searchPosts(e) {
  e.preventDefault(); 
  const query = document.getElementById("searchQuery").value.trim();
  const feedContainer = document.getElementById("feed");

  if (!query) return loadFeed();

  feedContainer.innerHTML = "<p>Searching...</p>";

  try {
    const res = await fetch(
      `https://v2.api.noroff.dev/social/posts/search?q=${encodeURIComponent(
        query
      )}&_author=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.errors?.[0]?.message || "Search failed");

    renderPosts(data.data || []);
  } catch (err) {
    feedContainer.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

function renderPosts(posts) {
  const feedContainer = document.getElementById("feed");

  if (!posts.length) {
    feedContainer.innerHTML = "<p>No posts found.</p>";
    return;
  }

  feedContainer.innerHTML = posts
    .map((post) => {
      const authorName = post.author?.name || "Unknown Author";
      const authorAvatar =
        post.author?.avatar?.url || "./assets/profilepic.jpg";

      return `
        <section class="feed-container">
          <div class="profile">
            <img 
              class="profile-pic go-profile" 
              src="${authorAvatar}" 
              alt="Profile Picture"
              data-username="${authorName}" 
            />
            <h2 class="go-profile" data-username="${authorName}">
              ${authorName}
            </h2>
          </div>
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
            <div class="post-actions">
              <a href="./individualPost.html?id=${post.id}">
                <button class="read-button">Read More</button>
              </a>
            </div>
          </div>
        </section>
      `;
    })
    .join("");

  
  document.querySelectorAll(".go-profile").forEach((el) => {
    el.addEventListener("click", (e) => {
      const username = e.target.dataset.username;
      goToProfile(username);
    });
  });
}

function goToProfile(username) {
  window.location.href = `profile.html?username=${encodeURIComponent(
    username
  )}`;
}


document.getElementById("searchForm").addEventListener("submit", searchPosts);


loadFeed();
