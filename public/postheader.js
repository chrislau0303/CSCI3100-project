const stickyElement = document.querySelector('.profile');
const headers = document.getElementsByClassName('post-header');

function checkPosition() {
    const stickyRect = stickyElement.getBoundingClientRect();

    // Loop through headers and hide based on position
    for (const header of headers) {
        const headerRect = header.getBoundingClientRect();
        if (headerRect.top < stickyRect.bottom - 24) {
            header.classList.add('hidden'); // Hide header
        } else {
            header.classList.remove('hidden'); // Show header
        }
    }
}

// Event listeners for scroll and resize
window.addEventListener('scroll', checkPosition);
window.addEventListener('resize', checkPosition);

// Initial check
checkPosition();