import "./style.css"

class Project {
    todoItems = [];

    constructor(title) {
        this.title = title;
    }

    get todoItems() {
        return this.todoItems;
    }

    /**
     * Adds a TodoItem to this project's todoItems array
     * @param {*} title - The title of the TodoItem
     * @param {*} description - The description of the TodoItem
     * @param {*} dueDate - The due date of the TodoItem
     * @param {*} priority - The priority level of the TodoItem
     * @returns null if there's error, undefined if successful
     */
    addTodoItem(title, description, dueDate, priority) {
        // Check if a todo item with the same title is already in this list
        if (this.searchItems(title)) {
            console.log("There is already an item in this list with the title: " + title);
            return;
        }

        // Check if todo item has a title
        if (!title || title === "") {
            console.log("Todo item must have a title");
            return;
        }

        this.todoItems.push(new TodoItem(title, description, dueDate, priority));
    }

    /**
     * Searches for a TodoItem in this project's todoItems array
     * @param {*} title - The title of the TodoItem
     * @returns The found TodoItem or null if the item isn't found
     */
    searchItems(title) {
        for (let item of this.todoItems) {
            if (item.title === title) {
                return item;
            }
        }

        return null;
    }
}

class TodoItem {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

let newProject = new Project();
newProject.addTodoItem("testTitle", "testDesc", "January 14th, 2023", 2);
newProject.addTodoItem("TestTitle", "TestDesc", "January 14th, 2023", 3);
console.log(newProject.addTodoItem("TESTTitle", "TestDesc", "January 14th, 2023", 2));
console.log(newProject.todoItems);