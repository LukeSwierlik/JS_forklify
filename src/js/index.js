// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from "./views/base";

/** Global state of the app
 *  Search obejct
 *  Current recipe object
 *  Shopping list object
 *  Liked recipes
 * @type {Search}
 */
const state = {
    search: {}
};

const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();
    console.log('dziala');

    if(query) {
        // 2. New search object and add to state.
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();

        // 4. Search for recipes
        await state.search.getResults();

        // 5. Render results on UI
        console.log('[controlSearch] recipes', state);
        searchView.renderResults(state.search.recipes);
    }
};

document
    .querySelector('.search')
    .addEventListener('submit', (event) => {
        event.preventDefault();
        controlSearch();
    });
