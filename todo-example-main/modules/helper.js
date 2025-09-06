// @ts-check

/**
 * Creating an Abstraction:
 * 1. Create an Abstraction that creates the task list Element
 *
 * @param {string} dataAttr
 * @param {Object} [value]
 * @returns {HTMLElement}
 */
export const getHTML = (dataAttr, value) => {
    const selector = value ? `[data-${dataAttr} = "${value}"]`: `[data-${dataAttr}]`; // if there is a value, then the selector is: (), otherwise: ()
    
    const element = document.querySelector(selector);
    
    const isHTMLElement = element instanceof HTMLElement;

    if (!isHTMLElement) {
        throw new Error(`${selector} attribute not found in HTML`);
    }

    return element;
};

/**
 * Creating an Abstraction:
 * 1. Create an Abstraction that checks if the task list Element already exists
 *
 * @param {string} dataAttr
 * @param {Object} [value]
 * @returns {boolean}
 */
export const doesHTMLExist = (dataAttr, value) => {
    const selector = value ? `[data-${dataAttr} = "${value}"]`: `[data-${dataAttr}]`; // if there is a value, then the selector is: (), otherwise: ()
    
    const element = document.querySelector(selector);
    
    const isHTMLElement = element instanceof HTMLElement;

    if (!isHTMLElement) {
        throw new Error(`${selector} attribute not found in HTML`);
    }

    return isHTMLElement;
};