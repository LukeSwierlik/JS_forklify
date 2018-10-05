import axios from "axios";

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
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = '7a0796052edf1f44f48073b91dfab5b3';
        const urlFood = `https://www.food2fork.com/api/search?key=${key}&q=${this._query}`;

         await axios
            .get(`${proxy}${urlFood}`)
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