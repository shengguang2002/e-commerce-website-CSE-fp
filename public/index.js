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
  let userEmail = null;
  window.addEventListener("load", init);

  /**
   * this function starts the my store website by enable
   * home and product button to be clickable
   */
  function init() {
    makeRequest();
    id('list').addEventListener('click', checkGrid);
    id('login').addEventListener('click', loginPage);
    id('newuser').addEventListener('click', newUser);
    id('home').addEventListener('click', loginPage);
    id('search-term').addEventListener('input', searchTermInput);
    id('search-btn').addEventListener('click', searchBtnClicked);
    id('history').addEventListener('click', purchaseHistory);
    id('all').addEventListener('click', filterClear);
    id('cat').addEventListener('click', filterCategory("cat"));
    id('dog').addEventListener('click', filterCategory("dog"));
  }


  async function filterCategory(type) {
    try {
      let newSearch = new FormData();
      newSearch.append("search", type);
      newSearch.append("type", "category");
      let response = await fetch('/future/search', {method: 'POST', body: newSearch});
      await statusCheck(response);
      id('search-term').value = '';
      let rows = await response.json();
      let ids = [];
      for (let row of rows) {
        ids.push(row.PetID);
      }
      let pets = id('products').querySelectorAll('.product');
      console.log(pets);
      for (let pet of pets) {
        if (!ids.includes(parseInt(pet.id))) {
          pet.classList.add('hidden');
        } else {
          pet.classList.remove('hidden');
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  function filterClear() {
    let pets = id('products').querySelectorAll('.product');
    for (let pet of pets) {
      pet.classList.remove('hidden');
    }
  }

  function newUser() {
    id('products').classList.add('hidden');
    id('container3').classList.remove('hidden');
    id('create').classList.remove('hidden');
    id('create').addEventListener('click', create);

  }

  function create() {
    let user = id('username').value;
    let password = id('password').value;
    let url = '/future/info/' + user + '/' + password
    fetch(url)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(processCreateData)
      .catch(console.error);
  }

  function processCreateData(responseData) {
    console.log(responseData.changes);
    if (responseData.changes > 0) {
      id('user').classList.remove('hidden');
      userID = responseData.lastID;
      id("submits").removeEventListener("click", login);
      id("submits").style.color = "gray";
      qs('#container3 h1').textContent = "Successfully logged in click on back"
      qs('#container3 h1').style.color = "green";
      id('user').addEventListener('click', purchaseHistory);
      id('create').classList.add('hidden');
      id('newuser').classList.add('hidden');
      getRecommendedProducts();
    }
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
      console.error(err);
    }
  }

  /**
   * Asynchronously handles the click event for the search button.
   * Fetches Yips (posts) that match the entered search term and updates the view.
   * Catches and handles any errors that occur during the fetch.
   */
  async function searchBtnClicked() {
    try {
      let newSearch = new FormData();
      newSearch.append("search", id('search-term').value.trim());
      newSearch.append("type", id('search-select').value);
      let response = await fetch('/future/search', {method: 'POST', body: newSearch});
      await statusCheck(response);
      id('search-term').value = '';
      let rows = await response.json();
      let ids = [];
      for (let row of rows) {
        ids.push(row.PetID);
      }
      let pets = id('products').querySelectorAll('.product');
      console.log(pets);
      for (let pet of pets) {
        if (!ids.includes(parseInt(pet.id))) {
          pet.classList.add('hidden');
        } else {
          pet.classList.remove('hidden');
        }
      }
    } catch (err) {
      console.error(err);
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
    id('submits').addEventListener('click', login);
    qs('.back-button').addEventListener('click', backToMain);
    console.log('hi');
  }

  function backToMain() {
    console.log("retirn");
    id('products').classList.remove('hidden');
    id('container3').classList.add('hidden');
  }

  function login() {
    console.log('login');
    let user = id('username').value;
    let password = id('password').value;
    console.log(user);
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
      userID = responseData[0].userID;
      id("submits").removeEventListener("click", login);
      id("submits").style.color = "gray";
      qs('#container3 h1').textContent = "Successfully logged in click on back"
      qs('#container3 h1').style.color = "green";
      id('user').addEventListener('click', purchaseHistory);
      id('save').classList.remove('hidden');
      id('save').addEventListener('click', save);
    }
  }

  function save(){
    id('username').textContent = userEmail;
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
      let button2 = gen('button');
      let img = gen('img');
      let result = 'Future_PETS/' + responseData['Pets'][i].Name + '.jpg';
      word.textContent = responseData['Pets'][i].Name;
      img.src = result;
      product.classList.add('product');
      p1.classList.add('price');
      button2.id = 'view';
      button2.textContent = 'view item';
      button2.para = responseData['Pets'][i].Name;
      button2.paras = responseData['Pets'][i].Price;
      button2.addEventListener('click', viewItem);
      button.id = 'add';
      button.textContent ='Add to Cart';
      button.addEventListener('click', async () => {
        let newBuy = new FormData();
        newBuy.append("name", responseData['Pets'][i].Name);
        newBuy.append("price", responseData['Pets'][i].Price);
        newBuy.append("category", responseData['Pets'][i].category);
        let response = await fetch('/future/buy', {method: 'POST', body: newBuy});
        await statusCheck(response);
      });
      p1.textContent = "$" + responseData['Pets'][i].Price;
      product.appendChild(word);
      product.appendChild(img);
      product.appendChild(p1);
      product.appendChild(button2);
      product.appendChild(button);
      product.id = responseData['Pets'][i].PetID;
      productTotal.appendChild(product);
    }
    id('products').appendChild(productTotal);
  }

  function viewItem(parameter) {
    console.log('hi');
    id('products').classList.add('hidden');
    id('container2').classList.remove('hidden');
    let name = parameter.currentTarget.para;
    let price = parameter.currentTarget.paras;
    let result = 'Future_PETS/' + name + '.jpg';
    qs('.product-image img').src =result;
    qs('.product-price').textContent = '$' + price;
  }

  //这是干啥用的？
  function checkGrid() {
    let pets = id('home').querySelectorAll('.pet');
      for (let pet of pets) {
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
  }

  function getRecommendedProducts() {
    fetch(`/future/purchase-history/${userID}`)
      .then(statusCheck)
      .then(response => response.json())
      .then(purchaseHistory => {
        const recommendedProducts = generateRecommendations(purchaseHistory);
        displayRecommendedProducts(recommendedProducts);
      })
      .catch(console.error);
  }

  function generateRecommendations(purchaseHistory) {
    if (purchaseHistory.length === 0) {
      return generateRandomRecommendations();
    }
    return generateRandomRecommendations();
  }

  function generateRandomRecommendations() {
    const recommendedProducts = [];
    for (let i = 0; i < 5; i++) {
      const product = {
        name: `Recommended Product ${i+1}`,
        price: Math.floor(Math.random() * 100),
        seller: `Seller ${i+1}`
      };
      recommendedProducts.push(product);
    }
    return recommendedProducts;
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