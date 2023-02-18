import "./style.css"

const projectsDiv = document.querySelector("#projects"); // div in the center of the page

let projects = [];

class Project {
    todoItems = [];

    constructor(title, titleIsEditable) {
        // Project title
        if (title === undefined) {
            this._projectTitle = "";
        } else {
            this._projectTitle = title;
        }

        // True if title is editable
        this._titleIsEditable = titleIsEditable

        // Project id
        this._id = Math.floor(Math.random() * 10000);
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

    get id() {
        return this._id;
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

        this.todoItems.push(new TodoItem("", id, this._projectTitle, "", ""));

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

    constructor(title, id, category, dueDate, priority) {
        this.title = title;
        this.id = id;
        this.category = category;
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

// Event listener for the "Create a new project" button
document.getElementById("newProjectBtn").addEventListener("click", function (e) {
    // Create a new project
    let newProject = new Project();
    
    // Create new button in the sidebar
    const projectButton = createProjectButton(newProject);
    const newProjectsDiv = document.getElementById("new-projects-sidebar");

    // Create a project card
    const projectCard = createProject(newProject);
    
    // Clear the "projects" div (central div)
    projectsDiv.innerHTML = "";

    projectsDiv.appendChild(projectCard); // Attach Project card
    newProjectsDiv.appendChild(projectButton); // Attach Project button
}, false);

/**
 * Creates a new button for the sidebar
 * @param {Project} newProject is a new Project object
 * @returns the new button
 */
function createProjectButton(newProject) {
    const button = document.createElement("button");
    button.innerHTML = newProject.title;
    button.id = "new-project-btn-" + newProject.id;

    button.addEventListener("click", function (e) {
        projectsDiv.innerHTML = "";
        projectsDiv.appendChild(createProject(newProject));
    }, false);
    
    return button;
}

/**
 * Create a new project card
 */
function createProject(newProject) {
    // projectCard div wraps the project
    const projectCard = document.createElement("div");
    projectCard.classList.add("projectCard");
    
    const projectTitle = document.createElement("input");
    if (newProject.title === "") {
        projectTitle.setAttribute("placeholder", "Title");
    } else {
        projectTitle.value = newProject.title;
    }
    projectTitle.classList.add("projectTitle");
    projectTitle.addEventListener("input", function (e) {
        newProject.title = e.target.value; // editable title

        // Edits the corresponding button on the sidebar
        const sidebarBtn = document.getElementById("new-project-btn-" + newProject.id);
        sidebarBtn.innerHTML = newProject.title;

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

    return projectCard;
}

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

    const todoItemLeftSide = document.createElement("input");
    todoItemLeftSide.setAttribute("placeholder", "New item");
    todoItemLeftSide.addEventListener("input", function (e) {
        newProject.editTodoItemTitle(e.target.value, id);
    }, false);
    todoItemLeftSide.classList.add("todoItemLeftSide");
    todoItemWrapper.appendChild(todoItemLeftSide);

    const todoItemRightSide = document.createElement("div");
    todoItemRightSide.classList.add("todoItemRightSide");
    todoItemWrapper.appendChild(todoItemRightSide);

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    todoItemRightSide.appendChild(checkbox);

    return todoItemWrapper;
}