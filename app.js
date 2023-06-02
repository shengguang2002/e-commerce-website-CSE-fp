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

// app.get('/yipper/user/:user', async (req, res) => {
//   let db = await getDBConnection();
//   let name = req.params["user"];
//   let all = "SELECT id, name, yip, hashtag, likes\
//   , DATETIME(date) FROM yips where name = ? ORDER BY date DESC";
//   let getAll = await db.all(all, [name]);
//   if (getAll.length > 0) {
//     res.type('json');
//     res.send(getAll);
//   } else {
//     res.status(400).send("no name found");
//   }
//   await db.close();
// })

// app.post('/yipper/likes', async (rq, rs) => {
//   let db = await getDBConnection();
//   let id = rq.body.id;
//   let all = "SELECT id, name, yip, hashtag, likes\
//   , DATETIME(date) FROM yips where id = ? ORDER BY date DESC";
//   let getAll = await db.all(all, [id]);
//   console.log(getAll);
//   if (getAll.length > 0) {
//     let update = parseInt(getAll[0].likes) + 1
//     await db.run("UPDATE yips SET likes = ? Where id = ?", [update, id]);

//     rs.type('text');
//     rs.send(update.toString());
//   } else {
//     rs.type('text');
//     rs.status(400);
//     rs.send('missing body param');
//   }
//   await db.close();
// });

// app.post('/yipper/new', async (rq, rs) => {
//   let db = await getDBConnection();
//   let name = rq.body.name;
//   let full = rq.body.full;
//   let yip = (full.split('#'))[0];
//   let hashtag = (full.split('#'))[1];
//   let all = "INSERT INTO yips(name, yip, hashtag, likes) values(?, ?, ?, 0)";
//   let getAll = await db.all(all, [name, yip, hashtag]);
//   let last = "SELECT id, name, yip, hashtag, likes, DATETIME(date)\
//   FROM yips ORDER BY id DESC LIMIT 1";
//   let get = await db.all(last);
//   rs.type('json');
//   rs.send(get);
//   await db.close();
// });


app.use(express.static('public'));
const PORT = process.env.PORT || PORT_NUM;
app.listen(PORT);