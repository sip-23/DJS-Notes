// Declerations
const todoTasks = document.getElementById('todo-tasks');
const doingTasks = document.getElementById('doing-tasks');
const doneTasks = document.getElementById('done-tasks');
const modal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const cancelBtn = document.getElementById('cancel-btn');
const editModal = document.getElementById('edit-task-modal');
const editTaskForm = document.getElementById('edit-task-form');
const editCancelBtn = document.getElementById('edit-cancel-btn');
const addTask = document.getElementById('addTaskButton');
const toggle = document.getElementById("themeToggle");
const sidebar = document.querySelector('.sidebar');
const hideSidebarBtn = document.getElementById('hideSidebar');
const showSidebarBtn = document.getElementById('showSidebar');
const updateTaskBtn = document.getElementById('saveChangesBtn')
const mobileSidebar = document.getElementById('drawer');
const mobileSidebarBtn = document.getElementById('mobileSidebarBtn');
const closeMobileSidebarBtn = document.getElementById('closeMobileSidebarBtn');
const deleteTaskBtn = document.getElementById('deleteTaskBtn');
const deleteConfirmation = document.getElementById('confirm');
const delConfirmBtn = document.getElementById('delete-confirmed');
const delCancelBtn = document.getElementById('delete-canceled');
const toggleSlider = document.getElementById('themeToggle');
const bod = document.documentElement;
const toggleSliderMobile = document.getElementById('themeToggle-mobile');
const additionConfirmedBtn = document.getElementById('addition-confirmed');
const addTaskConfirmDiag = document.getElementById('confirm-addition');
const loadingIndicator = document.getElementById('loading-indicator');
const errorDisplay = document.getElementById('error-display');


// Modal input fields
const taskIdInput = document.getElementById('task-id');
const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-description');
const taskStatusInput = document.getElementById('task-status');
const taskPriorityInput = document.getElementById('task-priority');
const editTaskTitleInput = document.getElementById('edit-task-title');
const editTaskDescInput = document.getElementById('edit-task-description');
const editTaskStatusInput = document.getElementById('edit-task-status');
const editTaskPriorityInput = document.getElementById('edit-task-priority');

// API
const API_URL = 'https://jsl-kanban-api.vercel.app/';

// Current task that I want to show
let currentTask = null;
let initialTasks = [];

// Loading function
function showLoading() {
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
    }
    if (errorDisplay) {
        errorDisplay.classList.add('hidden');
    }
}

// Function to hide the loading
function hideLoading() {
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
    }
}

// function to show Error
function showError(message) {
    if (errorDisplay) {
        errorDisplay.textContent = message;
        errorDisplay.classList.remove('hidden');
    }
    console.error(message);
}

function dismissError() {
  const errorDisplay = document.getElementById('error-display');
  if (errorDisplay) {
    errorDisplay.classList.add('hidden');
  }
}

// Fetch Fucntion
async function fetchTasks() {
    // 1. Use the async key word and allow the function to return a promise
    // - Which allows you to use the await inside the function.
    // - async/ wait allows us to write asyncronous code that looks synchronous.
    // - This is used for requests in the network (like fetch, Post) which would take time.
    
    showLoading();
    // 2. Then I run the ...
    // This is a helper function within the fetch function which runs the animation when fetching the data, carried out below in the try-catch block
    try {
        // 3. try block allows the failure of a block of code to occur without the program stoping
        // If any error occurs inside try, execution jumps to catch
        // we used this because network request fail due to a plathora o reasons (host/server could be down, client might have bad conncetion)
        const response = await fetch(API_URL);
        // 4. the fetch() method starts the HTTP request to the host/server and returns a promise
        // the await property pauses the function execution until the promise is resloved and then once resolved,
        // the HTTP response is asigned to the response variable        
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        // 5. The if statement here checks if HTTP request did not succeed using the .ok method
        // And if the condition is true, the program stops executing and throws this custom error.
        const tasks = await response.json();
        // 6. Then we used the .json() method on the response we cgot from the API to extract the json body/ or converts it to json
        // The await allows us to wait that convertion/ extraction to finish
        // and that where that async await duo comes in to assist in the waiting of even larger jscon extractions
        const processedTasks = tasks.map(task => ({
            ...task,
            priority: task.priority || 'low'
        }));
        // 7. This code block essentially takes the extracted json and maps it out where:
        // the initial task array is spread into individual elements (using the spread/rest operator(function parameters))
        // Then for each individual element extracted, either a given task priority is given or the static string is added.
        // in this case, the static string is parsed.
        
        // Save to local storage immediately
        localStorage.setItem('initialTasks', JSON.stringify(processedTasks));
        // 8. Then we Store the proccessed task in out local storage.
        // I used JSON.stringify method on the Proccessed array to convert it into a JSON string that the local storage understands and stores.
        // I then called that InitialTask
        // And used setItem() method that stored the JSOn string into the LocalStorage
        return processedTasks;
    } catch (error) {
        console.error('Fetch error:', error);
        showError(error.message);
        
        // Return whatever is in local storage as fallback
        const localTasks = JSON.parse(localStorage.getItem('initialTasks'));
        return localTasks || getDefaultTasks();
        // 9. The catch block essentially runs if there is any error that occurs in the try-block
        // it logs and shows the error on thr console and also the error message created in my HTML through the showError function
    } finally {
        hideLoading();
        // 10. The finally block the runs regardless of the outcome
        // this is where I executed the hideLoading() function, which essentially hides loading animation 
    }
}

// Create task function - Element
/**
 * Creates the list element and its respective / relevent classes in the DOM.
 * @param {Object} task - The tasks which are stored in an array and declared as tasks
 * @returns {HTMLLIElement} - The created list item elements
 */
function createTaskElement(initialTasks) {
    const taskElementCreated = document.createElement("li"); // Creates an HTML list item element for a task


    if(initialTasks.priority === 'low') {
        taskElementCreated.className = 'task flex mt-4 py-5 px-3 mr-2 w-max-[320px] xl:w-[280px] h-[60px] bg-white dark:bg-[#2B2C37] dark:text-white rounded-lg shadow-[0px_4px_6px_0px_rgba(54,78,126,0.1)] transition-all hover:shadow-md flex justify-between items-center';
        // Sets appropriate classes for styling and also creates a className for the new class
        taskElementCreated.innerHTML = `<h3 class="font-bold">${initialTasks.title}</h3><span class="flex justify-end inline h-[15px] w-[15px]">🟢</span>`;
        taskElementCreated.setAttribute('data-id', initialTasks.id);
    } else if (initialTasks.priority === 'medium') {
        taskElementCreated.className = 'task flex mt-4 py-5 px-3 mr-2 w-max-[320px] xl:w-[280px] h-[60px] bg-white dark:bg-[#2B2C37] dark:text-white rounded-lg shadow-[0px_4px_6px_0px_rgba(54,78,126,0.1)] transition-all hover:shadow-md flex justify-between items-center';
        // Sets appropriate classes for styling and also creates a className for the new class
        taskElementCreated.innerHTML = `<h3 class="font-bold">${initialTasks.title} </h3><span class="flex justify-end inline h-[15px] w-[15px]">🟠</span>`;
        taskElementCreated.setAttribute('data-id', initialTasks.id);
    } else {
        taskElementCreated.className = 'task flex mt-4 py-5 px-3 mr-2 w-max-[320px] xl:w-[280px] h-[60px] bg-white dark:bg-[#2B2C37] dark:text-white rounded-lg shadow-[0px_4px_6px_0px_rgba(54,78,126,0.1)] transition-all hover:shadow-md flex justify-between items-center';
        // Sets appropriate classes for styling and also creates a className for the new class
        taskElementCreated.innerHTML = `<h3 class="font-bold">${initialTasks.title} </h3><span class="flex justify-end inline h-[15px] w-[15px]">🔴</span>`;
        taskElementCreated.setAttribute('data-id', initialTasks.id);
    }
    
    taskElementCreated.setAttribute('data-id', initialTasks.id);
    taskElementCreated.setAttribute('data-priority', initialTasks.priority); // For sorting

    return taskElementCreated;
    // Returns the created DOM element
}

// Showing the task
// Implemented function to show all tasks once the script is running on the main section
/**
 * First cleans the HTML Elements and then Shows or Renders the tasks from the given array to the respactive columns in the DOM
 */
function showSortedTasks() {
    if (!initialTasks) {
        console.error("initialTasks is not defined");
        initialTasks = [];
    }


    // Clear all columns
    todoTasks.innerHTML = '';
    doingTasks.innerHTML = '';
    doneTasks.innerHTML = '';

    // Sort all tasks by priority first (high to low), then by other criteria if needed
    const sortedTasks = [...initialTasks].sort((a, b) => {
        // 1. creates a copy using  spread operator keeping the original array unharmed
        // 2. Then I used the sort method on the copied array to sort in place the declared look up object within it.
        const priorityOrder = {high: 3, medium: 2, low: 1};
        return priorityOrder[b.priority] - priorityOrder[a.priority];
        // 3. Then I return this comparison calcualtion, 
        // which take the pair a and b mapped priority values
        // and subtracts a priority from b value
        // this calcualtion says: 
        // if outcome is below 0, a was larger then b and therefore takes priority
        // if outcome is above 0, a was smaller then b and therefore takes does not take priorty and falls below b.
        // if outcome is 0, then nothing changes.
    });

    // Sort tasks into columns
    sortedTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        
    
        switch(task.status) {
            case 'todo':
                todoTasks.appendChild(taskElement);
                break;   
            case 'doing':
                doingTasks.appendChild(taskElement);
                break;
            case 'done':
                doneTasks.appendChild(taskElement);
                break;
        }
    });

    updateTaskCounts();
}

// Update the task counts in each column header
/**
 * Selects the Element container with the specified id and select the last child of the target parent and gives it the value of length of the Elements in that column
 */
function updateTaskCounts() {
  // Updates the count numbers in each column header
  // selects the DOM at the attribute node and uses the property .textcontent to update / set it with the length of the children nodes/ elements
  document.querySelector('#todo-column span:last-child').textContent = `(${todoTasks.children.length})`; 
  document.querySelector('#doing-column span:last-child').textContent = `(${doingTasks.children.length})`;
  document.querySelector('#done-column span:last-child').textContent = `(${doneTasks.children.length})`;
}

// Function to open modal with task data
/**
 * Matches the Id of the selected task provides the information in the modal.
 * @param {number} taskId - Is the ID of the selected
 * @returns A modal that is populated with the informtion that the corresponds to the matched ID
 */
function openEditModal(taskId) {
    currentTask = initialTasks.find(task => task.id === taskId);
    
    if (!currentTask) return;
  
    // populate the modal with task data that was salected
    taskIdInput.value = currentTask.id;
    editTaskTitleInput.value = currentTask.title;
    editTaskDescInput.value = currentTask.description;
    editTaskStatusInput.value = currentTask.status;
    editTaskPriorityInput.value = currentTask.priority;
  
    // Show the modal
    editModal.classList.remove('hidden');
}

// Function to open modal with task data
/**
 * Matches the Id of the selected task provides the information in the modal.
 * @returns A modal that is populated with the informtion that the corresponds to the matched ID
 */
function deleteTaskConfirm(e) {
    e.preventDefault();
    showDeleteConfirmationDialog();
}

// Delete confirmation functions
function showDeleteConfirmationDialog() {
    deleteConfirmation.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function showAdditionConfirmationDialog(){
    addTaskConfirmDiag.classList.remove('hidden');
}

function deleteConfirmed(){
    deleteConfirmation.classList.add('hidden');
    document.body.style.overflow = '';
    deleteTask(currentTask.id);
}

function deleteCanceled(){
    deleteConfirmation.classList.add('hidden');
}

function additionConfirmedCloseDialog(){
    addTaskConfirmDiag.classList.add('hidden');
}

// function to add new dask from the modal
// save new task
/**
 * This allos changes to be made in modal to be savd
 * @param {Event} e - Is the submit event from the form
 * @returns 
 */
function addTasksubmit(e) {
    e.preventDefault();

    if(validateInputs()){
        saveTask(initialTasks);
        closeModal();
        showAdditionConfirmationDialog();
        showSortedTasks();
    }
    
};

const setError = (element, message) => {
    const errorDisplay = document.getElementById(`${element.id}-error`);

    if (errorDisplay) {
        errorDisplay.innerText = message;
        errorDisplay.classList.remove('hidden');
        element.classList.add('border-red-500');
        element.classList.remove('border-gray-300');
    }
    
};

// Creating a cussess
const setSuccess = (element) => {
    const errorDisplay = document.getElementById(`${element.id}-error`);
    
    if(errorDisplay){
        errorDisplay.innerText = '';
        errorDisplay.classList.add('hidden');
        element.classList.remove('border-red-500');
        element.classList.add('border-gray-300');
    }
};

// Validating inputs
const validateInputs = () => {
    const taskTitleInputValue = taskTitleInput.value.trim();
    const taskDescInputValue = taskDescInput.value.trim();
    const taskStatusInputValue = taskStatusInput.value;
    const taskPriorityInputValue = taskPriorityInput.value;

    let isValid = true;

    if(!taskTitleInputValue) {
        setError(taskTitleInput, "Please fill out this field.");
        isValid = false;
    } else {
        setSuccess(taskTitleInput);
    }

    if(!taskDescInputValue) {
        setError(taskDescInput, "Please fill out this field.");
        isValid = false;
    } else {
        setSuccess(taskDescInput);
    }

    if(!taskStatusInputValue) {
        setError(taskStatusInput, "INVALID STATUS! Please enter only: todo, doing, or done");
        isValid = false;
    } else {
        setSuccess(taskStatusInput);
    }

    if(!taskPriorityInputValue) {
        setError(taskPriorityInput, "INVALID STATUS! Please enter only: todo, doing, or done");
        isValid = false;
    } else {
        setSuccess(taskPriorityInput);
    }


    // Store task details in object
    if(isValid) {
        const output = {
            id: initialTasks.length + 1,
            title: taskTitleInputValue,
            description: taskDescInputValue,
            status: taskStatusInputValue,
            priority: taskPriorityInputValue
        };
        
        // Add task to the existing array
        initialTasks.push(output);
        
        saveTask();

        taskForm.reset();
        return true
    }

    return false;
};

function saveTask() {
    localStorage.setItem("initialTasks", JSON.stringify(initialTasks));
}

// Function to delete task from local storage
function deleteTask(taskId) {
    const taskIndex = initialTasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        initialTasks.splice(taskIndex, 1);
        saveTask();
        showSortedTasks();
    }
    closeModal();
}

// function to open modal
function openModel() {
    taskTitleInput.value = '';
    taskDescInput.value = '';
    taskStatusInput.value = 'todo';
    taskPriorityInput.value = 'low';
    modal.classList.remove('hidden')
}

// Function to close modal
/**
 * Closes the task modal and resets the current task variable declared
 * Add the Hidden class to allow the modal to dissapear once it is closed
 */
function closeModal() {
    modal.classList.add('hidden');
    editModal.classList.add('hidden');
    currentTask = null;
}

// Function to Save task changes
/**
 * This allos changes to be made in modal to be savd
 * @param {Event} e - Is the submit event from the form before
 * @returns 
 */
function saveTaskChanges(e) {
    e.preventDefault();
    
    if (!currentTask) return;
  
    // Update task object
    currentTask.title = editTaskTitleInput.value;
    currentTask.description = editTaskDescInput.value;
    currentTask.status = editTaskStatusInput.value;
    currentTask.priority = editTaskPriorityInput.value;
    
    // Refresh display
    // Refreshes the display and closes the modal
    saveTask();
    closeModal();
    showAdditionConfirmationDialog();
    showSortedTasks();
}

// function to Hide sidebar
function hideSidebarVisability() {
    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('lg:w-[300px]');
    sidebar.classList.add('opacity-0');
    sidebar.classList.add('w-0');
    sidebar.classList.add('border-none');
    showSidebarBtn.classList.remove('hidden');
    localStorage.setItem('sidebarHidden', 'true');

}

// function to show sidebar
function showSidebarVisability() {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('lg:w-[300px]');
    sidebar.classList.remove('opacity-0');
    sidebar.classList.remove('w-0');
    sidebar.classList.remove('border-none');
    showSidebarBtn.classList.add('hidden');
    localStorage.setItem('sidebarHidden', 'false');
}

function showSidebarVisabilityMobile(){
    mobileSidebar.classList.remove('hidden');
    localStorage.setItem('sidebarHidden', 'false');
}

function hideSidebarVisabilityMobile(){
    mobileSidebar.classList.add('hidden');
    localStorage.setItem('sidebarHidden', 'true');
}

function checkSidebarState () {
    const isHidden = localStorage.getItem('sidebarHidden') === 'true';
    if (isHidden){
        hideSidebarVisability();
    }
    else {
        showSidebarVisability();
    }
}

// Event Listeners
/**
 * Sets up event listener for the selected task that is triggered by a click
 * This will also open the edit model.
 * 
 */
function setupEventListeners() {
    // Event delegation for task clicks
    // Sets up click handlers for task items using event delegation
    // Adds modal control handlers (cancel button, outside click, ESC key)
    // Sets up form submission handler
    [todoTasks, doingTasks, doneTasks].forEach(column => {
        column.addEventListener('click', (e) => {
            const taskElement = e.target.closest('.task');
            if (taskElement) {
                const taskId = parseInt(taskElement.dataset.id);
                openEditModal(taskId);
            }
        });
    });

    // Open modal once add new button is clicked
    addTask.addEventListener('click', openModel);
    taskForm.addEventListener('submit', addTasksubmit);

    // Modal close and opening event listeners
    cancelBtn.addEventListener('click', closeModal);
    editCancelBtn.addEventListener('click', closeModal);
    updateTaskBtn.addEventListener('click', saveTaskChanges);
    deleteTaskBtn.addEventListener('click', deleteTaskConfirm);
    delConfirmBtn.addEventListener("click", deleteConfirmed);
    delCancelBtn.addEventListener("click", deleteCanceled);
    additionConfirmedBtn.addEventListener("click", additionConfirmedCloseDialog);


    // Close modal when clicking on the ouside of it
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close modal when clicking on the ouside of it
    editModal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
  
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    hideSidebarBtn.addEventListener('click', hideSidebarVisability);
    showSidebarBtn.addEventListener('click', showSidebarVisability);
    mobileSidebarBtn.addEventListener('click', showSidebarVisabilityMobile);
    closeMobileSidebarBtn.addEventListener('click', hideSidebarVisabilityMobile);
}

// Toggle event listener for light mode and dark mode
// Theme toggle functions - MOVE THIS BEFORE init()
function setupThemeToggle() {
    toggleSlider.addEventListener('change', () => {
        if (toggleSlider.checked) {
            bod.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            bod.classList.remove('dark');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    toggleSliderMobile.addEventListener('change', () => {
        if (toggleSliderMobile.checked) {
            bod.classList.add('dark');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            bod.classList.remove('dark');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Initialize theme
    if (localStorage.getItem('darkMode') === 'enabled') {
        bod.classList.add('dark');
        toggleSlider.checked = true;
        toggleSliderMobile.checked = true;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        bod.classList.add('dark');
        toggleSlider.checked = true;
        toggleSliderMobile.checked = true;
    }
}

// Fucntion for loading the fetch data animation
function updateLoadingUI() {
  const overlay = document.getElementById('loading-overlay');
  if (isLoading) {
    overlay.classList.remove('hidden');
  } else {
    overlay.classList.add('hidden');
  }
}

// Initialize the board initially there was 8 now there will be 6
/**
 * init function is the main functon that has mor functions within the function
 */
async function init() {
    // First setup theme and sidebar
    setupThemeToggle();
    checkSidebarState();
    
    // Try to load from localStorage first
    const savedTasks = JSON.parse(localStorage.getItem('initialTasks'));
    
    if (savedTasks && savedTasks.length > 0) {
        initialTasks = savedTasks;
        showSortedTasks();
        console.log('Loaded from localStorage:', initialTasks);
    } else {
        // Only fetch from API if no local data exists
        initialTasks = await fetchTasks();
    }
    
    // Then setup event listeners after DOM is ready
    setupEventListeners();
    
    // Finally render tasks
    showSortedTasks();
}

document.addEventListener('DOMContentLoaded', init);