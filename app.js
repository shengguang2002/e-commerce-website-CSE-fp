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
      filename: 'finalProjectDatabase.db',
      driver: sqlite3.Database
  });
  return db;
}

app.get('/future/all', async (req, res) => {
  /*let db = await getDBConnection();
  let all = "SELECT Name, Price FROM Aipets";
  let getAll = await db.all(all);
  /*let text = {
    "Pets":[
    ]
  }
  for (let i = 0; i < getAll.length; i++) {
    text["Pets"].push(getAll[i])
  }
  res.type('json').json({"Pets": getAll});
  await db.close();*/
  try {
    let db = await getDBConnection();
    let query;
    if (req.query.search) {
      query = `SELECT PetID
      FROM Aipets
      WHERE Name
      LIKE '%${req.query.search}%'
      ORDER BY id`;
    } else {
      query = "SELECT Name, Price FROM Aipets";
    }
    let row = await db.all(query);
    res.type('json').json({"Pets": row});
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
  let all = "INSERT INTO login(email, digit) values(?, ?)";
  let getAll = await db.all(all, [email, digit]);
  let result = "SELECT userID FROM login ORDER BY userID DESC LIMIT 1";
  let getResult = await db.run(result);
  res.type('json');
  res.send(getResult);
  } else {
    res.status(400).send("Insertion failed");
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
    if(req) {
      if (!req.body.name || !req.body.seller|| !req.body.price) {
        res.status(ERROR_CODE).send('Missing one or more of the required params.');
        return;
      }
      let db = await getDBConnection();
      let sql = `INSERT INTO Bought (name, seller, price, date)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)`;
      await db.run(sql, [req.body.name, req.body.seller, req.body.price]);
    }
    let row = await db.all(`SELECT *
      FROM yips`);
    res.type('json').json(row);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send('An error occurred on the server. Try again later.');
  }
});

app.get('/future/purchase-history/:user', async (req, res) => {
  let db = await getDBConnection();
  let user = req.params["user"];
  if (user != '') {
  let all = 'SELECT A.Name, A.Price, A.category \
             FROM Bought \
             JOIN AiPets AS A ON Bought.petID = A.PetID \
             WHERE Bought.userID = ?;';
  let getAll = await db.all(all, [user]);
  res.type('json');
  res.send(getAll);
  } else {
    res.status(400).send("Insertion failed");
  }
  await db.close();
})


app.use(express.static('public'));
const PORT = process.env.PORT || PORT_NUM;
app.listen(PORT);