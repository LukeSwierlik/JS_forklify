// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from "./views/base";

/** Global state of the app
 *  Search obejct
 *  Current recipe object
 *  Shopping list object
 *  Liked recipes
 * @type {Search}
 */
const state = {
    search: {},
    recipe: {}
};

/**
 * SEARCH CONTROLLER
 * @returns {Promise<void>}
 */

const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();

    if(query) {
        // 2. New search object and add to state.
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        // 4. Search for recipes
        await state.search.getResults();

        // 5. Render results on UI
        clearLoader();
        searchView.renderResults(state.search.recipes);
    }
};

elements.searchForm
    .addEventListener('submit', (event) => {
        event.preventDefault();
        controlSearch();
    });

elements.searchResPages
    .addEventListener('click', (event) => {
        const buttonClassSelector = '.btn-inline';
        const btn  = event.target.closest(buttonClassSelector);

        if(btn) {
            const pageBtn = btn.dataset.goto;
            const goToPage = parseInt(pageBtn, 10);

            searchView.clearResults();
            searchView.renderResults(state.search.recipes, goToPage);
        }
    });


/**
 * RECIPE CONTROLLER
 * @returns {Promise<void>}
 */
const controlRecipe = async () => {
    // Get ID from url.
    const id = window.location.hash.replace('#', '');

    if(id) {
        // 1.Prepare UI for changes.

        // 2. Create new recipe object.
        state.recipe = new Recipe(id);

        // 3. Get recipe data.
        await state.recipe.getRecipe();

        // 4. Calculate servings and time.
        state.recipe.calcTime();
        state.recipe.calcServings();

        // 5. Render recipe.
    }
};

['hashchange', 'load'].forEach(type =>
    window.addEventListener(type, controlRecipe)
);