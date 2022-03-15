const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

const openDB = () => {
  return (db = new sqlite3.Database("./mebelniydvorik.db", (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Connected to sqlite database...");
  }));
};

const closeDB = (db) => {
  db.close((err) => {
    if (err) console.log(err);
    console.log("Closed connection to sqlite database");
  });
};

app.get("/", (req, res) => {
  const db = openDB();
  db.serialize(() => {
    db.all(
      `select name from sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'users'`,
      (err, row) => {
        if (err) console.log(err.message);
        res.send(row);
      }
    );
  });
  closeDB(db);
});

app.get("/test/:table", (req, res) => {
  const db = openDB();
  db.serialize(() => {
    db.all(`pragma table_info(${req.params.table})`, (err, row) => {
      if (err) console.log(err);
      res.send(row);
    });
  });
  closeDB(db);
});

app.get("/view/:table", (req, res) => {
  const db = openDB();
  db.serialize(() => {
    db.all(
      `select rowid,* from ${req.params.table} where удален= 0`,
      (err, row) => {
        if (err) console.log(err);
        res.send(row);
      }
    );
  });
  closeDB(db);
});

app.get("/view/:table/:id", (req, res) => {
  const db = openDB();
  db.serialize(() => {
    db.all(
      `select rowid,* from ${req.params.table} where rowid = ${req.params.id}`,
      (err, row) => {
        if (err) console.log(err);
        res.send(row);
      }
    );
  });
  closeDB(db);
});

app.post("/change/:table/:id", (req, res) => {
  let tempQuerry = "";
  let values = req.body;
  for (const key in values) {
    if (Object.hasOwnProperty.call(values, key)) {
      const element = values[key];
      if (key !== "rowid" && key !== "остаток")
        tempQuerry += `'${key}' = '${element}',`;
    }
  }
  tempQuerry = tempQuerry.slice(0, tempQuerry.length - 1);
  const db = openDB();
  db.serialize(() => {
    db.run(
      `update ${req.params.table} set ${tempQuerry} where rowid = ${req.params.id};`,
      (err) => {
        if (err) console.log(err);
      }
    );
  });
  closeDB(db);
  res.send();
});

app.post("/create/:table", (req, res) => {
  let tempQuerry = "";
  let values = req.body;
  for (const key in values) {
    if (Object.hasOwnProperty.call(values, key)) {
      const element = values[key];
      if (key !== "остаток" && key !== "rowid") {
        tempQuerry += `'${element}',`;
      }
    }
  }
  tempQuerry = tempQuerry.slice(0, tempQuerry.length - 1);
  const db = openDB();
  db.serialize(() => {
    db.run(`insert into ${req.params.table} values(${tempQuerry});`, (err) => {
      if (err) console.log(err);
    });
  });
  closeDB(db);
  res.send();
});

app.delete("/delete/:table/:id", (req, res) => {
  console.log(req.params);
  const db = openDB();
  db.serialize(() => {
    db.run(
      `update ${req.params.table} set 'удален'=1 where rowid=${req.params.id};`,
      (err) => {
        if (err) console.log(err);
      }
    );
  });
  closeDB(db);
  res.send();
});

app.post("/table/create", (req, res) => {
  console.log(req.body);
  const { tableName, addRemain, tableValues } = req.body;
  let querry = "";
  tableValues.forEach((element) => {
    let type = "";
    let isKey = false;
    if (element.valueType.includes("Varchar")) {
      type = "varchar(55)";
    } else {
      type = "int(11)";
    }
    querry += `'${element.valueName}' ${type} ${
      element.valueIsKey ? "primary key not null" : "not null"
    },`;
  });
  if (addRemain) {
    querry +=
      "'количество' int(11) NOT NULL, 'продано' int(11) DEFAULT NULL, 'удален' int(1) DEFAULT 0, 'остаток' int(11) GENERATED ALWAYS AS ('количество' - 'продано') VIRTUAL";
  } else {
    querry += "'удален' int(1) DEFAULT 0";
  }
  // console.log(querry);
  const db = openDB();
  db.serialize(() => {
    db.run(`create table ${tableName} (${querry});`, (err) => {
      if (err) console.log(err);
    });
  });
  closeDB(db);
  res.send();
});
