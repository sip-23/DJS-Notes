const scrollContainer = document.getElementById('podcasts-container');
const scrollContainer2 = document.getElementById('podcasts-container2');
const scrollRightButton = document.getElementById('scroll-right');
const scrollLeftButton = document.getElementById('scroll-left');
const scrollRight2Button = document.getElementById('scroll-right2');
const scrollLeft2Button = document.getElementById('scroll-left2');
    
export function scrollersEventListener() {
    const scrollAmount = 290;

    // Right scroll button functionality
    scrollRightButton.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
        scrollContainer2.scrollBy({
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
        scrollContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    scrollRight2Button.addEventListener('click', () => {
        scrollContainer2.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
        scrollContainer2.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Left scroll button functionality
    scrollLeft2Button.addEventListener('click', () => {
        scrollContainer2.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
        scrollContainer2.scrollBy({
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

    if (scrollContainer2.scrollLeft > 0) {
        scrollLeft2Button.classList.remove('hidden');
    } else {
        scrollLeft2Button.classList.add('hidden');
    }
    
    // Show right button if not at the end
    if (scrollContainer2.scrollLeft < (scrollContainer2.scrollWidth - scrollContainer2.clientWidth - 10)) {
        scrollRight2Button.classList.remove('hidden');
    } else {
        scrollRight2Button.classList.add('hidden');
    }
}

// Update on scroll
scrollContainer.addEventListener('scroll', updateButtonVisibility);
scrollContainer2.addEventListener('scroll', updateButtonVisibility);

// Also update on window resize
window.addEventListener('resize', updateButtonVisibility);