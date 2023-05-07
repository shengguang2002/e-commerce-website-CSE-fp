/*
 * Name: Hanyang Yu, Brian Juan
 * Date: May 6, 2023
 * Section: CSE 154 AF
 *
 * This is the JS to implement the UI for online shopping.
 */
"use strict";

(function() {

  window.addEventListener("load", init);

  /**
   * initiate event listener when the window is loaded
   */
  function init() {
    document.getElementById("products").addEventListener("click", function(event) {
        if (this.tagName === "BUTTON") {
          let priceElement = this.parentElement.querySelector(".price");
          let price = parseFloat(priceElement.textContent.slice(1));
        }
    });
  }


  /**
   * Returns the element with the specified id attribute.
   * @param {string} id string representing the id attribute of the element to be returned.
   * @returns {HTMLElement} The element with the specified id attribute.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * A function that simplify calling document.querySelectorAll
   * @param {selectors} query: A query of selector
   * @returns {NodeList} An Element object representing the all elements in the document
   * that matches the specified set of CSS selectors, or null is returned if there are no matches.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * A function that simplify calling document.querySelector
   * @param {selectors} query: A query of selectors
   * @returns {Element} An Element object representing the first element in the
   * document that matches the specified set of CSS selectors, or null is returned
   * if there are no matches.
   */
  function qs(query) {
    return document.querySelector(query);
  }
})();