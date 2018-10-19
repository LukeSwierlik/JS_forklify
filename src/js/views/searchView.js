import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = (id) => {
    const resultsList = Array.from(document.querySelectorAll('.results__link'));

    resultsList.forEach(element => {
        element.classList.remove('results__link--active');
    });

    document
        .querySelector(`.results__link[href*="#${id}"]`)
        .classList
        .add('results__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];

    if(title.length > limit) {
        title
            .split(' ')
            .reduce((acc, curr) => {
                const newTitleLength = acc + curr.length;

                if(newTitleLength <= limit) {
                    newTitle.push(curr);
                }

                return newTitleLength;
            }, 0);

        return `${newTitle.join(' ')} ...`;
    }

    return title;
};

const renderRecipe = (recipe) => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};


const createButton = (page, type) => {
    return `
        <button 
            class="btn-inline results__btn--${type}" 
            data-goto=${type === 'prev' ? page - 1 : page + 1}
            >
            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
            
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
    `;
};

const renderButton = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;

    if(page === 1 && pages > 1) {
        // Only button to go to next page
         button = createButton(page, 'next');
    } else if(page < pages) {
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    }
    else if(page === pages && pages > 1) {
        // Only button to go to prev page
         button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    console.log('[renderResults] recipes', recipes);

    recipes
        .slice(start, end)
        .forEach(renderRecipe);

    // render pagination button
    renderButton(page, recipes.length, resPerPage);
};