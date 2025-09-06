// @ts-check

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

// Exporting incapsulation

export const addTask = () => {

};