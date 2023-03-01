import { allTodoItemsProject, projects, storageKeyName } from "./index";
import Project from "./Project";

export default class Storage {

    /**
     * Saves the projects array to localStorage
     */
    static saveData() {
        localStorage.setItem(storageKeyName, JSON.stringify(projects));
    }

    /**
     * Turns JSON data into Projects and TodoItems
     * @param {*} data unparsed JSON string
     */
    static loadData(data) {
        let allObjects = JSON.parse(data);

        let mapOfAllTodoItems = allObjects.map(function (e) {
            return e.todoItems;
        });

        if (allObjects.length === 1) {
            // If there are no projects created, just fill in the "All todo-items" project
            let allTodoItemsArray = mapOfAllTodoItems[0];
            this.fillTodoProjectItems(allTodoItemsProject, allTodoItemsArray);
        }

        if (allObjects.length > 1) {
            // If there are some projects created, first fill in the "All todo-items" project
            let allTodoItemsArray = mapOfAllTodoItems[0];
            this.fillTodoProjectItems(allTodoItemsProject, allTodoItemsArray);
            
            // Then create and fill in the following projects
            for (let i = 1; i < mapOfAllTodoItems.length; i++) {
                let newProject = new Project(allObjects[i]._projectTitle, allObjects[i]._id);
                let arrayOfOneProjectsTodoItems = mapOfAllTodoItems[i];
                this.fillTodoProjectItems(newProject, arrayOfOneProjectsTodoItems);
                projects.push(newProject);
            }
        }
    }

    /**
     * Fills a Project with todo items given in a todo items array
     * For use with creating objects saved as JSON
     * @param {*} newProject is the project to be filled
     * @param {*} todoItemsArray is the array of todo items
     */
    static fillTodoProjectItems(newProject, todoItemsArray) {
        for (let i = 0; i < todoItemsArray.length; i++) {
            newProject.addFilledTodoItem(
                todoItemsArray[i]._title, 
                todoItemsArray[i]._id,
                todoItemsArray[i]._category,
                todoItemsArray[i].dueDate,
                todoItemsArray[i].priority);
            newProject
                .searchItems(todoItemsArray[i]._id)
                .isComplete = todoItemsArray[i]._isComplete;
        }
    }
}