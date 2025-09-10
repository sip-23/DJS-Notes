let volume = 70;
let isPlaying = false;
let isDragging = false;
let currentTime = 0;
let totalDuration = 225; // seconds
let isRepeatActive = false;
let isShuffleActive = false;

// DOM elements
let progressBarRef = null;

// Initialize the audio player
function initAudioPlayer() {
    // Get DOM elements
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const volumeControl = document.getElementById('volumeControl');
    const volumeValue = document.getElementById('volumeValue');
    const currentTimeElement = document.getElementById('currentTime');
    const totalDurationElement = document.getElementById('totalDuration');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');
    progressBarRef = progressBar;

    // Set initial values
    volumeControl.value = volume;
    volumeValue.textContent = `${volume}%`;
    totalDurationElement.textContent = formatTime(totalDuration);
    currentTimeElement.textContent = formatTime(currentTime);
    updateProgressBar();

    // Event listeners
    playPauseBtn.addEventListener('click', handlePlayPause);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    volumeControl.addEventListener('input', handleVolumeChange);
    progressBar.addEventListener('click', handleProgressBarClick);
    
    // Add drag functionality for progress bar
    progressBar.addEventListener('mousedown', startDragging);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('mousemove', handleDrag);
}

// Format time function
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Play/Pause handler
function handlePlayPause() {
    isPlaying = !isPlaying;
    updatePlayButton();
    
    // Simulate audio playback (replace with actual audio element)
    if (isPlaying) {
        simulatePlayback();
    } else {
        clearInterval(playbackInterval);
    }
}

// Simulate playback (replace with actual audio element)
let playbackInterval = null;
function simulatePlayback() {
    clearInterval(playbackInterval);
    playbackInterval = setInterval(() => {
        if (isPlaying && currentTime < totalDuration) {
            currentTime += 1;
            updateProgressBar();
            document.getElementById('currentTime').textContent = formatTime(currentTime);
        } else if (currentTime >= totalDuration) {
            if (isRepeatActive) {
                currentTime = 0;
                updateProgressBar();
            } else {
                isPlaying = false;
                updatePlayButton();
                clearInterval(playbackInterval);
            }
        }
    }, 1000);
}

// Update play button state
function updatePlayButton() {
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    
    if (isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
}

// Toggle shuffle
function toggleShuffle() {
    isShuffleActive = !isShuffleActive;
    const shuffleBtn = document.getElementById('shuffleBtn');
    
    if (isShuffleActive) {
        shuffleBtn.style.color = '#fff'; // Active color
        // Add shuffle logic here
    } else {
        shuffleBtn.style.color = '#b3b3b3'; // Inactive color
    }
}

// Toggle repeat
function toggleRepeat() {
    isRepeatActive = !isRepeatActive;
    const repeatBtn = document.getElementById('repeatBtn');
    
    if (isRepeatActive) {
        repeatBtn.style.color = '#fff'; // Active color
    } else {
        repeatBtn.style.color = '#b3b3b3'; // Inactive color
    }
}

// Handle volume change
function handleVolumeChange(e) {
    volume = e.target.value;
    document.getElementById('volumeValue').textContent = `${volume}%`;
    
    // Update volume icons based on volume level
    const lowVolBtn = document.getElementById('low-vol');
    const highVolBtn = document.getElementById('high-vol');
    
    if (volume == 0) {
        lowVolBtn.innerHTML = '<svg class="fill-[#000000] dark:fill-[#b3b3b3]" xmlns="http://www.w3.org/2000/svg"  width="24px" height="24px" viewBox="-1.5 0 19 19" class="cf-icon-svg"><path d="M7.676 4.938v9.63c0 .61-.353.756-.784.325l-2.896-2.896H2.02A1.111 1.111 0 0 1 .911 10.89V8.618a1.112 1.112 0 0 1 1.108-1.109h1.977l2.896-2.896c.43-.43.784-.284.784.325zm7.251 6.888a.554.554 0 1 1-.784.784l-2.072-2.073-2.073 2.073a.554.554 0 1 1-.784-.784l2.073-2.073L9.214 7.68a.554.554 0 0 1 .784-.783L12.07 8.97l2.072-2.073a.554.554 0 0 1 .784.783l-2.072 2.073z"/></svg>';
    } else if (volume < 50) {
        lowVolBtn.innerHTML = '<svg class="fill-[#000000] dark:fill-[#b3b3b3]" xmlns="http://www.w3.org/2000/svg"  width="24px" height="24px" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
    } else {
        lowVolBtn.innerHTML = '<svg class="fill-[#000000] dark:fill-[#b3b3b3]" xmlns="http://www.w3.org/2000/svg"  width="24px" height="24px" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
    }
}

// Handle progress bar click
function handleProgressBarClick(e) {
    if (!progressBarRef) return;
    
    const rect = progressBarRef.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const width = rect.width;
    
    currentTime = (clickPosition / width) * totalDuration;
    updateProgressBar();
    document.getElementById('currentTime').textContent = formatTime(currentTime);
}

// Start dragging
function startDragging(e) {
    isDragging = true;
    handleDrag(e);
}

// Stop dragging
function stopDragging() {
    isDragging = false;
}

// Handle drag
function handleDrag(e) {
    if (!isDragging || !progressBarRef) return;
    
    const rect = progressBarRef.getBoundingClientRect();
    const dragPosition = e.clientX - rect.left;
    const width = rect.width;
    
    currentTime = Math.max(0, Math.min((dragPosition / width) * totalDuration, totalDuration));
    updateProgressBar();
    document.getElementById('currentTime').textContent = formatTime(currentTime);
}

// Update progress bar
function updateProgressBar() {
    const progress = document.getElementById('progress');
    if (progress) {
        const progressBarWidth = (currentTime / totalDuration) * 100;
        progress.style.width = `${progressBarWidth}%`;
    }
}

// Handle stop (if needed)
function handleStop() {
    isPlaying = false;
    currentTime = 0;
    updatePlayButton();
    updateProgressBar();
    document.getElementById('currentTime').textContent = formatTime(currentTime);
    clearInterval(playbackInterval);
}

// Export functions
export { initAudioPlayer, handlePlayPause, toggleRepeat, toggleShuffle, handleStop };