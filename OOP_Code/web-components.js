// ---------------------------------------------------------------------------------------------------------------------------------------

// How to define a new web component

// ---------------------------------------------------------------------------------------------------------------------------------------

class CustomElement extends HTMLElement {
    constructor() {
        super(); // Calls the parent class's constructor
        // Define functionality specific to this custom element
    }
}

// 1. Class Syntax: Utilises the class keyword to define a new custom element as a class.
// 2. Extending HTML Elements: CustomElement extends HTMLElement, indicating that it inherits from the basic HTML element class, allowing it to act like a native HTML element.
//  - By extending the HTMLElement class, custom elements can inherit properties and methods from it, allowing them to behave like standard HTML elements.
// 3. Constructor and Super: 
//  - The constructor method is a special method for creating and initialising an object created with a class. 
//  - Calling super() within it is crucial as it calls the constructor of the parent class (HTMLElement in this case), ensuring the custom element has all the necessary initialisation from its HTML element lineage.
//  - ensuring that the element is properly set up according to the standards of HTML elements.
// 4. After calling super(), you can add custom functionality specific to the new element.




class PodcastCard extends HTMLElement {
    constructor() {
        super();
        // Attach a shadow DOM tree to the element
        this.attachShadow({ mode: 'open' });
    }
    
    // Called when the element is added to the DOM
    connectedCallback() {
        this.render();
    }
    
    // Method to render the component
    render() {
        const title = this.getAttribute('title') || 'Podcast Title';
        const image = this.getAttribute('image') || 'https://via.placeholder.com/300';
        const seasons = this.getAttribute('seasons') || '0';
        const updated = this.getAttribute('updated') || new Date().toISOString();
        const genres = this.getAttribute('genres') || 'Podcast';
        const likes = this.getAttribute('likes') || '0';
        
        // Calculate days since last update
        const updatedDate = new Date(updated);
        const currentDate = new Date();
        const daysSinceUpdate = Math.floor((currentDate - updatedDate) / (1000 * 60 * 60 * 24));
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    --card-width: 300px;
                    --image-height: 180px;
                }
                
                .card {
                    width: var(--card-width);
                    height: 350px;
                    display: flex;
                    flex-direction: column;
                    padding: 20px;
                    gap: 8px;
                    border-radius: 12px;
                    background: #282828;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                }
                
                .card:hover {
                    background: #65350F;
                    transform: translateY(-5px);
                    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
                }
                
                .card-image {
                    width: 100%;
                    height: var(--image-height);
                    object-fit: cover;
                    border-radius: 8px;
                    margin-bottom: 12px;
                }
                
                .card-title {
                    font-weight: 600;
                    color: white;
                    font-size: 1.1rem;
                    margin: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .card-details {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 5px;
                }
                
                .seasons {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #b3b3b3;
                    font-size: 0.9rem;
                }
                
                .likes {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: white;
                    font-size: 0.9rem;
                }
                
                .genres {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                    margin: 8px 0;
                }
                
                .genre {
                    background: #F4F4F4;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    color: #121212;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .update-info {
                    color: #b3b3b3;
                    font-size: 0.85rem;
                    margin-top: auto;
                }
                
                @media (max-width: 640px) {
                    :host {
                        --card-width: 100%;
                    }
                    
                    .card {
                        height: auto;
                        min-height: 320px;
                    }
                }
            </style>
            
            <div class="card">
                <img src="${image}" alt="${title}" class="card-image">
                <h3 class="card-title">${title}</h3>
                <div class="card-details">
                    <div class="seasons">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>${seasons} seasons</span>
                    </div>
                    <div class="likes">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        <span>${likes}</span>
                    </div>
                </div>
                <div class="genres">
                    ${genres.split(', ').map(genre => `<span class="genre">${genre}</span>`).join('')}
                </div>
                <p class="update-info">Updated ${daysSinceUpdate} days ago</p>
            </div>
        `;
        
        // Add click event listener
        this.shadowRoot.querySelector('.card').addEventListener('click', () => {
            alert(`You clicked on: ${title}`);
        });
    }
    
    // Called when an attribute changes
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }
    
    // Specify which attributes to observe
    static get observedAttributes() {
        return ['title', 'image', 'seasons', 'updated', 'genres', 'likes'];
    }
}

// Register the custom element
customElements.define('podcast-card', PodcastCard);

// Demo functions
function showDemo() {
    document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' });
}

function showCode() {
    alert('Check the code tab to see the complete implementation of the PodcastCard web component!');
}

function showBenefits() {
    alert('Web Components provide:\n\n• Encapsulation via Shadow DOM\n• Reusability across projects\n• Framework interoperability\n• Native browser support\n• Maintainability through isolation');
}