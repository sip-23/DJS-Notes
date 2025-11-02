// 1. import ... from 'react': ES module import.
import React, { createContext, useContext, useState, useEffect } from 'react';
// 2. createContext — factory that returns a React Context object used to share value(s) across the component tree without prop drilling.
// 3. useContext — hook to consume a context value inside a component.
// 4. useState — hook for local state.
// 5. useEffect — hook for running side effects after render (lifecycle logic). 

// **What is React Context?**
// Context is a React system for prop drilling avoidance 
// - it allows data to be passed through the component tree without manually passing props at every level.
// Presence:
// Without Context: Pass darkMode and toggleTheme through every component
// With Context: Any component can directly access the theme data

// Context flow:
// ThemeProvider (Provides data)
//     ↓
// App Component
//     ↓
// Header Component  
//     ↓
// Button Component (Consumes data)

// 6. Then, using createContext(), I creates a context object Without arguments it has an undefined default value.
// - ThemeContext becomes a "carrier" for theme data as the assigned varaible name
const ThemeContext = createContext();
// ThemeContext is an object with { Provider, Consumer } and an internal identity used by React reconciliation.
// - Contains Provider and Consumer components (we use Provider)
// - Because no default is provided, if a component calls useContext(ThemeContext) outside a ThemeProvider, it will receive undefined (hence the explicit guard below).

// Under the Hood Implementation
function createContext(defaultValue) {
  const context = {
    $$typeof: REACT_CONTEXT_TYPE,
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    _threadCount: 0,
    
    // These are the components you use
    Provider: null,
    Consumer: null,
    
    // For DevTools
    displayName: undefined,
  };

  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context, // Reference back to parent context
  };

  context.Consumer = context;

  return context;
}

// 1.  Provider Component Implementation
function Provider({ value, children }) {
  const context = this; // Reference to the context object
  
  // Use React's internal dispatcher to push context provider
  ReactDispatcher.pushProvider(context, value);
  
  try {
    return children;
  } finally {
    // Clean up in complete phase
    ReactDispatcher.popProvider(context);
  }
}

// 2. Value Propagation Mechanism
// Simplified React internals
const ReactDispatcher = {
  providerStack: [],
  
  pushProvider(context, value) {
    // Store previous value for restoration
    const previousValue = context._currentValue;
    context._currentValue = value;
    this.providerStack.push({ context, previousValue });
    
    // Mark consumers for update
    this.scheduleConsumersUpdate(context);
  },
  
  popProvider(context) {
    const { previousValue } = this.providerStack.pop();
    context._currentValue = previousValue;
  },
  
  scheduleConsumersUpdate(context) {
    // React's reconciliation finds all consumers and schedules updates
    // This is where the magic happens!
  }
};

// 3. The Subscription Model - How Consumers Get Notified
function Consumer(props) {
  const context = this; // The context object
  const value = readContext(context);
  
  return props.children(value);
}

function readContext(context) {
  // React internals - this is where the subscription happens
  const dispatcher = ReactCurrentDispatcher.current;
  
  if (dispatcher === null) {
    return context._currentValue;
  }
  
  // Subscribe this component to context changes
  dispatcher.readContext(context);
  
  return context._currentValue;
}

// 4. React's Fiber Architecture Integration
// In React's fiber architecture:
function updateContextProvider(current, workInProgress, renderLanes) {
  const newValue = workInProgress.pendingProps.value;
  const context = workInProgress.type._context;
  
  // Compare with previous value
  if (objectIs(newValue, context._currentValue)) {
    // No change - bail out optimization
  } else {
    // Value changed - propagate to consumers
    context._currentValue = newValue;
    
    // Find all matching consumers and schedule updates
    propagateContextChange(workInProgress, context, renderLanes);
  }
  
  // Continue rendering children
  const nextChildren = workInProgress.pendingProps.children;
  reconcileChildren(current, workInProgress, nextChildren, renderLanes);
  return workInProgress.child;
}

// 7. Using a arrow function , I define a named export of a custom hook --- export const useTheme = () => { ... }.
// - Convention: hooks start with use
export const useTheme = () => {
  // 8. I first define Hook that reads current context value
  // useContext(ThemeContext) reads the nearest ThemeContext.Provider value up the tree.
  const context = useContext(ThemeContext);
  // 9. Checks if context exists (null means outside Provider)
  // - The if (!context) guard checks for undefined and throws a helpful developer error (defensive programming) to avoid silent failures when the hook is used outside the provider.
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
    // 10. throw new Error(...) - Safety check for proper usage
  }
  return context;
  // 11. return context returns the provider value (usually an object like { darkMode, toggleTheme })
  // - return context; - Returns { darkMode, toggleTheme } object
};
// Purpose: Custom hook for clean context consumption in components

// 12. Then I define the ThemeProvider Component
// - ThemeProvider is a component (arrow function) exported for wrapping parts of the app.
export const ThemeProvider = ({ children }) => {
  // 13. With Props:
  // - { children } - Destructures children prop (nested components)
  // --- ({ children }) — props destructuring: React passes children (nested JSX) via this prop.
  // - useState(false) - Initializes dark mode state to false (light mode)
  // --- useState(false) initializes darkMode with false (light theme by default). setDarkMode is the updater function.
  const [darkMode, setDarkMode] = useState(false);

  // 14. Using useffect hook, I implement the Theme Initialization Effect
  // - useEffect(() => { ... }, []) — runs the effect after the first render (mount) because the dependency array is empty. 
  // In StrictMode you may observe it run twice in development.
  useEffect(() => {
    // 15. Initialize theme from localStorage or system preference
    const initializeTheme = () => {
      // 16. localStorage.getItem('darkMode') - Retrieves user's saved preference
      // - localStorage.getItem('darkMode') reads persistent user preference (string). 
      // - localStorage stores only strings. Typical saved values here are 'enabled' or 'disabled'.
      const savedTheme = localStorage.getItem('darkMode');
      
      // 17. Then i define the Priority order:
      // ✅ Local storage (user explicit choice)
      // ✅ System preference (if no user choice)
      // ❌ Default light mode (fallback)
      // 18. if (savedTheme === 'enabled') — sets local state to dark and adds the 'dark' CSS class to document.body. 
      // - This class is commonly used by CSS/Tailwind to switch themes (Tailwind's dark strategy with class).
      if (savedTheme === 'enabled') {
        setDarkMode(true);
        document.body.classList.add('dark');
        // 19. else if (savedTheme === 'disabled') — sets state to light and removes the 'dark' class.
      } else if (savedTheme === 'disabled') {
        setDarkMode(false);
        document.body.classList.remove('dark');
        // 20 . else if (window.matchMedia('(prefers-color-scheme: dark)').matches) — if there’s no saved preference,
        // - Returns true if system is in dark mode 
        // - it queries the system preference using Media Queries API. matchMedia(...).matches returns a boolean. 
        // - Checks if OS/browser prefers dark mode
        // --- If the system prefers dark, the code enables dark mode and also sets localStorage to 'enabled'. 
        // --- (Note: this writes a default that persists the system preference—behavior you may or may not want.)
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Only use system preference if no user preference is saved
        setDarkMode(true);
        // - document.body.classList.add('dark') - Adds CSS class for dark mode styling
        document.body.classList.add('dark');
        localStorage.setItem('darkMode', 'enabled');
      }
    };
    // The effect mutates the DOM (document.body.classList) and sets state (setDarkMode) — both are legitimate side effects.

    // 19. then I call the funtion to react after mount
    initializeTheme();
  }, []); // 20. Because of empty dependency array, It Runs once after mount 

  // 21. Then I defined the Theme Toggle Function
  // - toggleTheme is an event handler (function) that toggles theme when called.
  const toggleTheme = () => {
    // 22. I set a variable that carries Toggles current state
    // computes the new state by inverting current state. 
    // Subtle point: using setDarkMode(d => !d) (functional updater) is safer against stale closures if toggle is used in async scenarios.
    const newDarkMode = !darkMode;
    // 23. setDarkMode(newDarkMode) - Updates React state
    setDarkMode(newDarkMode);
    
    // Condditional if statement to check if its not a null
    if (newDarkMode) {
      // 24. Updates DOM class for immediate visual change
      document.body.classList.add('dark');
      // 25. Saves preference to localStorage for persistence
      localStorage.setItem('darkMode', 'enabled');
    } else {
      // 26. Updates DOM class for immediate visual change
      document.body.classList.remove('dark');
      // 27. Saves preference to localStorage for persistence
      localStorage.setItem('darkMode', 'disabled');
    }
  };

  // 28. I then return the Context Provider
  // The component returns the context Provider with value={{ darkMode, toggleTheme }}.
  // Any descendant component that calls useTheme() will get this object.
  return (
    // value={{ darkMode, toggleTheme }} - Object available to all consuming components
    // {children} - Renders all nested components inside the Provider
    // - {children} renders whatever JSX was wrapped inside <ThemeProvider>...</ThemeProvider>.
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
    // the value object is recreated every render — that causes all consumers to re-render whenever ThemeProvider re-renders (even if only toggleTheme identity changes).
    // Memoizing the value is a common optimization.
  );
};

// ------------------------------------------------------------------------------------------------------------------------------------------
// Setup (App Level):
// App.jsx
import { ThemeProvider } from './ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <Header />
            <MainContent />
            <Footer />
        </ThemeProvider>
    );
}

// Consumption (Any Component):
// Header.jsx
import { useTheme } from './ThemeContext';

function Header() {
    const { darkMode, toggleTheme } = useTheme();
    
    return (
        <header className={darkMode ? 'dark-header' : 'light-header'}>
            <button onClick={toggleTheme}>
                {darkMode ? 'Switch to Light' : 'Switch to Dark'}
            </button>
        </header>
    );
}

// Provider-Consumer Relationship:
// ThemeProvider (Producer)
//     ↓ provides value
// ThemeContext (Channel)  
//     ↓ carries value
// useTheme() (Consumer)
//     ↓ accesses value
// Component

// // User clicks toggle button
toggleTheme() 
// called → darkMode state updates → ThemeProvider re-renders → Context value updates → All useTheme() consumers re-render → UI updates with new theme

// What each important API/keyword means (quick glossary)
// createContext() — creates a Context object with Provider and Consumer.
// Provider — a React component that supplies a context value to descendants.
// useContext(Context) — React hook to read the nearest Provider value.
// useState(initial) — returns [value, setter]; scheduling updates causes re-renders.
// useEffect(fn, deps) — runs fn after render; deps array controls when it re-runs; returning a function is cleanup.
// document.body.classList.add/remove — DOM APIs to mutate classname list.
// localStorage.getItem/setItem — synchronous browser storage API (string only).
// window.matchMedia(mediaQueryString) — returns a MediaQueryList with .matches boolean; can also attach listeners for changes.
// children — React prop that contains nested JSX.

// Practical notes, gotchas and recommended improvements
// Server-side rendering (SSR) / Next.js
// - window and document are undefined on the server. This hook directly accesses window.matchMedia and document.body inside useEffect. useEffect runs only on the client, so it’s safe for SSR render—but if you ever move logic into render-time (or useLayoutEffect) you must guard with typeof window !== 'undefined'.
// Flashing / theme FOUC (Flash Of Unstyled Content)
// - Because the effect runs after first paint, the page can briefly render in the wrong theme. To avoid that, set theme class server-side or inject a small inline script in HTML that reads localStorage and sets document.documentElement.classList synchronously before React mounts. Alternatively, use useLayoutEffect (runs earlier) — but useLayoutEffect still runs on client only.
// Saving system preference to localStorage automatically
// - The code sets localStorage to 'enabled' if the system prefers dark and there is no saved preference. That means next visits the system preference gets persisted — user may be surprised. Prefer not to write a default unless you intend to persist the auto-detected choice.
// matchMedia change listener
// - If you want the app to adapt when user changes system theme while your app is running (and they have not chosen a preference), add a MediaQueryList listener (mql.addEventListener('change', handler) or mql.addListener fallback) and clean it up in the effect.
// localStorage errors
// - localStorage calls can throw (private mode, quota exceeded). Wrap in try/catch.
// Stability of value object
// - value={{ darkMode, toggleTheme }} creates a fresh object each render. Any useTheme() consumer will re-render when the provider renders because the object identity changed, even if darkMode is the same. Use useMemo(() => ({ darkMode, toggleTheme }), [darkMode]) or memoize toggleTheme with useCallback to reduce churn.
// Functional updater pattern
// - Use setDarkMode(d => !d) inside toggleTheme to guard against stale state if the function is used in asynchronous contexts.
// StrictMode double effect in dev
// - React StrictMode may mount/unmount/mount effects twice in development which can cause double writes into localStorage unless guarded.
// TypeScript
// - In TS you would type the context value to avoid any and improve IDE support.

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const ThemeContext = createContext(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};

export const ThemeProvider = ({ children, persistSystemPreference = false }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize synchronously if possible (prevents FOUC if you call this
  // from a small inline script or server-rendered class toggling).
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('darkMode') : null;
      if (saved === 'enabled') {
        setDarkMode(true);
        document.body.classList.add('dark');
        return;
      }
      if (saved === 'disabled') {
        setDarkMode(false);
        document.body.classList.remove('dark');
        return;
      }
      // No explicit user preference:
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
        document.body.classList.add('dark');
        if (persistSystemPreference) {
          try { localStorage.setItem('darkMode', 'enabled'); } catch {}
        }
      }
    } catch (err) {
      // localStorage might throw in private mode
      console.warn('ThemeProvider init error', err);
    }
  }, [persistSystemPreference]);

  // keep value stable to avoid unnecessary re-renders in consumers
  const toggleTheme = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      try {
        if (next) {
          document.body.classList.add('dark');
          localStorage.setItem('darkMode', 'enabled');
        } else {
          document.body.classList.remove('dark');
          localStorage.setItem('darkMode', 'disabled');
        }
      } catch (err) {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  // Optional: listen to system changes if no explicit user preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const stored = localStorage.getItem('darkMode');
    if (stored) return; // user has chosen — do not auto-switch on system change

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      try {
        if (e.matches) {
          setDarkMode(true);
          document.body.classList.add('dark');
        } else {
          setDarkMode(false);
          document.body.classList.remove('dark');
        }
      } catch (err) {}
    };
    mql.addEventListener ? mql.addEventListener('change', handler) : mql.addListener(handler);
    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', handler) : mql.removeListener(handler);
    };
  }, []);

  const value = useMemo(() => ({ darkMode, toggleTheme }), [darkMode, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
