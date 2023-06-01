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
    id('home').addEventListener('click', loginPage);
    id('search-term').addEventListener('input', searchTermInput);
    id('search-btn').addEventListener('click', searchBtnClicked);
    id('history').addEventListener('click', purchaseHistory);
  }

  async function purchaseHistory() {
    try {
      let response = await fetch(`/future/buy`);
      await statusCheck(response);
      let rows = await response.json();
      let historyArticle = gen('article');
      let userHeader = gen('h1');
      userHeader.textContent = `Purchase History`;
      historyArticle.appendChild(userHeader);
      for (let i = 0; i < rows.length; i++) {
        let historyElement = gen('p');
        historyElement.textContent = `Transaction #${i + 1}: Buy${rows[i].name} from #${rows[i].seller} with $${rows[i].price}`;
        userArticle.appendChild(yipElement);
      }
    } catch (err) {
      setError(true);
    }
  }

  /**
   * Asynchronously handles the click event for the search button.
   * Fetches Yips (posts) that match the entered search term and updates the view.
   * Catches and handles any errors that occur during the fetch.
   */
  async function searchBtnClicked() {
    try {
      let response = await fetch(`/future/all?search=${id('search-term').value.trim()}`);
      await statusCheck(response);
      let rows = await response.json();
      let ids = rows.map(row => row.PetID);
      let pets = id('products').querySelectorAll('.pet');
      for (let pet of pets) {
        if (!ids.includes(parseInt(pet.id))) {
          pet.classList.add('hidden');
        } else {
          pet.classList.remove('hidden');
        }
      }
    } catch (err) {
      setError(true);
    }
  }

  async function filterActivated() {
    try {
      let response = await fetch(`/future/all?search=${this.textContent.value.trim()}`);
      await statusCheck(response);
      let rows = await response.json();
      let ids = rows.map(row => row.id);
      let cards = id('home').querySelectorAll('.card');
      for (let card of cards) {
        if (!ids.includes(parseInt(card.id))) {
          card.classList.add('hidden');
        } else {
          card.classList.remove('hidden');
        }
      }
    } catch (err) {
      setError(true);
    }
  }

  /**
   * Handles the input event for the search term input field.
   * Enables or disables the search button depending on whether the input field is empty.
   */
  function searchTermInput() {
    id('search-btn').disabled = !id('search-term').value.trim();
  }

  function loginPage() {
    id('products').classList.add('hidden');
    id('container3').classList.remove('hidden');
    id('submit').addEventListener('click', login);
    qs('.back-button').addEventListener('click', backToMain);
  }

  function backToMain() {
    console.log("retirn");
    id('products').classList.remove('hidden');
    id('container3').classList.add('hidden');
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

  //这个真的可以进去嘛
  function processLoginData(responseData) {
    console.log(responseData);
    if (responseData.length > 0){
      id('user').classList.remove('hidden');
      userID = responseData;
      id("submit").removeEventListener("click", login);
      id("submit").style.color = "gray";
      qs('.container2 h1').textContent = "Successfully logged in click on back"
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

  //能不能单独拆分成一个function?
  /**
   * The processData will generate a list of products and makae each prodcut
   * clickable
   * @param {JSON} responseData -the api data of products
   */
  function processData(responseData) {
    let productTotal = gen('div');
    productTotal.classList.add('on');
    productTotal.classList.add('pet');
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
      button.addEventListener('click', async () => {
        let newBuy = new FormData();
        newBuy.append("name", responseData['Pets'][i].Name);
        newBuy.append("seller", "HanyangYu");
        newBuy.append("price", responseData['Pets'][i].Price);
        let response = await fetch('/future/buy', {method: 'POST', body: newBuy});
        await statusCheck(response);
      });
      p1.textContent = "$" + responseData['Pets'][i].Price;
      product.appendChild(word);
      product.appendChild(img);
      product.appendChild(p1);
      product.appendChild(button);
      product.id = responseData['Pets'][i].PetID;
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