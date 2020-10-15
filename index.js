const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "ejs");

const emptyData = {
  quote: "Unavailable",
  keywords: [],
};

function load() {
  return new Promise((res, rej) => {
    const filePath = "./quotes.json";
    fs.readFile(filePath, (err, data) => {
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

var quotes = [];
var limit = 0;

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
  if (limit == 0) {
    res.render("main", { data: emptyData });
  } else if (isNaN(number) || number < 0 || number > limit) {
    res.redirect("/random");
  } else {
    res.render("main", { data: quotes[req.params.number - 1] });
  }
});

app.get("/next/:number", (req, res, next) => {
  let number = Number(req.params.number) + 1;
  if (!isNaN(number) && number <= limit && number > 0) {
    res.redirect(`/number/${number}`);
  } else if (number == limit + 1) {
    res.redirect(`/number/${1}`);
  } else {
    res.redirect("/random");
  }
});

app.get("/prev/:number", (req, res, next) => {
  let number = Number(req.params.number) - 1;
  if (!isNaN(number) && number > 0 && number <= limit) {
    res.redirect(`/number/${number}`);
  } else if (number == 0) {
    res.redirect(`/number/${limit}`);
  } else {
    res.redirect("/random");
  }
});

app.get("/random", (req, res, next) => {
  let number = Math.floor(Math.random() * limit + 1);
  res.redirect(`/number/${number}`);
});

app.post("/add", (req, res, next) => {
  let obj = { quote: req.body.quote, author: req.body.author };
  let keywords = [];
  if (req.body.keywords) {
    let array = req.body.keywords.split(" ");
    for (let x of array) {
      x = x.trim().toLowerCase();
      if (x.length > 0) {
        keywords.push(x);
      }
    }
  }
  let author = req.body.author.replace(/\s+/g, "");
  keywords.push(author);
  obj["keywords"] = keywords;
  quotes.push(obj);
  const filePath = "./quotes.json";
  fs.writeFile(filePath, JSON.stringify(quotes), () => {
    console.log("New Quote Added");
    limit++;
    if (req.xhr) {
      res.json({
        url: `/number/${limit}`,
      });
    } else {
      res.redirect(url);
    }
  });
});

app.get("/keyword/:keyword", (req, res, next) => {
  let keyword = req.params.keyword.toLowerCase();
  console.log(`Call by keyword: ${keyword}`);
  let searchItem = keyword;
  let randarr = [];
  for (let i = 0; i < limit; i++) {
    if (quotes[i].keywords.includes(searchItem)) {
      randarr.push(i + 1);
    }
  }
  if (randarr.length > 0) {
    let index = Math.floor(Math.random() * randarr.length);
    res.redirect(`/number/${randarr[index]}`);
  } else {
    res.redirect("/random");
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
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
