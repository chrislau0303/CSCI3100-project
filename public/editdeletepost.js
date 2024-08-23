function openEditPopup(postId, description) {
    document.getElementById('editPopup').style.display = 'flex';
    document.getElementById('editDescription').value = description;
    // Store postId for saving later
    window.currentPostId = postId;
}

function closeEditPopup() {
    document.getElementById('editPopup').style.display = 'none';
}

function saveEdit() {
    const newDescription = document.getElementById('editDescription').value;
    const postId = window.currentPostId;
    
    fetch('/api/posts/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId, description: newDescription }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        closeEditPopup(); // Close the popup on success
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function confirmDelete(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        fetch(`/api/posts/delete/${postId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            const postElement = document.getElementById(`post-${postId}`);
            if (postElement) {
                postElement.remove();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}