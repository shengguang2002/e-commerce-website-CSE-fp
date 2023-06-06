/*
 * Name: Hanyang Yu, Brian Yuan
 * Date: May 6, 2023
 * Section: CSE 154 AF
 *
 * This is the JS to implement the UI for online shopping.
 */
"use strict";
(function() {
  let userID = 121;
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
    console.log(type);
    if(id('products').classList.contains(type)) {
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
      console.log(pets);
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

  /**
   * when a new account is sucessuflly created
   * it will show the account page and disaply
   * Successfully logged in click on back
   * it will also incur the get recommended product on the home page
   * The color of the submit button will change tp gray
   * and The title will be green
   * a user is then able to click on the account page tp view
   * their purchase history by enable the account button.
   * The craete button will then be hidden form user
   * The userId will alos be updated to the global variable for
   * future use
   * @param {json} responseData - form the craete account endpoint
   */
  function processCreateData(responseData) {
    console.log(responseData.changes);
    if (responseData.changes > 0) {
      id('user').classList.remove('hidden');
      id('newuser').classList.add('hidden');
      userID = responseData.lastID;
      id("submits").removeEventListener("click", login);
      id("submits").style.color = "gray";
      qs('#container3 h1').textContent = "Successfully logged in click on back"
      qs('#container3 h1').style.color = "green";
      id('user').addEventListener('click', purchaseHistory);
      id('create').classList.add('hidden');
      id('newuser').classList.add('hidden');
      getRecommendedProducts();
      id('Recproducts').classList.remove('hidden');
    }
  }

  /**
   * This function will contains all of the purchase history of the a logged
   * account. It does so by checking if the userID has values. Then it call the
   * purcchasehistory endpoint to get purshcase information on the user. The json
   * information will then be returned and the data will appended to the page.
   */
  async function purchaseHistory() {
    if(!userID) {
      console.log("login first!");
    } else {
      try {
        let response = await fetch(`/future/purchasehistory?userID=${userID}`);
        await statusCheck(response);
        let rows = await response.json();
        qs('#purchase-history h2').textContent = `Purchase History for `+ userEmail;
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

  /**
   * The login page is inccured when the user clicked the login button
   * the product page will be hidden and login page will be visible to see
   */
  function loginPage() {
    id('products').classList.add('hidden');
    id('container3').classList.remove('hidden');
    id('submits').addEventListener('click', login);
    console.log('hi');
  }

  /**
   * The back button takes the user bakc the product page by enable the hidden
   * prodcuts to be reappear and hide the other elements
   */
  function backToMain() {
    console.log("retirn");
    id('products').classList.remove('hidden');
    id('container3').classList.add('hidden');
    id('container2').classList.add('hidden');
    id('purchase-history').classList.add('hidden');
  }

  /**
   * the login page call the login endpoint by insert username and password
   * use post method. The api then return the information to processLoginData
   * for future processing.
   */
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
    console.log(responseData);
    if (responseData.length > 0){
      id('user').classList.remove('hidden');
      id('newuser').classList.add('hidden');
      userID = responseData[0].userID;
      id("submits").removeEventListener("click", login);
      id("submits").style.color = "gray";
      qs('#container3 h1').textContent = "Successfully logged in click on back"
      qs('#container3 h1').style.color = "green";
      id('user').addEventListener('click', purchaseHistory);
      id('save').classList.remove('hidden');
      id('save').addEventListener('click', save);
      getRecommendedProducts();
      id('Recproducts').classList.remove('hidden');
    }
  }

  /**
   * save the username
   */
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
      let p2 = gen('p');
      let p3 = gen('p');
      let sellButton = gen('button');
      let viewButton = gen('button');
      let img = gen('img');
      let result = 'Future_PETS/' + responseData['Pets'][i].Name + '.jpg';
      word.textContent = responseData['Pets'][i].Name;
      img.src = result;
      product.classList.add('product');
      p1.classList.add('price');
      p2.classList.add('description');
      p3.classList.add('description');
      viewButton.id = 'view';
      viewButton.textContent = 'view item';
      viewButton.addEventListener('click', () => viewItem(responseData['Pets'][i]));
      sellButton.id = 'add';
      sellButton.textContent ='Buy Now!';
      sellButton.addEventListener('click', async () => {
        if(userID) {
          console.log("selling!!");
          let newBuy = new FormData();
          newBuy.append("userID", userID);
          newBuy.append("price", responseData['Pets'][i].Price);
          newBuy.append("petID", responseData['Pets'][i].PetID);
          await fetch('/future/buy', {method: 'POST', body: newBuy});
        } else {
          console.log("login first!");
        }
      });
      p1.textContent = "$" + responseData['Pets'][i].Price;
      p2.textContent = "Seller: " + responseData['Pets'][i].seller;
      p3.textContent = "From: " + responseData['Pets'][i].region;
      product.appendChild(word);
      product.appendChild(img);
      product.appendChild(p2);
      product.appendChild(p3);
      product.appendChild(p1);
      product.appendChild(viewButton);
      product.appendChild(sellButton);
      product.id = responseData['Pets'][i].PetID;
      productTotal.appendChild(product);
    }
    id('products').appendChild(productTotal);
  }
  /**
   * This funciton input all of informaiton like seller info, name, price
   * when user clicked on the view button
   * @param {json} para
   */
  function viewItem(para) {
    console.log(para);
    id('products').classList.add('hidden');
    id('container2').classList.remove('hidden');
    let name = para.Name;
    let result = 'Future_PETS/' + name + '.jpg';
    let price = para.Price;
    qs('#product-image img').src ='Future_PETS/' + para.Name + '.jpg';
    id('product-price').textContent = '$' + para.Price;
    id('seller-info').textContent='Sold by ' + para.seller
    + ", and Shiped from " + para.region;
    qs('#container2 h1').textContent = "AiPets: " + para.Name + " (" + para.category + ")";
  }

  /**
   * it switch the grid view when click on the button
   */
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

  /**
   * this function recommended the pordcut based on the user purchase history
   * it will call the rec endpoint to get all of history of the pets by that
   * id
   */
  function getRecommendedProducts() {
    fetch(`/future/rec/${userID}`)
      .then(statusCheck)
      .then(response => response.json())
      .then(purchaseHistory => {
        generateRecommendations(purchaseHistory);
      })
      .catch(console.error);
  }

  /**
   * if user has not purchased anything, then it will recommended a random
   * pet to be shown on the screen
   * if user does have purchase hisytory. then it will recommneed a random
   * cat or dog pets based number of cat pets or dog oets user purchased.
   * @param {json} purchaseHistory
   */
  function generateRecommendations(purchaseHistory) {
    if (purchaseHistory.length === 0) {
      let randomID = Math.floor(Math.random() * 10) + 1;
      getApendRec(randomID)
        .then(detail => {
          append(detail);
        });
    } else {
      let dog = 0;
      let cat = 0;
      let random = Math.floor(Math.random() * purchaseHistory[0].LastPetID) + 1;
      console.log(random);
      for (let i = 0; i < purchaseHistory.length; i++) {
        if (purchaseHistory[i].category === 'dog') {
          dog += 1;
        } else {
          cat += 1;
        }
      }
      if (dog > cat) {
        let detail;
        const fetchRandomPet = () => {
          random = Math.floor(Math.random() * purchaseHistory[0].LastPetID) + 1;
          return getApendRec(random)
            .then(data => {
              detail = data;
              if (detail[0].category !== 'dog') {
                return fetchRandomPet();
              }
              return detail;
            });
        };
        fetchRandomPet()
          .then(detail => {
            append(detail);
          });
      }
       else {
        getApendRec(randomID)
        .then(detail => {
          append(detail);
        });
      }
    }
  }

  /**
   * this call get endpoint by input the id
   * @param {int} ID
   * @returns
   */
  function getApendRec(ID) {
    let randomID = new FormData();
    randomID.append("petID", ID);
    return fetch('/future/get', { method: 'POST', body: randomID })
      .then(statusCheck)
      .then(response => response.json())
      .then(purchaseHistory => {
        return purchaseHistory;
      })
      .catch(console.error);
  }

  /**
   * this creates the new recommended pet
   * @param {json} responseData
   */
  function append(responseData) {
    let product = gen('div');
    let word = gen('h1');
    let img = gen('img');
    let result = 'Future_PETS/' + responseData[0].Name + '.jpg';
    img.src = result;
    word.textContent = responseData[0].Name;
    product.appendChild(word);
    product.appendChild(img);
    product.classList.add('product');
    id('Recproducts').appendChild(product);
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