const toggleSlider = document.getElementById('themeToggle');
const bod = document.body;

export function themeToggleEventListener() {
    toggleSlider.addEventListener('change', () => {
            if (toggleSlider.checked) {
                bod.classList.add('dark');
                localStorage.setItem('darkMode', 'enabled');
                // toggleSliderMobile.checked = true;
            } else {
                bod.classList.remove('dark');
                localStorage.setItem('darkMode', 'disabled');
                // toggleSliderMobile.checked = false;
            }
        });
        
    // toggleSliderMobile.addEventListener('change', () => {
    //         if (toggleSliderMobile.checked) {
    //             bod.classList.add('dark');
    //             localStorage.setItem('darkMode', 'enabled');
    //             toggleSlider.checked = true;
    //         } else {
    //             bod.classList.remove('dark');
    //             localStorage.setItem('darkMode', 'disabled');
    //             toggleSlider.checked = false;
    //         }
    //     });

        // Initialize theme
        if (localStorage.getItem('darkMode') === 'enabled') {
            bod.classList.add('dark');
            toggleSlider.checked = true;
            // toggleSliderMobile.checked = true;
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            bod.classList.add('dark');
            toggleSlider.checked = true;
            // toggleSliderMobile.checked = true;
        }
    }