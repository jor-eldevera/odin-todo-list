import "./style.css"

const projectsDiv = document.querySelector("#projects");

let projects = [];

class Project {
    todoItems = [];

    constructor(title, titleIsEditable) {
        if (title === undefined) {
            this._projectTitle = "";
        } else {
            this._projectTitle = title;
        }

        this._titleIsEditable = titleIsEditable
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
     * Adds a new todo-item to the todoItems array
     * @returns the id of the new todo-item
     */
    addNewTodoItem() {
        const id = Math.floor(Math.random() * 10000);

        if (this.searchItems(id)) {
            console.log("There is already an item in this list with the id: " + id);
            return;
        }

        this.todoItems.push(new TodoItem("", id, "", "", ""));

        return id;
    }

    /**
     * Edits the title of a todo-item
     * @param {*} title is the new title
     * @param {*} id is the id of the todo-item to be changed
     */
    editTodoItemTitle(title, id) {
        let item = this.searchItems(id);
        item.title = title;
    }

    /**
     * Searches for a TodoItem in this project's todoItems array
     * @param {*} id - The id of the TodoItem
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
    complete = false;

    constructor(title, id, description, dueDate, priority) {
        this.title = title;
        this.id = id;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    get complete() {
        return this.complete;
    }

    set complete(isComplete) {
        this.complete = isComplete;
    }
}

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

    projectsDiv.appendChild(projectCard);
}
// createProject();

function createAllTodosProject() {
    let newProject = new Project("All todo-items", false);

    // projectCard div wraps the project
    const projectCard = document.createElement("div");
    projectCard.classList.add("projectCard");

    const projectTitle = document.createElement("input");
    projectTitle.setAttribute("placeholder", "Title");
    projectTitle.classList.add("projectTitle");
    projectTitle.value = "All todo-items"
    projectTitle.readOnly = true;
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

    projects.push(newProject);
    return projectCard;
}
projectsDiv.appendChild(createAllTodosProject());

/**
 * Create a new todo item for the DOM
 * @returns a new todo item
 */
function createTodoItem(newProject) {
    const todoItemWrapper = document.createElement("div");
    todoItemWrapper.classList.add("todoItemWrapper");

    const id = newProject.addNewTodoItem();

    const newTodoItem = document.createElement("input");
    newTodoItem.setAttribute("placeholder", "New item");
    newTodoItem.addEventListener("input", function (e) {
        newProject.editTodoItemTitle(e.target.value, id);
    }, false);
    newTodoItem.classList.add("newTodoItem");
    todoItemWrapper.appendChild(newTodoItem);

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    todoItemWrapper.appendChild(checkbox);

    return todoItemWrapper;
}