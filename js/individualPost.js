
    const token = localStorage.getItem("token");
    const apiKey = localStorage.getItem("apiKey");

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    async function fetchPost() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/social/posts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to load post");
        const { data } = await res.json();
        renderPost(data);
      } catch (err) {
        document.getElementById("postDetails").innerHTML =
          `<p style="color:red;">${err.message}</p>`;
      }
    }

    function renderPost(post) {
      document.getElementById("postDetails").innerHTML = `
        <article class="post-card">
          <h2 class="post-title">${post.title || "Untitled"}</h2>
          <p class="post-body">${post.body || ""}</p>
          ${
            post.media?.url
              ? `<img class="post-image" src="${post.media.url}" alt="${post.media.alt || "Post image"}" />`
              : ""
          }
          <div class="tags">
            ${post.tags?.map(t => `<span class="tag">#${t}</span>`).join("") || ""}
          </div>
        </article>
      `;
    }

    fetchPost();
 