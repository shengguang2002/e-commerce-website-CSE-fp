/*
 * Name: Hanyang Yu, Brian Yuan
 * Date: May 6, 2023
 * Section: CSE 154 AF
 *
 * This is the JS to implement the UI for online shopping M278 AI Pet Store, an ecommerce-website.
 * It provides JS code that serves functions of searching, filtering, buying AI pets, showing AI
 * pets, providing purchase history, log in and sign up, and giving recommending pets based on
 * your purchase history
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
    id('cat').addEventListener('click', () => filterCategory("cat"));
    id('dog').addEventListener('click', () => filterCategory("dog"));
    id('back-button2').addEventListener('click', backToMain);
    id('back-button3').addEventListener('click', backToMain);
    id('back-button4').addEventListener('click', backToMain);
    getRecommendedProducts();
  }

  /**
   * This funciton filter the results by cat or dogs
   * @param {string} type - on or off the for the prodcut attributes
   */
  function filterCategory(type) {
    if (id('products').classList.contains(type)) {
      id('products').classList.remove(type);
      filterClear();
    } else {
      filterChecked(type);
    }
  }

  /**
   * This fucniton extends the filterCategory by utlizing the
   * search api endpoint to accomplish search feature on the pets
   * like the pet name
   * @param {string} type -dog or cat
   */
  async function filterChecked(type) {
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
      for (let pet of pets) {
        if (!ids.includes(parseInt(pet.id))) {
          pet.classList.add('hidden');
        } else {
          pet.classList.remove('hidden');
        }
      }
      id('products').classList.add(type);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * make all of the pets availiable to see by remobing the hidden
   * class form the pets
   */
  function filterClear() {
    let pets = id('products').querySelectorAll('.product');
    for (let pet of pets) {
      pet.classList.remove('hidden');
    }
  }

  /**
   * when craete account is clicked it hide the product page and display
   * the login page. It will make the craete new account visible
   */
  function newUser() {
    id('products').classList.add('hidden');
    id('container3').classList.remove('hidden');
    id('create').classList.remove('hidden');
    id('create').addEventListener('click', create);

  }

  /**
   * this call the endpoint of creating a new user
   * on the back it will enter the user name and password
   * to the database
   */
  async function create() {
    try {
      let user = id('username').value;
      let password = id('password').value;
      let url = '/future/info/' + user + '/' + password;
      let response = await fetch(url);
      await statusCheck(response);
      let rows = await response.json();
      processCreateData(rows);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Processes the response from the create account endpoint.
   *
   * If a new account is successfully created, the function updates the user interface:
   * - It displays the account page with the message "Successfully logged in click on back"
   * - It triggers the loading of recommended products on the home page
   * - The color of the submit button changes to gray and the title turns green
   * - The 'account' button becomes enabled, allowing the user to view their purchase history
   * - The 'create' button is hidden
   *
   * In addition, it updates the global userID variable with the lastID from the response data.
   *
   * @param {Object} responseData - The response from the create account endpoint, expected to include 'changes' and 'lastID' properties.
   */
  function processCreateData(responseData) {
    if (responseData.changes > 0) {
      id('user').classList.remove('hidden');
      id('newuser').classList.add('hidden');
      userID = responseData.lastID;
      id("submits").removeEventListener("click", login);
      id("submits").style.color = "gray";
      qs('#container3 h1').textContent = "Successfully logged in click on back";
      qs('#container3 h1').style.color = "green";
      id('user').addEventListener('click', purchaseHistory);
      id('create').classList.add('hidden');
      id('newuser').classList.add('hidden');
      getRecommendedProducts();
      id('recommend-production').classList.remove('hidden');
    }
  }

  /**
   * This function will contains all of the purchase history of the a logged
   * account. It does so by checking if the userID has values. Then it call the
   * purcchasehistory endpoint to get purshcase information on the user. The json
   * information will then be returned and the data will appended to the page.
   */
  async function purchaseHistory() {
    if (userID) {
      try {
        let response = await fetch(`/future/purchasehistory?userID=${userID}`);
        await statusCheck(response);
        let rows = await response.json();
        qs('#purchase-history h2').textContent = `Purchase History for ` + userEmail;
        id('products').classList.add('hidden');
        id('container3').classList.add('hidden');
        id('container2').classList.add('hidden');
        id('purchase-history').classList.remove('hidden');
        qs('#purchase-history article').innerHTML = "";
        for (let i = 0; i < rows.length; i++) {
          let historyElement = gen('p');
          historyElement.textContent = `Transaction #${i + 1}: Buy pet id :${rows[i].petID}
          with $${rows[i].price}   ${new Date(rows[i].date).toLocaleString()}`;
          qs('#purchase-history article').appendChild(historyElement);
        }
      } catch (err) {
        console.error(err);
      }
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

  /**
   * The login page is inccured when the user clicked the login button
   * the product page will be hidden and login page will be visible to see
   */
  function loginPage() {
    id('products').classList.add('hidden');
    id('container3').classList.remove('hidden');
    id('submits').addEventListener('click', login);
  }

  /**
   * The back button takes the user bakc the product page by enable the hidden
   * prodcuts to be reappear and hide the other elements
   */
  function backToMain() {
    id('products').classList.remove('hidden');
    id('container3').classList.add('hidden');
    id('recommend-production').classList.add('hidden');
    id('container2').classList.add('hidden');
    id('purchase-history').classList.add('hidden');
  }

  /**
   * the login page call the login endpoint by insert username and password
   * use post method. The api then return the information to processLoginData
   * for future processing.
   */
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

  /**
   * This funciton processed the loggged in information by
   * Successfully logged in click on back
   * it will also incur the get recommended product on the home page
   * The color of the submit button will change tp gray
   * and The title will be green
   * a user is then able to click on the account page tp view
   * their purchase history by enable the account button.
   * The craete button will then be hidden form user
   * The userId will alos be updated to the global variable for
   * future use
   * @param {json} responseData - the userid
   */
  function processLoginData(responseData) {
    if (responseData.length > 0) {
      id('user').classList.remove('hidden');
      id('newuser').classList.add('hidden');
      userID = responseData[0].userID;
      id("submits").removeEventListener("click", login);
      id("submits").style.color = "gray";
      qs('#container3 h1').textContent = "Successfully logged in click on back";
      qs('#container3 h1').style.color = "green";
      id('user').addEventListener('click', purchaseHistory);
      id('save').classList.remove('hidden');
      id('save').addEventListener('click', save);
      getRecommendedProducts();
      id('recommend-production').classList.remove('hidden');
    }
  }

  /**
   * save the username
   */
  function save() {
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

  /**
   * Generates a product element with nested elements.
   * @param {Object} pet - The pet data.
   * @returns {HTMLElement} The product element.
   */
  function generateProductElement(pet) {
    let product = gen('div');
    let word = gen('h1');
    let p1 = gen('p');
    let p2 = gen('p');
    let p3 = gen('p');
    let sellButton = gen('button');
    let viewButton = gen('button');
    let img = gen('img');

    product.classList.add('product');
    p1.classList.add('price');
    p2.classList.add('description');
    p3.classList.add('description');
    viewButton.id = 'view';
    sellButton.id = 'add';

    product.appendChild(word);
    product.appendChild(img);
    product.appendChild(p2);
    product.appendChild(p3);
    product.appendChild(p1);
    product.appendChild(viewButton);
    product.appendChild(sellButton);
    product.id = pet.PetID;
    return product;
  }

  /**
   * Sets the text content of a product element.
   * @param {HTMLElement} product - The product element.
   * @param {Object} pet - The pet data.
   */
  function setProductTextContent(product, pet) {
    let word = product.querySelector('h1');
    let p1 = product.querySelector('.price');
    let p2 = product.querySelector('.description:nth-child(3)');
    let p3 = product.querySelector('.description:nth-child(4)');
    let img = product.querySelector('img');

    word.textContent = pet.Name;
    img.src = 'img/' + pet.Name + '.jpg';
    img.alt = "picture of " + pet.Name;
    p1.textContent = "$" + pet.Price;
    p2.textContent = "Seller: " + pet.seller;
    p3.textContent = "From: " + pet.region;
  }

  /**
   * Sets event listeners for buttons in a product element.
   * @param {HTMLElement} product - The product element.
   * @param {Object} pet - The pet data.
   */
  function setProductEventListeners(product, pet) {
    let sellButton = product.querySelector('#add');
    let viewButton = product.querySelector('#view');

    viewButton.textContent = 'view item';
    viewButton.addEventListener('click', () => viewItem(pet));

    sellButton.textContent = 'Buy Now!';
    sellButton.addEventListener('click', async () => {
      if (userID) {
        let newBuy = new FormData();
        newBuy.append("userID", userID);
        newBuy.append("price", pet.Price);
        newBuy.append("petID", pet.PetID);
        await fetch('/future/buy', {method: 'POST', body: newBuy});
      }
    });
  }

  /**
   * The processData will generate a list of products and make each product clickable.
   * @param {JSON} responseData -the api data of products
   */
  function processData(responseData) {
    let productTotal = gen('div');
    productTotal.classList.add('on');
    productTotal.classList.add('pet');

    for (let i = 0; i < responseData['Pets'].length; i++) {
      let product = generateProductElement(responseData['Pets'][i]);
      setProductTextContent(product, responseData['Pets'][i]);
      setProductEventListeners(product, responseData['Pets'][i]);

      productTotal.appendChild(product);
    }
    id('products').appendChild(productTotal);
  }

  /**
   * This funciton input all of informaiton like seller info, name, price
   * when user clicked on the view button
   * @param {Object} para - Item parameter object
   */
  function viewItem(para) {
    id('products').classList.add('hidden');
    id('container2').classList.remove('hidden');
    qs('#product-image img').src = 'img/' + para.Name + '.jpg';
    id('product-price').textContent = '$' + para.Price;
    id('seller-info').textContent = 'Sold by ' + para.seller + ", and Shiped from " + para.region;
    qs('#container2 h1').textContent = "AiPets: " + para.Name + " (" + para.category + ")";
  }

  /**
   * it switch the grid view when click on the button
   */
  function checkGrid() {
    let pets = id('products').querySelectorAll('.product');
    for (let pet of pets) {
      if (pet.classList.contains('add')) {
        pet.classList.add('off');
        pet.classList.remove('add');
        pet.style.display = "block";
      } else {
        pet.classList.remove('off');
        pet.classList.add('add');
        pet.style.display = "grid";
      }
    }
  }

  /**
   * this function recommended the pordcut based on the user purchase history
   * it will call the rec endpoint to get all of history of the pets by that
   * id
   */
  function getRecommendedProducts() {
    fetch(`/future/rec/${userID}`)
      .then(statusCheck)
      .then(response => response.json())
      .then(boughtHistory => {
        generateRecommendations(boughtHistory);
      })
      .catch(console.error);
  }

  /**
   * If user does have purchase history, then it will recommend a random
   * cat or dog pets based on the number of cat or dog pets user purchased.
   * @param {Array} buyHistory - The purchase history of the user.
   * @returns {string} - The pet category to recommend. If no history, returns null.
   */
  function getRecommendationCategory(buyHistory) {
    if (buyHistory.length === 0) {
      return null;
    }
    let dog = 0;
    let cat = 0;

    for (let i = 0; i < buyHistory.length; i++) {
      if (buyHistory[i].category === 'dog') {
        dog += 1;
      } else {
        cat += 1;
      }
    }
    return dog > cat ? 'dog' : 'cat';
  }

  /**
   * Fetches a random pet from a specified category.
   * @param {number} maxID - The maximum petID to be fetched.
   * @param {string} category - The pet category to fetch.
   * @returns {Promise} - A promise with the pet details.
   */
  function fetchRandomPet(maxID, category) {
    let detail;
    const fetchUntilCategoryMatches = () => {
      let randomID = Math.floor(Math.random() * maxID) + 1;
      return getApendRec(randomID)
        .then(data => {
          detail = data;
          if (detail[0].category !== category) {
            return fetchUntilCategoryMatches();
          }
          return detail;
        });
    };
    return fetchUntilCategoryMatches();
  }

  /**
   * Generates a recommendation for the user based on their purchase history.
   * @param {json} pastBought - The purchase history of the user.
   */
  function generateRecommendations(pastBought) {
    const DECIMAL = 10;
    let randomID = Math.floor(Math.random() * DECIMAL) + 1;
    let category = getRecommendationCategory(pastBought);
    if (category === null) {
      getApendRec(randomID)
        .then(detail => {
          append(detail);
        });
    } else {
      fetchRandomPet(pastBought[0].LastPetID, category)
        .then(detail => {
          append(detail);
        });
    }
  }

  /**
   * Makes a POST request to the '/future/get' endpoint with a specified Pet ID.
   * @param {number} ID - The ID of the Pet to retrieve from the database.
   * @returns {Promise<Object>} - A Promise that resolves to the Pet data
   * retrieved from the database.
   */
  async function getApendRec(ID) {
    try {
      let randomID = new FormData();
      randomID.append("petID", ID);
      let response = await fetch('/future/get', {method: 'POST', body: randomID});
      await statusCheck(response);
      let boughtHistory = await response.json();
      return boughtHistory;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * this creates the new recommended pet
   * @param {json} responseData formulated recommended pet's data
   */
  function append(responseData) {
    let product = gen('div');
    let word = gen('h1');
    let img = gen('img');
    let result = 'img/' + responseData[0].Name + '.jpg';
    img.src = result;
    word.textContent = responseData[0].Name;
    product.appendChild(word);
    product.appendChild(img);
    product.classList.add('product');
    id('recommend-production').appendChild(product);
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
})();