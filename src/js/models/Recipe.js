import axios from 'axios';
import {key, proxy} from "../config";

class Recipe {
    constructor(id) {
        this.id = id;
        this.title = '';
        this.publisher = '';
        this.image_url = '';
        this.source_url = '';
        this.ingredients = [];
        this.time = 0;
        this.servings = 0;
    }

    async getRecipe() {
        const urlFood = `https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`;
        const url = `${proxy}${urlFood}`;

        await axios
            .get(url)
            .then(({data}) => {
                const {recipe: {title, publisher, image_url, source_url, ingredients}} = data;

                this.title = title;
                this.publisher = publisher;
                this.image_url = image_url;
                this.source_url = source_url;
                this.ingredients = ingredients;

                console.log('data', data);
            })
            .catch(err => {
                console.log('[getRecipe()] err', err);
            });
    }

    calcTime() {
        //Amusing that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);

        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients
            .map(ingredient => {
                // 1. Uniform units
                let newIngredient = ingredient.toLowerCase();

                unitsLong.forEach((unit, index) => {
                    newIngredient = ingredient.replace(unit, unitsShort[index]);
                });

                // 2. Remove parentheses
                newIngredient = newIngredient.replace(/ *\([^)]*\) */g, ' ');

                // 3. Parse ingredients into count, unit and ingredient
                const listIngredient = newIngredient.split(' ');
                const unitIndex = listIngredient.findIndex(element => units.includes(element));

                let objectIngredient;

                if(unitIndex > -1) {
                    // There is a unit
                    // Ex. 4 1/2 cups, listCount is [4, 1/2] --> eval('4+1/2') --> 4.5
                    // Ex. 4 cups, listCount is [4]
                    const listCount = listIngredient.slice(0, unitIndex);
                    let count;

                    if(listCount.length === 1) {
                        count = eval(listIngredient[0].replace('-', '+'));
                    } else {
                        count = eval(listIngredient.slice(0, unitIndex).join('+'));
                    }

                    objectIngredient = {
                        count,
                        unit: listIngredient[unitIndex],
                        ingredient: listIngredient.slice(unitIndex + 1).join(' ')
                    }
                } else if(parseInt(listIngredient[0], 10)) {
                    // There is NO unit, but 1st element is number
                    objectIngredient = {
                        count: parseInt(listIngredient[0], 10),
                        unit: '',
                        ingredient: listIngredient.slice(1).join(' ')
                    }
                } else if(unitIndex === -1) {
                    // There is NO unit and NO number is 1st position
                    objectIngredient = {
                        count: 1,
                        unit: '',
                        ingredient: newIngredient
                    }
                }

                return objectIngredient;
            });

        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach((ingredient) => {
            ingredient.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}

export default Recipe;

