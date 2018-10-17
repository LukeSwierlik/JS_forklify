import axios from 'axios';
import {key, proxy} from "../config";

class Recipe {
    constructor(id) {
        this._id = id;
        this._title = '';
        this._publisher = '';
        this._image_url = '';
        this._source_url = '';
        this._ingredients = [];
        this._time = 0;
        this._servings = 0;
    }

    get id() {
        return this._id;
    }

    get ingredients() {
        return this._ingredients;
    }

    set title(value) {
        this._title = value;
    }

    set publisher(value) {
        this._publisher = value;
    }

    set image_url(value) {
        this._image_url = value;
    }

    set source_url(value) {
        this._source_url = value;
    }

    set ingredients(value) {
        this._ingredients = value;
    }

    set time(value) {
        this._time = value;
    }

    set servings(value) {
        this._servings = value;
    }

    async getRecipe() {
        const urlFood = `https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`;
        const url = `${proxy}${urlFood}`;

        await axios
            .get(url)
            .then(({ data }) => {
                const { recipe: { title, publisher, image_url, source_url, ingredients } } = data;

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
}

export default Recipe;

