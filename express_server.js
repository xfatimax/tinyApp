const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieSession = require('cookie-session');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const bcrypt = require("bcryptjs");

const { generateRandomString, getUserByEmail, urlsOfUser} = require("./helper");
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

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


app.get("/", (req, res) => {
  const templateVars = {user: req.session.user_id};
  if (!req.session.user) {
    return res.render('login', templateVars);
  } 
  return res.redirect("/urls");
});


app.get("/urls.json", (req, res) => {
  return res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/");
  }
  const user = users[req.session.user_id];
  const templateVars = { urls: urlsOfUser(req.session.user_id,urlDatabase), user: user};
  return res.render("urls_index", templateVars);
});


app.get("/register", (req, res) => {
  const user = req.session.userID;
  const templateVars = {user: req.session.userID};
  if (user) {
    return res.redirect('urls');

  } else {
    return res.render('register', templateVars);
  }
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
 
  if (!email || !password) {
    return res.status(400).send('Email and password are required!');
  }
  if (getUserByEmail(email, users)) {
    return res.status(400).send('Email is already registered!');
  }
  else {
    //Add new user to database
    const randomStr = generateRandomString();
    users[randomStr] = {
      id: randomStr,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    }
    req.session.user_id = randomStr;
    return res.redirect("/urls");
  }
});

app.get('/login', (req, res) => {
  const user = req.session.user_id;
  const templateVars = {user: req.session.user_id};
  if (user) {
    return res.redirect('/urls');
  } else {
    return res.render('login', templateVars);
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password; 
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = getUserByEmail(email, users);
  //console.log("user is: " , user );
  if (!user) {
    return res.status(400).send("Email is not registered");
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).send("Password is incorrect");
  
  } else {
    console.log(user);
    req.session.user_id = user.id;
    return res.redirect("/urls");
  }

});

// For some reason, "/urls/new" was not working
app.get("/urls/new/1", (req, res) => {
  //const user = users[req.session.user_id];
  //const templateVars = { urls: urlDatabase, user: user};
  const templateVars = {user: users[req.session.user_id]};
  if (req.session.user_id) {
    return res.render('urls_new', templateVars);

  } 
    return res.redirect('/login');
  
});

//Create new entry
app.post("/urls", (req, res) => {
  console.log("hello");
  if (!req.session.user_id) {
    return res.status(401).send('You need to be logged in to create TinyApp URLs!\n');
  }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id};
  console.log("world");
  return res.redirect(`/urls/${shortURL}`);
});


app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id], 
    user: users[req.session.user_id]};
  
  if (req.session.user_id === urlDatabase[req.params.id].userID) {
    return res.render('urls_show', templateVars);
  } 
  console.log(urlDatabase);
  return res.status(401).send('This URL does not belong to you!\n');

});

// app.post("/urls/:id", (req, res) => {
//   if (urlDatabase[req.params.id].userID === req.session["userID"]) {
//     let longURL = req.body.longURL;
//     urlDatabase[req.params.id].longURL = longURL;
//     return res.redirect('/urls');
//   } else {
//     return res.status(400).send("Permission denied");
//   }
// });

//Delete an entry
app.post("/urls/:id/delete", (req, res) => {
  if (req.session.user_id !== urlDatabase[req.params.id].userID) {
    return res.status(401).send(`You are not logged in! Please log in to delete.`); 
  } 
  delete urlDatabase[req.params.id];
  return res.redirect('/urls');
});

// Edit an entry
app.post("/urls/:id/edit", (req, res) => {
  if (req.session.user_id !== urlDatabase[req.params.id].userID) {
    return res.status(401).send('You do not have access to edit that TinyAPP entry.');
  }
  urlDatabase[req.params.id].longURL = req.body.longURL;
  return res.redirect('/urls');
});

app.get("/u/:id", (req, res) => {
  console.log("line 197 " , urlDatabase, req.params.id);
  const longURL = urlDatabase[req.params.id];
  if (!urlDatabase[req.params.id]) {
    return res.status(401).send('URL is not in the database');
  }
  return res.redirect(longURL.longURL);
});

//Logout
app.post("/logout", (req, res) => {
  req.session = null;
  return res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
