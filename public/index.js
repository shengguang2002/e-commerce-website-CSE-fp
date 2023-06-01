/*
 * Name: Hanyang Yu, Brian Yuan
 * Date: May 6, 2023
 * Section: CSE 154 AF
 *
 * This is the JS to implement the UI for online shopping.
 */
"use strict";
(function() {
  let userID = null;
  window.addEventListener("load", init);


  /**
   * this function starts the my store website by enable
   * home and product button to be clickable
   */
  function init() {
    makeRequest();
    id('list').addEventListener('click', checkGrid);
    id('login').addEventListener('click', loginPage);
  }

  function loginPage() {
    id('products').classList.add('hidden');
    id('container3').classList.remove('hidden');
    id('submit').addEventListener('click', login);

  }

  function login() {
    let user = id('username').value;
    let password = id('password').value;
    let url = '/future/login';
    let params = new FormData();
    params.append("name", user);
    params.append("password", password);
    fetch(url, {method: "POST", body: params})
      .then(statusCheck)
      .then(resp => resp.json())
      .then(processLoginData)
      .catch(console.error);
  }

  function processLoginData(responseData) {
    console.log(responseData);
    if (responseData.length > 0){
      id('user').classList.remove('hidden');
      userID = responseData;
      id("submit").removeEventListener("click", login);
      id("submit").style.color = "gray";
      qs('.container2 h1').textContent = "Successfully logged in clikc on back"
      qs('.container2 h1').style.color = "green";
    }

  }

  /**
   * make request will generate all of the products availiable to
   * purchase by check the status and call process data
   */
  function makeRequest() {
    let url = '/future/all';
    fetch(url)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(processData)
      .catch(console.error);
  }

  /**
   * The processData will generate a list of products and makae each prodcut
   * clickable
   * @param {JSON} responseData -the api data of products
   */
  function processData(responseData) {
    let productTotal = gen('div');
    productTotal.classList.add('on');
    productTotal.id = 'pet';
    for (let i = 0; i < responseData['Pets'].length; i++) {
      let product = gen('div');
      let word = gen('h1');
      let p1 = gen('p');
      let button = gen('button');
      let img = gen('img');
      let result = 'Future_PETS/' + responseData['Pets'][i].Name + '.jpg';
      word.textContent = responseData['Pets'][i].Name;
      img.src = result;
      product.classList.add('product');
      p1.classList.add('price');
      button.id = 'add';
      button.textContent ='Add to Cart';
      p1.textContent = "$" + responseData['Pets'][i].Price;
      product.appendChild(word);
      product.appendChild(img);
      product.appendChild(p1);
      product.appendChild(button);
      productTotal.appendChild(product);
    }
    id('products').appendChild(productTotal);
  }

  function checkGrid() {
    if (id('pet').classList.contains('add')) {
      id('pet').classList.add('off');
      id('pet').classList.remove('add');
      id('pet').style.display = "block";
    } else {
      id('pet').classList.remove('off');
      id('pet').classList.add('add');
      id('pet').style.display = "";
    }
  }

  /**
   * check the fecth call
   * @param {element} res - fetch response data
   * @returns {element} - return the res data
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }


  /**
   * short function for get element by id
   * @param {string} id -The element id string
   * @returns {Element} -element
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * short function for create element
   * @param {string} generate -the element string
   * @returns {Element} - the element
   */
  function gen(generate) {
    return document.createElement(generate);
  }

    /**
   * short function for queryselector
   * @param {string} selector -the element string
   * @returns {Element} - the element
   */
    function qs(selector) {
      return document.querySelector(selector);
    }

    /**
     * short function for querySelectorAll
     * @param {string} selector -the element string
     * @returns {Element} - the element
     */
    function qsa(selector) {
      return document.querySelectorAll(selector);
    }
})();