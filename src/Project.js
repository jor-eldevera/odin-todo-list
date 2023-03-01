import TodoItem from "./TodoItem";
import { homepageCardTitle, projects } from "./index";

export default class Project {
    todoItems = [];

    constructor(title, id) {
        // Project title
        if (title === undefined) {
            this._projectTitle = "";
        } else {
            this._projectTitle = title;
        }

        // Project id
        if (id === undefined) {
            this._id = this.getUniqueId();
        } else {
            this._id = id;
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

    get id() {
        return this._id;
    }

    // toJSON() {
    //     return {
    //         _projectTitle: this._projectTitle,
    //         _id: this._id,
    //         hasTodoItems: this.hasTodoItems.toString() + ' // FUNCTION'
    //     };
    // }

    // static reviver(key, value) {
    //     if (typeof value === 'string' && /\/\/ FUNCTION$/.test(value)) {
    //         const fnBody = `return ${value.replace(/\/\/ FUNCTION$/, '')}`;
    //         console.log(fnBody);
    //         const fn = new Function(fnBody)();
    //         return fn;
    //     }
    //     return value;
    // }

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

    /**
     * Adds a pre-filled todo-item to the todoItems array.
     * Used when filling out the page with JSON data.
     * @param {*} title 
     * @param {*} id 
     * @param {*} category 
     * @param {*} dueDate 
     * @param {*} priority 
     */
    addFilledTodoItem(title, id, category, dueDate, priority) {
        this.todoItems.push(new TodoItem(title, id, category, dueDate, priority));
    }

    /**
     * Removes a TodoItem from this object's todoItems array
     * @param {*} id is the id of the TodoItem to be removed
     */
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
     * Edits the category of a todo-item
     * @param {*} category is the new category
     * @param {*} id is the id of the todo-item to be changed
     */
    editAllTodoItemCategories(category) {
        for (let item of this.todoItems) {
            item.category = category;
        }
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

    /**
     * Generates a unique id
     * @returns a unique id
     */
    getUniqueId() {
        let newId;
        let existingIDs = projects.map(function(obj) {
            return obj.id;
        }); // Get an array of all existng ids
        do {
            // Generate new ids while the id is not unique
            newId = Math.floor(Math.random() * 10000);
        } while (existingIDs.indexOf(newId) !== -1);
        return newId;
    }
}