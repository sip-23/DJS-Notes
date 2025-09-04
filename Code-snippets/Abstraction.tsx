// Most modern and recommended approach to Create a UUID
const uuid = crypto.randomUUID();
console.log(uuid); // e.g., "123e4567-e89b-12d3-a456-426614174000"

// Complete Cross-Browser Solution
function generateUUID() {
    // Check if crypto.randomUUID is available
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    
    // Fallback for older browsers
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    
    // Fallback for very old environments
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const uuid = generateUUID();
console.log(uuid);


// Node.js Specific (if not using crypto.randomUUID)
// For Node.js environments
const crypto = require('crypto');

function generateUUID() {
    return crypto.randomUUID ? crypto.randomUUID() : 
        ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.randomBytes(1)[0] & 15 >> c / 4).toString(16)
        );
}

const uuid = generateUUID();
console.log(uuid);

// ------------------------------------------------------------------------------------------------------------------------------------//

// JavaScipt is an abstraction of assembly language, Which creates the below

// Abstraction 1: Using crypto.getRandomValues() (Fallback for Older Browsers)
// JavaScript is an abstraction of Assembly
/**
 * Create Unique ID
 * @returns 
 */
function generateUUID() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// @ts-check (allows us to be diligent and produces an error is something is not correct and doesnt do what we said it would do)

// This pulls out the essence and hides the low-level things that are not important

import { generateUUID } from "/Abstraction.tsx"

// Astraction 2: This extracts the essence of it (What it acually does)
// This means we can use it without knowing the internals and What it does

const uuid = generateUUID();
console.log(uuid);

// Abstraction 3: This is used below un the Organisation to create an employee and becomes part of an abstract of that.
// uses generateUUID() within it.

/**
 * @param {String} name - takes the legal name of employee as appearing on their ID
 * @return {Employee}
 */
export createEmployee = (name, company) => {
    const uuid = generateUUID()

    return {
        uuid,
        name,
        company,
        created: new Date(),
    }
}

// run this
createEmployee("John Doe", "Codespace");


// Abstraction 4: This can further be abstracted If user already works at codeSpace, they are a colleague

const createColleague = (name) => createEmployee(name, "Codespace")

// run this
createColleague("Jane Doe");

// With this, you can see the essense has been pulled and removed all the noise.
// Good abstraction is Composable


// Abstraction 5: Create Inspector to check Codespace Employee, But we also need to onboard them
const createInspector = (name) => createColleague(name, "SAGov");

// run this
createInspector("Big Boss");


// Abstraction 6: Event with the attendees log
// You can also use Props

const createEvent = ({attendees, title}) => {
    return {
        title,
        attendees, 
        date: new Date(),
        completed: false,
    }
}

const event = createEvent({
    title: "Annual 2051 Inspction",
    attendees: [
        createEmployee("John Doe", "Codespace");
        createColleague("Jane Doe");
        createInspector("Big Boss");
    ],
    })