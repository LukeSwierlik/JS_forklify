import { selectors } from "../constants/constants";

const documentQuerySelector = (selector) => {
    return document.querySelector(selector);
};

export const elements = {
    searchForm: documentQuerySelector(selectors.SEARCH),
    searchInput: documentQuerySelector(selectors.SEARCH_FIELD),
    searchResultList: documentQuerySelector(selectors.SEARCH_RESULT_LIST),
    searchResults: documentQuerySelector(selectors.SEARCH_RESULTS),
    loaderElement: documentQuerySelector(selectors.LOADER),
    searchResPages: documentQuerySelector(selectors.SEARCH_RESULTS_PAGES),
    recipe: documentQuerySelector(selectors.RECIPE),
    shoppingList: documentQuerySelector(selectors.SHOPPING_LIST),
    likesField: documentQuerySelector(selectors.LIKES_FIELD),
    likesList: documentQuerySelector(selectors.LIKES_LIST)
};

export const renderLoader = (parent) => {
    const loader = `
        <div class = "loader">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;

    parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
    const loader = document.querySelector('.loader');

    if(loader) {
        loader.parentElement.removeChild(loader);
    }
};