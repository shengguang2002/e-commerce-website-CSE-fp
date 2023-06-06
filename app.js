/*
 * Name: Hanyang Yu, Brian Yuan
 * Date: May 6, 2023
 * Section: CSE 154 AF
 *
 * This file is the server-side application for M278 AI Pet Store, an ecommerce-website.
 * It provides API endpoints for log in and sign up, getting information of AI pets, and
 * enabling user to buy and check purchase history.
 */
'use strict';
const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

// Create an instance of an express application
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

// Constant error codes for response
const ERROR_CODE = 400;
const SERVER_ERROR_CODE = 500;
const PORT_NUM = 8000;

/**
 * Establishes a connection to the SQLite database and returns the database object.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'finalproject.db',
    driver: sqlite3.Database
  });
  return db;
}

/**
 * Express route for "/future/all" endpoint. Fetches all pet details from the database.
 * Responds with a JSON object containing pet details.
 * @param {string} req - Express request object.
 * @param {string} res - Express response object.
 */
app.get('/future/all', async (req, res) => {
  try {
    let db = await getDBConnection();
    let query = "SELECT Name, Price, PetID, seller, region, category FROM Alpets";
    let row = await db.all(query);
    res.type('json').json({"Pets": row});
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send('An error occurred on the server. Try again later.');
  }
});

/**
 * Express route for "/future/search" endpoint. Searches for pets based on the request body.
 * Responds with matching pet IDs as a JSON object.
 * @param {string} req - Express request object.
 * @param {string} res - Express response object.
 */
app.post('/future/search', async (req, res) => {
  try {
    if (!req.body.search || !req.body.type) {
      res.status(ERROR_CODE).send('Missing one or more of the required params.');
      return;
    }
    let db = await getDBConnection();
    let query = `SELECT PetID FROM AlPets WHERE ${req.body.type} LIKE '%${req.body.search}%'`;
    let row = await db.all(query);
    res.type('json').json(row);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send('An error occurred on the server. Try again later.');
  }
});

/**
 * Express route for "/future/login" endpoint. Authenticates user login.
 * Responds with user details if successful, else responds with error message.
 * @param {string} req - Express request object.
 * @param {string} res - Express response object.
 */
app.post('/future/login', async (req, res) => {
  try {
    let db = await getDBConnection();
    let user = req.body.name;
    let password = req.body.password;
    let all = "SELECT userID FROM login WHERE email = ? and digit = ?";
    let getAll = await db.all(all, [user, password]);
    if (getAll.length > 0) {
      res.type('text');
      res.send(getAll);
    } else {
      res.type('text');
      res.status(ERROR_CODE);
      res.send('incorrect login information');
    }
    await db.close();
  } catch (error) {
    res.status(SERVER_ERROR_CODE).send("Insertion failed");
  }
});

/**
 * Express route for "/future/info/:email/:digit" endpoint. Inserts new user into the database.
 * Responds with the user's ID from the database.
 * @param {string} req - Express request object.
 * @param {string} res - Express response object.
 */
app.get('/future/info/:email/:digit', async (req, res) => {
  try {
    let db = await getDBConnection();
    let email = req.params["email"];
    let digit = req.params["digit"];
    if (email !== '' || digit !== '') {
      let all = "INSERT INTO login (email, digit) VALUES (?, ?)";
      await db.all(all, [email, digit]);
      let result = "SELECT userID FROM login ORDER BY userID DESC LIMIT 1";
      let getResult = await db.run(result);
      res.type('json');
      res.send(getResult);
    } else {
      res.status(SERVER_ERROR_CODE).send("Insertion failed");
    }
    await db.close();
  } catch (error) {
    res.status(SERVER_ERROR_CODE).send('An error occurred on the server. Try again later.');
  }
});

/**
 * Express route for "/future/buy" endpoint. Inserts a purchase record into the database.
 * Responds with error message if any error occurs.
 * @param {string} req - Express request object.
 * @param {string} res - Express response object.
 */
app.post('/future/buy', async (req, res) => {
  try {
    if (!req.body.userID || !req.body.price || !req.body.petID) {
      res.status(ERROR_CODE).send('Missing one or more of the required params.');
      return;
    }
    let db = await getDBConnection();
    let sql = `INSERT INTO purchase (userID, price, petID, date)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)`;
    await db.run(sql, [req.body.userID, req.body.price, req.body.petID]);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send('An error occurred on the server. Try again later.');
  }
});

/**
 * Express route for "/future/purchasehistory" endpoint. Fetches a user's purchase history.
 * Responds with purchase details as a JSON object.
 * @param {string} req - Express request object.
 * @param {string} res - Express response object.
 */
app.get('/future/purchasehistory', async (req, res) => {
  try {
    if (!req.query.userID) {
      res.status(ERROR_CODE).send('Missing one or more of the required params.');
      return;
    }
    let id = req.query.userID;
    let db = await getDBConnection();
    let query = `SELECT userID, price, petID, date FROM purchase WHERE userID = ?`;
    let row = await db.all(query, [id]);
    res.type('json').json(row);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send('An error occurred on the server. Try again later.');
  }
});

/**
 * Express route for "/future/rec/:user" endpoint. Recommends a pet for the user.
 * Responds with recommended pet details as a JSON object.
 * @param {string} req - Express request object.
 * @param {string} res - Express response object.
 */
app.get('/future/rec/:user', async (req, res) => {
  try {
    let db = await getDBConnection();
    let user = req.params["user"];
    if (user !== '') {
      let all = 'SELECT A.Name, A.Price, A.category, \
                  (SELECT MAX(PetID) FROM AlPets) AS LastPetID \
                  FROM purchase \
                  JOIN AlPets AS A ON purchase.petID = A.PetID \
                  WHERE purchase.userID = ?;';
      let getAll = await db.all(all, [user]);
      res.type('json');
      res.send(getAll);
    } else {
      res.status(ERROR_CODE).send("failed");
    }
    await db.close();
  } catch (error) {
    res.status(SERVER_ERROR_CODE).send("An error occurred");
  }
});

/**
 * Express route for "/future/get" endpoint. Fetches a pet's details.
 * Responds with pet details as a JSON object.
 * @param {string} req - Express request object.
 * @param {string} res - Express response object.
 */
app.post('/future/get', async (req, res) => {
  try {
    if (!req.body.petID) {
      res.status(ERROR_CODE).send('Missing one or more of the required params.');
      return;
    }
    let db = await getDBConnection();
    let all = 'SELECT Name, Price, category, \
    (SELECT MAX(PetID) FROM AlPets) AS LastPetID \
    FROM AlPets \
    WHERE PetID = ?';
    let row = await db.all(all, [req.body.petID]);
    res.type('json');
    res.send(row);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send('An error occurred on the server. Try again later.');
  }
});

// Middleware to serve static files from the "public" directory
app.use(express.static('public'));

// Express server listening on a port
const PORT = process.env.PORT || PORT_NUM;
app.listen(PORT);