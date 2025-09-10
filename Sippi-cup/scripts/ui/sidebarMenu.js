const sidebar = document.getElementById('sidebar');
const closeMenuBtn = document.getElementById('close-menu-btn');
const openMenuBtn = document.getElementById('open-menu-btn');
const closedLockIcon = document.getElementById('closed-lock');
const openLockIcon = document.getElementById('open-lock');

// hide sidebar / menu
export function closeMenuVisability() {
    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('lg:w-[350px]');
    sidebar.classList.add('opacity-0');
    sidebar.classList.add('w-0');
    sidebar.classList.add('border-none');
    
    // changing the lock icons in the nav bar
    closedLockIcon.classList.remove('hidden');
    openLockIcon.classList.add('hidden');
    
    localStorage.setItem('sidebarHidden', 'true');
}

// showing the sidebar / Menu
export function openMenuVisability() {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('lg:w-[350px]');
    sidebar.classList.remove('opacity-0');
    sidebar.classList.remove('w-0');
    sidebar.classList.remove('border-none');
    
    // change the lock icons
    closedLockIcon.classList.add('hidden');
    openLockIcon.classList.remove('hidden');
    
    localStorage.setItem('sidebarHidden', 'false');
}

export function checkSidebarState() {
    const isHidden = localStorage.getItem('sidebarHidden') === 'true';
    if (isHidden) {
        closeMenuVisability();
    } else {
        openMenuVisability();
    }
}

export function initSidebar() {
    // Adding event listeners
    closeMenuBtn.addEventListener('click', closeMenuVisability);
    openMenuBtn.addEventListener('click', openMenuVisability);
    
    // Check initial state
    checkSidebarState();
    
    return {
        closeMenuVisability,
        openMenuVisability,
        checkSidebarState
    };
}