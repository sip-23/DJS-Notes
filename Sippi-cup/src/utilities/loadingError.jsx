// 1. I Import React’s useState hook to manage internal component state.
import { useState } from 'react'; 

/**
 * ErrorDisplay Component
 *
 * shows a error notification box once the data cannot load due to loading error codes
 * 
 * @component
 * @param {Object} props
 * @param {string} props.message - error message to display.
 */

// 2. Then I Declared a functional component named ErrorDisplay.
// - Accepts props:
//    - message: the error text shown to the user.
//    - onDismiss: optional callback when the error is dismissed.
const ErrorDisplay = ({ message, onDismiss }) => {

  // 3. In this line: I Define a state variable isVisible (initially true) - to track whether the error box should be shown.
  // - setIsVisible updates this state.
  const [isVisible, setIsVisible] = useState(true);

  // 4. Then I Defined a function called handleDismiss using the arrow function notation / syntax:
  // - It first Sets isVisible to false (hides the error).
  // - If onDismiss was provided as a prop, it calls it (so parent components can react to dismissal).
  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  // 5. If isVisible is false, the component returns null, meaning nothing is rendered
  if (!isVisible) return null;

  // 6. In the return block, I render the the  collection of elements or markups
  return (
    // 6. If still visible, render a div styled as a floating error box:
    // - fixed bottom-5 right-5: pinned at bottom-right of screen with spacing
    // - bg-[#ff4444]: red background (custom hex).
    // - text-white: white text.
    // - px-4 py-3: padding inside the box.
    // - rounded: rounded corners.
    // - shadow-lg: drop shadow for visibility.
    // - z-[1000]: ensures it overlays most UI elements.
    <div className="fixed bottom-5 right-5 bg-[#ff4444] text-white px-4 py-3 rounded shadow-lg z-[1000]">
      {/* 7. Displays the error message text from props. */}
      <span>{message}</span>

      {/* 8. Renders a close button (×).
        - onClick={handleDismiss} triggers the dismiss logic.

        Using inline Tailwindcss classes, I style it using:
        - ml-4: margin to the left, spacing from text.
        - text-xl: larger font size for visibility. */}
      <button onClick={handleDismiss} className="ml-4 text-xl">×</button>
    </div>
  );
}; // Closes the error container and finishes the component.

export default ErrorDisplay; // Exports the component so it can be used elsewhere.