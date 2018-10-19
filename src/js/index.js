// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as shoppingListView from './views/shoppingListView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from "./views/base";


/** Global state of the app
 *  Search obejct
 *  Current recipe object
 *  Shopping list object
 *  Liked recipes
 */
const state = {
    search: null,
    recipe: null,
    shoppingList: null,
    likes: null
};


/**
 * SEARCH CONTROLLER
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

        try {
            // 4. Search for recipes
            await state.search.getResults();

            // 5. Render results on UI
            clearLoader();
            console.log('state.search', state.search);

            searchView.renderResults(state.search.recipes);
        } catch (err) {
            console.log('[controlSearch] err', err);
            clearLoader();
        }
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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if(state.recipe) {
            searchView.highlightSelected(id);
        }

        // 2. Create new recipe object.
        state.recipe = new Recipe(id);

        try {
            // 3. Get recipe data.
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // 4. Calculate servings and time.
            state.recipe.calcTime();
            state.recipe.calcServings();

            // 5. Render recipe.
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (err) {
            console.log('[controlRecipe] err', err);
        }
    }
};


['hashchange', 'load'].forEach(type =>
    window.addEventListener(type, controlRecipe)
);


/**
 * SHOPPING LIST CONTROLLER
 */
const controlShoppingList = () => {
    // Create a new list IF there in none yet
    if(!state.shoppingList) {
        state.shoppingList = new ShoppingList();
    }

    // Add each ingredient to the shopping list and UI
    state.recipe.ingredients.forEach(({ count, unit, ingredient }) => {
        const item = state.shoppingList.addItem(count, unit, ingredient);

        shoppingListView.renderShoppingListItem(item);
    });
};


// Handle delete and update list item events
elements.shoppingList.addEventListener('click', (event) => {
    const id = event.target.closest('.shopping__item').dataset.itemId;

    // Handle the delete button
    if(event.target.matches('.shopping__delete, .shopping_delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        shoppingListView.deleteItem(id);
    } else if(event.target.matches('.shopping__count-value')) {
        const value = parseFloat(event.target.value);

        state.shoppingList.updateCount(id, value);
    }
});


/**
 * LIKES CONTROLLER
 */
const controlLikes = () => {
    if(!state.likes) {
        state.likes = new Likes();
    }

    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)) {
        // Add like to the state
        const { title, publisher, image_url } = state.recipe;
        const newLike = state.likes.addLike(currentID, title, publisher, image_url);

        // Toggle the like button
        likesView.toggleLikeButton(true);

        // Add like to UI list
        likesView.renderLike(newLike);
    } else {
        // User HAS yet liked current recipe

        // Remove like to the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeButton(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeField(state.likes.getCountLikes());
};


// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeField(state.likes.getCountLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


// Handling recipe button clicks
elements.recipe.addEventListener('click', (event) => {
    if(event.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(event.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlShoppingList();
    } else if(event.target.matches('.recipe__love, .recipe__love *')) {
        // Likes controller
        controlLikes();
    }
});