import uniqid from 'uniqid';

class ShoppingList {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };

        this.items.push(item);
    }

    deleteItem(id) {
        const index = this.items.findIndex(element => element.id === id);

        return this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(element => element.id === id).count = newCount;
    }
}

export default ShoppingList;