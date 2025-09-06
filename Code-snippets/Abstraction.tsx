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

import { error } from "console";
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
 * @typedef {object} Employee
 * @prop {string} uuid
 * @param {String} name - takes the legal name of employee as appearing on their ID
 * @prop {string} company
 * @prop {Date} created
 */

/**
 * @param {string} name
 * @return {Employee} 
 */
export const createEmployee = (name, company) => {
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
// OCP
// LSP

const createEvent = ({attendees, title}) => {
    const response = {};

    for (const { name: attendeeName, company} of attendees) {
        if (company === "CodeSpace") {
            const answer = window.prompt(`Is ${attendeeName} attending?`);

            if (!answer || answer.trim() === "")
                throw new Error("Answer can not be empty");

            response[attendeeName] = answer;
        } else if (company === "South African Gov") {
            response[attendeeName] = "Awaiting response";
        } else {
            response[attendeeName] = "Not required";
        }
    }
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


// -------------------------------------------------------------------------------------------------------------------------------------

// SOLID: Working example break down

/**
 * S in SOLID:
 * This must do a single responsibility as far as possible
 * This function originally: Adds the HTML Elements and also set the values within it all at once
 * But What about a function that needs to update the tasks?
 * Creating an Abstraction:
 * 1. Create an Abstraction that creates the task list Element (Task)
 * 2. Create an abstraction that sets the values in the created list Element HTML (Task)
 * 3. Create and abstraction that allows for editing created List element (Task)
 * 
 * Also ensure you separate this by:
 *  - Adding to something to the HTML
 *  - Adding something to the **state**
 * 
 * After doing this, I can Automatically have a function that updates a task and use it immediately.
 * 
 * Also put in a condition that checks if the ID is already in the HTML and if it is throw error.
 * 
 * 
 * @param {String} id - comes from the state 
 */
const addStyledTasktoHTML = (id) => {
    const isExisting = document.querySelector(`[data-list]="${id}"`);

    if (isExisting) {
        throw new Error('Task with ID is found in HTML therefore added');
    }

    const list = document.querySelector("[data-list]");
    const isHTMLElement = list instanceof HTMLElement;

    if (!isHTMLElement) {
        throw new Error('"data-list" attribute not found in HTML');
    }

    const preview = document.createElement("li");
    preview.className = "task";
    preview.dataset.task = id;  /* this adds the id like: <li class="task" data-task="xxxxxxxx"></li> */

    preview.innerHTML = /* html */
        `<label class="task__check">
            <input class="task__input" type="checkbox" />
          </label>
          <button class="task__title">
            Wash th Dog asda sdasd asd as ddas Dog asda sdasd asd as ddase Dog
            asda sdasd asd as ddas
          </button>
          <label class="task__check">
            <svg
              class="task__icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 96 960 960"
            >
              <path
                d="M253 961q-40.212 0-67.606-27.1Q158 906.8 158 867V314h-58v-94h231v-48h297v48h232v94h-58v553q0 39.05-27.769 66.525Q746.463 961 707 961H253Zm454-647H253v553h454V314ZM354 789h77V390h-77v399Zm175 0h78V390h-78v399ZM253 314v553-553Z"
              ></path>
            </svg>
          </label>
        </li>
        <li class="task">
          <label class="task__check">
            <input class="task__input" type="checkbox" />
          </label>
          <button class="task__title">
            Wash th Dog asda sdasd asd as ddas Dog asda sdasd asd as ddase Dog
            asda sdasd asd as ddas
          </button>
          <label class="task__check">
            <svg
              class="task__icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 96 960 960"
            >
              <path
                d="M253 961q-40.212 0-67.606-27.1Q158 906.8 158 867V314h-58v-94h231v-48h297v48h232v94h-58v553q0 39.05-27.769 66.525Q746.463 961 707 961H253Zm454-647H253v553h454V314ZM354 789h77V390h-77v399Zm175 0h78V390h-78v399ZM253 314v553-553Z"
              ></path>
            </svg>
          </label>`;
    list.appendChild(preview);
};

addStyledTasktoHTML();

// -----------------------------------------------------------------------------------------------------------------

// Creating the 4 Abstractions: Functions related to Tasks

// Creating function that are not related to Tasks
// - Methods/ variables that help and not necessarily associated with anything 
// Get helpers and add them in the util.js file

/**
 * Creating an Abstraction:
 * 1. Create an Abstraction that creates the task list Element
 *
 * @param {string} dataAttr
 * @param {Object} [value]
 * @returns {HTMLElement}
 */
const getHTML = (dataAttr, value) => {
    const selector = value ? `[data-${dataAttr} = "${value}"]`: `[data-${dataAttr}]`; // if there is a value, then the selector is: (), otherwise: ()
    const element = document.querySelector(selector);
    
    const isHTMLElement = element instanceof HTMLElement;

    if (!isHTMLElement) {
        throw new Error(`${selector} attribute not found in HTML`);
    }

    return element;
};

/**
 * Creating an Abstraction:
 * 1. Create an Abstraction that checks if the task list Element already exists
 *
 * @param {string} dataAttr
 * @param {Object} [value]
 * @returns {boolean}
 */
const doesHTMLExist = (dataAttr, value) => {
    const selector = value ? `[data-${dataAttr} = "${value}"]`: `[data-${dataAttr}]`; // if there is a value, then the selector is: (), otherwise: ()
    const element = document.querySelector(selector);
    
    const isHTMLElement = element instanceof HTMLElement;

    if (!isHTMLElement) {
        throw new Error(`${selector} attribute not found in HTML`);
    }

    return isHTMLElement;
};

/**
 *  * Creating an Abstraction:
 * 2. Create an Abstraction that styles the task list Element using getHTML() abstraction.
 * 
 * @param {String} id 
 */
const addTasktoHTML = (id) => {
    const isExisting = getHTML("list", id);

    if (isExisting) {
        throw new Error('Task with ID is found in HTML therefore added');
    }

    const list = getHTML("list");

    const preview = document.createElement("li");
    preview.className = "task";
    preview.dataset.task = id;  /* this adds the id like: <li class="task" data-task="xxxxxxxx"></li> */

    preview.innerHTML = /* html */
        `<label class="task__check">
            <input class="task__input" type="checkbox" />
          </label>
          <button class="task__title">
            Wash th Dog asda sdasd asd as ddas Dog asda sdasd asd as ddase Dog
            asda sdasd asd as ddas
          </button>
          <label class="task__check">
            <svg
              class="task__icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 96 960 960"
            >
              <path
                d="M253 961q-40.212 0-67.606-27.1Q158 906.8 158 867V314h-58v-94h231v-48h297v48h232v94h-58v553q0 39.05-27.769 66.525Q746.463 961 707 961H253Zm454-647H253v553h454V314ZM354 789h77V390h-77v399Zm175 0h78V390h-78v399ZM253 314v553-553Z"
              ></path>
            </svg>
          </label>
        </li>
        <li class="task">
          <label class="task__check">
            <input class="task__input" type="checkbox" />
          </label>
          <button class="task__title">
            Wash th Dog asda sdasd asd as ddas Dog asda sdasd asd as ddase Dog
            asda sdasd asd as ddas
          </button>
          <label class="task__check">
            <svg
              class="task__icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 96 960 960"
            >
              <path
                d="M253 961q-40.212 0-67.606-27.1Q158 906.8 158 867V314h-58v-94h231v-48h297v48h232v94h-58v553q0 39.05-27.769 66.525Q746.463 961 707 961H253Zm454-647H253v553h454V314ZM354 789h77V390h-77v399Zm175 0h78V390h-78v399ZM253 314v553-553Z"
              ></path>
            </svg>
          </label>`;
    list.appendChild(preview);
};

addTasktoHTML("test");

/**
 * Creating an Abstraction:
 * 1. Create an Abstraction that creates the task list Element
 * 2. 
 * 
 * 
 * Problem: You just want to update a sting thing from the Data / state.js
 * 
 * Solution: Helper function (typescript helper)
 *  - Pick
 *  - Omit
 *  - Partial
 *  - Required
 * These create an object based on another object by removing things from an object or extracting things from an object.
 * 
 * @param {string} id
 * @param {Partial<Pick<Task, 'completed' | 'due' | 'title' | 'urgency'>>} changes
 */
const EditTaskinHTML = (id, changes) => {
    const element = document.querySelector(`[data-list]="${id}"`);
    const isHTMLElement = element instanceof HTMLElement;

    if (!isHTMLElement) {
        throw new Error('"data-list" attribute not found in HTML');
    }
};

EditTaskinHTML("test", {title: "Wash the Dog"});


// Add EventListener when error occurs
window.addEventListener('error', () => {
    document.body.innerHTML = 'Something went very very wrong, refresh Twana'
})


