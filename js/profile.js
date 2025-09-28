const token = localStorage.getItem("token");
const apiKey = localStorage.getItem("apiKey");
const loggedInUser = localStorage.getItem("username");

if (!token || !apiKey || !loggedInUser) {
  window.location.href = "login.html";
}

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username");

const profileNameHeader = document.getElementById("profileNameHeader");
const headerAvatar = document.getElementById("headerAvatar");
const profileAvatar = document.getElementById("profileAvatar");
const profileFullName = document.getElementById("profileFullName");
const profileEmail = document.getElementById("profileEmail");
const followersCount = document.getElementById("followersCount");
const postContainer = document.getElementById("postContainer");
const followBtn = document.getElementById("followBtn");

async function loadHeaderUser() {
  try {
    const res = await fetch(
      `https://v2.api.noroff.dev/social/profiles/${loggedInUser}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
      }
    );

    const { data } = await res.json();
    if (res.ok) {
      profileNameHeader.textContent = data.name;
      headerAvatar.src = data.avatar?.url || "./assets/profilepic.jpg";
    }
  } catch (err) {
    console.error("Failed to load logged-in user header info:", err.message);
  }
}

async function loadProfile() {
  try {
    const res = await fetch(
      `https://v2.api.noroff.dev/social/profiles/${username}?_posts=true&_followers=true&_following=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
      }
    );

    const { data } = await res.json();
    if (!res.ok) throw new Error("Failed to load profile");

    renderProfile(data);
    renderPosts(data.posts);

    if (username !== loggedInUser) {
      setupFollowButton(data);
    } else {
      followBtn.style.display = "none";
    }
  } catch (err) {
    postContainer.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

function renderProfile(profile) {
  profileAvatar.src = profile.avatar?.url || "./assets/profilepic.jpg";
  profileFullName.textContent = profile.name;
  profileEmail.textContent = profile.email || "@unknown.email";
  followersCount.textContent = `Followers ${
    profile._count?.followers || 0
  } | Following ${profile._count?.following || 0}`;
}

function renderPosts(posts) {
  if (!posts || posts.length === 0) {
    postContainer.innerHTML = `<p style="color:#555; font-style:italic;">No posts yet.</p>`;
    return;
  }

  postContainer.innerHTML = posts
    .map(
      (post) => `
        <section class="post-container">
          <div class="post-content">
            <h2>${post.title || "Untitled"}</h2>
            <p>${post.body || ""}</p>
            ${
              post.media?.url
                ? `<img class="post-image" src="${post.media.url}" alt="${
                    post.media.alt || "Post image"
                  }" />`
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
              <a href="./individualPost.html?id=${
                post.id
              }" class="view-link">View</a>
            </div>
          </div>
        </section>
      `
    )
    .join("");
}

function setupFollowButton(profile) {
  let isFollowing = profile.followers?.some((f) => f.name === loggedInUser);

  function updateButton() {
    followBtn.textContent = isFollowing ? "Unfollow" : "Follow";
    followBtn.classList.toggle("following", isFollowing);
  }

  updateButton();

  followBtn.addEventListener("click", async () => {
    followBtn.disabled = true;
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const res = await fetch(
        `https://v2.api.noroff.dev/social/profiles/${username}/${endpoint}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      const respData = await res.json();
      if (!res.ok)
        throw new Error(respData.errors?.[0]?.message || "Action failed");

      isFollowing = !isFollowing;
      updateButton();

      let counts = profile._count;
      counts.followers = isFollowing
        ? counts.followers + 1
        : counts.followers - 1;
      followersCount.textContent = `Followers ${counts.followers} | Following ${counts.following}`;
    } catch (err) {
      alert(err.message);
    } finally {
      followBtn.disabled = false;
    }
  });
}

document.getElementById("logout").addEventListener("click", (e) => {
  e.preventDefault();
  if (confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    window.location.href = "login.html";
  }
});

loadHeaderUser();
loadProfile();
