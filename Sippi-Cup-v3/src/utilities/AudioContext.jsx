// This is a React Context for handling audio playback in a podcast app.
// It integrates audio control, local storage persistence, progress tracking, and recently played history
// Wrapped in a provider that any component in the React tree can access via useAudio()
// 1. Imports React and multiple React hooks:
// - createContext → creates a Context object for global state sharing.
// - useContext → consumes a context inside components.
// - useRef → creates mutable references that persist across renders (used for audio object).
// - useState → defines local state variables.
// - useEffect → performs side effects (e.g., syncing data with localStorage, event listeners).
import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

// 2. Creates a new Context for the audio state.
// - This AudioContext will allow any nested component to access the shared audio data.
// - createContext(): Creates the audio context that will carry our player data throughout the app
const AudioContext = createContext();

// 3. Then we create our Custom Hook: useAudio
// - This is a custom React Hook that simplifies accessing the context.
export const useAudio = () => {
  // 5. useContext(AudioContext): Accesses the current context value
  // - gives you the context value from the nearest <AudioContext.Provider>.
  const context = useContext(AudioContext);
  // 4. Safety pattern: Ensures hook is only used within the provider
  // - If used outside that provider, it throws an error (safety guard).
  if (!context) {
    // Error boundary: Prevents runtime errors from missing provider
    throw new Error('useAudio must be used within an AudioProvider');
  }
  // returns the prop
  return context;
  // ✅ So any component can just call const { playEpisode, isPlaying } = useAudio();
};

// 6. Then I create a Provider Component: AudioProvider which is a component (created using arrow function) exported for wrapping parts of the app.
// - The main Provider Component that wraps your app
// With Props:
// - { children } - Destructures children prop (nested components)
// --- ({ children }) — props destructuring: React passes children (nested JSX elements inside <AudioProvider>...</AudioProvider>) via this prop.
export const AudioProvider = ({ children }) => {
  // Step 1: Core State and Refs
  // 7. audioRef - Ref - Direct reference to HTML Audio element - new Audio()
  // - useRef() stores an HTML5 <audio> element.
  // audioRef.current always points to the same Audio() object — persistent between renders.
  const audioRef = useRef(new Audio());
  // 8. currentEpisode - Object - Currently playing episode data - null
  const [currentEpisode, setCurrentEpisode] = useState(null);
  // 9. isPlaying -	Boolean -	 Play/pause status - false
  const [isPlaying, setIsPlaying] = useState(false);
  // 10. currentTime - Number -	Current playback position (seconds) -	0
  const [currentTime, setCurrentTime] = useState(0);
  // 11. duration -	Number -	Total episode duration (seconds) -	0
  const [duration, setDuration] = useState(0);
  // 12. volume -	Number -	Volume level (0-100) - 70
  const [volume, setVolume] = useState(70);
  // 13. isRepeatActive -	Boolean	- Repeat mode status -	false
  const [isRepeatActive, setIsRepeatActive] = useState(false);
  // 14. isShuffleActive - 	Boolean -	Shuffle mode status	- false
  const [isShuffleActive, setIsShuffleActive] = useState(false);
  // 15. playbackHistory - Object -	Track progress for all episodes -	{}
  const [playbackHistory, setPlaybackHistory] = useState({});
  // 16. recentlyPlayed -	Array -	Last 10 played episodes -	[]
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  // | State Variable    | Purpose                                    |
  // | ----------------- | ------------------------------------------ |
  // | `currentEpisode`  | Stores the current playing episode’s data. |
  // | `isPlaying`       | Boolean indicating play/pause state.       |
  // | `currentTime`     | Current playback position (seconds).       |
  // | `duration`        | Total duration of current audio.           |
  // | `volume`          | Volume (0–100).                            |
  // | `isRepeatActive`  | If repeat mode is active.                  |
  // | `isShuffleActive` | If shuffle mode is active.                 |
  // | `playbackHistory` | Object storing playback info per episode.  |
  // | `recentlyPlayed`  | Array storing recently played episodes.    |


  // 17. Then, using useffect, I create a Persistence System - localStorage Effects to load from localStorage on mount
  // This Loads from Local Storage (on mount)
  useEffect(() => {
    // 18. localStorage.getItem(key): Retrieves string data from browser storage
    // - Loads stored data from localStorage
    const savedVolume = localStorage.getItem('audioVolume');
    const savedHistory = localStorage.getItem('playbackHistory');
    const savedCurrentEpisode = localStorage.getItem('currentEpisode');
    const savedRecentlyPlayed = localStorage.getItem('recentlyPlayedEpisodes');

    // 19. parseInt(): Converts volume string to number
    if (savedVolume) setVolume(parseInt(savedVolume));
    // 20. JSON.parse(): Converts JSON strings back to JavaScript objects
    // - Converts strings → objects using JSON.parse()
    if (savedHistory) setPlaybackHistory(JSON.parse(savedHistory));
    if (savedCurrentEpisode) setCurrentEpisode(JSON.parse(savedCurrentEpisode));
    if (savedRecentlyPlayed) setRecentlyPlayed(JSON.parse(savedRecentlyPlayed));
    // Keeps your player state consistent after page reload.
  }, []); // 21. Empty dependency array []: Runs only once on component mount

  // 22. I then create a Save to localStorage Effects: Which Saves to localStorage when values change
  // - Each state has its own effect that saves when it changes
  useEffect(() => {
    // volume.toString(): Converts number to string (localStorage only stores strings)
    // the .setItem() method is a local storage method that Saves preference to localStorage for persistence
    localStorage.setItem('audioVolume', volume.toString());
  }, [volume]); // Whenever volume changes, save it as a string.

  useEffect(() => {
    // Inside the parenthesis, it starts with JSON.stringify(): Converts objects to JSON strings for storage
    // the .setItem() method is a local storage method that Saves preference to localStorage for persistence
    localStorage.setItem('playbackHistory', JSON.stringify(playbackHistory));
  }, [playbackHistory]);

  useEffect(() => {
    if (currentEpisode) {
      // Inside the parenthesis, it starts with JSON.stringify(): Converts objects to JSON strings for storage
      // the .setItem() method is a local storage method that Saves preference to localStorage for persistence
      localStorage.setItem('currentEpisode', JSON.stringify(currentEpisode));
    }
  }, [currentEpisode]);

  useEffect(() => {
    // Inside the parenthesis, it starts with JSON.stringify(): Converts objects to JSON strings for storage
    // the .setItem() method is a local storage method that Saves preference to localStorage for persistence
    localStorage.setItem('recentlyPlayedEpisodes', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  // 23. function to track recently played episodes
  const trackRecentlyPlayed = (episodeData) => {
    // 24. Functional Update Pattern: setRecentlyPlayed(prev => ...)
    setRecentlyPlayed(prev => {
      // 25. prev.filter(): Removes existing episode to prevent duplicates
      // - Ensures no duplicates in “recently played.”
      const filtered = prev.filter(ep => ep.episodeId !== episodeData.episodeId);
      // 26. [episodeData, ...filtered]: Adds new episode to beginning (spread operator)
      // - Moves the current episode to the front of the list.
      // - .slice(0, 10): Keeps only first 10 items (FIFO queue)
      // - Add to beginning and limit to 10 episodes
      const updated = [episodeData, ...filtered].slice(0, 10);
      return updated;
    });
  };

  // 27. Using useffect hook, I then manage the Audio Event Handlers
  useEffect(() => {
    // audioRef.current always points to the same Audio() object — persistent between renders.
    // - Gets reference to the actual <audio> element.
    const audio = audioRef.current;

    // 29. loadedmetadata Event: Fires when audio duration is known
    // - When metadata loads (duration available)
    const handleLoadedMetadata = () => {
      // 30. audio.duration: Gets total duration in seconds and changes the state of the of duration
      setDuration(audio.duration);
      
      // 31. The I perform the Resume logic: Checks if episode has saved progress and resumes from that point
      // - Resume from saved position if available
      const episodeId = currentEpisode?.episodeId;
      // currentEpisode?.episodeId: Optional chaining prevents errors if null
      if (episodeId && playbackHistory[episodeId]) {
        // Reads the total duration.
        const savedTime = playbackHistory[episodeId].currentTime;
        if (savedTime > 0) {
          // Restores playback position if user had previously paused midway.
          audio.currentTime = savedTime;
          // Updates it
          setCurrentTime(savedTime);
        }
      }
    };

    // 32. timeupdate Event: Fires continuously during playback
    // - When time updates (every frame)
    const handleTimeUpdate = () => {
      // Syncs current playback time to state.
      setCurrentTime(audio.currentTime);
      
      // Save progress every 5 seconds
      // Math.floor(audio.currentTime) % 5 === 0: Saves progress every 5 seconds
      if (currentEpisode && Math.floor(audio.currentTime) % 5 === 0) {
        // Every 5 seconds, stores progress in history.
        // - Prevents excessive localStorage writes
        saveProgress(audio.currentTime);
      }
    };

    // 33. When audio ends, ended Event: 
    // - Fires when playback completes
    const handleEnded = () => {
      // Stops playback.
      setIsPlaying(false);
      
      if (currentEpisode) {
        // saveProgress(duration, true): Marks episode as completed
        // Mark as completed
        saveProgress(duration, true);
        
        // Repeat logic: Restarts same episode if repeat is active
        // - If repeat is on
        if (isRepeatActive) {
          // Replays same episode
          // - Restart the same episode
          // setTimeout(..., 500): Small delay before restarting
          setTimeout(() => playEpisode(currentEpisode), 500);
        }
      }
    };

    // 34. Event Listener Pattern: Registers browser audio events.
    // Cleans up to avoid memory leaks when dependencies change.
    // 35. Add: addEventListener(event, handler)
    // 36. Remove: removeEventListener(event, handler) in cleanup
    // Dependencies: Effect re-runs when these values change
    const handleError = (e) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentEpisode, playbackHistory, isRepeatActive]);
  // Dependencies: Effect re-runs when these values change

  // 37. I then create a Volume control side effect for Volume Syncing
  useEffect(() => {
    // Volume Conversion: HTML Audio uses 0-1 range, we use 0-100 - Converts your integer (0–100) to that range.
    // - The <audio> element volume expects a float between 0.0 and 1.0.
    // - volume / 100: Converts our scale to browser's scale. 
    audioRef.current.volume = volume / 100;
  }, [volume]);

  const saveProgress = (time, completed = false) => {
    if (!currentEpisode) return;

    const episodeId = currentEpisode.episodeId;
    setPlaybackHistory(prev => ({ ...prev,
      [episodeId]: {
        currentTime: time,
        duration: duration,
        // Completion Logic: time >= duration * 0.95
        // 95% watched counts as "completed"
        // - Handles cases where user doesn't listen to very end
        completed: completed || (time >= duration * 0.95), // 95% considered completed
        lastListened: new Date().toISOString()
      }
    }));
  };
  // Creates Progress Object Structure:
  //   {
  //   "episode123": {
  //     currentTime: 125.5,    // Last listened position
  //     duration: 1800,        // Total duration  
  //     completed: false,      // Whether user finished
  //     lastListened: "2023-10-01T10:30:00.000Z" // ISO timestamp
  //   }
  // }

  // 38. Playback Control - Play Episode:
  const playEpisode = (episodeData) => {
    const { episodeId, audioUrl, title, season, episode, showTitle, showImage } = episodeData;
    
    // 39. audioRef.current.pause() - Stop current playback
    audioRef.current.pause();
    
    // Set new episode
    // - This Sets state and logs in history.
    const newEpisode = {
      episodeId,
      audioUrl,
      title,
      season,
      episode,
      showTitle,
      showImage
    };
    
    // 40. Set state: Update current episode and track in history
    setCurrentEpisode(newEpisode);

    // Track in recently played
    trackRecentlyPlayed(newEpisode);

    // Load and play new audio
    // - Loads and starts playback after slight delay (ensures metadata ready).
    audioRef.current.src = audioUrl;
    // 41. Load audio: Set new source and call load()
    audioRef.current.load();
    
    setTimeout(() => {
      // 42. Play: Use setTimeout to ensure audio is loaded
      // - Promise handling: play() returns a promise that might reject
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Playback failed:', error);
      });
    }, 100);
  };

  const togglePlayPause = () => {
    // Conditional Logic: Different behavior based on current state
    if (!currentEpisode) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Playback failed:', error);
      });
    }
  };

  // Seeking and Skipping:
  // - Moves playback position forward/backward safely within duration range.
  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      saveProgress(time);
    }
  };

  const skipForward = (seconds = 15) => {
    if (audioRef.current) {
      // Boundary Protection: Math.min(..., duration): Prevents seeking beyond end
      const newTime = Math.min(audioRef.current.currentTime + seconds, duration);
      seekTo(newTime);
    }
  };

  const skipBackward = (seconds = 15) => {
    if (audioRef.current) {
      // Math.max(..., 0): Prevents seeking before start
      const newTime = Math.max(audioRef.current.currentTime - seconds, 0);
      seekTo(newTime);
    }
  };

  // Simple toggles of repeat and shuffle state.
  const toggleRepeat = () => {
    setIsRepeatActive(!isRepeatActive);
  };

  const toggleShuffle = () => {
    setIsShuffleActive(!isShuffleActive);
  };

  // Utility Functions: Cleanup and Access Patterns: 
  // - Returns saved progress for a specific episode (for progress bars).
  // - Clears the recently played list.
  const stopPlayback = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const resetHistory = () => {
    setPlaybackHistory({});
    setRecentlyPlayed([]);
    // localStorage.removeItem(): Clears specific storage keys
    localStorage.removeItem('playbackHistory');
    localStorage.removeItem('recentlyPlayedEpisodes');
  };

  const getEpisodeProgress = (episodeId) => {
    // playbackHistory[episodeId] || null: Safe access with fallback
    return playbackHistory[episodeId] || null;
  };

  const clearRecentlyPlayed = () => {
    setRecentlyPlayed([]);
    localStorage.removeItem('recentlyPlayedEpisodes');
  };

  // Context Value and Provider
  // - Exposed API: All state and functions available to consuming components
  const value = {
    // State - State: Read-only data for display
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    volume,
    isRepeatActive,
    isShuffleActive,
    playbackHistory,
    recentlyPlayed,
    
    // Actions - Actions: Functions to modify state and control playback
    playEpisode,
    togglePlayPause,
    seekTo,
    skipForward,
    skipBackward,
    setVolume,
    toggleRepeat,
    toggleShuffle,
    stopPlayback,
    resetHistory,
    getEpisodeProgress,
    clearRecentlyPlayed,
    trackRecentlyPlayed
  };

  // Wraps children in a context provider.
  // Makes all audio controls available globally throughout the app.
  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

// | Feature           | Managed by                                   | Purpose                          |
// | ----------------- | -------------------------------------------- | -------------------------------- |
// | Playback control  | `audioRef`, `playEpisode`, `togglePlayPause` | Play, pause, seek                |
// | Persistence       | `localStorage`                               | Save volume, episode, progress   |
// | Progress tracking | `saveProgress`                               | Resume where left off            |
// | History           | `playbackHistory`, `recentlyPlayed`          | Track user’s listening history   |
// | Repeat / Shuffle  | Boolean states                               | Enhance playback UX              |
// | Context           | `AudioContext.Provider`                      | Global access for all components |
 

// ------------------------------------------------------------------------------------------------------------------------------------
// Usage

function PlayerComponent() {
  const { 
    currentEpisode, 
    isPlaying, 
    currentTime, 
    duration, 
    togglePlayPause,
    playEpisode 
  } = useAudio();

  return (
    <div>
      <button onClick={togglePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <progress value={currentTime} max={duration} />
    </div>
  );
}