import axios from "axios";
import { proxy, key } from "../config";

class Search {
    constructor(query) {
        this._recipes = [];
        this._query = query;
    }

    get recipes() {
        return this._recipes;
    }

    set recipes(value) {
        this._recipes = value;
    }

    async getResults() {
        const urlFood = `https://www.food2fork.com/api/search?key=${key}&q=${this._query}`;
        const url = `${proxy}${urlFood}`;

         await axios
            .get(url)
            .then(({ data }) => {
                const { recipes } = data;

                this.recipes = recipes;
            })
            .catch(err => {
                console.log('[getResults] Error: ', err);
            });
    };
}

export default Search;