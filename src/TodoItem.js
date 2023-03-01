export default class TodoItem {
    _isComplete = false;

    constructor(title, id, category, dueDate, priority) {
        this._title = title;
        this._id = id;
        this._category = category;
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

    set category(category) {
        this._category = category
    }

    get category() {
        return this._category;
    }
    
    toString() {
        return this._title;
    }
}