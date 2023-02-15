import "./style.css"

class Project {
    todoItems = [];

    constructor(title) {
        if (title === undefined) {
            this._projectTitle = "";
        } else {
            this._projectTitle = title;
        }
    }

    get todoItems() {
        return this.todoItems;
    }

    get title() {
        return this._projectTitle;
    }

    set title(title) {
        this._projectTitle = title;
    }

    /**
     * Adds a TodoItem to this project's todoItems array
     * @param {*} title - The title of the TodoItem
     * @param {*} id - The id of the TodoItem
     * @param {*} description - The description of the TodoItem
     * @param {*} dueDate - The due date of the TodoItem
     * @param {*} priority - The priority level of the TodoItem
     * @returns null if there's error, undefined if successful
     */
    addTodoItem(title, id, description, dueDate, priority) {
        // Check if a todo item with the same title is already in this list
        if (this.searchItems(id)) {
            console.log("There is already an item in this list with the title: " + title);
            return;
        }

        // Check if todo item has a title
        if (!title || title === "") {
            console.log("Todo item must have a title");
            return;
        }

        this.todoItems.push(new TodoItem(title, id, description, dueDate, priority));
    }

    editTodoItem(title, id, description, dueDate, priority) {

    }

    /**
     * Searches for a TodoItem in this project's todoItems array
     * @param {*} title - The title of the TodoItem
     * @returns The found TodoItem or null if the item isn't found
     */
    searchItems(id) {
        for (let item of this.todoItems) {
            if (item.id === id) {
                return item;
            }
        }

        return null;
    }
}

class TodoItem {
    constructor(title, id, description, dueDate, priority) {
        this.title = title;
        this.id = id;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

// some test code
let testProject = new Project();
testProject.addTodoItem("testTitle", 24601, "testDesc", "January 14th, 2023", 2);
testProject.addTodoItem("TestTitle", 69, "TestDesc", "January 14th, 2023", 3);
console.log(testProject.todoItems);

// Add event listener to the new project button
document.getElementById("newProjectBtn").addEventListener("click", createProject, false);

/**
 * Create a new project card
 */
function createProject() {
    let newProject = new Project();

    // projectCard div wraps the project
    const projectCard = document.createElement("div");
    projectCard.classList.add("projectCard");
    
    const projectTitle = document.createElement("input");
    projectTitle.setAttribute("placeholder", "Title");
    projectTitle.classList.add("projectTitle");
    projectTitle.addEventListener("input", function (e) {
        newProject.title = e.target.value; // editable title
    }, false);
    projectCard.appendChild(projectTitle);

    const newTodoItemBtn = document.createElement("button");
    newTodoItemBtn.innerHTML = "+";
    newTodoItemBtn.addEventListener("click", function (e) {
        // Create empty todo item
        const newTodoItem = createTodoItem(newProject);
        // Make the todo item a child of the projectCard
        projectCard.appendChild(newTodoItem);
    }, false);
    newTodoItemBtn.classList.add("newTodoItemBtn");
    projectCard.appendChild(newTodoItemBtn);
    
    document.querySelector("#content").appendChild(projectCard);
}

/**
 * Create a new todo item for the DOM
 * @returns a new todo item
 */
function createTodoItem(newProject) {
    const todoItemWrapper = document.createElement("div");

    const newTodoItem = document.createElement("input");
    newTodoItem.setAttribute("placeholder", "New item");
    newTodoItem.addEventListener("input", function (e) {
        newProject.editTodoItem(e.target.value, "", "", "");
    }, false);
    newTodoItem.classList.add("newTodoItem");
    todoItemWrapper.appendChild(newTodoItem);

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    todoItemWrapper.appendChild(checkbox);

    return todoItemWrapper;
}