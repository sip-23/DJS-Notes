const scrollContainer = document.getElementById('podcasts-container');
const scrollRightButton = document.getElementById('scroll-right');
const scrollLeftButton = document.getElementById('scroll-left');

export function scrollersEventListener() {
    const scrollAmount = 300;

    // Right scroll button functionality
    scrollRightButton.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Left scroll button functionality
    scrollLeftButton.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
}
    
// Show/hide scroll buttons based on scroll position
export function updateButtonVisibility() {
    // Show left button if not at the beginning
    if (scrollContainer.scrollLeft > 0) {
        scrollLeftButton.classList.remove('hidden');
    } else {
        scrollLeftButton.classList.add('hidden');
    }
    
    // Show right button if not at the end
    if (scrollContainer.scrollLeft < (scrollContainer.scrollWidth - scrollContainer.clientWidth - 10)) {
        scrollRightButton.classList.remove('hidden');
    } else {
        scrollRightButton.classList.add('hidden');
    }
}

// Update on scroll
scrollContainer.addEventListener('scroll', updateButtonVisibility);

// Also update on window resize
window.addEventListener('resize', updateButtonVisibility);