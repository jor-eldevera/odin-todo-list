import "./style.css"
import Project from "./Project";
import Storage from "./Storage";

const projectsDiv = document.querySelector("#projects"); // div in the center of the page

export const homepageCardTitle = "All todo-items"; // The title of the homepage card
export const storageKeyName = "todoLists"

export let projects = [];
let activeProject;

// Create the "All todo-items" project
export let allTodoItemsProject = new Project(homepageCardTitle, false);
projects.push(allTodoItemsProject);
activeProject = allTodoItemsProject;

// Load data from localStorage to "projects" array
let savedData = localStorage.getItem(storageKeyName);
if (savedData !== null) {
    Storage.loadData(savedData);
}
// Load the page with data
projectsDiv.appendChild(createAllTodosProject(allTodoItemsProject));
// Load sidebar with projects
for (let i = 1; i < projects.length; i++) {
    const projectButtonWrapper = createProjectBtnWrapper(projects[i]);
    const projectButton = createProjectButton(projects[i]);
    const deleteButton = createProjectDeleteButton(projects[i]);
    
    const newProjectsDiv = document.getElementById("new-projects-sidebar");
    
    newProjectsDiv.appendChild(projectButtonWrapper); // Attach new Project wrapper to the sidebar
    projectButtonWrapper.appendChild(projectButton); // Attach button to the wrapper
    projectButtonWrapper.appendChild(deleteButton);
}

// Event listener for the "View all todo-items" button
document.getElementById("viewAllTodoItemsBtn").addEventListener("click", function (e) {
    // Clear the "projects" div (central div)
    projectsDiv.innerHTML = "";
    
    activeProject = allTodoItemsProject;
    
    // Append the all todo-items project
    projectsDiv.appendChild(createAllTodosProject(allTodoItemsProject));
}, false);

// Event listener for the "Create new project" button
document.getElementById("newProjectBtn").addEventListener("click", function (e) {
    // Create a new project
    let newProject = new Project();
    projects.push(newProject);

    // Save data to localStorage
    Storage.saveData();
    
    // Create new button in the sidebar
    const projectButtonWrapper = createProjectBtnWrapper(newProject);
    const projectButton = createProjectButton(newProject);
    const deleteButton = createProjectDeleteButton(newProject);

    const newProjectsDiv = document.getElementById("new-projects-sidebar");

    // Create a project card
    const projectCard = createProject(newProject);
    
    // Clear the "projects" div (central div)
    projectsDiv.innerHTML = "";

    activeProject = newProject;
    projectsDiv.appendChild(projectCard); // Attach Project card to the center
    newProjectsDiv.appendChild(projectButtonWrapper); // Attach new Project wrapper to the sidebar
    projectButtonWrapper.appendChild(projectButton); // Attach button to the wrapper
    projectButtonWrapper.appendChild(deleteButton);
}, false);

/**
 * Creates a new wrapper for a new project button in the sidebar
 * @param {Project} newProject is a new Project object
 * @returns the new wrapper
 */
function createProjectBtnWrapper(newProject) {
    const projectButtonWrapper = document.createElement("div");
    projectButtonWrapper.id = "project-button-wrapper-" + newProject.id;
    projectButtonWrapper.classList.add("projectButtonWrapper");
    return projectButtonWrapper;
}

/**
 * Creates a new button for the sidebar
 * @param {Project} newProject is a new Project object
 * @returns the new button
 */
function createProjectButton(newProject) {
    const button = document.createElement("button");
    if (newProject._projectTitle === "") {
        button.innerHTML = "untitled";
    } else {
        button.innerHTML = newProject._projectTitle;
    }
    button.id = "new-project-btn-" + newProject.id;
    button.classList.add("projectBtn");

    button.addEventListener("click", function (e) {
        projectsDiv.innerHTML = "";
        activeProject = newProject;
        projectsDiv.appendChild(createProject(newProject));
    }, false);
    
    return button;
}

/**
 * Creates a delete button for a project
 * @param {Project} newProject is the project who will be deleted by this button
 * @returns a button that deletes the project passed to this function
 */
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

        // Save data to localStorage
        Storage.saveData();
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

        // Save data to localStorage
        Storage.saveData();

        // Edit the labels and category-properties on each todo-item
        const labels = document.getElementsByClassName("projectId-" + newProject.id);
        for (let i = 0; i < labels.length; i++) {
            // Edit labels
            labels[i].innerHTML = newProject.title;
        }
        for (let i = 0; i < newProject.todoItems.length; i++) {
            // Edit category property in each todo-item
            newProject.editAllTodoItemCategories(newProject.title);
        }

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

/**
 * Create the "All todo-items"/homepage card
 * @param {} newProject is the "All todo-items" project
 * @returns the "All todo-items" card
 */
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

        // Save data to localStorage
        Storage.saveData();
    }, false);
    todoItemLeftSide.classList.add("todoItemLeftSide");
    todoItemWrapper.appendChild(todoItemLeftSide);

    const todoItemRightSide = document.createElement("div");
    todoItemRightSide.classList.add("todoItemRightSide");
    todoItemWrapper.appendChild(todoItemRightSide);

    const categoryLabel = document.createElement("div");
    categoryLabel.innerHTML = newProject.searchItems(itemID).category;
    categoryLabel.classList.add("categoryLabel");
    categoryLabel.classList.add("projectId-" + newProject.id); // for use with labels 
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

        // Save data to localStorage
        Storage.saveData();
    });
    todoItemRightSide.appendChild(checkbox);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "🗙";
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.addEventListener("click", function (e) {
        newProject.removeTodoItem(itemID);
        todoItemWrapper.remove();

        // Save data to localStorage
        Storage.saveData();
    }, false);
    todoItemRightSide.appendChild(deleteBtn);

    // Save data to localStorage
    Storage.saveData();

    return todoItemWrapper;
}