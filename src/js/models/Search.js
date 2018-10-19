import axios from "axios";
import { proxy, key } from "../config";

class Search {
    constructor(query) {
        this.recipes = [];
        this.query = query;
    }

    async getResults() {
        const urlFood = `https://www.food2fork.com/api/search?key=${key}&q=${this.query}`;
        const url = `${proxy}${urlFood}`;

         await axios
            .get(url)
            .then(({ data }) => {
                const { recipes } = data;
                console.log('data', data);

                this.recipes = recipes;
            })
            .catch(err => {
                console.log('[getResults] Error: ', err);
            });
    };
}

export default Search;