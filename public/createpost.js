function openCreatePopup(userId) {
    document.getElementById('createPopup').style.display = 'flex';
    document.getElementById('content').value = null;
    window.currentUserId = userId;
}

function closeCreatePopup() {
    document.getElementById('createPopup').style.display = 'none';
}

function createPost() {
    const userId = window.currentUserId;
    const description = document.getElementById('content').value;

    fetch('/api/posts/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, description: description }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        closeCreatePopup(); // Close the popup on success
        getUserPosts(userId); // Refresh the posts
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

document.getElementById('createForm').addEventListener('submit', function(event) {
    event.preventDefault();
    createPost();
});