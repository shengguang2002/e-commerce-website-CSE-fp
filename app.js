'use strict';
const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');


const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

const ERROR_CODE = 400;
const SERVER_ERROR_CODE = 500;
const PORT_NUM = 8000;

async function getDBConnection() {
  const db = await sqlite.open({
      filename: 'finalproject.db',
      driver: sqlite3.Database
  });
  return db;
}

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

app.post('/future/search', async (req, res) => {
  try {
    //console.log(req.body.search);
    if(!req.body.search || !req.body.type) {
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

app.post('/future/login', async (rq, rs) => {
  let db = await getDBConnection();
  let user = rq.body.name;
  let password = rq.body.password;
  let all = "SELECT userID FROM login WHERE email = ? and digit = ?";
  let getAll = await db.all(all, [user, password]);
  if (getAll.length > 0) {
    rs.type('text');
    rs.send(getAll);
  } else {
    rs.type('text');
    rs.status(400);
    rs.send('inccorect login information');
  }
  await db.close();
});

app.get('/future/info/:email/:digit', async (req, res) => {
  let db = await getDBConnection();
  let email = req.params["email"];
  let digit = req.params["digit"];
  if (email != '' || digit != '') {
  let all = "INSERT INTO login (email, digit) VALUES (?, ?)";
  let getAll = await db.all(all, [email, digit]);
  let result = "SELECT userID FROM login ORDER BY userID DESC LIMIT 1";
  let getResult = await db.run(result);
  res.type('json');
  res.send(getResult);
  } else {
    res.status(SERVER_ERROR_CODE).send("Insertion failed");
  }
  await db.close();
})


/**
 *
 * @param {string} req - Express request object.
 * @param {string} res - Express response object.
 */
app.post('/future/buy', async (req, res) => {
  try {
    if (!req.body.userID || !req.body.price) {
      res.status(ERROR_CODE).send('Missing one or more of the required params.');
      return;
    }
    let db = await getDBConnection();
    console.log("check");
    let sql = `INSERT INTO purchase (userID, price, petID, date)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)`;
    console.log("check1");
    await db.run(sql, [req.body.userID, req.body.price, req.body.petID]);
    console.log("check12");
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send('An error occurred on the server. Try again later.');
  }
});

app.get('/future/purchasehistory', async (req, res) => {
  try {
    if(!req.query.userID) {
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


app.get('/future/rec/:user', async (req, res) => {
  let db = await getDBConnection();
  let user = req.params["user"];
  if (user != '') {
    let all = 'SELECT A.Name, A.Price, A.category, \
                (SELECT MAX(PetID) FROM AlPets) AS LastPetID \
                FROM purchase \
                JOIN AlPets AS A ON purchase.petID = A.PetID \
                WHERE purchase.userID = ?;';
    let getAll = await db.all(all, [user]);
    res.type('json');
    res.send(getAll);
  } else {
    res.status(400).send("failed");
  }
  await db.close();
})

app.post('/future/get', async (req, res) => {
  try {
    if(!req.body.petID) {
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
})


app.use(express.static('public'));
const PORT = process.env.PORT || PORT_NUM;
app.listen(PORT);