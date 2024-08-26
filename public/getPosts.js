function getUserPosts(userId) {
    fetch(`/api/posts/getposts/${userId}`, {
        method: 'POST',
    }) // Adjust this to your actual endpoint for fetching posts
    .then(response => response.json())
    .then(posts => {
        const postsContainer = document.getElementById('postsContainer'); 
        postsContainer.innerHTML = ''; // Clear existing posts
        console.log(posts)
        posts.forEach(post => {
            // Create and append new post elements
            const postElement = document.createElement('div');
            postElement.id = `post-${post.post_id}`;
            postElement.className = 'post';
            postElement.innerHTML = `
                <div class="post-header">
                    <h2>${post.description}</h2>
                    <div class="dropdown">
                        <button class="dropbtn">...</button>
                        <div class="dropdown-content">
                            <a onclick="openEditPopup('${post.userId}','${post.post_id}', '${post.description}')">Edit</a>
                            <a onclick="confirmDelete('${post.post_id}')">Delete</a>
                        </div>
                    </div>
                </div>
                <p>posted on ${post.post_time}</p>
            `;
            postsContainer.appendChild(postElement);
        });
    })
    .catch((error) => {
        console.error('Error fetching posts:', error);
    });
}
