'use strict';
const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');


const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

async function getDBConnection() {
  const db = await sqlite.open({
      filename: 'finalProjectDatabase.db',
      driver: sqlite3.Database
  });
  return db;
}

app.get('/future/all', async (req, res) => {
  let db = await getDBConnection();
  let all = "select Name, Price from Aipets";
  let getAll = await db.all(all);
  let text = {
    "Pets":[
    ]
  }
  for (let i = 0; i < getAll.length; i++) {
    text["Pets"].push(getAll[i])
  }
  res.type('json');
  res.send(text);
  await db.close();
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
const PORT = process.env.PORT || 8000;
app.listen(PORT);