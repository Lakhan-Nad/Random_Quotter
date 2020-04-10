const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "ejs");

function load() {
  return new Promise((res, rej) => {
    fs.readFile("./something.json", (err, data) => {
      if (err) {
        console.log(err);
        rej(err);
      } else {
        console.log("Data Fetched");
        res(data);
      }
    });
  });
}

let generate = async () => {
  let data = await load();
  quotes = JSON.parse(data);
  limit = quotes.length;
  console.log(quotes, limit);
};

generate();

app.get("/", (req, res, next) => {
  return res.redirect("/random");
});

app.get("/number/:number", (req, res, next) => {
  let number = Number(req.params.number);
  if (isNaN(number) || number < 0 || number > limit) {
    return res.redirect("/random");
  } else {
    res.render("main", { data: quotes[req.params.number - 1] });
  }
});

app.get("/next/:number", (req, res, next) => {
  let number = Number(req.params.number) + 1;
  if (!isNaN(number) && number <= limit) {
    let url = "/number/" + number;
    return res.redirect(url);
  } else {
    return res.redirect("/random");
  }
});

app.get("/prev/:number", (req, res, next) => {
  let number = Number(req.params.number) - 1;
  if (!isNaN(number) && number > 0) {
    let url = "/number/" + number;
    return res.redirect(url);
  } else {
    return res.redirect("/random");
  }
});

app.get("/random", (req, res, next) => {
  let number = Math.floor(Math.random() * limit + 1);
  let url = "/number/" + number;
  return res.redirect(url);
});

app.post("/add", (req, res, next) => {
  let obj = { quote: req.body.quote, author: req.body.author };
  let keywords = [];
  if (req.body.keywords) {
    keywords = req.body.keywords.split(" ");
  }
  let author = req.body.author.replace(/\s+/g, "");
  keywords.push(author);
  obj.keywords = keywords;
  quotes.push(obj);
  fs.writeFile("./something.json", JSON.stringify(quotes), () => {
    console.log("New Quote Added");
    limit++;
    let url = "/number/" + limit;
    if (req.xhr) {
      res.json({
        url: url,
      });
    } else {
      res.redirect(url);
    }
  });
});

app.post("/keyword", (req, res, next) => {
  keywords = req.body.keyword.split(/\s+/);
  console.log(keywords);
  let index = Math.floor(Math.random() * keywords.length);
  // console.log(index);
  let searchItem = keywords[index];
  // console.log(searchItem);
  let randarr = [];
  for (let i = 0; i < limit; i++) {
    if (quotes[i].keywords.includes(searchItem)) {
      randarr.push(i + 1);
    }
  }
  // console.log(randarr);
  index = Math.floor(Math.random() * randarr.length);
  // console.log(index);
  if (randarr.length > 0) {
    let url = "/number/" + randarr[index];
    return res.redirect(url);
  } else {
    return res.redirect("/random");
  }
});

// 404 Error
app.use((req, res, next) => {
  console.log(req.url);
  let err = { message: "Requested Route Doesn't Exist", status: 404 };
  next(err);
});

// Error Handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500 || err.status);
  res.json(err);
});

module.exports = app;
