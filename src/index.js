import "./style.css"

const projectsDiv = document.querySelector("#projects"); // div in the center of the page

const homepageCardTitle = "All todo-items";

let projects = [];
let activeProject;

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
     * Checks whether or not the todoItems array contains items
     * @returns true if the todoItems array contains items
     */
    hasTodoItems() {
        if (this.todoItems.length === 0) {
            return false;
        } else {
            return true;
        }
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

        if (this._projectTitle === homepageCardTitle) {
            this.todoItems.push(new TodoItem("", id, "uncategorized", "", ""));
        } else {
            this.todoItems.push(new TodoItem("", id, this._projectTitle, "", ""));
        }
        

        return id;
    }

    removeTodoItem(id) {
        for (let i = 0; i < this.todoItems.length; i++) {
            if (this.todoItems[i].id === id) {
                this.todoItems.splice(i, 1);
            }
        }
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
    _isComplete = false;

    constructor(title, id, category, dueDate, priority) {
        this._title = title;
        this._id = id;
        this.category = category;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    get isComplete() {
        return this._isComplete;
    }

    set isComplete(isComplete) {
        this._isComplete = isComplete;
    }

    get title() {
        return this._title
    }

    set title(title) {
        this._title = title
    }
    
    get id() {
        return this._id;
    }
    
    toString() {
        return this._title;
    }
}

// Create the "All todo-items" project and append it to the page (home page)
let allTodoItemsProject = new Project(homepageCardTitle, false);
projects.push(allTodoItemsProject);
activeProject = allTodoItemsProject;
projectsDiv.appendChild(createAllTodosProject(allTodoItemsProject));

// Event listener for the "View all todo-items" button
document.getElementById("viewAllTodoItemsBtn").addEventListener("click", function (e) {
    // Clear the "projects" div (central div)
    projectsDiv.innerHTML = "";

    activeProject = allTodoItemsProject;

    // Append the all todo-items project
    projectsDiv.appendChild(createAllTodosProject(allTodoItemsProject));    
}, false);

// Event listener for the "Create a new project" button
document.getElementById("newProjectBtn").addEventListener("click", function (e) {
    // Create a new project
    let newProject = new Project();
    projects.push(newProject);
    
    // Create new button in the sidebar
    const projectButtonWrapper = document.createElement("div");
    const projectButton = createProjectButton(newProject);
    projectButtonWrapper.id = "project-button-wrapper-" + newProject.id;
    projectButtonWrapper.classList.add("projectButtonWrapper");
    const newProjectsDiv = document.getElementById("new-projects-sidebar");

    // Create a project card
    const projectCard = createProject(newProject);
    
    // Clear the "projects" div (central div)
    projectsDiv.innerHTML = "";

    const deleteButton = createProjectDeleteButton(newProject);

    activeProject = newProject;
    projectsDiv.appendChild(projectCard); // Attach Project card to the center
    newProjectsDiv.appendChild(projectButtonWrapper); // Attach new Project wrapper to the sidebar
    projectButtonWrapper.appendChild(projectButton); // Attach button to the wrapper
    projectButtonWrapper.appendChild(deleteButton);
}, false);

/**
 * Creates a new button for the sidebar
 * @param {Project} newProject is a new Project object
 * @returns the new button
 */
function createProjectButton(newProject) {
    const button = document.createElement("button");
    button.innerHTML = "untitled";
    button.id = "new-project-btn-" + newProject.id;
    button.classList.add("projectBtn");

    button.addEventListener("click", function (e) {
        projectsDiv.innerHTML = "";
        activeProject = newProject;
        projectsDiv.appendChild(createProject(newProject));
    }, false);
    
    return button;
}

function createProjectDeleteButton(newProject) {
    const button = document.createElement("button");
    button.innerHTML = "🗙";
    button.classList.add("deleteBtn");

    button.addEventListener("click", function (e) {
        // Delete the project from the projects array
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].id === newProject.id) {
                projects.splice(i, 1);
            }
        }
        
        // Remove the project from the page
        // or reload the "all todo-items" div when deleting a project
        if (newProject.title === activeProject.title
            || projectsDiv.firstElementChild.firstElementChild.value === allTodoItemsProject.title) {
            projectsDiv.innerHTML = "";
            activeProject = allTodoItemsProject;
            projectsDiv.appendChild(createAllTodosProject(allTodoItemsProject));
        }

        // Remove the project from the sidebar
        document.getElementById("project-button-wrapper-" + newProject.id).remove();
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

    if (newProject.hasTodoItems()) {
        let todoItems = newProject.todoItems;
        for (let i = 0; i < todoItems.length; i++) {
            const newTodoItem = createTodoItem(newProject, todoItems[i].id);
            projectCard.appendChild(newTodoItem);
        }
    }

    return projectCard;
}

function createAllTodosProject(newProject) {
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
    
    // Add todo items
    for (let i = 0; i < projects.length; i++) {
        const items = projects[i].todoItems;
        for (let j = 0; j < items.length; j++) {
            const newTodoItem = createTodoItem(projects[i], items[j].id);
            projectCard.appendChild(newTodoItem);
        }
    }
    return projectCard;
}

/**
 * Create a new todo item for the DOM
 * @param {*} newProject is the project that this function is operating on
 * @param {*} id is the id of the todo item being created. Do not pass an id when creating a new todo item
 * @returns a new todo item
 */
function createTodoItem(newProject, id) {
    const todoItemWrapper = document.createElement("div");
    todoItemWrapper.classList.add("todoItemWrapper");

    const todoItemLeftSide = document.createElement("input");

    let itemID;
    if (id === undefined) {
        // If an id is not passed, create a new todo item
        itemID = newProject.addNewTodoItem();
        todoItemLeftSide.setAttribute("placeholder", "New item");
    } else {
        // If an id is passed, create a new todo item based on the existing id
        itemID = id;
        let title = newProject.searchItems(itemID).title;
        if (title === "" || title === null) {
            todoItemLeftSide.setAttribute("placeholder", "New item");
        } else {
            todoItemLeftSide.value = title;
        }
    }

    todoItemLeftSide.addEventListener("input", function (e) {
        newProject.editTodoItemTitle(e.target.value, itemID);
    }, false);
    todoItemLeftSide.classList.add("todoItemLeftSide");
    todoItemWrapper.appendChild(todoItemLeftSide);

    const todoItemRightSide = document.createElement("div");
    todoItemRightSide.classList.add("todoItemRightSide");
    todoItemWrapper.appendChild(todoItemRightSide);

    const categoryLabel = document.createElement("div");
    categoryLabel.innerHTML = newProject.searchItems(itemID).category;
    categoryLabel.classList.add("categoryLabel");
    todoItemRightSide.appendChild(categoryLabel);

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    if (newProject.searchItems(itemID).isComplete === true) {
        checkbox.checked = true;
    } else {
        checkbox.checked = false;
    }
    checkbox.addEventListener("change", function (e) {
        if (this.checked) {
            newProject.searchItems(itemID).isComplete = true;
        } else {
            newProject.searchItems(itemID).isComplete = false;
        }
    });
    todoItemRightSide.appendChild(checkbox);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "🗙";
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.addEventListener("click", function (e) {
        newProject.removeTodoItem(itemID);
        todoItemWrapper.remove();
    }, false);
    todoItemRightSide.appendChild(deleteBtn);

    return todoItemWrapper;
}