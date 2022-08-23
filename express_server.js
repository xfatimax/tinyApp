const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const PORT = 8080; // default port 8080
const hashedPassword = bcrypt.hashSync(password, 10);
const generateRandomString = function() {
  return Math.random().toString(36).slice(2, 8);
};
app.set("view engine", "ejs");

const urlDatabase = {
    b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
    },
    i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
    }
  };

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
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

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const userID = req.session.userID;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/register", (req, res) => {
  const user = req.session.userID;
  const templateVars = {user: req.session.userID};
  if (user) {
    res.redirect('urls');

  } else {
    res.render('register', templateVars);
  }
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
 
  if (email === "" || password === "") {
    res.status(400).send('Email and password are required!');
  }
  if (getUserByEmail(email, users)) {
    res.status(400).send('Email is already registered!');
  }
  else {
    const userID = newUser(email, password, users);
    req.session.userID = userID;
    res.redirect("/urls");
  }
});

app.get('/login', (req, res) => {
  const user = req.session.user;
  const templateVars = {user: req.session.userID,
  };
  if (user) {
    res.redirect('urls');
  } else {
    res.render('login', templateVars);
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password; 
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = getUserByEmail(email, users);

  if (!user) {
    res.status(400).send("Email is not registered");

  }
  if (!bcrypt.compareSync(password, hashedPassword)) {
    res.status(400).send("Password is incorrect");
  
  } else {

    res.redirect("urls");
  }

});

app.get("/urls", (req, res) => {
  const templateVars = { user: users[req.session.user], urls: urlsForUser(req.session.user, urlDatabase) };
  res.render('urls_index', templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.longURL];
  if (!urlDatabase[req.params.id]) {
    res.status(400).send('URL is not in the database');
  }
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {

  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id], 
    user: users[req.session.user_id]};
  
  if (req.session.user_id === users.userID) {
    res.render('urls_show', templateVars);
  }
  res.status(400).send('This page does not belong to you!');
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: req.session.user, userID: req.session.user_id};
  
  if (templateVars.user) {
    res.render('urls_new', templateVars);

  } else {
    res.redirect('/login');
  }
});



app.post("/urls/:id", (req, res) => {
  if (urlDatabase[req.params.id].userID === req.session["userID"]) {
    let longURL = req.body.longURL;
    urlDatabase[req.params.id].longURL = longURL;
    res.redirect('/urls');
  } else {
    res.status(400).send("Permission denied");
  }
});

app.delete("urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});


