const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase};
  res.render("urls_show", templateVars);
  res.redirect(longURL)
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  urlDatabase[generateRandomString()] = req.body.longURL;
  //res.send("Ok"); // Respond with 'Ok' (we will replace this)
  res.redirect(`/urls/${generateRandomString()}`);
});

const generateRandomString = function() {
  return Math.random().toString(36).slice(2, 8);
};

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.longURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  if (req.session.user) {
    urlsForUser(urlDatabase, userID); 
    urlDatabase[generateRandomString()] = {longURL: req.body.longURL, userID: req.session.user_id}; 
    res.redirect(`/urls/${generateRandomString()}`); // Redirects to new url's page
  }
})