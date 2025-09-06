// @ts-check

import { state, Task } from "./modules/state.js";
console.log("It works");

// Add EventListener when error occurs
window.addEventListener('error', () => {
    document.body.innerHTML = 'Something went very very wrong, refresh Twana';
});

addTasktoHTML("test");
EditTaskinHTML("test", {title: "Wash the Dog"});
