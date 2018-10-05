import { selectors } from "../constants/constants";

const documentQuerySelector = (selector) => {
    return document.querySelector(selector);
};

export const elements = {
    searchForm: documentQuerySelector(selectors.SEARCH),
    searchInput: documentQuerySelector(selectors.SEARCH_FIELD),
    searchResultList: documentQuerySelector(selectors.SEARCH_RESULT_LIST)
};