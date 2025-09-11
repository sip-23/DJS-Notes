// -----------------------------------------------------------------------------------------------------------------------------------------------------------

// Encapsulation in JavaScript:

// -----------------------------------------------------------------------------------------------------------------------------------------------------------

function createCounter() {
    let value = 0;

    return {
        // Method to increase the counter
        increase() {
            value++;
        },
        // Method to decrease the counter
        decrease() {
            value--;
        },
        // Method to display the counter value
        display() {
            console.log(value);
        }
    };
}

const counter = createCounter();
counter.increase();
counter.display(); // Output: 1

// Encapsulation means bundling the data (variables) and the methods that work on the data into a single unit (object) and controlling access to that data. 
// This is often used to hide the internal state of an object from the outside world. 
// The createCounter function 
// 1. The **value** variable is encapsulated within the function.
//  - It cannot be accessed directly from outside the function, thus adhering to the principles of encapsulation. 
// 2. The methods ^ are exposed, allowing controlled interaction with value.
//  - increase, 
//  - decrease,
//  - display  
// This shows how encapsulation helps in building secure and maintainable code.


// --------------------------------------------------------------------------------------------------------------------------------------------------------

// Encapsulating a Task Component

// --------------------------------------------------------------------------------------------------------------------------------------------------------

class Task {
    constructor(title, dueDate) {
        let _title = title;
        let _dueDate = dueDate;

        // Public method to get the task's title
        this.getTitle = function() {
            return _title;
        };

        // Public method to set the task's title
        this.setTitle = function(newTitle) {
            _title = newTitle;
        };
    }
}

// _title and _dueDate are private variables accessible only within the Task class. 
// The public methods **getTitle** and **setTitle** provide a controlled way to access and modify these properties.

// -------------------------------------------------------------------------------------------------------------------------------------------------------

// Encapsulation through a factory function

// -------------------------------------------------------------------------------------------------------------------------------------------------------

function createTally() {
    let count = 0; // Encapsulated variable
    return {
        increment() { count += 1; },
        decrement() { count -= 1; },
        getCount() { return count; }
    };
}

// This pattern allows for the creation of encapsulated modules or components
// The count variable is not directly accessible from the outside, ensuring maintainability and modular code.