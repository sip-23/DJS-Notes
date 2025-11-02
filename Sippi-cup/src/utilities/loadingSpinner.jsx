/**
 * LoadingSpinner Component
 * 
 * Displays a full-screen loading overlay with:
 * - A spinning circular loader
 * - A welcome message
 * - Sippi-Cup logo
 *
 * @component 
 */

// 1. Using arrow function, I Declare a functional React component named LoadingSpinner
const LoadingSpinner = () => {
    // 2. Defines an object logo that holds:
    // - id: an identifier (not directly used here).
    // - image: path to the logo file
    // - alt: alternative text for accessibility.
    const logo = {id: 3, image: "./src/assets/SippiCup_logo.png", alt: "logo"};
    
    // 3. Then I Start the JSX return block.
    // - Using perentheses (), I allows me to add a collection of HTML markup elements
    // - Everything inside will be rendered in the browser.
    return (
        // 4. div container covers the entire viewport:
        // - fixed inset-0: positions it fixed at top, bottom, left, right = full screen.
        // - bg-black bg-opacity-50: semi-transparent black background overlay.
        // - flex flex-col: arranges children vertically.
        // - items-center justify-center: centers children both horizontally and vertically.
        // - text-white: makes text white.
        // - z-[1000]: ensures it overlays everything else (very high z-index).
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white z-[1000]">

            {/* 5. This is the spinner circle:
                - border-[5px] border-solid border-gray-300: light gray border all around.
                - border-t-[5px] border-t-blue-500: top border is blue (creates spinner effect).
                - rounded-full: makes it a perfect circle.
                - w-[50px] h-[50px]: sets size.
                - mb-4: margin below.
                - animate-spin: Tailwind animation that continuously rotates it. */}
            <div className="border-[5px] border-solid border-gray-300 border-t-[5px] border-t-blue-500 rounded-full w-[50px] h-[50px] mb-4 animate-spin"></div>
                
                {/* 6. A welcome message displayed above the logo. */}
                <p className="mb-4">Welcome to Sippi-Cup ☕ Podcasts</p>

                {/* 7. Conditional rendering: if logo exists, display an img tag.
                    - className styles:
                        - flex: makes the image behave flexibly.
                        - w-[200px]: sets width.
                        - h-fit: keeps height proportional.
                        - md:w-[200px]: same width on medium screens.
                        - mb-4: margin below.
                        - src={logo.image}: image path.
                        - alt={logo.alt}: alt text for accessibility. */}
                {logo && (
                    <img 
                        className="flex w-[200px] h-fit md:w-[200px] mb-4" 
                        src={logo.image} 
                        alt={logo.alt} 
                    />
                )}

                {/* 7. Conditional rendering: Else A status message displayed at the bottom. */}
                <p>Loading Podcasts...</p>
            </div>
    );
}; // Closes the main container <div> and finishes the component.

export default LoadingSpinner;